const crypto   = require("crypto");
const razorpay = require("../config/razorpay");
const Order    = require("../models/Order");
const User     = require("../models/User");
const Product  = require("../models/Product");
const { Subscription, NfcCard } = require("../models");
const { sendPaymentSuccessEmail } = require("../utils/mailer");

// ── POST /api/payments/create-razorpay-order ──────────────────────────────────
// Creates a Razorpay order for a given local order_id.
// Returns key_id, razorpay_order_id, amount (paise), currency — never key_secret.

async function createRazorpayOrder(req, res, next) {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, message: "order_id is required", data: null });
    }

    const order = await Order.findOne({ where: { id: order_id, user_id: req.user.id } });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found", data: null });
    }

    if (order.payment_status === "paid") {
      return res.status(400).json({ success: false, message: "Order is already paid", data: null });
    }

    // Wrap Razorpay API call separately so its error codes (e.g. 401 for bad
    // credentials) are never forwarded to the client as-is — that would trigger
    // the frontend's 401 interceptor and incorrectly log the user out.
    let rzpOrder;
    try {
      rzpOrder = await razorpay.orders.create({
        amount:   Math.round(Number(order.total_amount) * 100), // paise
        currency: "INR",
        receipt:  order.order_number,
      });
    } catch (rzpErr) {
      const message =
        rzpErr?.error?.description ||
        rzpErr?.message ||
        "Payment gateway error. Please try again.";
      return res.status(502).json({ success: false, message, data: null });
    }

    return res.json({
      success: true,
      message: "Razorpay order created",
      data: {
        razorpay_order_id: rzpOrder.id,
        amount:            rzpOrder.amount,
        currency:          rzpOrder.currency,
        key_id:            process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/payments/verify-razorpay-payment ────────────────────────────────
// Verifies Razorpay payment signature (HMAC SHA256).
// On success: marks order as paid + processing.
// On failure: marks order as failed.

async function verifyRazorpayPayment(req, res, next) {
  try {
    const { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required payment fields", data: null });
    }

    const order = await Order.findOne({ where: { id: order_id, user_id: req.user.id } });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found", data: null });
    }

    // Compute expected signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await order.update({ payment_status: "failed" });
      return res.status(400).json({ success: false, message: "Payment signature verification failed", data: null });
    }

    // Valid payment
    await order.update({
      payment_status: "paid",
      order_status:   "processing",
      payment_id:     razorpay_payment_id,
    });

    // Activate Pro subscription if order included pro_plan
    if (order.pro_plan && order.user_id) {
      try {
        const existing = await Subscription.findOne({ where: { user_id: order.user_id, status: "active" } });
        if (!existing) {
          const expiresAt = new Date();
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          await Subscription.create({
            user_id:    order.user_id,
            plan:       "pro",
            status:     "active",
            starts_at:  new Date(),
            expires_at: expiresAt,
          });
        }
      } catch (e) { console.error("Pro activation failed:", e.message); }
    }

    // Auto-assign NFC card on payment success (if not already assigned)
    if (order.user_id) {
      try {
        const existingCard = await NfcCard.findOne({ where: { user_id: order.user_id } });
        if (!existingCard) {
          // Generate a system UID — admin will update with real chip UID when shipping
          const systemUid = `TML-${order.order_number}-${Date.now().toString(36).toUpperCase()}`;
          await NfcCard.create({
            user_id:        order.user_id,
            card_uid:       systemUid,
            status:         "active",
            default_action: "profile",
          });
          console.log(`[payment] NFC card auto-created for user ${order.user_id}: ${systemUid}`);
        }
      } catch (e) { console.error("NFC card auto-create failed:", e.message); }
    }

    // Send confirmation email — fire-and-forget so a mail failure never blocks the response
    try {
      const [user, product] = await Promise.all([
        User.findByPk(order.user_id),
        Product.findByPk(order.product_id),
      ]);
      if (user?.email) {
        sendPaymentSuccessEmail(user.email, {
          customerName:    user.full_name || "Customer",
          orderId:         order.id,
          orderNumber:     order.order_number,
          amount:          order.total_amount,
          productName:     product?.name ?? null,
          shippingAddress: order.shipping_address,
          proPlan:         !!order.pro_plan,
        }).catch(() => {});
      }
    } catch {}

    return res.json({
      success: true,
      message: "Payment verified successfully",
      data: { payment_status: "paid", order_status: "processing" },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createRazorpayOrder, verifyRazorpayPayment };
