import api from "./api";

const orderService = {
  list:   (params) => api.get("/reseller/orders", { params }),
  detail: (id)     => api.get(`/reseller/orders/${id}`),
  create: (data)   => api.post("/reseller/orders", data),
  cancel: (id)     => api.patch(`/reseller/orders/${id}/cancel`),

  createPayment: (reseller_order_id) => api.post("/reseller/payment/create-order", { reseller_order_id }),
  verifyPayment: (data)              => api.post("/reseller/payment/verify", data),
};

export default orderService;
