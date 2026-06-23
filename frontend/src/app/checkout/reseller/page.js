"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const API            = process.env.NEXT_PUBLIC_API_URL            || "http://localhost:5000/api";
const RESELLER_PANEL = process.env.NEXT_PUBLIC_RESELLER_PANEL_URL || "http://localhost:3002";

/* ─── helpers ────────────────────────────────────────────────── */
function fmt(n) { return `₹${Number(n).toLocaleString("en-IN")}`; }

async function apiFetch(path, opts = {}, token) {
  const res  = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src     = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/* ─── icons ──────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M10 3L5 8l5 5" />
  </svg>
);

/* ─── step bar ───────────────────────────────────────────────── */
const STEP_LABELS = ["Details", "Shipping", "Review", "Payment"];

function StepBar({ step }) {
  return (
    <div className="mb-8 flex items-center">
      {STEP_LABELS.map((label, i) => {
        const idx  = i + 1;
        const done = idx < step;
        const act  = idx === step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold"
                style={{ background: done ? "#28DC4F" : act ? "#18181B" : "#E5E7EB", color: done || act ? "#fff" : "#9CA3AF" }}
              >
                {done ? <CheckIcon /> : idx}
              </div>
              <span className="hidden text-[11px] font-medium sm:block" style={{ color: done ? "#28DC4F" : act ? "#18181B" : "#9CA3AF" }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="mx-1 h-[2px] w-8 rounded-full sm:mx-2 sm:w-16 md:w-20" style={{ background: done ? "#28DC4F" : "#E5E7EB" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── field wrapper ──────────────────────────────────────────── */
function Field({ label, optional, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1 text-[13px] font-medium text-[#374151]">
        {label}
        {optional
          ? <span className="text-[11px] font-normal text-[#9CA3AF]">(Optional)</span>
          : <span className="text-[#EF4444]">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
    </div>
  );
}

const baseInputStyle = (hasError) => ({
  width: "100%",
  borderRadius: 12,
  border: `1.5px solid ${hasError ? "#EF4444" : "#EBEBEB"}`,
  background: "#F9FAFB",
  padding: "13px 16px",
  fontSize: 14,
  color: "#1E1E1E",
  outline: "none",
  boxSizing: "border-box",
});

/* ─── order summary sidebar ──────────────────────────────────── */
function OrderSummary({ item, commissionBalance, useCommission, onUseCommissionChange, showCommission }) {
  const price   = Number(item?.rawSalePrice || item?.rawPrice || 0);
  const useComm = Math.min(Math.max(0, Number(useCommission)), commissionBalance, price);
  const toPay   = Math.max(0, price - useComm);

  return (
    <div className="w-full rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm lg:w-[360px] lg:shrink-0">
      <h2 className="mb-4 text-[15px] font-bold text-[#111827]">Order Summary</h2>

      {item && (
        <div className="flex items-center gap-3 pb-4">
          <div className="flex h-[46px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[10px]" style={{ background: "#F5F5F5" }}>
            {item.productImage
              ? <img src={item.productImage} alt={item.productName} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-[#111827]">{item.productName}</p>
            <p className="text-[13px] font-bold text-[#28DC4F]">{fmt(price)}</p>
          </div>
        </div>
      )}

      <div className="border-t border-[#F4F4F4] pt-4">
        <div className="flex justify-between text-[13px]">
          <span className="text-[#6D6D6D]">Product</span>
          <span className="font-medium">{fmt(price)}</span>
        </div>
        <div className="mt-2 flex justify-between text-[13px]">
          <span className="text-[#6D6D6D]">Shipping</span>
          <span className="font-semibold text-[#28DC4F]">FREE</span>
        </div>

        {showCommission && commissionBalance > 0 && (
          <div className="mt-3 rounded-xl p-3" style={{ background: "#F0FFF4", border: "1px solid #BBF7D0" }}>
            <p className="mb-2 text-[12px] font-semibold text-[#16A34A]">Commission Balance: {fmt(commissionBalance)}</p>
            <label className="text-[12px] font-medium text-[#374151]">Apply (₹)</label>
            <input
              type="number" min={0} max={Math.min(commissionBalance, price)} step="0.01"
              value={useCommission}
              onChange={(e) => onUseCommissionChange(e.target.value)}
              style={{ width: "100%", marginTop: 6, borderRadius: 8, border: "1px solid #BBF7D0", background: "#fff", padding: "8px 12px", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              placeholder="0"
            />
            {useComm > 0 && <p className="mt-1.5 text-[11px] text-[#16A34A]">−{fmt(useComm)} applied</p>}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[#F4F4F4] pt-4">
          <span className="text-[15px] font-semibold text-[#111827]">To Pay</span>
          <span className="text-[20px] font-bold text-[#111827]">{fmt(toPay)}</span>
        </div>
        {toPay === 0 && (
          <p className="mt-1 text-center text-[11px] font-semibold text-[#28DC4F]">Fully covered by commission</p>
        )}
      </div>
    </div>
  );
}

/* ─── main page ──────────────────────────────────────────────── */
export default function ResellerCheckoutPage() {
  const router = useRouter();
  const [step,        setStep]        = useState(1);
  const [item,        setItem]        = useState(null);
  const [token,       setToken]       = useState("");
  const [stats,       setStats]       = useState(null);
  const [error,       setError]       = useState("");
  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [successId,   setSuccessId]   = useState("");

  // step 1 — customer details
  const [custName,  setCustName]  = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");

  // email OTP verification
  const [otpSent,       setOtpSent]       = useState(false);
  const [otpVerified,   setOtpVerified]   = useState(false);
  const [otp,           setOtp]           = useState(["","","","","",""]);
  const [otpError,      setOtpError]      = useState("");
  const [otpLoading,    setOtpLoading]    = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = Array.from({ length: 6 }, () => null);
  const otpRefsList = { current: otpRefs };

  // step 2
  const [ship, setShip] = useState({ name: "", address: "", landmark: "", city: "", state: "", pincode: "", phone: "" });

  // commission
  const [useCommission, setUseCommission] = useState(0);

  useEffect(() => {
    const rt   = sessionStorage.getItem("resellerToken");
    const mode = sessionStorage.getItem("resellerMode");
    if (!rt || mode !== "1") { router.replace("/products"); return; }
    setToken(rt);
    try { setItem(JSON.parse(localStorage.getItem("checkoutItem") || "{}")); } catch {}
    fetch(`${API}/reseller/profile/stats`, { headers: { Authorization: `Bearer ${rt}` } })
      .then(r => r.json()).then(setStats).catch(() => {});
  }, [router]);

  const price    = Number(item?.rawSalePrice || item?.rawPrice || 0);
  const balance  = Number(stats?.commission_balance || 0);
  const useComm  = Math.min(Math.max(0, Number(useCommission)), balance, price);
  const toPay    = Math.max(0, price - useComm);

  /* validations */
  function v1() {
    const e = {};
    if (!custName.trim())  e.custName  = "Name is required";
    if (!custEmail.trim()) e.custEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(custEmail)) e.custEmail = "Enter a valid email";
    if (!custPhone.trim()) e.custPhone = "Phone is required";
    return e;
  }
  function v2() {
    const e = {};
    const req = { name: "Full name", address: "Address", city: "City", state: "State", pincode: "Pincode", phone: "Phone" };
    for (const [k, l] of Object.entries(req)) if (!ship[k]?.trim()) e[k] = `${l} is required`;
    if (ship.pincode && !/^\d{6}$/.test(ship.pincode)) e.pincode = "Pincode must be 6 digits";
    return e;
  }

  async function sendOtp() {
    const e = v1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setOtpError(""); setOtpLoading(true);
    try {
      await apiFetch("/reseller/customer/send-otp", { method: "POST", body: JSON.stringify({ email: custEmail }) }, token);
      setOtpSent(true);
      setOtp(["","","","","",""]);
      startCountdown();
      setTimeout(() => otpRefsList.current[0]?.focus(), 100);
    } catch (err) {
      setOtpError(err.message || "Failed to send code. Try again.");
    } finally {
      setOtpLoading(false);
    }
  }

  function startCountdown() {
    setResendCountdown(30);
    const t = setInterval(() => {
      setResendCountdown(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; });
    }, 1000);
  }

  async function verifyOtp() {
    const code = otp.join("");
    if (code.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    setOtpError(""); setOtpLoading(true);
    try {
      await apiFetch("/reseller/customer/verify-otp", { method: "POST", body: JSON.stringify({ email: custEmail, otp: code }) }, token);
      setOtpVerified(true);
    } catch (err) {
      setOtpError(err.message || "Invalid code. Please try again.");
      setOtp(["","","","","",""]);
      setTimeout(() => otpRefsList.current[0]?.focus(), 50);
    } finally {
      setOtpLoading(false);
    }
  }

  function handleOtpChange(val, i) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next); setOtpError("");
    if (val && i < 5) otpRefsList.current[i + 1]?.focus();
  }

  function handleOtpKey(e, i) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefsList.current[i - 1]?.focus();
  }

  function next1() {
    if (!otpVerified) { setOtpError("Please verify the customer email first."); return; }
    setErrors({}); setStep(2);
  }
  function next2() { const e = v2(); if (Object.keys(e).length) { setErrors(e); return; } setErrors({}); setStep(3); }

  function cleanup() {
    sessionStorage.removeItem("resellerToken");
    sessionStorage.removeItem("resellerMode");
    localStorage.removeItem("checkoutItem");
  }

  async function placeOrder() {
    if (!item || !token) return;
    setError(""); setSubmitting(true);
    try {
      const payload = {
        product_id:            item.productId,
        customer_name:         custName,
        customer_phone:        custPhone,
        customer_email:        custEmail,
        use_commission_amount: useComm,
        card_customization:    item.customization || {},
        shipping_address:      { name: ship.name, address: ship.address, landmark: ship.landmark || "", city: ship.city, state: ship.state, pincode: ship.pincode, phone: ship.phone },
      };

      const data = await apiFetch("/reseller/orders", { method: "POST", body: JSON.stringify(payload) }, token);
      const ro   = data.reseller_order;

      if (toPay === 0) {
        cleanup();
        setSuccessId(ro.id);
        setSuccess(true);
        return;
      }

      await loadRazorpay();
      const rzpData = await apiFetch("/reseller/payment/create-order", { method: "POST", body: JSON.stringify({ reseller_order_id: ro.id }) }, token);

      let done = false;
      const rzp = new window.Razorpay({
        key: rzpData.key_id, amount: rzpData.amount, currency: rzpData.currency,
        order_id: rzpData.razorpay_order_id,
        name: "TAPME Labs", description: `NFC Card for ${custName}`,
        prefill: { name: custName, email: custEmail, contact: custPhone },
        theme: { color: "#28DC4F" },
        handler: async (response) => {
          try {
            await apiFetch("/reseller/payment/verify", { method: "POST", body: JSON.stringify({ reseller_order_id: ro.id, razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }) }, token);
            done = true;
            rzp.close();
            cleanup();
            setSuccessId(ro.id);
            setSuccess(true);
          } catch { setError("Payment verification failed. Please contact support."); rzp.close(); }
        },
        modal: { ondismiss: () => { if (!done) setError("Payment was cancelled."); } },
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── success ── */
  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#F9F9F9]">
          <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "#28DC4F" }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M7 18L14 25L29 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-[26px] font-bold text-[#111827]">Order Placed!</h1>
              <p className="mt-2 text-[15px] text-[#6D6D6D]">
                A profile setup email has been sent to <strong>{custEmail}</strong>.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-[#F0F0F0] bg-white p-5 text-left">
              <p className="mb-3 text-[13px] font-semibold text-[#111827]">What happens next</p>
              {[
                `Setup email sent to ${custEmail}`,
                "Customer clicks the link, sets a password and fills in their digital profile",
                "NFC card is linked and ready when it arrives",
              ].map((t, i) => (
                <div key={i} className="mb-2 flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-black" style={{ background: "#28DC4F" }}>{i + 1}</div>
                  <p className="text-[13px] text-[#4B5563]">{t}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { window.location.href = `${RESELLER_PANEL}/orders/${successId}`; }}
                className="rounded-xl px-6 py-3 text-[14px] font-semibold text-black" style={{ background: "#28DC4F" }}>
                View Order
              </button>
              <button onClick={() => { window.location.href = `${RESELLER_PANEL}/orders`; }}
                className="rounded-xl border border-[#E5E7EB] px-6 py-3 text-[14px] font-medium text-[#374151] hover:bg-[#F9FAFB]">
                All Orders
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!item?.productId) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-[14px] text-[#9CA3AF]">Loading order details…</p>
        </div>
        <Footer />
      </>
    );
  }

  /* ── shared input helper ── */
  const sinp = (val, setter, key) => ({
    value: val,
    style: baseInputStyle(!!errors[key]),
    onChange: (e) => { setter(e.target.value); if (errors[key]) setErrors(p => ({ ...p, [key]: "" })); },
    onFocus: (e) => { if (!errors[key]) e.target.style.borderColor = "#28DC4F"; },
    onBlur:  (e) => { if (!errors[key]) e.target.style.borderColor = "#EBEBEB"; },
  });
  const hinp = (key) => ({
    value: ship[key],
    style: baseInputStyle(!!errors[key]),
    onChange: (e) => { setShip(p => ({ ...p, [key]: e.target.value })); if (errors[key]) setErrors(p => ({ ...p, [key]: "" })); },
    onFocus: (e) => { if (!errors[key]) e.target.style.borderColor = "#28DC4F"; },
    onBlur:  (e) => { if (!errors[key]) e.target.style.borderColor = "#EBEBEB"; },
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F9F9F9]">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

          {/* Reseller badge */}
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide" style={{ background: "#DCFCE7", color: "#16A34A" }}>
              Reseller Order
            </span>
            <span className="text-[13px] text-[#6B7280]">Placing order on behalf of a customer</span>
          </div>

          <StepBar step={step} />

          {error && (
            <div className="mb-6 rounded-xl px-4 py-3 text-[13px]" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

            {/* LEFT */}
            <div className="flex-1">

              {/* Step 1 — Customer Details */}
              {step === 1 && (
                <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="mb-5 text-[18px] font-bold text-[#111827]">Customer Details</h2>
                  <div className="flex flex-col gap-4">
                    <Field label="Customer Name" error={errors.custName}>
                      <input placeholder="Full name" {...sinp(custName, setCustName, "custName")} />
                    </Field>

                    {/* Email + Send OTP */}
                    <div className="flex flex-col gap-2">
                      <Field label="Customer Email" error={errors.custEmail}>
                        <div className="flex gap-2">
                          <input
                            type="email" placeholder="customer@email.com"
                            {...sinp(custEmail, (v) => { setCustEmail(v); setOtpSent(false); setOtpVerified(false); setOtp(["","","","","",""]); setOtpError(""); }, "custEmail")}
                            disabled={otpVerified}
                            style={{ ...baseInputStyle(!!errors.custEmail), flex: 1, opacity: otpVerified ? 0.7 : 1 }}
                          />
                          {!otpVerified && (
                            <button
                              type="button"
                              onClick={sendOtp}
                              disabled={otpLoading || !custEmail.includes("@")}
                              style={{
                                padding: "0 16px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                                background: otpLoading || !custEmail.includes("@") ? "#E5E7EB" : "#18181B",
                                color: otpLoading || !custEmail.includes("@") ? "#9CA3AF" : "#fff",
                                border: "none", cursor: otpLoading || !custEmail.includes("@") ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {otpLoading && !otpSent ? "Sending…" : otpSent ? "Resend" : "Send Code"}
                            </button>
                          )}
                          {otpVerified && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", background: "#DCFCE7", borderRadius: 12, fontSize: 12, fontWeight: 600, color: "#16A34A", whiteSpace: "nowrap" }}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Verified
                            </div>
                          )}
                        </div>
                      </Field>

                      {/* OTP boxes */}
                      {otpSent && !otpVerified && (
                        <div className="rounded-xl p-4" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                          <p className="mb-3 text-[12px] text-[#6B7280]">
                            Enter the 6-digit code sent to <strong>{custEmail}</strong>
                          </p>
                          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                            {otp.map((val, i) => (
                              <input
                                key={i}
                                ref={el => { otpRefsList.current[i] = el; }}
                                type="text" inputMode="numeric" maxLength={1}
                                value={val}
                                onChange={e => handleOtpChange(e.target.value, i)}
                                onKeyDown={e => handleOtpKey(e, i)}
                                style={{
                                  width: 44, height: 50, textAlign: "center", fontSize: 20, fontWeight: 700,
                                  border: `2px solid ${otpError ? "#EF4444" : val ? "#28DC4F" : "#E5E7EB"}`,
                                  borderRadius: 10, background: "#fff", outline: "none",
                                }}
                              />
                            ))}
                          </div>
                          {otpError && <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 8 }}>{otpError}</p>}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <button
                              type="button" onClick={verifyOtp} disabled={otpLoading || otp.join("").length < 6}
                              style={{
                                padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                                background: otpLoading || otp.join("").length < 6 ? "#E5E7EB" : "#28DC4F",
                                color: "#000", border: "none",
                                cursor: otpLoading || otp.join("").length < 6 ? "not-allowed" : "pointer",
                              }}
                            >
                              {otpLoading ? "Verifying…" : "Verify Code"}
                            </button>
                            <button
                              type="button"
                              onClick={resendCountdown > 0 ? undefined : sendOtp}
                              disabled={resendCountdown > 0 || otpLoading}
                              style={{ fontSize: 12, color: resendCountdown > 0 ? "#9CA3AF" : "#28DC4F", background: "none", border: "none", cursor: resendCountdown > 0 ? "default" : "pointer" }}
                            >
                              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Field label="Customer Phone" error={errors.custPhone}>
                      <input type="tel" placeholder="+91 98765 43210" {...sinp(custPhone, setCustPhone, "custPhone")} />
                    </Field>

                    {!otpVerified && (
                      <div className="rounded-xl px-4 py-3 text-[12px] text-[#374151]" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                        A verification code will be sent to the customer email. Verify it before proceeding.
                      </div>
                    )}

                    {otpError && !otpSent && <p style={{ fontSize: 12, color: "#EF4444" }}>{otpError}</p>}

                    <button
                      onClick={next1}
                      disabled={!otpVerified}
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ background: "#28DC4F" }}
                    >
                      Continue to Shipping <ArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Shipping */}
              {step === 2 && (
                <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="mb-5 text-[18px] font-bold text-[#111827]">Shipping Address</h2>
                  <div className="flex flex-col gap-4">
                    <Field label="Full Name" error={errors.name}>
                      <input placeholder="Recipient's full name" {...hinp("name")} />
                    </Field>
                    <Field label="Address" error={errors.address}>
                      <input placeholder="House no., building, street" {...hinp("address")} />
                    </Field>
                    <Field label="Landmark" optional error={errors.landmark}>
                      <input placeholder="Near school, opposite park…" {...hinp("landmark")} />
                    </Field>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label="City" error={errors.city}>
                        <input placeholder="Mumbai" {...hinp("city")} />
                      </Field>
                      <Field label="State" error={errors.state}>
                        <input placeholder="Maharashtra" {...hinp("state")} />
                      </Field>
                      <Field label="Pincode" error={errors.pincode}>
                        <input placeholder="400001" maxLength={6} {...hinp("pincode")} />
                      </Field>
                    </div>
                    <Field label="Phone" error={errors.phone}>
                      <input type="tel" placeholder="Contact number" {...hinp("phone")} />
                    </Field>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setStep(1)} className="flex items-center gap-1 rounded-xl border border-[#E5E7EB] px-5 py-3 text-[14px] font-medium text-[#374151] hover:bg-[#F9FAFB]">
                        <ChevronLeft /> Back
                      </button>
                      <button onClick={next2} className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-semibold text-black" style={{ background: "#28DC4F" }}>
                        Continue to Review <ArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Review + Place */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-[#111827]">Customer Details</h3>
                      <button onClick={() => setStep(1)} className="text-[13px] font-medium text-[#28DC4F] hover:opacity-75">Edit</button>
                    </div>
                    <div className="flex flex-col gap-1 text-[13px] text-[#4B5563]">
                      <p className="font-semibold text-[#111827]">{custName}</p>
                      <p>{custEmail}</p>
                      <p>{custPhone}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[15px] font-bold text-[#111827]">Shipping Address</h3>
                      <button onClick={() => setStep(2)} className="text-[13px] font-medium text-[#28DC4F] hover:opacity-75">Edit</button>
                    </div>
                    <div className="flex flex-col gap-1 text-[13px] text-[#4B5563]">
                      <p className="font-semibold text-[#111827]">{ship.name}</p>
                      <p>{ship.address}{ship.landmark ? `, ${ship.landmark}` : ""}</p>
                      <p>{[ship.city, ship.state].filter(Boolean).join(", ")}{ship.pincode ? ` – ${ship.pincode}` : ""}</p>
                      <p>{ship.phone}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 border-b border-[#F4F4F4] pb-4">
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#6D6D6D]">Product</span>
                        <span className="font-medium">{fmt(price)}</span>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="text-[#6D6D6D]">Shipping</span>
                        <span className="font-semibold text-[#28DC4F]">FREE</span>
                      </div>
                      {useComm > 0 && (
                        <div className="flex justify-between text-[13px]">
                          <span className="text-[#6D6D6D]">Commission applied</span>
                          <span className="text-[#16A34A]">−{fmt(useComm)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-[#111827]">
                        {toPay === 0 ? "Total (via Commission)" : "To Pay"}
                      </span>
                      <span className="text-[22px] font-bold text-[#111827]">{fmt(toPay)}</span>
                    </div>

                    <button
                      onClick={placeOrder}
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ background: "#28DC4F" }}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin" style={{ animationDuration: "0.75s" }} width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="7" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" />
                            <circle cx="9" cy="9" r="7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 29" />
                          </svg>
                          Placing Order…
                        </>
                      ) : (
                        <>{toPay === 0 ? "Place Order (Commission)" : `Pay ${fmt(toPay)} & Place Order`} <ArrowRight /></>
                      )}
                    </button>
                    <button onClick={() => setStep(2)} className="mt-3 flex w-full items-center justify-center gap-1 text-[13px] font-medium text-[#6D6D6D] hover:text-black">
                      <ChevronLeft /> Back to Shipping
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — Order Summary */}
            <OrderSummary
              item={item}
              commissionBalance={balance}
              useCommission={useCommission}
              onUseCommissionChange={setUseCommission}
              showCommission={step >= 3}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
