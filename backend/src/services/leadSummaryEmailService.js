/**
 * Sends a scored leads summary email to card owners after batch scoring.
 * Groups leads by user and sends one email per user with new scores.
 */

const nodemailer = require("nodemailer");
const { Lead, User } = require("../models");
const { Op } = require("sequelize");
const { LOGO_HEADER } = require("../utils/mailer");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const PRIORITY_EMOJI = { hot: "🔥", warm: "🌡", cold: "❄️" };
const PRIORITY_COLOR = { hot: "#DC2626", warm: "#D97706", cold: "#2563EB" };

/**
 * Send summary emails for all leads scored in the last 2 hours
 */
async function sendScoredLeadsSummary() {
  // Find recently scored leads (last 2 hours)
  const since = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const leads = await Lead.findAll({
    where: {
      scoring_status: "scored",
      ai_scored_at:   { [Op.gte]: since },
    },
    include: [{ model: User, as: "user", attributes: ["id", "email", "full_name"] }],
    order: [["ai_score", "DESC"]],
  });

  if (leads.length === 0) return;

  // Group by user
  const byUser = {};
  for (const lead of leads) {
    const uid = lead.user_id;
    if (!byUser[uid]) byUser[uid] = { user: lead.user, leads: [] };
    byUser[uid].leads.push(lead);
  }

  // Send one email per user
  for (const { user, leads: userLeads } of Object.values(byUser)) {
    if (!user?.email) continue;

    const hot  = userLeads.filter(l => l.ai_priority === "hot");
    const warm = userLeads.filter(l => l.ai_priority === "warm");
    const cold = userLeads.filter(l => l.ai_priority === "cold");

    const subject = hot.length > 0
      ? `🔥 ${hot.length} hot lead${hot.length > 1 ? "s" : ""} — act now!`
      : `📊 ${userLeads.length} new lead${userLeads.length > 1 ? "s" : ""} scored`;

    const leadsHtml = userLeads.map(lead => {
      const emoji = PRIORITY_EMOJI[lead.ai_priority] || "📋";
      const color = PRIORITY_COLOR[lead.ai_priority] || "#374151";
      return `
        <div style="border:1px solid #F0F0F0;border-radius:12px;padding:16px;margin-bottom:12px;background:#fff">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <strong style="font-size:15px;color:#111827">${lead.name || "Unknown"}</strong>
            <span style="font-size:13px;font-weight:700;color:${color}">${emoji} ${String(lead.ai_priority || "").toUpperCase()} · ${lead.ai_score}/10</span>
          </div>
          ${lead.email ? `<p style="margin:2px 0;font-size:13px;color:#6D6D6D">📧 ${lead.email}</p>` : ""}
          ${lead.phone ? `<p style="margin:2px 0;font-size:13px;color:#6D6D6D">📞 ${lead.phone}</p>` : ""}
          ${lead.ai_summary ? `<p style="margin:8px 0 0;font-size:13px;color:#374151;background:#F9FAFB;padding:8px;border-radius:8px">${lead.ai_summary}</p>` : ""}
          <div style="margin-top:12px;display:flex;gap:8px">
            ${lead.email ? `<a href="mailto:${lead.email}?subject=Following up from TapMe&body=${encodeURIComponent(lead.ai_reply_suggestion || '')}" style="display:inline-block;background:#28DC4F;color:#000;font-weight:600;font-size:12px;padding:8px 16px;border-radius:8px;text-decoration:none">Send Email</a>` : ""}
            ${lead.phone ? `<a href="https://wa.me/${lead.phone.replace(/\D/g,'')}?text=${encodeURIComponent(lead.ai_reply_suggestion || '')}" style="display:inline-block;background:#25D366;color:#fff;font-weight:600;font-size:12px;padding:8px 16px;border-radius:8px;text-decoration:none">WhatsApp</a>` : ""}
          </div>
        </div>`;
    }).join("");

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#F9F9F9">
        <div style="background:#fff;border-radius:16px;padding:28px;border:1px solid #F0F0F0;margin-bottom:20px">
          <div style="margin-bottom:20px">${LOGO_HEADER}</div>
          <h2 style="margin:0 0 4px;font-size:22px;color:#111827">Hi ${user.full_name || "there"}!</h2>
          <p style="margin:0 0 20px;font-size:14px;color:#6D6D6D">
            ${userLeads.length} new lead${userLeads.length > 1 ? "s" : ""} scored
            ${hot.length > 0 ? `— <strong style="color:#DC2626">${hot.length} need immediate attention</strong>` : ""}
          </p>

          <!-- Stats row -->
          <div style="display:flex;gap:12px;margin-bottom:24px">
            ${hot.length  > 0 ? `<div style="flex:1;background:#FEF2F2;border-radius:10px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:800;color:#DC2626">${hot.length}</div><div style="font-size:11px;color:#DC2626">🔥 Hot</div></div>` : ""}
            ${warm.length > 0 ? `<div style="flex:1;background:#FFFBEB;border-radius:10px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:800;color:#D97706">${warm.length}</div><div style="font-size:11px;color:#D97706">🌡 Warm</div></div>` : ""}
            ${cold.length > 0 ? `<div style="flex:1;background:#EFF6FF;border-radius:10px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:800;color:#2563EB">${cold.length}</div><div style="font-size:11px;color:#2563EB">❄️ Cold</div></div>` : ""}
          </div>

          ${leadsHtml}

          <div style="text-align:center;margin-top:20px">
            <a href="${FRONTEND_URL}/dashboard/leads" style="display:inline-block;background:#111827;color:#fff;font-weight:600;font-size:14px;padding:14px 32px;border-radius:99px;text-decoration:none">
              View All Leads →
            </a>
          </div>
        </div>
        <p style="text-align:center;font-size:12px;color:#9CA3AF">
          You're receiving this because you have a TapMe Labs Pro account.<br/>
          <a href="${FRONTEND_URL}/dashboard/settings" style="color:#28DC4F">Manage notifications</a>
        </p>
      </div>`;

    try {
      await transporter.sendMail({
        from:    process.env.EMAIL_FROM,
        to:      user.email,
        subject,
        html,
      });
      console.log(`[summary-email] Sent to ${user.email} — ${userLeads.length} leads`);
    } catch (e) {
      console.error(`[summary-email] Failed for ${user.email}:`, e.message);
    }
  }
}

module.exports = { sendScoredLeadsSummary };
