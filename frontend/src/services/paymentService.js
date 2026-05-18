import api from "./api";

// ── POST /api/payments/create-razorpay-order ──────────────────────────────────
// Returns { razorpay_order_id, amount, currency, key_id }

async function createRazorpayOrder(order_id) {
  const response = await api.post("/payments/create-razorpay-order", { order_id });
  return response.data;
}

// ── POST /api/payments/verify-razorpay-payment ────────────────────────────────
// payload: { order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature }

async function verifyRazorpayPayment(payload) {
  const response = await api.post("/payments/verify-razorpay-payment", payload);
  return response.data;
}

const paymentService = { createRazorpayOrder, verifyRazorpayPayment };

export default paymentService;
