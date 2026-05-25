const express = require("express");
const { getAllCustomers, getCustomerById, deleteCustomer } = require("../controllers/adminCustomerController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/",       protect, requireAdmin, getAllCustomers);
router.get("/:id",    protect, requireAdmin, getCustomerById);
router.delete("/:id", protect, requireAdmin, deleteCustomer);

module.exports = router;
