const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject: "Your TapMe verification code",
    text:    `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not create a TapMe account, ignore this email.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px;border:1px solid #F0F0F0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
          <span style="font-size:20px;font-weight:700;color:#18181B">Tap<span style="color:#28DC4F">Me</span></span>
        </div>
        <h2 style="margin:0 0 8px;font-size:22px;color:#111827">Verify your email</h2>
        <p style="margin:0 0 24px;font-size:14px;color:#6D6D6D;line-height:1.6">
          Use the code below to complete your registration. It expires in <strong>10 minutes</strong>.
        </p>
        <div style="text-align:center;background:#F9F9F9;border-radius:12px;padding:24px;margin-bottom:24px">
          <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#111827">${otp}</span>
        </div>
        <p style="margin:0;font-size:12px;color:#9CA3AF">
          If you did not create a TapMe account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail };
