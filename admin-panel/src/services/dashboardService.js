import api from "./api";

const dashboardService = {
  async getStats() {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },
};

export default dashboardService;
