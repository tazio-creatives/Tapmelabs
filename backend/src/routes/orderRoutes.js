const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  updateOrderNotes,
} = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");

const router = express.Router();

// Static paths before /:id to avoid param collision
router.get("/my-orders",          protect,                getMyOrders);
router.get("/",                   protect, requireAdmin,  getAllOrders);
router.post("/",                  protect,                createOrder);
router.get("/:id",                protect,                getOrderById);
router.put("/:id/status",         protect, requireAdmin,  updateOrderStatus);
router.put("/:id/payment-status", protect, requireAdmin,  updatePaymentStatus);
router.put("/:id/notes",          protect, requireAdmin,  updateOrderNotes);

module.exports = router;
