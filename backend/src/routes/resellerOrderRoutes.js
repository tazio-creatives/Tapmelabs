const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/resellerOrderController");
const resellerAuth = require("../middleware/resellerAuth");

router.use(resellerAuth);

router.get("/",          ctrl.list);
router.post("/",         ctrl.create);
router.get("/:id",       ctrl.detail);
router.patch("/:id/cancel", ctrl.cancel);

module.exports = router;
