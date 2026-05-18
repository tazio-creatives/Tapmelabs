import api from "./api";

// ── GET /api/products ─────────────────────────────────────────────────────────
// Returns active products. Pass search string to filter by name/description.

async function getAllProducts(search = "") {
  const params = search ? { search } : {};
  const response = await api.get("/products", { params });
  return response.data;
}

// ── GET /api/products/:slug ───────────────────────────────────────────────────

async function getProductBySlug(slug) {
  const response = await api.get(`/products/${slug}`);
  return response.data;
}

const productService = { getAllProducts, getProductBySlug };

export default productService;
