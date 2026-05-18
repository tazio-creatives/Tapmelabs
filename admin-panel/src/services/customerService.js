import api from "./api";

const customerService = {
  async getAllCustomers(search = "") {
    const params = search ? { search } : {};
    const response = await api.get("/admin/customers", { params });
    return response.data;
  },

  async getCustomerById(id) {
    const response = await api.get(`/admin/customers/${id}`);
    return response.data;
  },
};

export default customerService;
