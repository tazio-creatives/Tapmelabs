const express = require("express");
const { register, login, me, updateMe, verifyOtp, resendOtp, changePassword, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register",         register);
router.post("/login",            login);
router.get("/me",                protect, me);
router.post("/verify-otp",       verifyOtp);
router.post("/resend-otp",       resendOtp);
router.put("/me",                protect, updateMe);
router.post("/change-password",  protect, changePassword);
router.post("/forgot-password",  forgotPassword);
router.post("/reset-password",   resetPassword);

module.exports = router;
