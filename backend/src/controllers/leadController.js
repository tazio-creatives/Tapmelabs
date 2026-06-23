const { Lead, Form, User } = require("../models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// GET /api/leads
async function list(req, res) {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const where = { user_id: req.user.id };
    if (status)   where.status       = status;
    if (priority) where.ai_priority  = priority;

    const { rows, count } = await Lead.findAndCountAll({
      where,
      include: [{ model: Form, as: "form", attributes: ["id", "title", "slug"] }],
      order: [["created_at", "DESC"]],
      limit:  Number(limit),
      offset: (Number(page) - 1) * Number(limit),
    });

    res.json({ success: true, leads: rows, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/leads/:id
async function getOne(req, res) {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ model: Form, as: "form", attributes: ["id", "title"] }],
    });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PATCH /api/leads/:id/status
async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const valid = ["new", "contacted", "follow_up", "closed"];
    if (!valid.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });

    const lead = await Lead.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    await lead.update({ status });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PATCH /api/leads/:id/notes
async function updateNotes(req, res) {
  try {
    const { notes } = req.body;
    const lead = await Lead.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    await lead.update({ notes });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /api/leads/:id
async function remove(req, res) {
  try {
    const lead = await Lead.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    await lead.destroy();
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/leads/stats
async function stats(req, res) {
  try {
    const total     = await Lead.count({ where: { user_id: req.user.id } });
    const newLeads  = await Lead.count({ where: { user_id: req.user.id, status: "new" } });
    const hot       = await Lead.count({ where: { user_id: req.user.id, ai_priority: "hot" } });
    const contacted = await Lead.count({ where: { user_id: req.user.id, status: "contacted" } });
    res.json({ success: true, stats: { total, new: newLeads, hot, contacted } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/leads/:id/send-reply — send AI reply email to lead
async function sendReply(req, res) {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: "Message is required" });

    const lead = await Lead.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    if (!lead.email) return res.status(400).json({ success: false, message: "Lead has no email address" });

    const sender = await User.findByPk(req.user.id, { attributes: ["full_name", "email"] });

    await transporter.sendMail({
      from:     process.env.EMAIL_FROM,
      to:       lead.email,
      replyTo:  sender?.email,
      subject:  `Following up — ${sender?.full_name || "TapMe Labs"}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px;border:1px solid #F0F0F0">
          <p style="font-size:15px;color:#111827;line-height:1.7;white-space:pre-wrap">${message.replace(/</g, "&lt;")}</p>
          <hr style="border:none;border-top:1px solid #F0F0F0;margin:24px 0"/>
          <p style="font-size:13px;color:#6D6D6D">
            ${sender?.full_name || ""}<br/>
            <a href="${FRONTEND_URL}" style="color:#28DC4F">TapMe Labs</a>
          </p>
        </div>
      `,
    });

    // Auto-mark lead as contacted
    await lead.update({ status: "contacted" });

    res.json({ success: true, message: "Reply sent and lead marked as contacted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { list, getOne, updateStatus, updateNotes, remove, stats, sendReply };
