const crypto = require("crypto");
const { ResellerOrder, Order, Product, Reseller, CommissionLedger } = require("../models");
const { Op } = require("sequelize");
const { sendResellerCustomerSetupEmail } = require("../utils/mailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

async function issueSetupToken(ro, product) {
  if (!ro.customer_email) return;
  const token   = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);
  await ro.update({ customer_setup_token: token, customer_setup_token_expires_at: expires });
  const setupUrl = `${FRONTEND_URL}/reseller/customer-setup?token=${token}`;
  try {
    await sendResellerCustomerSetupEmail(ro.customer_email, {
      customerName: ro.customer_name || "Customer",
      productName:  product?.name || "NFC Business Card",
      setupUrl,
    });
  } catch (e) {
    console.error("Setup email failed:", e.message);
  }
}

// GET /api/reseller/orders
async function list(req, res) {
  try {
    const { status, from, to, page = 1, limit = 20 } = req.query;
    const where = { reseller_id: req.reseller.id };
    if (status) where.status = status;
    if (from || to) {
      where.created_at = {};
      if (from) where.created_at[Op.gte] = new Date(from);
      if (to)   where.created_at[Op.lte] = new Date(to);
    }

    const { rows, count } = await ResellerOrder.findAndCountAll({
      where,
      include: [{ model: Order, as: "order", include: ["product"] }],
      order: [["created_at", "DESC"]],
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    res.json({ orders: rows, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/reseller/orders/:id
async function detail(req, res) {
  try {
    const ro = await ResellerOrder.findOne({
      where: { id: req.params.id, reseller_id: req.reseller.id },
      include: [{ model: Order, as: "order", include: ["product"] }],
    });
    if (!ro) return res.status(404).json({ message: "Order not found" });
    res.json(ro);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/reseller/orders
async function create(req, res) {
  try {
    const {
      product_id,
      card_customization,
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      use_commission_amount = 0,
    } = req.body;

    if (!product_id) return res.status(400).json({ message: "product_id required" });

    const product = await Product.findByPk(product_id);
    if (!product || product.status !== "active") {
      return res.status(404).json({ message: "Product not found or unavailable" });
    }

    const reseller = req.reseller;
    const price = Number(product.sale_price || product.price);

    // Commission calculation
    const commissionRate   = Number(reseller.commission_rate);
    const commissionEarned = parseFloat(((price * commissionRate) / 100).toFixed(2));

    // How much commission to apply toward payment
    const balance         = Number(reseller.commission_balance);
    const applyCommission = Math.min(Math.max(0, Number(use_commission_amount)), balance, price);
    const razorpayAmount  = parseFloat((price - applyCommission).toFixed(2));

    let paymentMethod = "razorpay";
    if (applyCommission >= price)     paymentMethod = "commission";
    else if (applyCommission > 0)     paymentMethod = "mixed";

    // Generate unique order number
    const orderNumber = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create underlying order — user_id is null for reseller orders
    const order = await Order.create({
      order_number:     orderNumber,
      user_id:          null,
      product_id,
      total_amount:     price,
      payment_status:   razorpayAmount === 0 ? "paid" : "pending",
      order_status:     "processing",
      card_customization: card_customization || {},
      shipping_address:   shipping_address || {},
    });

    const ro = await ResellerOrder.create({
      reseller_id:       reseller.id,
      order_id:          order.id,
      customer_name,
      customer_phone,
      customer_email,
      order_total:       price,
      commission_rate:   commissionRate,
      commission_amount: commissionEarned,
      commission_applied: applyCommission,
      razorpay_amount:   razorpayAmount,
      payment_method:    paymentMethod,
      status:            razorpayAmount === 0 ? "paid" : "pending",
    });

    // If fully paid via commission — debit balance and credit commission earned
    if (razorpayAmount === 0 && applyCommission > 0) {
      const newBalance = parseFloat((balance - applyCommission + commissionEarned).toFixed(2));
      await reseller.update({
        commission_balance: newBalance,
        total_earned: parseFloat((Number(reseller.total_earned) + commissionEarned).toFixed(2)),
      });
      await CommissionLedger.create({
        reseller_id: reseller.id, reseller_order_id: ro.id,
        type: "used", amount: applyCommission,
        balance_after: parseFloat((balance - applyCommission).toFixed(2)),
        note: `Applied to order #${order.id.slice(0, 8)}`,
      });
      await CommissionLedger.create({
        reseller_id: reseller.id, reseller_order_id: ro.id,
        type: "earned", amount: commissionEarned,
        balance_after: newBalance,
        note: `Commission earned on order #${order.id.slice(0, 8)}`,
      });
      // Send profile setup email for commission-only orders (no Razorpay step)
      await issueSetupToken(ro, product);
    }

    res.status(201).json({ reseller_order: ro, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PATCH /api/reseller/orders/:id/cancel
async function cancel(req, res) {
  try {
    const ro = await ResellerOrder.findOne({
      where: { id: req.params.id, reseller_id: req.reseller.id },
    });
    if (!ro) return res.status(404).json({ message: "Order not found" });
    if (ro.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be cancelled" });
    }

    await ro.update({ status: "cancelled" });

    // Refund commission if it was applied
    if (Number(ro.commission_applied) > 0) {
      const reseller  = req.reseller;
      const newBalance = parseFloat((Number(reseller.commission_balance) + Number(ro.commission_applied)).toFixed(2));
      await reseller.update({ commission_balance: newBalance });
      await CommissionLedger.create({
        reseller_id: reseller.id, reseller_order_id: ro.id,
        type: "refunded", amount: ro.commission_applied,
        balance_after: newBalance,
        note: `Refund for cancelled order #${ro.order_id.slice(0, 8)}`,
      });
    }

    res.json({ message: "Order cancelled", reseller_order: ro });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { list, detail, create, cancel };
