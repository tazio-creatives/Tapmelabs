import api from "./api";

const uploadService = {
  async uploadProductImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    // Set Content-Type to undefined so axios sets the correct multipart boundary.
    const response = await api.post("/uploads/product-image", formData, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },

  async uploadSvgBackground(file) {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/uploads/svg-background", formData, {
      headers: { "Content-Type": undefined },
    });
    return response.data;
  },
};

export default uploadService;
