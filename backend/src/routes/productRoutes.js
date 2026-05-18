const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/",      protect, requireAdmin, createProduct);
router.get("/",                              getAllProducts);
router.get("/:slug",                         getProductBySlug);
router.put("/:id",    protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

module.exports = router;
