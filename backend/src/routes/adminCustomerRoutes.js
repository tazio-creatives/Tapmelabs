const express = require("express");
const { getAllCustomers, getCustomerById } = require("../controllers/adminCustomerController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/",    protect, requireAdmin, getAllCustomers);
router.get("/:id", protect, requireAdmin, getCustomerById);

module.exports = router;
