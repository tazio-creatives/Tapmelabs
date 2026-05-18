import api from "./api";

const productService = {
  async getProducts(search = "") {
    const params = search ? { search, all: "true" } : { all: "true" };
    const response = await api.get("/products", { params });
    return response.data;
  },

  async getProductBySlug(slug) {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },

  async createProduct(data) {
    const response = await api.post("/products", data);
    return response.data;
  },

  async updateProduct(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
