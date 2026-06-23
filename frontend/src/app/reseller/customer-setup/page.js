"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, Suspense } from "next/navigation";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* ─── icons ──────────────────────────────────────────────────── */
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}
  </svg>
);

/* ─── field ──────────────────────────────────────────────────── */
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#374151]">{label}</label>
      {children}
      {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */
function CustomerSetupContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token") || "";

  const [state, setState]       = useState("loading"); // loading | valid | invalid | done
  const [customerInfo, setCustomerInfo] = useState(null);
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [showCf,     setShowCf]     = useState(false);
  const [errors,     setErrors]     = useState({});
  const [apiError,   setApiError]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    fetch(`${API}/auth/reseller-setup?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) { setCustomerInfo(data.data); setState("valid"); }
        else setState("invalid");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError("");
    const e2 = {};
    if (!password) e2.password = "Password is required";
    else if (password.length < 6) e2.password = "Password must be at least 6 characters";
    if (!confirm) e2.confirm = "Please confirm your password";
    else if (password !== confirm) e2.confirm = "Passwords do not match";
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setSubmitting(true);

    try {
      const res  = await fetch(`${API}/auth/reseller-setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Setup failed");
      // Save JWT and user like normal login
      if (data.data?.token) {
        localStorage.setItem("customerToken", data.data.token);
        localStorage.setItem("customerUser",  JSON.stringify(data.data.user));
      }
      setState("done");
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inp = (val, setter, key, type = "text") => ({
    type,
    value: val,
    onChange: (e) => { setter(e.target.value); if (errors[key]) setErrors(p => ({ ...p, [key]: "" })); },
    className: "w-full rounded-xl border bg-[#F9FAFB] px-4 py-[13px] text-[14px] text-[#1E1E1E] outline-none transition-all placeholder:text-[#AEAEAE] focus:border-[#28DC4F] focus:bg-white focus:ring-2 focus:ring-[#28DC4F]/15",
    style: { borderColor: errors[key] ? "#EF4444" : "#EBEBEB" },
  });

  /* ── loading ── */
  if (state === "loading") {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#28DC4F]" />
        </div>
        <Footer />
      </>
    );
  }

  /* ── invalid / expired ── */
  if (state === "invalid") {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-[#F9F9F9] px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "#FEE2E2" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#111827]">Link Expired or Invalid</h1>
            <p className="mt-2 text-[14px] text-[#6D6D6D]">
              This setup link has expired or has already been used. Please contact your reseller for a new link.
            </p>
          </div>
          <Link href="/login" className="rounded-xl px-6 py-3 text-[14px] font-semibold text-black" style={{ background: "#28DC4F" }}>
            Login Instead
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  /* ── done / success ── */
  if (state === "done") {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-[#F9F9F9] px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "#28DC4F" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M7 18L14 25L29 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-[26px] font-bold text-[#111827]">Account Ready!</h1>
            <p className="mt-2 text-[15px] text-[#6D6D6D]">
              Your profile is set up. Go to your dashboard to configure your digital card.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl px-8 py-3 text-[15px] font-semibold text-black"
            style={{ background: "#28DC4F" }}
          >
            Go to Dashboard
          </button>
        </main>
        <Footer />
      </>
    );
  }

  /* ── setup form ── */
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F9F9F9]">
        <div className="mx-auto max-w-md px-4 py-12 sm:px-6">

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#DCFCE7" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 className="text-[24px] font-bold text-[#111827]">Set Up Your Profile</h1>
            <p className="mt-2 text-[14px] text-[#6D6D6D]">
              {customerInfo?.already_exists
                ? "An account already exists for this email. Set a new password to access your profile."
                : "Your NFC card is on the way! Create a password to secure your digital profile."}
            </p>
          </div>

          <div className="rounded-2xl border border-[#F0F0F0] bg-white p-6 shadow-sm">

            {customerInfo && (
              <div className="mb-5 rounded-xl p-4" style={{ background: "#F9FAFB", border: "1px solid #F0F0F0" }}>
                <p className="text-[13px] font-semibold text-[#111827]">{customerInfo.customer_name}</p>
                <p className="text-[13px] text-[#6D6D6D]">{customerInfo.customer_email}</p>
                {customerInfo.customer_phone && <p className="text-[13px] text-[#6D6D6D]">{customerInfo.customer_phone}</p>}
              </div>
            )}

            {apiError && (
              <div className="mb-4 rounded-xl px-4 py-3 text-[13px]" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Create Password" error={errors.password}>
                <div className="relative">
                  <input placeholder="Min. 6 characters" {...inp(password, setPassword, "password", showPw ? "text" : "password")} />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </Field>

              <Field label="Confirm Password" error={errors.confirm}>
                <div className="relative">
                  <input placeholder="Repeat your password" {...inp(confirm, setConfirm, "confirm", showCf ? "text" : "password")} />
                  <button type="button" onClick={() => setShowCf(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    <EyeIcon open={showCf} />
                  </button>
                </div>
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "#28DC4F" }}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin" style={{ animationDuration: "0.75s" }} width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="7" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5"/>
                      <circle cx="9" cy="9" r="7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 29"/>
                    </svg>
                    Setting up…
                  </>
                ) : "Set Up My Profile"}
              </button>
            </form>

            <p className="mt-5 text-center text-[12px] text-[#9CA3AF]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#28DC4F] hover:opacity-75">Log in</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CustomerSetupPage() {
  return (
    <Suspense fallback={null}>
      <CustomerSetupContent />
    </Suspense>
  );
}
