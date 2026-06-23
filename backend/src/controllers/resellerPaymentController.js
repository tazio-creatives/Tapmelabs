const crypto  = require("crypto");
const { ResellerOrder, Order, Product, Reseller, CommissionLedger } = require("../models");
const razorpay = require("../config/razorpay");
const { sendResellerCustomerSetupEmail } = require("../utils/mailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// POST /api/reseller/payment/create-order
// Creates a Razorpay order for the remaining razorpay_amount on a reseller order
async function createOrder(req, res) {
  try {
    const { reseller_order_id } = req.body;
    if (!reseller_order_id) return res.status(400).json({ message: "reseller_order_id required" });

    const ro = await ResellerOrder.findOne({
      where: { id: reseller_order_id, reseller_id: req.reseller.id, status: "pending" },
    });
    if (!ro) return res.status(404).json({ message: "Pending reseller order not found" });

    const amountPaise = Math.round(Number(ro.razorpay_amount) * 100);
    if (amountPaise <= 0) return res.status(400).json({ message: "No Razorpay payment needed" });

    const rzpOrder = await razorpay.orders.create({
      amount:   amountPaise,
      currency: "INR",
      receipt:  `res_${ro.id.slice(0, 12)}`,
    });

    await ro.update({ razorpay_order_id: rzpOrder.id });

    res.json({
      key_id:            process.env.RAZORPAY_KEY_ID,
      razorpay_order_id: rzpOrder.id,
      amount:            amountPaise,
      currency:          "INR",
      reseller_order_id: ro.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/reseller/payment/verify
async function verify(req, res) {
  try {
    const { reseller_order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const ro = await ResellerOrder.findOne({
      where: { id: reseller_order_id, reseller_id: req.reseller.id, status: "pending" },
    });
    if (!ro) return res.status(404).json({ message: "Order not found" });

    // Verify Razorpay signature
    const hmac     = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expected = hmac.digest("hex");
    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const reseller = req.reseller;
    const commissionEarned = Number(ro.commission_amount);
    const commissionApplied = Number(ro.commission_applied);

    // Credit commission earned + debit any commission applied
    const balance = Number(reseller.commission_balance);
    const newBalance = parseFloat((balance - commissionApplied + commissionEarned).toFixed(2));

    await reseller.update({
      commission_balance: newBalance,
      total_earned: parseFloat((Number(reseller.total_earned) + commissionEarned).toFixed(2)),
    });

    // Log commission used (if any)
    if (commissionApplied > 0) {
      await CommissionLedger.create({
        reseller_id: reseller.id, reseller_order_id: ro.id,
        type: "used", amount: commissionApplied,
        balance_after: parseFloat((balance - commissionApplied).toFixed(2)),
        note: `Applied to order #${ro.order_id.slice(0, 8)}`,
      });
    }

    // Log commission earned
    await CommissionLedger.create({
      reseller_id: reseller.id, reseller_order_id: ro.id,
      type: "earned", amount: commissionEarned,
      balance_after: newBalance,
      note: `Commission earned on order #${ro.order_id.slice(0, 8)}`,
    });

    // Mark reseller order + underlying order as paid
    await ro.update({ status: "paid", razorpay_payment_id });
    await Order.update({ payment_status: "paid" }, { where: { id: ro.order_id } });

    // Send profile setup email to customer
    if (ro.customer_email) {
      try {
        const token   = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 48 * 60 * 60 * 1000);
        await ro.update({ customer_setup_token: token, customer_setup_token_expires_at: expires });
        const order = await Order.findByPk(ro.order_id, { include: [{ model: Product, as: "product" }] });
        const setupUrl = `${FRONTEND_URL}/reseller/customer-setup?token=${token}`;
        await sendResellerCustomerSetupEmail(ro.customer_email, {
          customerName: ro.customer_name || "Customer",
          productName:  order?.product?.name || "NFC Business Card",
          setupUrl,
        });
      } catch (e) {
        console.error("Setup email failed:", e.message);
      }
    }

    res.json({ message: "Payment verified", reseller_order: ro });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createOrder, verify };
