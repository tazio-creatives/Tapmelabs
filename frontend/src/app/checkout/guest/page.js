"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import authService from "@/services/authService";

/* ─── blurred background (matches /register) ─────────────────── */

function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div style={{ position:"absolute", top:"-8%", left:"10%",  width:"45%", height:"55%", borderRadius:"50%", background:"rgba(40,220,79,0.07)",  filter:"blur(90px)" }} />
      <div style={{ position:"absolute", bottom:"-5%", right:"8%", width:"40%", height:"50%", borderRadius:"50%", background:"rgba(99,102,241,0.06)", filter:"blur(100px)" }} />
      <div style={{ position:"absolute", top:"40%", right:"25%", width:"30%", height:"35%", borderRadius:"50%", background:"rgba(251,191,36,0.04)",   filter:"blur(80px)" }} />
    </div>
  );
}

/* ─── icons ──────────────────────────────────────────────────── */

const ArrowRightIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" />
  </svg>
);

const MailSentIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="28" fill="#28DC4F" fillOpacity="0.10" />
    <circle cx="28" cy="28" r="20" fill="#28DC4F" fillOpacity="0.15" />
    <rect x="14" y="19" width="28" height="18" rx="3" fill="#28DC4F" fillOpacity="0.20" stroke="#28DC4F" strokeWidth="1.5" />
    <path d="M14 22l14 9 14-9" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── modal logo ─────────────────────────────────────────────── */

function ModalLogo() {
  return (
    <div className="flex items-center justify-center gap-[8px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo.svg" alt="TapMe" width={32} height={32} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-text.svg" alt="TAPME LABS" style={{ height: 13 }} />
    </div>
  );
}

/* ─── text field ─────────────────────────────────────────────── */

function Field({ label, id, error, ...props }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="text-[14px] font-medium text-[#1E1E1E]">{label}</label>
      <input
        id={id}
        className="w-full rounded-xl border bg-[#F9FAFB] px-4 py-[14px] text-[14px] text-[#1E1E1E] outline-none transition-all placeholder:text-[#AEAEAE] focus:bg-white focus:ring-2 focus:ring-[#28DC4F]/15"
        style={{ borderColor: error ? "#EF4444" : "#EBEBEB", borderWidth: "1px" }}
        {...props}
      />
      {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
    </div>
  );
}

/* ─── otp box (matches /register) ─────────────────────────────── */

function OtpBoxes({ otp, onChange, inputRefs }) {
  const handleChange = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = Array(6).fill("");
    digits.forEach((d, i) => { next[i] = d; });
    onChange(next);
    const lastFilled = Math.min(digits.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-[10px]">
      {otp.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          aria-label={`OTP digit ${i + 1}`}
          className="flex h-[52px] w-[44px] items-center justify-center rounded-[10px] border bg-[#FAFAFA] text-center text-[20px] font-bold text-[#111827] outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#28DC4F]/20 sm:h-[56px] sm:w-[48px]"
          style={{ borderColor: val ? "#28DC4F" : "#EBEBEB" }}
        />
      ))}
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function GuestCheckoutPage() {
  const router = useRouter();

  /* step: "form" | "verify" */
  const [step, setStep] = useState("form");

  const [fullName,    setFullName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [otp,             setOtp]             = useState(Array(6).fill(""));
  const [otpLoading,      setOtpLoading]      = useState(false);
  const [otpError,        setOtpError]        = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === "verify") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      startResendCountdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const startResendCountdown = () => {
    setResendCountdown(30);
    const id = setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) { clearInterval(id); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!email.trim())    errs.email    = "Email is required.";
    if (!phone.trim())    errs.phone    = "Phone number is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);

    try {
      await authService.sendGuestOtp({ email: email.trim() });
      setStep("verify");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to send verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setOtpError("");
    const code = otp.join("");
    if (code.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    setOtpLoading(true);

    try {
      const res = await authService.guestVerifyOtp({
        email: email.trim(),
        otp: code,
        full_name: fullName.trim(),
        phone: phone.trim(),
      });

      if (res?.data?.token && res?.data?.user) {
        authService.saveSession(res.data.token, res.data.user);
      }

      router.push("/checkout/shipping");
    } catch (err) {
      setOtpError(
        err.response?.data?.message ||
        err.message ||
        "Verification failed. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setOtp(Array(6).fill(""));
    setOtpError("");

    try {
      await authService.sendGuestOtp({ email: email.trim() });
    } catch (err) {
      setOtpError(
        err.response?.data?.message ||
        err.message ||
        "Failed to resend code. Please try again."
      );
    }

    startResendCountdown();
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="relative flex flex-1 flex-col">
        <div className="absolute inset-0 bg-[#F2F4F7]">
          <AuthBackground />
        </div>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[8px]" />

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-[440px] rounded-[24px] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.13)] sm:p-8">

            <ModalLogo />

            {/* ══════════════════════════════════════ STEP 1 — Form */}
            {step === "form" && (
              <>
                <div className="mt-5 text-center">
                  <h1 className="text-[20px] font-bold text-[#111827] sm:text-[22px]">Almost there</h1>
                  <p className="mt-1 text-[13px] text-[#6D6D6D]">
                    Just your details — no password needed, we&apos;ll email you a quick code to confirm.
                  </p>
                </div>

                {error && (
                  <div className="mt-4 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="mt-6 flex flex-col gap-4" noValidate>
                  <Field
                    label="Full Name"
                    id="fullName"
                    type="text"
                    placeholder="Jane Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={fieldErrors.fullName}
                    autoComplete="name"
                    required
                  />

                  <Field
                    label="Email Address"
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={fieldErrors.email}
                    autoComplete="email"
                    required
                  />

                  <Field
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={fieldErrors.phone}
                    autoComplete="tel"
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: "#28DC4F" }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" style={{ animationDuration:"0.75s" }} width="17" height="17" viewBox="0 0 17 17" fill="none">
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 26" />
                        </svg>
                        Sending code...
                      </>
                    ) : (
                      <>Continue <ArrowRightIcon /></>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ══════════════════════════════════════ STEP 2 — Verify */}
            {step === "verify" && (
              <>
                <div className="mt-5 flex flex-col items-center gap-3 text-center">
                  <MailSentIcon />
                  <div>
                    <h1 className="text-[21px] font-bold text-[#111827]">Verify your Email</h1>
                    <p className="mt-1 text-[14px] leading-relaxed text-[#6D6D6D]">
                      We sent a <span className="font-semibold text-[#111827]">6-digit verification code</span> to
                    </p>
                    <p className="mt-[2px] text-[14px] font-semibold text-[#28DC4F]">{email}</p>
                  </div>
                </div>

                {otpError && (
                  <div className="mt-4 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                    {otpError}
                  </div>
                )}

                <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-5" noValidate>
                  <OtpBoxes otp={otp} onChange={setOtp} inputRefs={otpRefs} />

                  <p className="text-center text-[12px] text-[#9CA3AF]">Code expires in <span className="font-medium text-[#111827]">10 minutes</span></p>

                  <button
                    type="submit"
                    disabled={otpLoading || otp.join("").length < 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: "#28DC4F" }}
                  >
                    {otpLoading ? (
                      <>
                        <svg className="animate-spin" style={{ animationDuration:"0.75s" }} width="17" height="17" viewBox="0 0 17 17" fill="none">
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 26" />
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>Verify & Continue <ArrowRightIcon /></>
                    )}
                  </button>
                </form>

                <div className="mt-5 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCountdown > 0}
                    className="text-[13px] font-medium transition-colors disabled:cursor-not-allowed"
                    style={{ color: resendCountdown > 0 ? "#9CA3AF" : "#111827" }}
                  >
                    {resendCountdown > 0
                      ? `Resend code in ${resendCountdown}s`
                      : "Resend Code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep("form"); setOtp(Array(6).fill("")); setOtpError(""); }}
                    className="text-[13px] text-[#9CA3AF] transition-colors hover:text-[#111827]"
                  >
                    Change Details
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
