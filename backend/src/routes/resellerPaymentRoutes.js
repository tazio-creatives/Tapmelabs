const express = require("express");
const router  = express.Router();
const ctrl    = require("../controllers/resellerPaymentController");
const resellerAuth = require("../middleware/resellerAuth");

router.use(resellerAuth);

router.post("/create-order", ctrl.createOrder);
router.post("/verify",       ctrl.verify);

module.exports = router;
