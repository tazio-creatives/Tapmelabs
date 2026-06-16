const { CommissionLedger, PayoutRequest, Reseller } = require("../models");
const { Op } = require("sequelize");

// GET /api/reseller/commission/summary
async function summary(req, res) {
  try {
    const r = req.reseller;
    res.json({
      commission_rate:    r.commission_rate,
      commission_balance: r.commission_balance,
      total_earned:       r.total_earned,
      total_withdrawn:    r.total_withdrawn,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/reseller/commission/ledger
async function ledger(req, res) {
  try {
    const { page = 1, limit = 30 } = req.query;
    const { rows, count } = await CommissionLedger.findAndCountAll({
      where: { reseller_id: req.reseller.id },
      order: [["created_at", "DESC"]],
      limit:  Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });
    res.json({ ledger: rows, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// POST /api/reseller/commission/payout/request
async function requestPayout(req, res) {
  try {
    const { amount, upi_id, bank_account, bank_ifsc, bank_name } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Valid amount required" });
    }
    if (!upi_id && !bank_account) {
      return res.status(400).json({ message: "UPI ID or bank details required" });
    }

    const reseller = req.reseller;
    if (Number(amount) > Number(reseller.commission_balance)) {
      return res.status(400).json({ message: "Insufficient commission balance" });
    }

    // Check no pending payout already
    const pending = await PayoutRequest.findOne({
      where: { reseller_id: reseller.id, status: "pending" },
    });
    if (pending) {
      return res.status(400).json({ message: "You already have a pending payout request" });
    }

    const payout = await PayoutRequest.create({
      reseller_id: reseller.id, amount, upi_id, bank_account, bank_ifsc, bank_name,
    });

    res.status(201).json({ message: "Payout request submitted", payout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET /api/reseller/commission/payout/history
async function payoutHistory(req, res) {
  try {
    const payouts = await PayoutRequest.findAll({
      where:  { reseller_id: req.reseller.id },
      order:  [["created_at", "DESC"]],
    });
    res.json({ payouts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { summary, ledger, requestPayout, payoutHistory };
