const express = require("express");
const { getDashboardStats } = require("../controllers/adminDashboardController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", protect, requireAdmin, getDashboardStats);

module.exports = router;
