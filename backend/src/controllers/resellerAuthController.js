const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Reseller } = require("../models");

function signAccess(reseller) {
  return jwt.sign(
    { id: reseller.id, email: reseller.email, role: "reseller" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function signRefresh(reseller) {
  return jwt.sign(
    { id: reseller.id, role: "reseller" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// POST /api/reseller/auth/register
async function register(req, res) {
  try {
    const { full_name, email, phone, password } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "full_name, email and password are required" });
    }

    const exists = await Reseller.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const reseller = await Reseller.create({ full_name, email, phone, password: hashed });

    const accessToken  = signAccess(reseller);
    const refreshToken = signRefresh(reseller);
    await reseller.update({ refresh_token: refreshToken });

    res.status(201).json({
      message: "Registration successful",
      token: accessToken,
      refresh_token: refreshToken,
      reseller: { id: reseller.id, full_name: reseller.full_name, email: reseller.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/reseller/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const reseller = await Reseller.findOne({ where: { email } });
    if (!reseller) return res.status(401).json({ message: "Invalid credentials" });
    if (reseller.status === "blocked") return res.status(403).json({ message: "Account blocked" });

    const valid = await bcrypt.compare(password, reseller.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken  = signAccess(reseller);
    const refreshToken = signRefresh(reseller);
    await reseller.update({ refresh_token: refreshToken });

    res.json({
      token: accessToken,
      refresh_token: refreshToken,
      reseller: {
        id: reseller.id,
        full_name: reseller.full_name,
        email: reseller.email,
        commission_rate: reseller.commission_rate,
        commission_balance: reseller.commission_balance,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/reseller/auth/refresh
async function refresh(req, res) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ message: "refresh_token required" });

    const payload = jwt.verify(refresh_token, process.env.JWT_SECRET);
    if (payload.role !== "reseller") return res.status(403).json({ message: "Invalid token" });

    const reseller = await Reseller.findByPk(payload.id);
    if (!reseller || reseller.refresh_token !== refresh_token) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccess  = signAccess(reseller);
    const newRefresh = signRefresh(reseller);
    await reseller.update({ refresh_token: newRefresh });

    res.json({ token: newAccess, refresh_token: newRefresh });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

// POST /api/reseller/auth/logout
async function logout(req, res) {
  try {
    await req.reseller.update({ refresh_token: null });
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/reseller/auth/me
async function me(req, res) {
  const r = req.reseller;
  res.json({
    id: r.id,
    full_name: r.full_name,
    email: r.email,
    phone: r.phone,
    status: r.status,
    commission_rate: r.commission_rate,
    commission_balance: r.commission_balance,
    total_earned: r.total_earned,
    total_withdrawn: r.total_withdrawn,
    two_fa_enabled: r.two_fa_enabled,
  });
}

module.exports = { register, login, refresh, logout, me };
