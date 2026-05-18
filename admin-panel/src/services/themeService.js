import api from "./api";

const themeService = {
  async getAllThemes() {
    const response = await api.get("/themes/admin");
    return response.data;
  },

  async getThemeByKey(key) {
    const response = await api.get(`/themes/${key}`);
    return response.data;
  },

  async createTheme(data) {
    const response = await api.post("/themes", data);
    return response.data;
  },

  async updateTheme(id, data) {
    const response = await api.put(`/themes/${id}`, data);
    return response.data;
  },

  // Soft-delete: backend sets status → "inactive"
  async deleteTheme(id) {
    const response = await api.delete(`/themes/${id}`);
    return response.data;
  },
};

export default themeService;
