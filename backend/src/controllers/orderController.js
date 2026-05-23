const { Order, User, Product } = require("../models");
const Profile = require("../models/Profile");

// ── Helpers ───────────────────────────────────────────────────────────────────

async function generateOrderNumber() {
  const last = await Order.findOne({ order: [["created_at", "DESC"]] });

  if (!last) return "TAPME1001";

  const numeric = parseInt(last.order_number.replace("TAPME", ""), 10);
  return `TAPME${isNaN(numeric) ? 1001 : numeric + 1}`;
}

// ── POST /api/orders ──────────────────────────────────────────────────────────

async function createOrder(req, res, next) {
  try {
    const { product_id, total_amount, shipping_address, card_customization } = req.body;

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

    const order_number = await generateOrderNumber();

    // TODO: Initiate Razorpay/Stripe payment session here before creating order.
    // Example: const paymentSession = await razorpay.orders.create({ amount, currency });
    // Store paymentSession.id in order for verification later.

    const order = await Order.create({
      order_number,
      user_id: req.user.id,
      product_id,
      total_amount,
      shipping_address:   shipping_address   ?? null,
      card_customization: card_customization ?? null,
      payment_status: "pending",
      order_status:   "pending",
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
          attributes: ["id", "name", "slug", "price", "sale_price", "images"],
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
        {
          model: User,
          as: "user",
          attributes: ["id", "full_name", "email", "phone"],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "slug", "price", "sale_price"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully.",
      data: { orders, count: orders.length },
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
          attributes: ["id", "name", "slug", "price", "sale_price", "images", "front_image", "back_image"],
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

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
        data: null,
      });
    }

    await order.update({ order_status });

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
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderNotes,
};
