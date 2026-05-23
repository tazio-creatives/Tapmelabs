import api from "./api";

const orderService = {
  async getAllOrders() {
    const response = await api.get("/orders");
    return response.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id, order_status) {
    const response = await api.put(`/orders/${id}/status`, { order_status });
    return response.data;
  },

  async updatePaymentStatus(id, payment_status) {
    const response = await api.put(`/orders/${id}/payment-status`, { payment_status });
    return response.data;
  },

  async updateOrderNotes(id, admin_notes) {
    const response = await api.put(`/orders/${id}/notes`, { admin_notes });
    return response.data;
  },
};

export default orderService;
