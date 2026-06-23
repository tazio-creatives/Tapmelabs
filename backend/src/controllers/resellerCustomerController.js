const { sendOtpEmail }    = require("../utils/mailer");
const { setOtp, verifyAndClear } = require("../utils/customerOtpStore");
const { User } = require("../models");

// POST /api/reseller/customer/send-otp
async function sendCustomerOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    // Block if customer already has an account
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This email already has a TapMe account. Please use a different email.",
      });
    }

    const otp = setOtp(email);
    await sendOtpEmail(email, otp);

    res.json({ success: true, message: `Verification code sent to ${email}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/reseller/customer/verify-otp
async function verifyCustomerOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and code are required" });
    }

    const result = verifyAndClear(email, otp);
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { sendCustomerOtp, verifyCustomerOtp };
