"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

/* ─── helpers ─────────────────────────────────────────────────── */

function formatDateTime(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const date = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

/* ─── icons ──────────────────────────────────────────────────── */

const XCircleIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <circle cx="40" cy="40" r="40" fill="#EF4444" fillOpacity="0.10" />
    <circle cx="40" cy="40" r="30" fill="#EF4444" />
    <path d="M28 28l24 24M52 28L28 52" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="5" width="8" height="8" rx="1.5" />
    <path d="M10 5V3.5A1.5 1.5 0 0 0 8.5 2h-5A1.5 1.5 0 0 0 2 3.5v5A1.5 1.5 0 0 0 3.5 10H5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M5 3l4 4-4 4" />
  </svg>
);

const RetryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1.5 9A7.5 7.5 0 1 0 4 3.5" />
    <path d="M1.5 3.5v4h4" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 2h12l1.5 13H1.5L3 2Z" />
    <path d="M6.5 5.5a2.5 2.5 0 0 1 5 0" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="9" fill="#EF4444" fillOpacity="0.12" stroke="#EF4444" strokeWidth="1.5" />
    <path d="M10 6v4.5" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="10" cy="13.5" r="1" fill="#EF4444" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 2a6 6 0 0 1 4 10.5V14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1.5A6 6 0 0 1 10 2Z" />
    <path d="M8 18h4" />
  </svg>
);

const HeadsetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.333 10a6.667 6.667 0 1 1 13.334 0" />
    <rect x="2" y="10" width="3.5" height="5.5" rx="1.75" />
    <rect x="14.5" y="10" width="3.5" height="5.5" rx="1.75" />
    <path d="M18 15.5v.833A2.167 2.167 0 0 1 15.833 18.5H10" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="2.5" width="12" height="9" rx="1.5" />
    <path d="M1 4.5l6 4 6-4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 2h3l1.5 3.5L5 7a9 9 0 0 0 2 2l1.5-1.5L12 9v3c-5.5.5-10.5-4.5-10-10Z" />
  </svg>
);

const CheckSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="7" fill="#28DC4F" fillOpacity="0.12" />
    <path d="M4 7l2 2 4-4" stroke="#28DC4F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

/* ─── info card ──────────────────────────────────────────────── */

function InfoCard({ icon, title, children }) {
  return (
    <div className="rounded-[16px] border border-[#F0F0F0] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
          {icon}
        </div>
        <h3 className="text-[15px] font-semibold text-[#111827]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ─── no-order fallback ──────────────────────────────────────── */

function NoOrderFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-[#F9F9F9] px-4 text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "#F6F6F6" }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div>
          <h1 className="text-[24px] font-semibold text-[#111827]">No Order Found</h1>
          <p className="mt-2 text-[14px] text-[#6B7280]">
            We couldn&apos;t find your order details. Browse our products and try again.
          </p>
        </div>
        <Link
          href="/products"
          className="rounded-[10px] px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#28DC4F" }}
        >
          Continue Shopping
        </Link>
      </main>
      <Footer />
    </>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function PaymentFailedPage() {
  const [copiedOrder,  setCopiedOrder]  = useState(false);
  const [copiedTxn,    setCopiedTxn]    = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [loaded,       setLoaded]       = useState(false);

  useEffect(() => {
    // TODO: After Razorpay/Stripe integration, call orderService.updatePaymentStatus here
    //       with payment_status: "failed" and the gateway error/transaction reference.
    //       e.g. orderService.updatePaymentStatus(currentOrder.id, { payment_status: "failed", payment_id })
    try {
      const orderStr = localStorage.getItem("currentOrder");
      if (orderStr) setCurrentOrder(JSON.parse(orderStr));
      const itemStr  = localStorage.getItem("checkoutItem");
      if (itemStr)  setCheckoutItem(JSON.parse(itemStr));
    } catch {}
    setLoaded(true);
  }, []);

  const copy = (text, setter) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  if (!loaded) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#F9F9F9]" />
      </>
    );
  }

  if (!currentOrder) return <NoOrderFound />;

  // ── Derived values ────────────────────────────────────────────────────────
  const orderId       = currentOrder.order_number || `TML-${String(currentOrder.id).padStart(6, "0")}`;
  const transactionId = currentOrder.payment_id || null;
  const attemptedAt   = formatDateTime(currentOrder.created_at);
  const failureReason = currentOrder.failure_reason || "Payment was cancelled or declined by the bank.";
  const total         = Number(currentOrder.total_amount);

  const subtotal     = Number(checkoutItem?.rawSalePrice ?? checkoutItem?.rawPrice ?? 0);
  const shippingCost = checkoutItem ? (subtotal >= 999 ? 0 : 99) : 0;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F9F9F9]">
        <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-[120px]">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1">
            <Link href="/" className="text-[13px] text-[#9CA3AF] transition-colors hover:text-black">Home</Link>
            <ChevronRightIcon />
            <Link href="/products" className="text-[13px] text-[#9CA3AF] transition-colors hover:text-black">Products</Link>
            <ChevronRightIcon />
            <span className="text-[13px] font-medium text-[#1E1E1E]">Payment Failed</span>
          </nav>

          {/* ── Failed hero ── */}
          <div className="mb-10 flex flex-col items-center text-center">
            <XCircleIcon />

            <h1 className="mt-5 text-[28px] font-bold leading-tight text-[#111827] md:text-[32px]">
              Payment Failed
            </h1>

            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#6D6D6D]">
              We couldn&apos;t process your payment. Please try again or use another payment method.
              Your cart has been saved.
            </p>

            {/* IDs */}
            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
              {/* Order ID */}
              <div className="flex items-center gap-2 rounded-full border border-[#EBEBEB] bg-white px-4 py-[9px] shadow-sm">
                <span className="text-[12px] text-[#9CA3AF]">Order ID</span>
                <span className="text-[13px] font-semibold text-[#111827]">{orderId}</span>
                <button
                  onClick={() => copy(orderId, setCopiedOrder)}
                  className="ml-1 flex items-center gap-1 rounded-[6px] px-2 py-[3px] text-[11px] font-medium transition-colors"
                  style={{
                    background: copiedOrder ? "#28DC4F" : "#F5F5F5",
                    color:      copiedOrder ? "#fff"    : "#6D6D6D",
                  }}
                >
                  <CopyIcon />
                  {copiedOrder ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Transaction ID — only shown when a real gateway provides one */}
              {transactionId && (
                <div className="flex items-center gap-2 rounded-full border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-[9px]">
                  <span className="text-[12px] text-[#9CA3AF]">Txn ID</span>
                  <span className="text-[13px] font-semibold text-[#EF4444]">{transactionId}</span>
                  <button
                    onClick={() => copy(transactionId, setCopiedTxn)}
                    className="ml-1 flex items-center gap-1 rounded-[6px] px-2 py-[3px] text-[11px] font-medium transition-colors"
                    style={{
                      background: copiedTxn ? "#EF4444" : "#FEE2E2",
                      color:      copiedTxn ? "#fff"    : "#EF4444",
                    }}
                  >
                    <CopyIcon />
                    {copiedTxn ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>

            <p className="mt-3 text-[12px] text-[#9CA3AF]">Attempted on {attemptedAt}</p>
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

            {/* ── LEFT — Order Summary ── */}
            <div className="flex flex-1 flex-col gap-5">

              <div className="rounded-[20px] border border-[#F0F0F0] bg-white p-6 shadow-sm">

                {/* Failed banner */}
                <div className="mb-5 flex items-start gap-3 rounded-[10px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3">
                  <AlertIcon />
                  <div>
                    <p className="text-[13px] font-semibold text-[#EF4444]">Transaction Declined</p>
                    <p className="mt-[2px] text-[12px] leading-relaxed text-[#6D6D6D]">{failureReason}</p>
                  </div>
                </div>

                <h2 className="mb-5 text-[17px] font-semibold text-[#111827]">Order Summary</h2>

                {/* Order item */}
                <div className="flex items-center gap-4">
                  <div
                    className="flex shrink-0 items-center justify-center overflow-hidden rounded-[12px]"
                    style={{ width: "80px", height: "52px", background: "#F5F5F5" }}
                  >
                    {checkoutItem?.productImage ? (
                      <img
                        src={checkoutItem.productImage}
                        alt={checkoutItem.productName}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <ImagePlaceholderIcon />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-[3px]">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      {checkoutItem?.productName || "NFC Card"}
                    </p>
                    {checkoutItem?.customization?.selectedCard && (
                      <p className="text-[12px] text-[#9CA3AF]">
                        {checkoutItem.customization.selectedCard.charAt(0).toUpperCase() +
                         checkoutItem.customization.selectedCard.slice(1)}
                      </p>
                    )}
                  </div>

                  <p className="shrink-0 text-[15px] font-semibold text-[#111827]">
                    {formatINR(checkoutItem ? subtotal : total)}
                  </p>
                </div>

                <div className="my-5 h-px bg-[#F4F4F4]" />

                {/* Price breakdown */}
                {checkoutItem && (
                  <>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#6D6D6D]">Subtotal</span>
                        <span className="text-[14px] font-medium text-[#111827]">{formatINR(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#6D6D6D]">Shipping</span>
                        {shippingCost === 0 ? (
                          <span className="text-[14px] font-semibold text-[#28DC4F]">FREE</span>
                        ) : (
                          <span className="text-[14px] font-medium text-[#111827]">₹{shippingCost}</span>
                        )}
                      </div>
                    </div>
                    <div className="my-5 h-px bg-[#F4F4F4]" />
                  </>
                )}

                {/* Total — not charged */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[16px] font-semibold text-[#111827]">Amount</span>
                    <p className="text-[11px] text-[#9CA3AF]">Not charged</p>
                  </div>
                  <span className="text-[22px] font-bold text-[#EF4444] line-through opacity-60">
                    {formatINR(total)}
                  </span>
                </div>

                <div className="my-5 h-px bg-[#F4F4F4]" />

                {/* Payment status */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#9CA3AF]">Payment Status</span>
                  <span className="flex items-center gap-[6px] rounded-full bg-[#FEE2E2] px-3 py-[4px] text-[12px] font-semibold text-[#EF4444]">
                    <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
                    Failed
                  </span>
                </div>
              </div>

              {/* Retry Payment */}
              <Link
                href="/payment/redirect"
                className="flex w-full items-center justify-center gap-2 rounded-[12px] py-[15px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
                style={{ background: "#EF4444" }}
              >
                <RetryIcon />
                Retry Payment
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#EBEBEB] bg-white py-[13px] text-[15px] font-semibold text-[#111827] transition-colors hover:border-[#111827]"
              >
                <ShoppingBagIcon />
                Continue Shopping
              </Link>
            </div>

            {/* ── RIGHT — Info cards ── */}
            <div className="flex w-full flex-col gap-5 lg:w-[360px] lg:shrink-0">

              {/* 1. Payment Status */}
              <InfoCard icon={<AlertIcon />} title="Payment Status">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#6D6D6D]">Status</span>
                    <span className="flex items-center gap-[6px] rounded-full bg-[#FEE2E2] px-3 py-[4px] text-[12px] font-semibold text-[#EF4444]">
                      <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#EF4444]" />
                      Failed
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="shrink-0 text-[13px] text-[#6D6D6D]">Reason</span>
                    <span className="text-right text-[13px] font-medium text-[#111827]">{failureReason}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#6D6D6D]">Time</span>
                    <span className="text-[13px] font-medium text-[#111827]">{attemptedAt}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#6D6D6D]">Amount</span>
                    <span className="text-[13px] font-semibold text-[#EF4444]">
                      {formatINR(total)} — Not Charged
                    </span>
                  </div>

                  <div className="mt-1 rounded-[8px] bg-[#FFF5F5] px-3 py-2">
                    <p className="text-[12px] leading-relaxed text-[#EF4444]">
                      If any amount was debited from your account, it will be refunded within{" "}
                      <strong>5–7 business days</strong> as per your payment provider&apos;s policy.
                    </p>
                  </div>
                </div>
              </InfoCard>

              {/* 2. What can you do next? */}
              <InfoCard icon={<LightbulbIcon />} title="What can you do next?">
                <ul className="flex flex-col gap-3">
                  {[
                    "Check your bank balance or card limit before retrying.",
                    "Try a different payment method — UPI, card, or net banking.",
                    "Ensure your internet connection is stable while paying.",
                    "Contact your bank if the payment keeps failing.",
                    "Reach out to us if the amount was debited but order wasn't placed.",
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className="mt-[1px] shrink-0"><CheckSmallIcon /></span>
                      <span className="text-[13px] leading-relaxed text-[#4B5563]">{tip}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/payment/redirect"
                  className="mt-4 flex w-full items-center justify-center gap-1 rounded-[8px] bg-[#EF4444] py-[10px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <RetryIcon />
                  Try Again
                </Link>
              </InfoCard>

              {/* 3. Need Help? */}
              <InfoCard icon={<HeadsetIcon />} title="Need Help?">
                <p className="mb-3 text-[13px] leading-relaxed text-[#6D6D6D]">
                  Our support team is available <strong className="text-[#111827]">9 AM – 7 PM</strong>, Mon – Sat.
                  {transactionId && " Mention your Transaction ID when contacting us."}
                </p>

                <div className="mb-3 flex flex-col gap-2">
                  <a
                    href="mailto:support@tapmelabs.com"
                    className="flex items-center gap-2 text-[13px] font-medium text-[#111827] transition-colors hover:text-[#28DC4F]"
                  >
                    <span className="text-[#28DC4F]"><MailIcon /></span>
                    support@tapmelabs.com
                  </a>
                  <a
                    href="tel:+918001234567"
                    className="flex items-center gap-2 text-[13px] font-medium text-[#111827] transition-colors hover:text-[#28DC4F]"
                  >
                    <span className="text-[#28DC4F]"><PhoneIcon /></span>
                    +91 800 123 4567
                  </a>
                </div>

                <div className="rounded-[8px] border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-[10px]">
                  <p className="text-[12px] leading-relaxed text-[#6D6D6D]">
                    💳 If money was debited from your account, refund will be processed automatically within{" "}
                    <span className="font-semibold text-[#111827]">5–7 business days</span> as per payment provider policy.
                  </p>
                </div>

                {/* TODO: Link to a real support ticket system when available. */}
                <Link
                  href="#"
                  className="mt-4 flex w-full items-center justify-center gap-1 rounded-[8px] border border-[#EBEBEB] py-[9px] text-[13px] font-medium text-[#6D6D6D] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F]"
                >
                  Open Support Ticket
                  <ChevronRightIcon />
                </Link>
              </InfoCard>
            </div>
          </div>

          {/* ── Bottom note ── */}
          <div className="mt-10 flex flex-col items-center gap-3">
            {transactionId && (
              <p className="text-[13px] text-[#9CA3AF]">
                Transaction ID:{" "}
                <span className="font-medium text-[#EF4444]">{transactionId}</span>
                {" "}— keep this for reference.
              </p>
            )}
            <p className="text-[12px] text-[#9CA3AF]">
              Questions? Email us at{" "}
              <a href="mailto:support@tapmelabs.com" className="underline underline-offset-2 hover:text-[#28DC4F]">
                support@tapmelabs.com
              </a>
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
