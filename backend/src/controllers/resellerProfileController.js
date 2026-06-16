const bcrypt = require("bcryptjs");
const { Reseller } = require("../models");

// GET /api/reseller/profile
async function getProfile(req, res) {
  const r = req.reseller;
  res.json({
    id: r.id, full_name: r.full_name, email: r.email, phone: r.phone,
    status: r.status, commission_rate: r.commission_rate,
    commission_balance: r.commission_balance, total_earned: r.total_earned,
    total_withdrawn: r.total_withdrawn, two_fa_enabled: r.two_fa_enabled,
    created_at: r.created_at,
  });
}

// PATCH /api/reseller/profile
async function updateProfile(req, res) {
  try {
    const { full_name, phone } = req.body;
    await req.reseller.update({ full_name, phone });
    res.json({ message: "Profile updated", reseller: req.reseller });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PATCH /api/reseller/profile/password
async function changePassword(req, res) {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ message: "current_password and new_password required" });
    }

    const valid = await bcrypt.compare(current_password, req.reseller.password);
    if (!valid) return res.status(401).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(new_password, 10);
    await req.reseller.update({ password: hashed });
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/reseller/dashboard/stats
async function dashboardStats(req, res) {
  try {
    const { ResellerOrder } = require("../models");
    const { Op } = require("sequelize");

    const [total, paid, pending] = await Promise.all([
      ResellerOrder.count({ where: { reseller_id: req.reseller.id } }),
      ResellerOrder.count({ where: { reseller_id: req.reseller.id, status: "paid" } }),
      ResellerOrder.count({ where: { reseller_id: req.reseller.id, status: "pending" } }),
    ]);

    const r = req.reseller;
    res.json({
      total_orders:       total,
      paid_orders:        paid,
      pending_orders:     pending,
      commission_balance: r.commission_balance,
      total_earned:       r.total_earned,
      total_withdrawn:    r.total_withdrawn,
      commission_rate:    r.commission_rate,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getProfile, updateProfile, changePassword, dashboardStats };
