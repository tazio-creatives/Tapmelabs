"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import authService from "@/services/authService";

/* ─── icons ──────────────────────────────────────────────────── */

const LocationPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 1.667A5.833 5.833 0 0 0 4.167 7.5c0 4.375 5.833 10.833 5.833 10.833S15.833 11.875 15.833 7.5A5.833 5.833 0 0 0 10 1.667Z" fill="#28DC4F" />
    <circle cx="10" cy="7.5" r="2.083" fill="white" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M5 3l4 4-4 4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1.333 2 3.333v4.334C2 11 4.667 13.8 8 14.667 11.333 13.8 14 11 14 7.667V3.333L8 1.333Z" fill="#28DC4F" />
    <path d="M5.5 8l1.75 1.75L10.5 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1.333 4h8v7.333H1.333V4Z" fill="#28DC4F" />
    <path d="M9.333 6h2.334L13.333 8.5v2.833h-4V6Z" fill="#28DC4F" />
    <circle cx="3.667" cy="11.667" r="1" fill="white" />
    <circle cx="11.667" cy="11.667" r="1" fill="white" />
  </svg>
);

const FlashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M9.333 1.333 3.333 9.333h5.334L6.667 14.667 12.667 6.667H7.333L9.333 1.333Z" fill="#28DC4F" />
  </svg>
);

/* ─── step indicator ─────────────────────────────────────────── */

const STEPS = [
  { label: "Cart",     done: true  },
  { label: "Shipping", done: false, active: true  },
  { label: "Review",   done: false },
  { label: "Payment",  done: false },
];

function CheckoutSteps() {
  return (
    <div className="mb-8 flex items-center gap-0">
      {STEPS.map((s, i) => (
        <div key={s.label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold"
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
              className="mx-2 h-[2px] w-12 rounded-full sm:w-20 md:w-24"
              style={{ background: s.done ? "#28DC4F" : "#E5E7EB" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── field component ────────────────────────────────────────── */

function Field({ label, id, optional, error, ...inputProps }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="flex items-center gap-1 text-[14px] font-medium text-[#1E1E1E]">
        {label}
        {optional && <span className="text-[12px] font-normal text-[#9CA3AF]">(Optional)</span>}
      </label>
      <input
        id={id}
        className="w-full rounded-[10px] border bg-[#FAFAFA] px-4 py-[13px] text-[14px] text-[#1E1E1E] outline-none transition-all placeholder:text-[#AEAEAE] focus:bg-white focus:ring-1"
        style={{
          borderColor: error ? "#EF4444" : "#EBEBEB",
          "--tw-ring-color": error ? "rgba(239,68,68,0.2)" : "rgba(40,220,79,0.2)",
        }}
        {...inputProps}
      />
      {error && <p className="text-[12px] font-medium text-red-500">{error}</p>}
    </div>
  );
}

/* ─── helpers ────────────────────────────────────────────────── */

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

const REQUIRED_FIELDS = ["firstName", "lastName", "email", "phone", "street", "city", "state", "pincode"];

const FIELD_LABELS = {
  firstName: "First Name",
  lastName:  "Last Name",
  email:     "Email Address",
  phone:     "Phone Number",
  street:    "Street Address",
  city:      "City",
  state:     "State",
  pincode:   "Pincode",
};

/* ─── page ───────────────────────────────────────────────────── */

export default function CheckoutShippingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    phone:     "",
    street:    "",
    landmark:  "",
    city:      "",
    state:     "",
    pincode:   "",
  });

  const [checkoutItem, setCheckoutItem] = useState(null);
  const [errors,       setErrors]       = useState({});
  const [apiError,     setApiError]     = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [hydrated,     setHydrated]     = useState(false);

  useEffect(() => {
    // Auth guard
    if (!authService.isLoggedIn()) {
      router.replace("/login?redirect=/checkout/shipping");
      return;
    }

    // Pre-fill from stored user
    try {
      const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
      const fullName = stored.full_name || stored.name || "";
      const parts = fullName.trim().split(" ");
      setForm((prev) => ({
        ...prev,
        firstName: parts[0] || "",
        lastName:  parts.slice(1).join(" "),
        email:     stored.email || "",
        phone:     stored.phone || "",
      }));
    } catch {}

    // Load saved address if user came back
    try {
      const saved = JSON.parse(localStorage.getItem("checkoutAddress") || "null");
      if (saved) setForm(saved);
    } catch {}

    // Load checkout item
    try {
      const stored = JSON.parse(localStorage.getItem("checkoutItem") || "null");
      setCheckoutItem(stored);
    } catch {
      setCheckoutItem(null);
    }

    setHydrated(true);
  }, [router]);

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const subtotal = Number(checkoutItem?.rawSalePrice ?? checkoutItem?.rawPrice ?? 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total    = subtotal + shipping;

  function validate() {
    const newErrors = {};
    for (const key of REQUIRED_FIELDS) {
      if (!form[key].trim()) newErrors[key] = `${FIELD_LABELS[key]} is required`;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!checkoutItem) {
      setApiError("No product selected. Please choose a product before continuing.");
      return;
    }

    setSubmitting(true);
    try {
      // Save address to localStorage for the review page (no API call here)
      localStorage.setItem("checkoutAddress", JSON.stringify(form));
      router.push("/checkout/review");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return null;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F9F9F9]">
        <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[120px]">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1">
            <Link href="/" className="text-[13px] font-normal text-[#9CA3AF] transition-colors hover:text-black">Home</Link>
            <ChevronRightIcon />
            <Link href="/products" className="text-[13px] font-normal text-[#9CA3AF] transition-colors hover:text-black">Products</Link>
            <ChevronRightIcon />
            <span className="text-[13px] font-medium text-[#1E1E1E]">Shipping</span>
          </nav>

          <CheckoutSteps />

          {/* Two-column layout */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

            {/* ── LEFT: Shipping Form ── */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} noValidate>
                <div className="rounded-[20px] border border-[#F0F0F0] bg-white p-6 shadow-sm md:p-8">

                  <div className="mb-6 flex items-center gap-[10px]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#28DC4F]/10">
                      <LocationPinIcon />
                    </div>
                    <div>
                      <h1 className="text-[20px] font-semibold text-[#111827]">Shipping Address</h1>
                      <p className="text-[13px] text-[#9CA3AF]">Enter the address where you&apos;d like your order delivered</p>
                    </div>
                  </div>

                  <div className="h-px bg-[#F4F4F4]" />

                  {apiError && (
                    <div
                      className="mt-5 rounded-[10px] px-4 py-3 text-[13px]"
                      style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                    >
                      {apiError}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-5">

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field label="First Name" id="firstName" type="text" placeholder="Jane" value={form.firstName} onChange={set("firstName")} error={errors.firstName} autoComplete="given-name" />
                      <Field label="Last Name"  id="lastName"  type="text" placeholder="Smith" value={form.lastName} onChange={set("lastName")} error={errors.lastName} autoComplete="family-name" />
                    </div>

                    <Field label="Email Address" id="email" type="email" placeholder="jane@example.com" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
                    <Field label="Phone Number"  id="phone" type="tel"   placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
                    <Field label="Street Address" id="street" type="text" placeholder="House No., Building, Street Name" value={form.street} onChange={set("street")} error={errors.street} autoComplete="street-address" />
                    <Field label="Landmark" id="landmark" type="text" placeholder="Near school, opposite park, etc." value={form.landmark} onChange={set("landmark")} optional autoComplete="address-level3" />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <Field label="City"    id="city"    type="text" placeholder="Mumbai"      value={form.city}    onChange={set("city")}    error={errors.city}    autoComplete="address-level2" />
                      <Field label="State"   id="state"   type="text" placeholder="Maharashtra" value={form.state}   onChange={set("state")}   error={errors.state}   autoComplete="address-level1" />
                      <Field label="Pincode" id="pincode" type="text" placeholder="400001"      value={form.pincode} onChange={set("pincode")} error={errors.pincode} autoComplete="postal-code" maxLength={6} />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-[12px] py-[15px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ background: "#28DC4F" }}
                    >
                      {submitting ? "Saving…" : <> Continue to Review <ArrowRightIcon /> </>}
                    </button>

                    <Link
                      href="/products"
                      className="flex items-center justify-center gap-1 text-[14px] font-medium text-[#6D6D6D] transition-colors hover:text-black"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M10 3L5 8l5 5" />
                      </svg>
                      Back to Products
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="w-full lg:w-[380px] lg:shrink-0">
              <div className="rounded-[20px] border border-[#F0F0F0] bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-[18px] font-semibold text-[#111827]">Order Summary</h2>

                {!checkoutItem ? (
                  <p className="text-[14px] text-[#9CA3AF]">No product selected.</p>
                ) : (
                  <div className="flex items-center gap-3">
                    <div
                      className="flex shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
                      style={{ width: "72px", height: "46px", background: "#F5F5F5" }}
                    >
                      {checkoutItem.productImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={checkoutItem.productImage} alt={checkoutItem.productName} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-[2px]">
                      <p className="text-[14px] font-semibold leading-snug text-[#111827]">{checkoutItem.productName}</p>
                      {checkoutItem.customization?.selectedCard && (
                        <p className="text-[12px] text-[#9CA3AF]">
                          {checkoutItem.customization.selectedCard.charAt(0).toUpperCase() + checkoutItem.customization.selectedCard.slice(1)}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 text-[14px] font-semibold text-[#111827]">{formatINR(subtotal)}</p>
                  </div>
                )}

                <div className="my-5 h-px bg-[#F4F4F4]" />

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
                </div>

                <div className="my-5 h-px bg-[#F4F4F4]" />

                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-semibold text-[#111827]">Total</span>
                  <span className="text-[20px] font-bold text-[#111827]">{formatINR(total)}</span>
                </div>

                <div className="my-5 h-px bg-[#F4F4F4]" />

                {/* Trust badges */}
                <div className="flex flex-col gap-3 rounded-[12px] bg-[#F9F9F9] p-4">
                  {[
                    { icon: <ShieldIcon />, text: <>Secure checkout with <strong className="text-[#111827]">256-bit SSL</strong> encryption</> },
                    { icon: <TruckIcon />,  text: <>Free shipping on orders above <strong className="text-[#111827]">₹999</strong></> },
                    { icon: <FlashIcon />,  text: <>Dispatch within <strong className="text-[#111827]">24 hours</strong></> },
                  ].map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-[1px] shrink-0">{b.icon}</div>
                      <p className="text-[13px] leading-[1.5] text-[#4B5563]">{b.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
