const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/adminResellerController");
const adminAuth = require("../middleware/adminAuth");

router.use(adminAuth);

router.get("/",                         ctrl.list);
router.get("/payouts",                  ctrl.listPayouts);
router.post("/payouts/:id/approve",     ctrl.approvePayout);
router.post("/payouts/:id/reject",      ctrl.rejectPayout);
router.get("/:id",                      ctrl.detail);
router.patch("/:id/status",             ctrl.updateStatus);
router.patch("/:id/commission-rate",    ctrl.updateCommissionRate);
router.get("/:id/orders",              ctrl.resellerOrders);

module.exports = router;
