const nodemailer   = require("nodemailer");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Pure HTML/CSS logo — Gmail blocks data: URIs and can't reach localhost URLs,
// so we render the brand mark with CSS shapes and text instead of image files.
const LOGO_HEADER = `
  <a href="${FRONTEND_URL}" style="display:inline-table;text-decoration:none;margin-bottom:24px">
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
      <tr>
        <td style="vertical-align:middle;padding-right:10px">
          <!-- Icon: green rounded square with white T -->
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background:#28DC4F;border-radius:10px;width:40px;height:40px">
            <tr><td style="text-align:center;vertical-align:middle;font-family:Arial,sans-serif;font-size:22px;font-weight:900;color:#ffffff;line-height:40px;width:40px;height:40px">T</td></tr>
          </table>
        </td>
        <td style="vertical-align:middle">
          <!-- Wordmark: TAP + ME in green + LABS -->
          <span style="font-family:Arial,sans-serif;font-size:18px;font-weight:900;letter-spacing:1px;color:#111827">TAP</span><span style="font-family:Arial,sans-serif;font-size:18px;font-weight:900;letter-spacing:1px;color:#28DC4F">ME</span><span style="font-family:Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:2px;color:#9CA3AF;margin-left:4px">LABS</span>
        </td>
      </tr>
    </table>
  </a>`;

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
        ${LOGO_HEADER}
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

async function sendPaymentSuccessEmail(to, { customerName, orderId, orderNumber, amount, productName, shippingAddress }) {
  const displayId   = orderNumber || `TML-${String(orderId).padStart(6, "0")}`;
  const amountStr   = `₹${Number(amount).toLocaleString("en-IN")}`;
  const addr        = shippingAddress || {};
  const addressLine = [addr.address, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject: `Order Confirmed – ${displayId} | TapMe Labs`,
    text: `Hi ${customerName},\n\nYour payment of ${amountStr} for order ${displayId} was successful.\n\nYou can now set up your digital profile at https://tapmelabs.com/dashboard/profile/setup\n\nThank you for choosing TapMe Labs!`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px;border:1px solid #F0F0F0">

        <!-- Header -->
        <div style="margin-bottom:28px">
          ${LOGO_HEADER}
        </div>

        <!-- Success badge — pure CSS, no SVG (Gmail strips inline SVG) -->
        <div style="text-align:center;margin-bottom:28px">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto 16px">
            <tr>
              <td style="width:64px;height:64px;border-radius:50%;background:#28DC4F;text-align:center;vertical-align:middle;font-family:Arial,sans-serif;font-size:30px;font-weight:900;color:#ffffff;line-height:64px">&#10003;</td>
            </tr>
          </table>
          <h1 style="margin:0 0 6px;font-size:24px;font-weight:700;color:#111827">Payment Successful!</h1>
          <p style="margin:0;font-size:14px;color:#6D6D6D">Hi ${customerName}, your order has been confirmed.</p>
        </div>

        <!-- Order summary -->
        <div style="background:#F9F9F9;border-radius:12px;padding:20px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:6px 0;color:#9CA3AF">Order ID</td>
              <td style="padding:6px 0;color:#111827;font-weight:600;text-align:right">${displayId}</td>
            </tr>
            ${productName ? `
            <tr>
              <td style="padding:6px 0;color:#9CA3AF">Product</td>
              <td style="padding:6px 0;color:#111827;text-align:right">${productName}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:6px 0;color:#9CA3AF">Amount Paid</td>
              <td style="padding:6px 0;color:#28DC4F;font-weight:700;text-align:right">${amountStr}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9CA3AF">Status</td>
              <td style="padding:6px 0;text-align:right">
                <span style="background:rgba(40,220,79,0.12);color:#16a34a;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:600">Paid</span>
              </td>
            </tr>
            ${addressLine ? `
            <tr>
              <td style="padding:6px 0;color:#9CA3AF;vertical-align:top">Ship to</td>
              <td style="padding:6px 0;color:#111827;text-align:right">${addressLine}</td>
            </tr>` : ""}
          </table>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-bottom:28px">
          <a href="https://tapmelabs.com/dashboard/profile/setup"
             style="display:inline-block;background:#28DC4F;color:#000;font-weight:700;font-size:15px;padding:14px 32px;border-radius:99px;text-decoration:none">
            Set Up Your Profile
          </a>
        </div>

        <!-- Footer -->
        <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center">
          Questions? Email us at <a href="mailto:support@tapmelabs.com" style="color:#28DC4F">support@tapmelabs.com</a>
        </p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail, sendPaymentSuccessEmail };
