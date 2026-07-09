"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import orderService from "@/services/orderService";

/* ─── helpers ─────────────────────────────────────────────────── */

function formatDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function addDays(dateStr, n) {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

/* ─── icons ──────────────────────────────────────────────────── */

const CheckCircleIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
    <circle cx="40" cy="40" r="40" fill="#28DC4F" fillOpacity="0.12" />
    <circle cx="40" cy="40" r="30" fill="#28DC4F" />
    <path d="M26 41l9 9 19-19" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="5" width="8" height="8" rx="1.5" />
    <path d="M10 5V3.5A1.5 1.5 0 0 0 8.5 2h-5A1.5 1.5 0 0 0 2 3.5v5A1.5 1.5 0 0 0 3.5 10H5" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 2v9M5.5 7.5 9 11l3.5-3.5" />
    <path d="M2 13.5v1A1.5 1.5 0 0 0 3.5 16h11a1.5 1.5 0 0 0 1.5-1.5v-1" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3.5" width="16" height="14.5" rx="2.5" />
    <path d="M2 8h16M6.5 2v3M13.5 2v3" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 1.667A5.833 5.833 0 0 0 4.167 7.5c0 4.375 5.833 10.833 5.833 10.833S15.833 11.875 15.833 7.5A5.833 5.833 0 0 0 10 1.667Z" fill="#28DC4F" />
    <circle cx="10" cy="7.5" r="2.083" fill="white" />
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

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M5 3l4 4-4 4" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 2h12l1.5 13H1.5L3 2Z" />
    <path d="M6.5 5.5a2.5 2.5 0 0 1 5 0" />
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
    <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#28DC4F]/10">
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
            We couldn&apos;t find your order details. Browse our products and complete a purchase.
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

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [copied,        setCopied]        = useState(false);
  const [currentOrder,  setCurrentOrder]  = useState(null);
  const [checkoutItem,  setCheckoutItem]  = useState(null);
  const [loaded,        setLoaded]        = useState(false);
  const [countdown,     setCountdown]     = useState(5);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [invoiceError,       setInvoiceError]       = useState("");
  const [reviewTagUrl,  setReviewTagUrl]  = useState(null);
  const [qrLoading,     setQrLoading]     = useState(false);
  const [downloadingQr, setDownloadingQr]  = useState(false);
  const [qrError,       setQrError]       = useState("");

  useEffect(() => {
    // TODO: After Razorpay/Stripe integration, call orderService.updatePaymentStatus here
    //       with the payment_id returned by the gateway before rendering this page.
    //       e.g. orderService.updatePaymentStatus(currentOrder.id, { payment_status: "paid", payment_id })
    try {
      const orderStr = localStorage.getItem("currentOrder");
      if (orderStr) setCurrentOrder(JSON.parse(orderStr));
      const itemStr  = localStorage.getItem("checkoutItem");
      if (itemStr)  setCheckoutItem(JSON.parse(itemStr));
    } catch {}

    // A new order just succeeded — the header may have cached stale
    // pre-purchase state (e.g. "Complete Profile") from earlier in this
    // session. Clear it and tell the header to re-check now.
    try {
      sessionStorage.removeItem("tapme:hasPaidOrder");
      sessionStorage.removeItem("tapme:hasOtherPaidOrder");
      sessionStorage.removeItem("tapme:hasProfile");
      window.dispatchEvent(new Event("tapme:authchange"));
    } catch {}

    setLoaded(true);
  }, []);

  const isNfcCard = (checkoutItem?.productType ?? "nfc_card") === "nfc_card";

  useEffect(() => {
    // Review-standee/card products get a QR code that points to their public
    // review-tap page. The ReviewTag row is created server-side in the same
    // request that marks the order paid, so it should already exist here —
    // retry a couple of times in case of a brief lag.
    if (!loaded || !currentOrder || isNfcCard) return;
    let cancelled = false;
    let attempts = 0;

    async function fetchReviewTag() {
      setQrLoading(true);
      try {
        const res = await orderService.getOrderById(currentOrder.id);
        const code = res?.data?.order?.review_tag?.code;
        if (cancelled) return;
        if (code) {
          setReviewTagUrl(`${window.location.origin}/rv/${code}`);
          setQrLoading(false);
          return;
        }
        attempts += 1;
        if (attempts < 4) {
          setTimeout(fetchReviewTag, 1500);
        } else {
          setQrLoading(false);
        }
      } catch {
        if (!cancelled) setQrLoading(false);
      }
    }

    fetchReviewTag();
    return () => { cancelled = true; };
  }, [loaded, currentOrder, isNfcCard]);

  useEffect(() => {
    // Review-standee/card products need no profile setup — logo + links were
    // already captured on the product page, so there's nothing to redirect to.
    if (!loaded || !currentOrder || !isNfcCard) return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [loaded, currentOrder, isNfcCard]);

  useEffect(() => {
    if (isNfcCard && countdown === 0 && currentOrder) {
      router.push("/dashboard/profile/setup");
    }
  }, [countdown, currentOrder, router, isNfcCard]);

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
  const orderId = currentOrder.order_number || `TML-${String(currentOrder.id).padStart(6, "0")}`;
  const dateStr         = formatDate(currentOrder.created_at);
  const deliveryFromStr = addDays(currentOrder.created_at, 4);
  const deliveryToStr   = addDays(currentOrder.created_at, 6);

  const subtotal     = Number(checkoutItem?.rawSalePrice ?? checkoutItem?.rawPrice ?? 0);
  const shippingCost = checkoutItem ? (subtotal >= 799 ? 0 : 99) : 0;
  const total        = Number(currentOrder.total_amount);

  const addr = currentOrder.shipping_address || {};

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  async function handleDownloadInvoice() {
    setInvoiceError("");
    setDownloadingInvoice(true);
    try {
      const res = await orderService.getInvoice(currentOrder.id);
      const blobUrl = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // responseType "blob" means an error JSON body also arrives as a Blob —
      // read it back as text to surface the real backend message.
      let message = "Failed to download invoice. Please try again.";
      try {
        const text = await err.response?.data?.text?.();
        if (text) message = JSON.parse(text).message || message;
      } catch {}
      setInvoiceError(message);
    } finally {
      setDownloadingInvoice(false);
    }
  }

  async function handleDownloadQr() {
    if (!reviewTagUrl) return;
    setQrError("");
    setDownloadingQr(true);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(reviewTagUrl)}&bgcolor=ffffff&color=111827&margin=10`;
    try {
      const res = await fetch(qrApiUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `tapme-qr-${orderId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      setQrError("Failed to download QR code. Please try again.");
    } finally {
      setDownloadingQr(false);
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F9F9F9]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 hidden items-center gap-1 sm:flex">
            <Link href="/" className="text-[13px] text-[#9CA3AF] transition-colors hover:text-black">Home</Link>
            <ChevronRightIcon />
            <Link href="/products" className="text-[13px] text-[#9CA3AF] transition-colors hover:text-black">Products</Link>
            <ChevronRightIcon />
            <span className="text-[13px] font-medium text-[#1E1E1E]">Order Confirmed</span>
          </nav>

          {/* ── Success hero ── */}
          <div className="mb-8 flex flex-col items-center text-center">
            <CheckCircleIcon />

            <h1 className="mt-5 text-[22px] font-bold leading-tight text-[#111827] sm:text-[28px]">
              Thank you for your order!
            </h1>

            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#6D6D6D]">
              Your payment was successful. We&apos;ve received your order and will start processing it right away.
              A confirmation has been sent to your email.
            </p>

            {/* Order ID chip */}
            <div className="mt-5 flex items-center gap-2 rounded-full border border-[#EBEBEB] bg-white px-5 py-[10px] shadow-sm">
              <span className="text-[13px] text-[#9CA3AF]">Order ID</span>
              <span className="text-[14px] font-semibold text-[#111827]">{orderId}</span>
              <button
                onClick={copyOrderId}
                title="Copy order ID"
                className="ml-1 flex items-center gap-1 rounded-[6px] px-2 py-[3px] text-[12px] font-medium transition-colors"
                style={{
                  background: copied ? "#28DC4F" : "#F5F5F5",
                  color:      copied ? "#fff"    : "#6D6D6D",
                }}
              >
                <CopyIcon />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="mt-3 text-[12px] text-[#9CA3AF]">Placed on {dateStr}</p>

            {/* ── Profile CTA (NFC cards only — review-standee/card products need no setup) ── */}
            {isNfcCard ? (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Link
                  href="/dashboard/profile/setup"
                  className="flex items-center justify-center gap-2 rounded-xl px-6 py-[13px] text-[15px] font-semibold text-black transition-opacity hover:opacity-90 active:opacity-80"
                  style={{ background: "#28DC4F" }}
                >
                  Complete Your Profile
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <p className="text-[13px] text-[#9CA3AF]">
                  Redirecting to profile setup in{" "}
                  <span className="font-semibold text-[#111827]">{countdown}</span>{" "}
                  {countdown === 1 ? "second" : "seconds"}...
                </p>
              </div>
            ) : (
              <p className="mt-6 max-w-sm text-[13px] text-[#9CA3AF]">
                No setup needed — it&apos;ll be ready to use as soon as it arrives.
              </p>
            )}
          </div>

          {/* ── Two-column layout ── */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

            {/* ── LEFT — Order Summary ── */}
            <div className="flex flex-1 flex-col gap-5">

              {/* Order Summary card */}
              <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <h2 className="mb-5 text-[16px] font-bold text-[#111827]">Order Summary</h2>

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
                        <span className="text-[14px] font-medium text-[#111827]">
                          {formatINR(subtotal)}
                        </span>
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

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-semibold text-[#111827]">Total Paid</span>
                  <span className="text-[22px] font-bold text-[#111827]">
                    {formatINR(total)}
                  </span>
                </div>

                <div className="my-5 h-px bg-[#F4F4F4]" />

                {/* Payment status */}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#9CA3AF]">Payment Status</span>
                  <span className="flex items-center gap-[6px] rounded-full bg-[#28DC4F]/10 px-3 py-[4px] text-[12px] font-semibold text-[#28DC4F]">
                    <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#28DC4F]" />
                    Paid
                  </span>
                </div>
              </div>

              {/* Download Invoice */}
              <button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-[14px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "#28DC4F" }}
              >
                <DownloadIcon />
                {downloadingInvoice ? "Preparing Invoice…" : "Download Invoice"}
              </button>
              {invoiceError && (
                <p className="text-center text-[12px] text-[#EF4444]">{invoiceError}</p>
              )}

              {/* Download QR Code (review-standee/card products only) */}
              {!isNfcCard && (
                <>
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    disabled={downloadingQr || qrLoading || !reviewTagUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EBEBEB] bg-white py-[13px] text-[15px] font-semibold text-[#111827] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <DownloadIcon />
                    {downloadingQr ? "Preparing QR Code…" : qrLoading ? "Preparing QR Code…" : "Download QR Code"}
                  </button>
                  {qrError && (
                    <p className="text-center text-[12px] text-[#EF4444]">{qrError}</p>
                  )}
                </>
              )}

              {/* View Order */}
              <Link
                href="/dashboard/orders"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EBEBEB] bg-white py-[13px] text-[15px] font-semibold text-[#111827] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F]"
              >
                View Order Details
                <ChevronRightIcon />
              </Link>
            </div>

            {/* ── RIGHT — Info cards ── */}
            <div className="flex w-full flex-col gap-5 lg:w-[360px] lg:shrink-0">

              {/* 1. Estimated Delivery */}
              <InfoCard icon={<CalendarIcon />} title="Estimated Delivery">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">{deliveryFromStr}</p>
                    <p className="text-[12px] text-[#9CA3AF]">to {deliveryToStr}</p>
                  </div>
                  <span className="rounded-full bg-[#28DC4F]/10 px-3 py-[5px] text-[12px] font-semibold text-[#28DC4F]">
                    Confirmed
                  </span>
                </div>

                {/* Progress tracker */}
                <div className="mt-4 flex items-center gap-0">
                  {[
                    { label: "Ordered",    done: true  },
                    { label: "Processing", done: false, active: true },
                    { label: "Shipped",    done: false },
                    { label: "Delivered",  done: false },
                  ].map((s, i, arr) => (
                    <div key={s.label} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        {i > 0 && (
                          <div className="h-[2px] flex-1" style={{ background: s.done ? "#28DC4F" : "#E5E7EB" }} />
                        )}
                        <div
                          className="h-[10px] w-[10px] shrink-0 rounded-full border-2"
                          style={{
                            background:  s.done ? "#28DC4F" : s.active ? "#fff" : "#E5E7EB",
                            borderColor: s.done || s.active ? "#28DC4F" : "#E5E7EB",
                          }}
                        />
                        {i < arr.length - 1 && (
                          <div className="h-[2px] flex-1" style={{ background: s.done ? "#28DC4F" : "#E5E7EB" }} />
                        )}
                      </div>
                      <span
                        className="mt-1 text-center text-[10px] font-medium"
                        style={{ color: s.done ? "#28DC4F" : s.active ? "#111827" : "#9CA3AF" }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </InfoCard>

              {/* 2. Delivery Address */}
              <InfoCard icon={<LocationIcon />} title="Delivery Address">
                <div className="flex flex-col gap-[3px]">
                  <p className="text-[14px] font-semibold text-[#111827]">{addr.full_name || "—"}</p>
                  <p className="text-[13px] text-[#6D6D6D]">{addr.street || "—"}</p>
                  {addr.landmark && (
                    <p className="text-[13px] text-[#6D6D6D]">{addr.landmark}</p>
                  )}
                  {(addr.city || addr.state || addr.pincode) && (
                    <p className="text-[13px] text-[#6D6D6D]">
                      {[addr.city, addr.state].filter(Boolean).join(", ")}
                      {addr.pincode ? ` – ${addr.pincode}` : ""}
                    </p>
                  )}
                  {addr.phone && (
                    <p className="mt-1 text-[13px] text-[#6D6D6D]">{addr.phone}</p>
                  )}
                </div>
              </InfoCard>

              {/* 3. Need Help? */}
              <InfoCard icon={<HeadsetIcon />} title="Need Help?">
                <p className="mb-3 text-[13px] leading-relaxed text-[#6D6D6D]">
                  Our support team is available 9 AM – 7 PM, Mon – Sat. We&apos;re happy to help with any questions about your order.
                </p>

                <div className="flex flex-col gap-2">
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

          {/* ── Continue Shopping — bottom CTA ── */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-xl bg-[#111827] px-8 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              <ShoppingBagIcon />
              Continue Shopping
            </Link>
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
