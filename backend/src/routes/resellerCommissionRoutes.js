const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/resellerCommissionController");
const resellerAuth = require("../middleware/resellerAuth");

router.use(resellerAuth);

router.get("/summary",          ctrl.summary);
router.get("/ledger",           ctrl.ledger);
router.post("/payout/request",  ctrl.requestPayout);
router.get("/payout/history",   ctrl.payoutHistory);

module.exports = router;
