const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/adminResellerController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdmin } = require("../middlewares/adminMiddleware");

router.use(protect, requireAdmin);

router.get("/",                         ctrl.list);
router.get("/payouts",                  ctrl.listPayouts);
router.post("/payouts/:id/approve",     ctrl.approvePayout);
router.post("/payouts/:id/reject",      ctrl.rejectPayout);
router.get("/:id",                      ctrl.detail);
router.patch("/:id/status",             ctrl.updateStatus);
router.patch("/:id/commission-rate",    ctrl.updateCommissionRate);
router.get("/:id/orders",              ctrl.resellerOrders);

module.exports = router;
