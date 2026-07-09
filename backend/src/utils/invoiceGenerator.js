const PDFDocument = require("pdfkit");

const BRAND_GREEN = "#28DC4F";
const BRAND_DARK  = "#111827";
const BRAND_GREY  = "#6B7280";
const PRO_PLAN_PRICE = 999;
const FREE_SHIPPING_THRESHOLD = 799;
const SHIPPING_FEE = 99;

function formatINR(n) {
  return `Rs. ${Number(n).toLocaleString("en-IN")}`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Draws the TapMe Labs wordmark as vector shapes/text — mirrors mailer.js's
// LOGO_HEADER (green rounded square "T" + TAP/ME/LABS), since PDFKit can't
// render that HTML table directly.
function drawBrandHeader(doc) {
  const x = doc.page.margins.left;
  const y = doc.y;

  doc.roundedRect(x, y, 32, 32, 8).fill(BRAND_GREEN);
  doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(18).text("T", x, y + 6, { width: 32, align: "center" });

  doc.fillColor(BRAND_DARK).font("Helvetica-Bold").fontSize(16)
    .text("TAP", x + 42, y + 7, { continued: true })
    .fillColor(BRAND_GREEN).text("ME", { continued: true })
    .fillColor(BRAND_GREY).fontSize(11).text(" LABS");

  doc.y = y + 32 + 16;
  doc.fillColor(BRAND_DARK);
}

function drawRow(doc, label, value, opts = {}) {
  const startY = doc.y;
  doc.font("Helvetica").fontSize(10).fillColor(BRAND_GREY).text(label, doc.page.margins.left, startY, { width: 150 });
  doc.font(opts.bold ? "Helvetica-Bold" : "Helvetica").fontSize(10).fillColor(BRAND_DARK)
    .text(value, doc.page.margins.left + 150, startY, { width: 340 });
  doc.moveDown(0.6);
}

// Streams a PDF invoice directly to `res`. `order` must include its
// associated `user` and `product`. Caller is responsible for setting
// Content-Type/Content-Disposition headers before calling this.
function generateInvoicePdf(res, { order, user, product }) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  doc.pipe(res);

  drawBrandHeader(doc);

  doc.font("Helvetica-Bold").fontSize(20).fillColor(BRAND_DARK).text("Invoice", { align: "right" });
  doc.moveDown(1);

  const invoiceNumber = `INV-${order.order_number}`;
  drawRow(doc, "Invoice No.", invoiceNumber, { bold: true });
  drawRow(doc, "Order Number", order.order_number);
  drawRow(doc, "Order Date", formatDate(order.createdAt));
  if (order.payment_id) drawRow(doc, "Payment ID", order.payment_id);
  drawRow(doc, "Payment Status", "PAID", { bold: true });

  doc.moveDown(0.5);
  doc.strokeColor("#E5E7EB").moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown(1);

  doc.font("Helvetica-Bold").fontSize(11).fillColor(BRAND_DARK).text("Bill To");
  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(10).fillColor(BRAND_GREY);
  if (user?.full_name) doc.text(user.full_name);
  if (user?.email)     doc.text(user.email);
  if (user?.phone)     doc.text(user.phone);

  const addr = order.shipping_address || {};
  const addressLine = [addr.street, addr.landmark, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");
  if (addressLine) doc.text(addressLine, { width: 400 });

  doc.moveDown(1.5);
  doc.strokeColor("#E5E7EB").moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown(1);

  // ── Line items ──────────────────────────────────────────────────────────
  const subtotal     = Number(product?.sale_price ?? product?.price ?? order.total_amount);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const proPlanCost  = order.pro_plan ? PRO_PLAN_PRICE : 0;

  const tableTop = doc.y;
  doc.font("Helvetica-Bold").fontSize(10).fillColor(BRAND_GREY);
  doc.text("Description", doc.page.margins.left, tableTop, { width: 350 });
  doc.text("Amount", doc.page.margins.left + 350, tableTop, { width: 140, align: "right" });
  doc.moveDown(0.5);
  doc.strokeColor("#E5E7EB").moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown(0.5);

  function lineItem(desc, amount) {
    const y = doc.y;
    doc.font("Helvetica").fontSize(10).fillColor(BRAND_DARK).text(desc, doc.page.margins.left, y, { width: 350 });
    doc.text(formatINR(amount), doc.page.margins.left + 350, y, { width: 140, align: "right" });
    doc.moveDown(0.7);
  }

  lineItem(product?.name || "Product", subtotal);
  lineItem("Shipping", shippingCost);
  if (order.pro_plan) lineItem("Pro Plan (1 year)", proPlanCost);

  doc.moveDown(0.3);
  doc.strokeColor("#E5E7EB").moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
  doc.moveDown(0.5);

  const totalY = doc.y;
  doc.font("Helvetica-Bold").fontSize(12).fillColor(BRAND_DARK).text("Total Paid", doc.page.margins.left, totalY, { width: 350 });
  doc.fillColor(BRAND_GREEN).text(formatINR(order.total_amount), doc.page.margins.left + 350, totalY, { width: 140, align: "right" });

  doc.moveDown(3);
  doc.font("Helvetica").fontSize(9).fillColor(BRAND_GREY)
    .text("Thank you for your order!", { align: "center" })
    .text("Questions? Email us at support@tapmelabs.com", { align: "center" });

  doc.end();
}

module.exports = { generateInvoicePdf };
