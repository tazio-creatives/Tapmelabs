const { Reseller, ResellerOrder, CommissionLedger, PayoutRequest, Order } = require("../models");
const { Op } = require("sequelize");

// GET /api/admin/resellers
async function list(req, res) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const where = {};
    if (status) where.status = status;

    const { rows, count } = await Reseller.findAndCountAll({
      where,
      attributes: { exclude: ["password", "refresh_token", "two_fa_secret"] },
      order: [["created_at", "DESC"]],
      limit:  Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    res.json({ resellers: rows, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/admin/resellers/:id
async function detail(req, res) {
  try {
    const reseller = await Reseller.findByPk(req.params.id, {
      attributes: { exclude: ["password", "refresh_token", "two_fa_secret"] },
    });
    if (!reseller) return res.status(404).json({ message: "Reseller not found" });

    const [orderCount, ledger] = await Promise.all([
      ResellerOrder.count({ where: { reseller_id: reseller.id } }),
      CommissionLedger.findAll({ where: { reseller_id: reseller.id }, order: [["created_at", "DESC"]], limit: 10 }),
    ]);

    res.json({ reseller, order_count: orderCount, recent_ledger: ledger });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PATCH /api/admin/resellers/:id/status
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const reseller = await Reseller.findByPk(req.params.id);
    if (!reseller) return res.status(404).json({ message: "Reseller not found" });
    await reseller.update({ status });
    res.json({ message: "Status updated", reseller });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// PATCH /api/admin/resellers/:id/commission-rate
async function updateCommissionRate(req, res) {
  try {
    const { rate } = req.body;
    if (rate === undefined || rate < 0 || rate > 100) {
      return res.status(400).json({ message: "Rate must be between 0 and 100" });
    }
    const reseller = await Reseller.findByPk(req.params.id);
    if (!reseller) return res.status(404).json({ message: "Reseller not found" });
    await reseller.update({ commission_rate: rate });
    res.json({ message: "Commission rate updated", reseller });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/admin/resellers/:id/orders
async function resellerOrders(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { rows, count } = await ResellerOrder.findAndCountAll({
      where: { reseller_id: req.params.id },
      include: [{ model: Order, as: "order", include: ["product"] }],
      order: [["created_at", "DESC"]],
      limit:  Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });
    res.json({ orders: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/admin/resellers/payouts
async function listPayouts(req, res) {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const payouts = await PayoutRequest.findAll({
      where,
      include: [{ model: Reseller, as: "reseller", attributes: ["id", "full_name", "email"] }],
      order: [["created_at", "DESC"]],
    });
    res.json({ payouts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/admin/resellers/payouts/:id/approve
async function approvePayout(req, res) {
  try {
    const payout = await PayoutRequest.findByPk(req.params.id, {
      include: [{ model: Reseller, as: "reseller" }],
    });
    if (!payout) return res.status(404).json({ message: "Payout not found" });
    if (payout.status !== "pending") return res.status(400).json({ message: "Not a pending payout" });

    const reseller  = payout.reseller;
    const newBalance = parseFloat((Number(reseller.commission_balance) - Number(payout.amount)).toFixed(2));
    if (newBalance < 0) return res.status(400).json({ message: "Insufficient reseller balance" });

    await reseller.update({
      commission_balance: newBalance,
      total_withdrawn: parseFloat((Number(reseller.total_withdrawn) + Number(payout.amount)).toFixed(2)),
    });

    await CommissionLedger.create({
      reseller_id: reseller.id, reseller_order_id: null,
      type: "withdrawn", amount: payout.amount,
      balance_after: newBalance,
      note: `Payout approved by admin`,
    });

    await payout.update({ status: "paid", processed_at: new Date() });
    res.json({ message: "Payout approved", payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/admin/resellers/payouts/:id/reject
async function rejectPayout(req, res) {
  try {
    const { note } = req.body;
    const payout = await PayoutRequest.findByPk(req.params.id);
    if (!payout) return res.status(404).json({ message: "Payout not found" });
    await payout.update({ status: "rejected", admin_note: note, processed_at: new Date() });
    res.json({ message: "Payout rejected", payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { list, detail, updateStatus, updateCommissionRate, resellerOrders, listPayouts, approvePayout, rejectPayout };
