const { Order, User, Product, Subscription, NfcCard, Form, ReviewTag } = require("../models");
const { Op } = require("sequelize");
const Profile = require("../models/Profile");
const { sendOrderStatusEmail } = require("../utils/mailer");
const { generateInvoicePdf } = require("../utils/invoiceGenerator");

// ── Activate Pro subscription for a user ─────────────────────────────────────
async function activateProSubscription(userId) {
  const existing = await Subscription.findOne({ where: { user_id: userId, status: "active" } });
  if (existing) return existing; // already Pro

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year

  return Subscription.create({
    user_id:    userId,
    plan:       "pro",
    status:     "active",
    starts_at:  new Date(),
    expires_at: expiresAt,
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function generateOrderNumber() {
  // Scan every TAPME-prefixed order for the true highest numeric suffix rather
  // than trusting the most-recently-created row — order numbers and creation
  // order can diverge (e.g. seeded/backfilled orders), and picking the wrong
  // "last" one produces a duplicate that fails the unique constraint.
  const orders = await Order.findAll({
    where: { order_number: { [Op.like]: "TAPME%" } },
    attributes: ["order_number"],
  });

  let maxNumeric = 1000;
  for (const o of orders) {
    const numeric = parseInt(o.order_number.replace("TAPME", ""), 10);
    if (!isNaN(numeric) && numeric > maxNumeric) maxNumeric = numeric;
  }

  return `TAPME${maxNumeric + 1}`;
}

// ── POST /api/orders ──────────────────────────────────────────────────────────

async function createOrder(req, res, next) {
  try {
    const { product_id, total_amount, shipping_address, card_customization, review_tag_data, pro_plan } = req.body;

    if (!product_id || total_amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "product_id and total_amount are required.",
        data: null,
      });
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
        data: null,
      });
    }

    // Block if user already has an active (non-failed, non-cancelled) order
    const existingOrder = await Order.findOne({
      where: {
        user_id: req.user.id,
        payment_status: { [Op.in]: ["pending", "paid"] },
        order_status:   { [Op.ne]: "cancelled" },
      },
    });
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: "You already have an active order. Visit your dashboard to track it.",
        data: null,
      });
    }

    const order_number = await generateOrderNumber();

    // TODO: Initiate Razorpay/Stripe payment session here before creating order.
    // Example: const paymentSession = await razorpay.orders.create({ amount, currency });
    // Store paymentSession.id in order for verification later.

    // Frontend already includes Pro price in total_amount — use as-is
    const finalTotal = Number(total_amount);

    const order = await Order.create({
      order_number,
      user_id: req.user.id,
      product_id,
      total_amount: finalTotal,
      shipping_address:   shipping_address   ?? null,
      card_customization: card_customization ?? null,
      review_tag_data:    review_tag_data    ?? null,
      payment_status: "pending",
      order_status:   "pending",
      pro_plan:       !!pro_plan,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/orders/my-orders ─────────────────────────────────────────────────

async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "slug", "price", "sale_price", "images", "front_image", "back_image", "product_type"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: { orders, count: orders.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/orders ───────────────────────────────────────────────────────────
// Admin-level: returns all orders with user + product details.
// TODO: Add admin role check middleware here when admin roles are implemented.

async function getAllOrders(req, res, next) {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User,    as: "user",    attributes: ["id", "full_name", "email", "phone"] },
        { model: Product, as: "product", attributes: ["id", "name", "slug", "price", "sale_price", "product_type"] },
      ],
      order: [["created_at", "DESC"]],
    });

    // Attach NFC card info per order (by user_id)
    const userIds = [...new Set(orders.map(o => o.user_id).filter(Boolean))];
    const cards = userIds.length > 0
      ? await NfcCard.findAll({
          where: { user_id: userIds },
          include: [{ model: Form, as: "form", attributes: ["slug"], required: false }],
        })
      : [];
    const cardByUser = {};
    cards.forEach(c => { cardByUser[c.user_id] = c; });

    const ordersWithCard = orders.map(o => {
      const card = o.user_id ? cardByUser[o.user_id] : null;
      return {
        ...o.toJSON(),
        nfc_card: card ? {
          card_uid:       card.card_uid,
          default_action: card.default_action,
          form_slug:      card.form?.slug || null,
        } : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully.",
      data: { orders: ordersWithCard, count: ordersWithCard.length },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/orders/:id ───────────────────────────────────────────────────────

async function getOrderById(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "phone"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "slug", "price", "sale_price", "images", "front_image", "back_image", "product_type"],
        },
        {
          model: ReviewTag,
          as: "review_tag",
          required: false,
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
        data: null,
      });
    }

    // Fetch customer's profile for NFC URL and card details
    const profile = order.user_id
      ? await Profile.findOne({ where: { user_id: order.user_id } })
      : null;

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      data: { order, profile: profile ?? null },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/orders/:id/invoice ───────────────────────────────────────────────
// Customer-facing — only the order's own owner may download its invoice.

async function getOrderInvoice(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User,    as: "user",    attributes: ["id", "full_name", "email", "phone"] },
        { model: Product, as: "product", attributes: ["id", "name", "price", "sale_price"] },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found.", data: null });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "You do not have access to this invoice.", data: null });
    }

    if (order.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Invoice is available once payment is confirmed.", data: null });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="invoice-${order.order_number}.pdf"`);
    generateInvoicePdf(res, { order, user: order.user, product: order.product });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/orders/:id/notes ─────────────────────────────────────────────────

async function updateOrderNotes(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
        data: null,
      });
    }

    await order.update({ admin_notes: req.body.admin_notes ?? null });

    return res.status(200).json({
      success: true,
      message: "Notes updated.",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/orders/:id/status ────────────────────────────────────────────────

async function updateOrderStatus(req, res, next) {
  try {
    const { order_status } = req.body;

    const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!order_status) {
      return res.status(400).json({
        success: false,
        message: "order_status is required.",
        data: null,
      });
    }

    if (!VALID_STATUSES.includes(order_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order_status. Must be one of: ${VALID_STATUSES.join(", ")}.`,
        data: null,
      });
    }

    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User,    as: "user",    attributes: ["id", "full_name", "email"] },
        { model: Product, as: "product", attributes: ["id", "name"] },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
        data: null,
      });
    }

    await order.update({ order_status });

    // Fire-and-forget delivery-status email for shipped/delivered transitions —
    // applies to all product types, never blocks the response on mail failure.
    if (["shipped", "delivered"].includes(order_status) && order.user?.email) {
      sendOrderStatusEmail(order.user.email, {
        customerName: order.user.full_name || "Customer",
        orderNumber:  order.order_number,
        productName:  order.product?.name ?? null,
        orderStatus:  order_status,
      }).catch((e) => console.error("Order status email failed:", e.message));
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/orders/:id/payment-status ───────────────────────────────────────

async function updatePaymentStatus(req, res, next) {
  try {
    const { payment_status } = req.body;

    const VALID_STATUSES = ["pending", "paid", "failed", "refunded"];

    if (!payment_status) {
      return res.status(400).json({
        success: false,
        message: "payment_status is required.",
        data: null,
      });
    }

    if (!VALID_STATUSES.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment_status. Must be one of: ${VALID_STATUSES.join(", ")}.`,
        data: null,
      });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
        data: null,
      });
    }

    // TODO: Verify Razorpay/Stripe webhook signature here before marking as paid.
    // Example: razorpay.webhooks.validateWebhookSignature(body, signature, secret)

    await order.update({ payment_status });

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  getOrderInvoice,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderNotes,
};
