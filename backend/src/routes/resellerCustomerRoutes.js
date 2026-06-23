const express    = require("express");
const router     = express.Router();
const resellerAuth = require("../middleware/resellerAuth");
const { sendCustomerOtp, verifyCustomerOtp } = require("../controllers/resellerCustomerController");

router.use(resellerAuth);
router.post("/send-otp",   sendCustomerOtp);
router.post("/verify-otp", verifyCustomerOtp);

module.exports = router;
