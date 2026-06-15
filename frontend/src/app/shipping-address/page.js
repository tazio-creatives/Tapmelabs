"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import orderService from "@/services/orderService";

/* ─── icons ──────────────────────────────────────────────────── */

const LocationPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 1.667A5.833 5.833 0 0 0 4.167 7.5c0 4.375 5.833 10.833 5.833 10.833S15.833 11.875 15.833 7.5A5.833 5.833 0 0 0 10 1.667Z"
      fill="#28DC4F"
    />
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

/* ─── field component ────────────────────────────────────────── */

function Field({ label, id, optional, error, ...inputProps }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="flex items-center gap-1 text-[14px] font-medium text-[#1E1E1E]">
        {label}
        {optional && (
          <span className="text-[12px] font-normal text-[#9CA3AF]">(Optional)</span>
        )}
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
      {error && (
        <p className="text-[12px] font-medium text-red-500">{error}</p>
      )}
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

/* ─── main page ──────────────────────────────────────────────── */

export default function ShippingAddressPage() {
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

  const [cartItems,   setCartItems]   = useState([]);
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState("");
  const [submitting,  setSubmitting]  = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItems(Array.isArray(stored) ? stored : []);
    } catch {
      setCartItems([]);
    }
  }, []);

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    // Clear the field error as soon as the user types
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // Compute totals from cart
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.rawSalePrice ?? item.rawPrice ?? 0);
    return sum + price;
  }, 0);
  const shipping = subtotal >= 799 ? 0 : 99;
  const total    = subtotal + shipping;

  // Client-side validation
  function validate() {
    const newErrors = {};
    for (const key of REQUIRED_FIELDS) {
      if (!form[key].trim()) {
        newErrors[key] = `${FIELD_LABELS[key]} is required`;
      }
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (cartItems.length === 0) {
      setApiError("Your cart is empty. Please add a product before placing an order.");
      return;
    }

    setSubmitting(true);
    try {
      const shipping_address = {
        full_name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email:     form.email.trim(),
        phone:     form.phone.trim(),
        street:    form.street.trim(),
        landmark:  form.landmark.trim(),
        city:      form.city.trim(),
        state:     form.state.trim(),
        pincode:   form.pincode.trim(),
      };

      const result = await orderService.createOrder({
        product_id:       cartItems[0].productId,
        total_amount:     total,
        shipping_address,
      });

      // Persist returned order so /payment/redirect can read it
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

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F9F9F9]">
        <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-[120px]">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1">
            <Link href="/" className="text-[13px] font-normal text-[#9CA3AF] transition-colors hover:text-black">
              Home
            </Link>
            <ChevronRightIcon />
            <Link href="/#products" className="text-[13px] font-normal text-[#9CA3AF] transition-colors hover:text-black">
              Products
            </Link>
            <ChevronRightIcon />
            <span className="text-[13px] font-medium text-[#1E1E1E]">Shipping Address</span>
          </nav>

          {/* Checkout progress steps */}
          <div className="mb-8 flex items-center gap-0">
            {[
              { label: "Cart",     step: 1, done: true  },
              { label: "Shipping", step: 2, done: false, active: true },
              { label: "Payment",  step: 3, done: false },
              { label: "Confirm",  step: 4, done: false },
            ].map((s, i, arr) => (
              <div key={s.step} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition-colors"
                    style={{
                      background: s.done ? "#28DC4F" : s.active ? "#18181B" : "#E5E7EB",
                      color: s.done || s.active ? "#fff" : "#9CA3AF",
                    }}
                  >
                    {s.done ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : s.step}
                  </div>
                  <span
                    className="hidden text-[11px] font-medium sm:block"
                    style={{ color: s.done ? "#28DC4F" : s.active ? "#18181B" : "#9CA3AF" }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    className="mx-2 h-[2px] w-12 rounded-full sm:w-20 md:w-32"
                    style={{ background: s.done ? "#28DC4F" : "#E5E7EB" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

            {/* ── LEFT: Shipping Form ── */}
            <div className="flex-1">
              <form onSubmit={handleSubmit} noValidate>
                <div className="rounded-[20px] border border-[#F0F0F0] bg-white p-6 shadow-sm md:p-8">

                  {/* Section title */}
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

                  {/* API error banner */}
                  {apiError && (
                    <div
                      className="mt-5 rounded-[10px] px-4 py-3 text-[13px]"
                      style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
                    >
                      {apiError}
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="mt-6 flex flex-col gap-5">

                    {/* Row 1: First + Last Name */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field
                        label="First Name"
                        id="firstName"
                        type="text"
                        placeholder="Jane"
                        value={form.firstName}
                        onChange={set("firstName")}
                        error={errors.firstName}
                        autoComplete="given-name"
                      />
                      <Field
                        label="Last Name"
                        id="lastName"
                        type="text"
                        placeholder="Smith"
                        value={form.lastName}
                        onChange={set("lastName")}
                        error={errors.lastName}
                        autoComplete="family-name"
                      />
                    </div>

                    {/* Row 2: Email */}
                    <Field
                      label="Email Address"
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={set("email")}
                      error={errors.email}
                      autoComplete="email"
                    />

                    {/* Row 3: Phone */}
                    <Field
                      label="Phone Number"
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={set("phone")}
                      error={errors.phone}
                      autoComplete="tel"
                    />

                    {/* Row 4: Street */}
                    <Field
                      label="Street Address"
                      id="street"
                      type="text"
                      placeholder="House No., Building, Street Name"
                      value={form.street}
                      onChange={set("street")}
                      error={errors.street}
                      autoComplete="street-address"
                    />

                    {/* Row 5: Landmark (optional) */}
                    <Field
                      label="Landmark"
                      id="landmark"
                      type="text"
                      placeholder="Near school, opposite park, etc."
                      value={form.landmark}
                      onChange={set("landmark")}
                      optional
                      autoComplete="address-level3"
                    />

                    {/* Row 6: City + State + Pincode */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <Field
                        label="City"
                        id="city"
                        type="text"
                        placeholder="Mumbai"
                        value={form.city}
                        onChange={set("city")}
                        error={errors.city}
                        autoComplete="address-level2"
                      />
                      <Field
                        label="State"
                        id="state"
                        type="text"
                        placeholder="Maharashtra"
                        value={form.state}
                        onChange={set("state")}
                        error={errors.state}
                        autoComplete="address-level1"
                      />
                      <Field
                        label="Pincode"
                        id="pincode"
                        type="text"
                        placeholder="400001"
                        value={form.pincode}
                        onChange={set("pincode")}
                        error={errors.pincode}
                        autoComplete="postal-code"
                        maxLength={6}
                      />
                    </div>

                    {/* CTA */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-[12px] py-[15px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ background: "#28DC4F" }}
                    >
                      {submitting ? (
                        <>
                          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Placing Order…
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ArrowRightIcon />
                        </>
                      )}
                    </button>

                    {/* Back link */}
                    <Link
                      href="/cart"
                      className="flex items-center justify-center gap-1 text-[14px] font-medium text-[#6D6D6D] transition-colors hover:text-black"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M10 3L5 8l5 5" />
                      </svg>
                      Back to Cart
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="w-full lg:w-[400px] lg:shrink-0">
              <div className="rounded-[20px] border border-[#F0F0F0] bg-white p-6 shadow-sm">

                <h2 className="mb-5 text-[18px] font-semibold text-[#111827]">Order Summary</h2>

                {/* Product list */}
                {cartItems.length === 0 ? (
                  <p className="text-[14px] text-[#9CA3AF]">Your cart is empty.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cartItems.map((item) => {
                      const price = Number(item.rawSalePrice ?? item.rawPrice ?? 0);
                      return (
                        <div key={item.id} className="flex items-center gap-3">
                          {/* Product thumbnail */}
                          <div
                            className="flex shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
                            style={{ width: "72px", height: "46px", background: "#F5F5F5" }}
                          >
                            {item.productImage ? (
                              /*
                                Plain <img> — product images are served from the backend
                                (http://localhost:5000/uploads/...). Swap to next/image once
                                a CDN domain is finalised and added to remotePatterns.
                              */
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                              />
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex flex-1 flex-col gap-[2px]">
                            <p className="text-[14px] font-semibold leading-snug text-[#111827]">{item.productName}</p>
                            {item.customization?.selectedCard && (
                              <p className="text-[12px] text-[#9CA3AF]">
                                {item.customization.selectedCard.charAt(0).toUpperCase() + item.customization.selectedCard.slice(1)}
                              </p>
                            )}
                          </div>

                          {/* Price */}
                          <p className="shrink-0 text-[14px] font-semibold text-[#111827]">
                            {formatINR(price)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Divider */}
                <div className="my-5 h-px bg-[#F4F4F4]" />

                {/* Price breakdown */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#6D6D6D]">Subtotal</span>
                    <span className="text-[14px] font-medium text-[#111827]">
                      {formatINR(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#6D6D6D]">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-[14px] font-semibold text-[#28DC4F]">FREE</span>
                    ) : (
                      <span className="text-[14px] font-medium text-[#111827]">
                        ₹{shipping}
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-[#F4F4F4]" />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-semibold text-[#111827]">Total</span>
                  <span className="text-[20px] font-bold text-[#111827]">
                    {formatINR(total)}
                  </span>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-[#F4F4F4]" />

                {/* Trust badges */}
                <div className="flex flex-col gap-3 rounded-[12px] bg-[#F9F9F9] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-[1px] shrink-0"><ShieldIcon /></div>
                    <p className="text-[13px] leading-[1.5] text-[#4B5563]">
                      Secure checkout with <span className="font-medium text-[#111827]">256-bit SSL</span> encryption
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-[1px] shrink-0"><TruckIcon /></div>
                    <p className="text-[13px] leading-[1.5] text-[#4B5563]">
                      Free shipping on orders above <span className="font-medium text-[#111827]">₹799</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-[1px] shrink-0"><FlashIcon /></div>
                    <p className="text-[13px] leading-[1.5] text-[#4B5563]">
                      Dispatch within <span className="font-medium text-[#111827]">4 days</span>
                    </p>
                  </div>
                </div>

                {/* Coupon / promo placeholder */}
                <div className="mt-5 flex overflow-hidden rounded-[10px] border border-[#EBEBEB]">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 bg-transparent px-4 py-[11px] text-[13px] text-[#1E1E1E] outline-none placeholder:text-[#AEAEAE]"
                  />
                  <button
                    type="button"
                    className="shrink-0 px-4 py-[11px] text-[13px] font-semibold text-[#28DC4F] transition-opacity hover:opacity-80"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Payment method chips */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-2">
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
