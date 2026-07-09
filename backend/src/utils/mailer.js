const nodemailer   = require("nodemailer");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Real brand mark — hosted image files, not inline <svg> or data: URIs.
// Gmail strips inline <svg> markup entirely and won't load data: URIs, but
// it does load ordinary <img> tags pointing at a public HTTPS URL, so we
// reference the same logo.svg/logo-text.svg files the live site itself uses.
const LOGO_HEADER = `
  <a href="${FRONTEND_URL}" style="display:inline-table;text-decoration:none;margin-bottom:24px">
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">
      <tr>
        <td style="vertical-align:middle;padding-right:10px">
          <img src="https://tapmelabs.com/images/logo.svg" width="32" height="32" alt="TapMe Labs" style="display:block;border:0;width:32px;height:32px" />
        </td>
        <td style="vertical-align:middle">
          <img src="https://tapmelabs.com/images/logo-text.svg" width="135" height="12" alt="TapMe Labs" style="display:block;border:0;width:135px;height:12px" />
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

async function sendPaymentSuccessEmail(to, { customerName, orderId, orderNumber, amount, productName, shippingAddress, proPlan, productType = "nfc_card" }) {
  const displayId   = orderNumber || `TML-${String(orderId).padStart(6, "0")}`;
  const totalAmount = Number(amount);
  const PRO_PRICE   = 999;
  const cardPrice   = proPlan ? totalAmount - PRO_PRICE : totalAmount;
  const amountStr   = `₹${totalAmount.toLocaleString("en-IN")}`;
  const addr        = shippingAddress || {};
  const addressLine = [addr.address, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");
  const isNfcCard   = productType === "nfc_card";
  const lineItemLabel = isNfcCard ? "NFC Business Card" : (productName || "Product");

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
            <!-- Price breakdown -->
            <tr>
              <td colspan="2" style="padding:8px 0 4px"><hr style="border:none;border-top:1px solid #EBEBEB;margin:0"/></td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#9CA3AF;font-size:13px">${lineItemLabel}</td>
              <td style="padding:4px 0;color:#111827;font-size:13px;text-align:right">₹${cardPrice.toLocaleString("en-IN")}</td>
            </tr>
            ${proPlan ? `
            <tr>
              <td style="padding:4px 0;color:#9CA3AF;font-size:13px">⚡ Pro Plan (1 year)</td>
              <td style="padding:4px 0;color:#16a34a;font-size:13px;font-weight:600;text-align:right">+₹${PRO_PRICE.toLocaleString("en-IN")}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:4px 0;color:#9CA3AF;font-size:13px">Shipping</td>
              <td style="padding:4px 0;color:#16a34a;font-size:13px;font-weight:600;text-align:right">FREE</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 0 4px"><hr style="border:none;border-top:1px solid #EBEBEB;margin:0"/></td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#111827;font-weight:700;font-size:14px">Total Paid</td>
              <td style="padding:4px 0;color:#28DC4F;font-weight:700;font-size:16px;text-align:right">${amountStr}</td>
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

        ${isNfcCard ? `
        <!-- CTA -->
        <div style="text-align:center;margin-bottom:28px">
          <a href="https://tapmelabs.com/dashboard/profile/setup"
             style="display:inline-block;background:#28DC4F;color:#000;font-weight:700;font-size:15px;padding:14px 32px;border-radius:99px;text-decoration:none">
            Set Up Your Profile
          </a>
        </div>` : ""}

        <!-- Footer -->
        <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center">
          Questions? Email us at <a href="mailto:support@tapmelabs.com" style="color:#28DC4F">support@tapmelabs.com</a>
        </p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(to, { name, resetUrl }) {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject: "Reset your TapMe password",
    text:    `Hi ${name},\n\nClick the link below to reset your password. It expires in 15 minutes.\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px;border:1px solid #F0F0F0">
        ${LOGO_HEADER}
        <h2 style="margin:0 0 8px;font-size:22px;color:#111827">Reset your password</h2>
        <p style="margin:0 0 24px;font-size:14px;color:#6D6D6D;line-height:1.6">
          Hi ${name}, we received a request to reset your TapMe password.
          Click the button below — the link expires in <strong>15 minutes</strong>.
        </p>
        <div style="text-align:center;margin-bottom:24px">
          <a href="${resetUrl}" style="display:inline-block;background:#28DC4F;color:#000;font-weight:700;font-size:15px;padding:14px 32px;border-radius:99px;text-decoration:none">
            Reset Password
          </a>
        </div>
        <p style="margin:0 0 8px;font-size:12px;color:#9CA3AF">
          Or copy this link into your browser:
        </p>
        <p style="margin:0 0 24px;font-size:12px;color:#6D6D6D;word-break:break-all">${resetUrl}</p>
        <p style="margin:0;font-size:12px;color:#9CA3AF">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

async function sendResellerCustomerSetupEmail(to, { customerName, productName, setupUrl }) {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject: "Your NFC Card is on its way! Set up your digital profile – TapMe Labs",
    text: `Hi ${customerName},\n\nGreat news! Your ${productName || "NFC Business Card"} has been ordered.\n\nSet up your digital profile so your card is ready to go when it arrives:\n${setupUrl}\n\nThis link expires in 48 hours.\n\nTapMe Labs Team`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px;border:1px solid #F0F0F0">

        <div style="margin-bottom:28px">${LOGO_HEADER}</div>

        <div style="text-align:center;margin-bottom:28px">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto 16px">
            <tr>
              <td style="width:64px;height:64px;border-radius:50%;background:#28DC4F;text-align:center;vertical-align:middle;font-family:Arial,sans-serif;font-size:28px;color:#fff;line-height:64px">&#128230;</td>
            </tr>
          </table>
          <h1 style="margin:0 0 6px;font-size:24px;font-weight:700;color:#111827">Your card is on its way!</h1>
          <p style="margin:0;font-size:14px;color:#6D6D6D">Hi ${customerName}, your <strong>${productName || "NFC Business Card"}</strong> has been ordered for you.</p>
        </div>

        <div style="background:#F9FAFB;border-radius:12px;padding:20px;margin-bottom:24px">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827">What happens next?</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:8px 0;color:#6D6D6D;vertical-align:top;width:24px">1.</td>
              <td style="padding:8px 0;color:#6D6D6D">Click the button below to set up your digital profile</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6D6D6D;vertical-align:top">2.</td>
              <td style="padding:8px 0;color:#6D6D6D">Choose a password to secure your account</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6D6D6D;vertical-align:top">3.</td>
              <td style="padding:8px 0;color:#6D6D6D">Your card will be linked and ready when it arrives</td>
            </tr>
          </table>
        </div>

        <div style="text-align:center;margin-bottom:28px">
          <a href="${setupUrl}" style="display:inline-block;background:#28DC4F;color:#000;font-weight:700;font-size:15px;padding:14px 36px;border-radius:99px;text-decoration:none">
            Set Up My Profile
          </a>
          <p style="margin:12px 0 0;font-size:11px;color:#9CA3AF">This link expires in 48 hours</p>
        </div>

        <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:14px 18px;margin-bottom:24px">
          <p style="margin:0;font-size:12px;color:#92400E">
            <strong>Can't click the button?</strong> Copy and paste this link into your browser:<br/>
            <span style="color:#6B7280;word-break:break-all">${setupUrl}</span>
          </p>
        </div>

        <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center">
          Questions? Email us at <a href="mailto:support@tapmelabs.com" style="color:#28DC4F">support@tapmelabs.com</a>
        </p>
      </div>
    `,
  });
}

async function sendOrderStatusEmail(to, { customerName, orderNumber, productName, orderStatus }) {
  const isShipped = orderStatus === "shipped";
  const heading    = isShipped ? "Your order has shipped!" : "Your order has been delivered!";
  const bodyText   = isShipped
    ? "Great news — your order is on its way to you."
    : "Your order has arrived. We hope you love it!";
  // Plain glyphs (not emoji pictographs) so the icon renders as a clean
  // single-color mark matching the brand, instead of a colorful stock emoji.
  const icon       = isShipped ? "&#8594;" : "&#10003;"; // arrow (in-transit) / checkmark (delivered)

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to,
    subject: `Order ${isShipped ? "Shipped" : "Delivered"} – ${orderNumber} | TapMe Labs`,
    text: `Hi ${customerName},\n\n${bodyText}\n\nOrder: ${orderNumber}${productName ? ` (${productName})` : ""}\nStatus: ${orderStatus}\n\nTapMe Labs Team`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px;border:1px solid #F0F0F0">
        <div style="margin-bottom:28px">${LOGO_HEADER}</div>

        <div style="text-align:center;margin-bottom:28px">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto 16px">
            <tr>
              <td style="width:64px;height:64px;border-radius:50%;background:#28DC4F;text-align:center;vertical-align:middle;font-family:Arial,sans-serif;font-size:30px;font-weight:700;color:#fff;line-height:64px">${icon}</td>
            </tr>
          </table>
          <h1 style="margin:0 0 6px;font-size:24px;font-weight:700;color:#111827">${heading}</h1>
          <p style="margin:0;font-size:14px;color:#6D6D6D">Hi ${customerName}, ${bodyText.toLowerCase()}</p>
        </div>

        <div style="background:#F9F9F9;border-radius:12px;padding:20px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr>
              <td style="padding:6px 0;color:#9CA3AF">Order ID</td>
              <td style="padding:6px 0;color:#111827;font-weight:600;text-align:right">${orderNumber}</td>
            </tr>
            ${productName ? `
            <tr>
              <td style="padding:6px 0;color:#9CA3AF">Product</td>
              <td style="padding:6px 0;color:#111827;text-align:right">${productName}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:6px 0;color:#9CA3AF">Status</td>
              <td style="padding:6px 0;text-align:right">
                <span style="background:rgba(40,220,79,0.12);color:#16a34a;padding:2px 10px;border-radius:99px;font-size:12px;font-weight:600;text-transform:capitalize">${orderStatus}</span>
              </td>
            </tr>
          </table>
        </div>

        <p style="margin:0;font-size:12px;color:#9CA3AF;text-align:center">
          Questions? Email us at <a href="mailto:support@tapmelabs.com" style="color:#28DC4F">support@tapmelabs.com</a>
        </p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail, sendPaymentSuccessEmail, sendPasswordResetEmail, sendResellerCustomerSetupEmail, sendOrderStatusEmail, LOGO_HEADER };
