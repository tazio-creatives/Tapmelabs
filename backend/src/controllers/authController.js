const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { sendOtpEmail } = require("../utils/mailer");

// ── Helpers ───────────────────────────────────────────────────────────────────

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function userPublicFields(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    is_email_verified: user.is_email_verified,
    status: user.status,
    created_at: user.created_at,
  };
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── POST /api/auth/register ───────────────────────────────────────────────────

async function register(req, res, next) {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "full_name, email, and password are required.",
        data: null,
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
        data: null,
      });
    }

    const hashed = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.create({
      full_name,
      email,
      phone: phone || null,
      password: hashed,
      role: "customer",
      is_email_verified: false,
      status: "active",
      otp,
      otp_expires_at,
    });

    await sendOtpEmail(email, otp);

    const token = signToken(user.id);

    return res.status(201).json({
      success: true,
      message: "Account created. Please verify your email with the OTP sent.",
      data: {
        token,
        user: userPublicFields(user),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────

async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
        data: null,
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
        data: null,
      });
    }

    if (user.is_email_verified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified.",
        data: { user: userPublicFields(user) },
      });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check the code and try again.",
        data: null,
      });
    }

    if (!user.otp_expires_at || new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new code.",
        data: null,
      });
    }

    await user.update({
      is_email_verified: true,
      otp: null,
      otp_expires_at: null,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      data: { user: userPublicFields(user) },
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/auth/resend-otp ─────────────────────────────────────────────────

async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required.", data: null });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email.", data: null });
    }

    if (user.is_email_verified) {
      return res.status(400).json({ success: false, message: "Email is already verified.", data: null });
    }

    const otp = generateOtp();
    const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ otp, otp_expires_at });
    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email.",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/auth/login ──────────────────────────────────────────────────────

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
        data: null,
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        data: null,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        data: null,
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support.",
        data: null,
      });
    }

    const token = signToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: {
        token,
        user: userPublicFields(user),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/auth/me ──────────────────────────────────────────────────────────

async function me(req, res) {
  return res.status(200).json({
    success: true,
    message: "User fetched successfully.",
    data: {
      user: userPublicFields(req.user),
    },
  });
}

// ── POST /api/auth/change-password ───────────────────────────────────────────

async function changePassword(req, res, next) {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: "current_password and new_password are required.", data: null });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters.", data: null });
    }

    const user = await User.findByPk(req.user.id);
    const match = await bcrypt.compare(current_password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Current password is incorrect.", data: null });
    }

    const hashed = await bcrypt.hash(new_password, 12);
    await user.update({ password: hashed });

    return res.json({ success: true, message: "Password changed successfully.", data: null });
  } catch (err) {
    next(err);
  }
}

// ── PUT /api/auth/me ──────────────────────────────────────────────────────────

async function updateMe(req, res, next) {
  try {
    const { full_name, phone } = req.body;
    const user = await User.findByPk(req.user.id);

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name.trim();
    if (phone     !== undefined) updates.phone     = phone.trim() || null;

    await user.update(updates);

    return res.json({ success: true, message: "Account updated.", data: { user: userPublicFields(user) } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me, updateMe, verifyOtp, resendOtp, changePassword };
