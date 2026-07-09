const { Form, Lead, NfcCard } = require("../models");
const { sendOtpEmail, LOGO_HEADER } = require("../utils/mailer");
const { Op } = require("sequelize");

function generateSlug(userId) {
  return `${userId.slice(0, 8)}-${Date.now()}`;
}

// GET /api/forms — list my forms
async function list(req, res) {
  try {
    const forms = await Form.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });
    res.json({ success: true, forms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/forms — create form
async function create(req, res) {
  try {
    const { title, description, fields, thank_you_message } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    const form = await Form.create({
      user_id: req.user.id,
      title,
      description: description || null,
      fields: fields || [
        { id: "name",    label: "Full Name",    type: "text",  required: true  },
        { id: "email",   label: "Email",        type: "email", required: true  },
        { id: "phone",   label: "Phone",        type: "tel",   required: false },
        { id: "message", label: "Message",      type: "textarea", required: false },
      ],
      thank_you_message: thank_you_message || "Thanks for connecting! I will reach out shortly.",
      slug: generateSlug(req.user.id),
    });

    res.status(201).json({ success: true, form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/forms/:id — get one form
async function getOne(req, res) {
  try {
    const form = await Form.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    res.json({ success: true, form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// PATCH /api/forms/:id — update form
async function update(req, res) {
  try {
    const form = await Form.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });

    const { title, description, fields, thank_you_message, is_active } = req.body;
    await form.update({
      ...(title             !== undefined && { title }),
      ...(description       !== undefined && { description }),
      ...(fields            !== undefined && { fields }),
      ...(thank_you_message !== undefined && { thank_you_message }),
      ...(is_active         !== undefined && { is_active }),
    });

    res.json({ success: true, form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /api/forms/:id — delete form
async function remove(req, res) {
  try {
    const form = await Form.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    await form.destroy();
    res.json({ success: true, message: "Form deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/forms/public/:slug — public form data (no auth)
async function getPublic(req, res) {
  try {
    const form = await Form.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [{ model: require("../models").User, as: "user", attributes: ["full_name"] }],
    });
    if (!form) return res.status(404).json({ success: false, message: "Form not found" });
    res.json({ success: true, form });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/forms/public/:slug/submit — public submit (no auth)
async function submit(req, res) {
  try {
    const form = await Form.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [{ model: require("../models").User, as: "user", attributes: ["full_name", "email"] }],
    });
    if (!form) return res.status(404).json({ success: false, message: "Form not found or inactive" });

    const data = req.body;

    // Extract name/email/phone by matching field type OR common key names
    const fields = form.fields || [];
    const nameField  = fields.find(f => f.type === "text"  && /name/i.test(f.label));
    const emailField = fields.find(f => f.type === "email");
    const phoneField = fields.find(f => f.type === "tel");

    const name  = (nameField  ? data[nameField.id]  : null) || data.name  || data.full_name || null;
    const email = (emailField ? data[emailField.id] : null) || data.email || null;
    const phone = (phoneField ? data[phoneField.id] : null) || data.phone || null;

    const lead = await Lead.create({
      form_id:        form.id,
      user_id:        form.user_id,
      data,
      name,
      email,
      phone,
      status:         "new",
      scoring_status: "pending",
    });

    // Respond immediately — don't wait for email
    res.status(201).json({
      success: true,
      message: form.thank_you_message,
    });

    // Send thank-you email fire-and-forget (after response sent)
    if (email) {
      sendThankYouEmail(email, name, form).catch(e => {
        console.error("Thank-you email failed:", e.message);
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function sendThankYouEmail(to, name, form) {
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const ownerName = form.user?.full_name || "the card owner";
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject: `Thanks for connecting with ${ownerName}!`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px;border:1px solid #F0F0F0">
        <div style="margin-bottom:24px">${LOGO_HEADER}</div>
        <h2 style="margin:0 0 8px;font-size:22px;color:#111827">Hi ${name || "there"}!</h2>
        <p style="margin:0 0 16px;font-size:15px;color:#6D6D6D;line-height:1.6">
          ${form.thank_you_message}
        </p>
        <hr style="border:none;border-top:1px solid #F0F0F0;margin:24px 0"/>
        <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center">
          Powered by <a href="${FRONTEND_URL}" style="color:#28DC4F;text-decoration:none">TapMe Labs</a>
        </p>
      </div>
    `,
  });
}

module.exports = { list, create, getOne, update, remove, getPublic, submit };
