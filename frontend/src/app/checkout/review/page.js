"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import authService from "@/services/authService";
import orderService from "@/services/orderService";

/* ─── icons ──────────────────────────────────────────────────── */

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M5 3l4 4-4 4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LocationPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 1.667A5.833 5.833 0 0 0 4.167 7.5c0 4.375 5.833 10.833 5.833 10.833S15.833 11.875 15.833 7.5A5.833 5.833 0 0 0 10 1.667Z" fill="#28DC4F" />
    <circle cx="10" cy="7.5" r="2.083" fill="white" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1.333 2 3.333v4.334C2 11 4.667 13.8 8 14.667 11.333 13.8 14 11 14 7.667V3.333L8 1.333Z" fill="#28DC4F" />
    <path d="M5.5 8l1.75 1.75L10.5 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── step indicator ─────────────────────────────────────────── */

const STEPS = [
  { label: "Cart",     done: true  },
  { label: "Shipping", done: true  },
  { label: "Review",   done: false, active: true },
  { label: "Payment",  done: false },
];

function CheckoutSteps() {
  return (
    <div className="mb-6 flex items-center gap-0">
      {STEPS.map((s, i) => (
        <div key={s.label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold sm:h-8 sm:w-8 sm:text-[13px]"
              style={{
                background: s.done ? "#28DC4F" : s.active ? "#18181B" : "#E5E7EB",
                color: s.done || s.active ? "#fff" : "#9CA3AF",
              }}
            >
              {s.done ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : i + 1}
            </div>
            <span
              className="hidden text-[11px] font-medium sm:block"
              style={{ color: s.done ? "#28DC4F" : s.active ? "#18181B" : "#9CA3AF" }}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="mx-1 h-[2px] w-7 rounded-full sm:mx-2 sm:w-16 md:w-24"
              style={{ background: s.done ? "#28DC4F" : "#E5E7EB" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── helpers ────────────────────────────────────────────────── */

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

/* ─── page ───────────────────────────────────────────────────── */

export default function CheckoutReviewPage() {
  const router = useRouter();

  const [checkoutItem, setCheckoutItem] = useState(null);
  const [address,      setAddress]      = useState(null);
  const [submitting,   setSubmitting]   = useState(false);
  const [apiError,     setApiError]     = useState("");
  const [hydrated,     setHydrated]     = useState(false);
  const [addPro,       setAddPro]       = useState(false);

  const PRO_PRICE = 999;

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      router.replace("/login?redirect=/checkout/review");
      return;
    }

    try {
      const item = JSON.parse(localStorage.getItem("checkoutItem") || "null");
      setCheckoutItem(item);
    } catch { setCheckoutItem(null); }

    try {
      const addr = JSON.parse(localStorage.getItem("checkoutAddress") || "null");
      setAddress(addr);
    } catch { setAddress(null); }

    setHydrated(true);
  }, [router]);

  const subtotal = Number(checkoutItem?.rawSalePrice ?? checkoutItem?.rawPrice ?? 0);
  const shipping = 0;
  const total    = subtotal + shipping + (addPro ? PRO_PRICE : 0);

  // No item or address → redirect back to fix
  const missingItem    = hydrated && !checkoutItem;
  const missingAddress = hydrated && !address;

  async function handlePlaceOrder() {
    if (!checkoutItem || !address) return;
    setApiError("");
    setSubmitting(true);

    try {
      const shipping_address = {
        full_name: `${address.firstName.trim()} ${address.lastName.trim()}`,
        email:     address.email.trim(),
        phone:     address.phone.trim(),
        street:    address.street.trim(),
        landmark:  address.landmark?.trim() || "",
        city:      address.city.trim(),
        state:     address.state.trim(),
        pincode:   address.pincode.trim(),
      };

      const card_customization = checkoutItem.design_method === "upload_own_design"
        ? {
            design_method:          "upload_own_design",
            uploaded_front_design:  checkoutItem.uploaded_front_design ?? null,
            uploaded_back_design:   checkoutItem.uploaded_back_design  ?? null,
          }
        : checkoutItem.customization
          ? { design_method: "customize_online", ...checkoutItem.customization }
          : null;

      const result = await orderService.createOrder({
        product_id:   checkoutItem.productId,
        total_amount: total,
        shipping_address,
        card_customization,
        pro_plan:     addPro,
      });

      localStorage.setItem("currentOrder", JSON.stringify(result.data?.order ?? result));
      router.push("/payment/redirect");
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
        "Failed to place order. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return null;

  if (missingItem) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-[#F9F9F9] px-4 text-center">
          <p className="text-[16px] font-semibold text-[#111827]">No product selected.</p>
          <Link href="/products" className="rounded-[10px] px-6 py-3 text-[14px] font-semibold text-white" style={{ background: "#28DC4F" }}>
            Browse Products
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (missingAddress) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-[#F9F9F9] px-4 text-center">
          <p className="text-[16px] font-semibold text-[#111827]">No shipping address found.</p>
          <Link href="/checkout/shipping" className="rounded-[10px] px-6 py-3 text-[14px] font-semibold text-white" style={{ background: "#28DC4F" }}>
            Enter Shipping Address
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F9F9F9]">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-5 hidden items-center gap-1 sm:flex">
            <Link href="/" className="text-[13px] text-[#9CA3AF] hover:text-black">Home</Link>
            <ChevronRightIcon />
            <Link href="/products" className="text-[13px] text-[#9CA3AF] hover:text-black">Products</Link>
            <ChevronRightIcon />
            <Link href="/checkout/shipping" className="text-[13px] text-[#9CA3AF] hover:text-black">Shipping</Link>
            <ChevronRightIcon />
            <span className="text-[13px] font-medium text-[#1E1E1E]">Review</span>
          </nav>

          <CheckoutSteps />

          {apiError && (
            <div
              className="mb-6 rounded-[10px] px-4 py-3 text-[13px]"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
            >
              {apiError}
            </div>
          )}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

            {/* ── LEFT: Items + Address ── */}
            <div className="flex flex-1 flex-col gap-5">

              {/* Items */}
              <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <h2 className="mb-5 text-[16px] font-bold text-[#111827]">Your Items</h2>
                {checkoutItem && (
                  <div className="flex items-center gap-4">
                    <div
                      className="flex shrink-0 items-center justify-center overflow-hidden rounded-[12px]"
                      style={{ width: "80px", height: "52px", background: "#F5F5F5" }}
                    >
                      {checkoutItem.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={checkoutItem.productImage} alt={checkoutItem.productName} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-[3px]">
                      <p className="text-[14px] font-semibold text-[#111827]">{checkoutItem.productName}</p>
                      {checkoutItem.customization?.selectedCard && (
                        <p className="text-[12px] text-[#9CA3AF]">
                          {checkoutItem.customization.selectedCard.charAt(0).toUpperCase() + checkoutItem.customization.selectedCard.slice(1)}
                          {checkoutItem.customization.name ? ` · ${checkoutItem.customization.name}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-[2px]">
                      <p className="text-[15px] font-semibold text-[#111827]">{formatINR(subtotal)}</p>
                      {checkoutItem.rawSalePrice && (
                        <p className="text-[12px] text-[#9CA3AF] line-through">{formatINR(checkoutItem.rawPrice)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Pro Plan Add-on ── */}
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: addPro ? "2px solid #28DC4F" : "2px solid #E5E7EB" }}>
                {/* Header banner */}
                <div style={{ background: addPro ? "#28DC4F" : "#18181B", padding: "14px 20px" }}
                  className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>⚡</span>
                    <p className="text-[13px] font-bold text-white">Upgrade to Pro</p>
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: addPro ? "rgba(0,0,0,0.15)" : "#28DC4F", color: addPro ? "#000" : "#000" }}>
                      OPTIONAL
                    </span>
                  </div>
                  <p className="text-[15px] font-black text-white">₹999<span className="text-[11px] font-normal opacity-80">/year</span></p>
                </div>

                {/* Body */}
                <div className="bg-white p-5">
                  <p className="mb-4 text-[13px] font-semibold text-[#111827]">
                    Turn your NFC card into a lead machine
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { icon: "🔥", title: "AI Lead Scoring", desc: "Hot / Warm / Cold priority" },
                      { icon: "📧", title: "Email Follow-up", desc: "One-click AI reply" },
                      { icon: "💬", title: "WhatsApp",        desc: "Pre-filled message" },
                      { icon: "📊", title: "Weekly Report",   desc: "AI insights & trends" },
                      { icon: "🎯", title: "Intent Detection", desc: "Know their purpose" },
                      { icon: "🔔", title: "Lead Alerts",     desc: "Email notifications" },
                    ].map(f => (
                      <div key={f.title} className="flex items-start gap-2 rounded-xl p-2.5"
                        style={{ background: addPro ? "#F0FFF4" : "#F9FAFB" }}>
                        <span style={{ fontSize: 15, lineHeight: 1 }}>{f.icon}</span>
                        <div>
                          <p className="text-[11px] font-semibold text-[#111827]">{f.title}</p>
                          <p className="text-[10px] text-[#9CA3AF]">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Toggle button */}
                  <button
                    type="button"
                    onClick={() => setAddPro(v => !v)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all"
                    style={{
                      background: addPro ? "#28DC4F" : "#F3F4F6",
                      border: `1.5px solid ${addPro ? "#28DC4F" : "#E5E7EB"}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded"
                        style={{ background: addPro ? "rgba(0,0,0,0.15)" : "#fff", border: addPro ? "none" : "2px solid #D1D5DB" }}>
                        {addPro && (
                          <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7L5.5 10L11.5 4" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] font-semibold" style={{ color: addPro ? "#000" : "#374151" }}>
                        {addPro ? "Pro Plan added ✓" : "Add Pro Plan to my order"}
                      </span>
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: addPro ? "#000" : "#28DC4F" }}>
                      {addPro ? "−₹999/yr" : "+₹999/yr"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              {address && (
                <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LocationPinIcon />
                      <h2 className="text-[16px] font-bold text-[#111827]">Delivery Address</h2>
                    </div>
                    <Link href="/checkout/shipping" className="text-[13px] font-medium text-[#28DC4F] hover:opacity-75">
                      Edit
                    </Link>
                  </div>
                  <div className="flex flex-col gap-[3px]">
                    <p className="text-[14px] font-semibold text-[#111827]">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-[13px] text-[#6D6D6D]">{address.street}</p>
                    {address.landmark && <p className="text-[13px] text-[#6D6D6D]">{address.landmark}</p>}
                    <p className="text-[13px] text-[#6D6D6D]">
                      {[address.city, address.state].filter(Boolean).join(", ")}
                      {address.pincode ? ` – ${address.pincode}` : ""}
                    </p>
                    <p className="mt-1 text-[13px] text-[#6D6D6D]">{address.phone}</p>
                    <p className="text-[13px] text-[#6D6D6D]">{address.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Price Summary + CTA ── */}
            <div className="w-full lg:w-[380px] lg:shrink-0 flex flex-col gap-4">

              <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <h2 className="mb-5 text-[16px] font-bold text-[#111827]">Price Details</h2>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#6D6D6D]">Subtotal</span>
                    <span className="text-[14px] font-medium text-[#111827]">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#6D6D6D]">Shipping</span>
                    {shipping === 0
                      ? <span className="text-[14px] font-semibold text-[#28DC4F]">FREE</span>
                      : <span className="text-[14px] font-medium text-[#111827]">₹{shipping}</span>}
                  </div>
                  {addPro && (
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#6D6D6D]">Pro Plan (1 year)</span>
                      <span className="text-[14px] font-medium text-[#28DC4F]">+{formatINR(PRO_PRICE)}</span>
                    </div>
                  )}
                </div>

                <div className="my-5 h-px bg-[#F4F4F4]" />

                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-semibold text-[#111827]">Total</span>
                  <span className="text-[22px] font-bold text-[#111827]">{formatINR(total)}</span>
                </div>

                <div className="my-5 h-px bg-[#F4F4F4]" />

                {/* Place order button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "#28DC4F" }}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin" style={{ animationDuration: "0.75s" }} width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                        <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 29" />
                      </svg>
                      Placing Order…
                    </>
                  ) : (
                    <> Place Order &amp; Pay <ArrowRightIcon /> </>
                  )}
                </button>

                <Link
                  href="/checkout/shipping"
                  className="mt-3 flex items-center justify-center gap-1 text-[14px] font-medium text-[#6D6D6D] transition-colors hover:text-black"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M10 3L5 8l5 5" />
                  </svg>
                  Back to Shipping
                </Link>

                <div className="mt-5 flex flex-col gap-[10px]">
                  <div className="flex items-center gap-2">
                    <ShieldIcon />
                    <span className="text-[12px] text-[#6D6D6D]">
                      Secure <span className="font-medium text-[#111827]">256-bit SSL</span> encrypted payment
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment method chips */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {["UPI", "Visa", "Mastercard", "Rupay", "Net Banking"].map((method) => (
                  <span
                    key={method}
                    className="rounded-[6px] border border-[#EBEBEB] bg-white px-3 py-[5px] text-[11px] font-medium text-[#6D6D6D]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
