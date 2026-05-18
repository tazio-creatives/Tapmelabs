import api from "./api";

// ── POST /api/orders ──────────────────────────────────────────────────────────
// Place a new order. Requires customerToken.
// payload: { product_id, total_amount, shipping_address }

async function createOrder(payload) {
  const response = await api.post("/orders", payload);
  return response.data;
}

// ── GET /api/orders/my-orders ─────────────────────────────────────────────────
// Returns orders belonging to the authenticated customer.

async function getMyOrders() {
  const response = await api.get("/orders/my-orders");
  return response.data;
}

// ── GET /api/orders/:id ───────────────────────────────────────────────────────

async function getOrderById(id) {
  const response = await api.get(`/orders/${id}`);
  return response.data;
}

// ── PUT /api/orders/:id/payment-status ───────────────────────────────────────
// Called after payment gateway callback to update payment status.
// payload: { payment_status, payment_id }
// TODO: Wire this to Razorpay/Stripe webhook or redirect handler.

async function updatePaymentStatus(id, payload) {
  const response = await api.put(`/orders/${id}/payment-status`, payload);
  return response.data;
}

const orderService = { createOrder, getMyOrders, getOrderById, updatePaymentStatus };

export default orderService;
