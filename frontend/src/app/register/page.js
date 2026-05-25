"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import authService from "@/services/authService";

/* ─── blurred background ─────────────────────────────────────── */

function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div style={{ position:"absolute", top:"-8%", left:"10%",  width:"45%", height:"55%", borderRadius:"50%", background:"rgba(40,220,79,0.07)",  filter:"blur(90px)" }} />
      <div style={{ position:"absolute", bottom:"-5%", right:"8%", width:"40%", height:"50%", borderRadius:"50%", background:"rgba(99,102,241,0.06)", filter:"blur(100px)" }} />
      <div style={{ position:"absolute", top:"40%", right:"25%", width:"30%", height:"35%", borderRadius:"50%", background:"rgba(251,191,36,0.04)",   filter:"blur(80px)" }} />

      <div style={{ position:"absolute", left:"5%", top:"8%", width:"43%", height:"78%", background:"rgba(255,255,255,0.55)", borderRadius:"20px" }} />
      <div style={{ position:"absolute", left:"8%", top:"13%", width:"14%", height:"8px",  background:"rgba(0,0,0,0.07)", borderRadius:"5px" }} />
      <div style={{ position:"absolute", left:"8%", top:"17%", display:"flex", gap:"6px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:"28px", height:"28px", borderRadius:"50%", background: i===1 ? "rgba(40,220,79,0.25)" : "rgba(0,0,0,0.06)" }} />
        ))}
      </div>
      <div style={{ position:"absolute", left:"8%", top:"23%", width:"20%", height:"10px", background:"rgba(0,0,0,0.09)", borderRadius:"5px" }} />
      <div style={{ position:"absolute", left:"8%",  top:"28%", width:"19%", height:"36px", background:"rgba(0,0,0,0.05)", borderRadius:"10px" }} />
      <div style={{ position:"absolute", left:"28%", top:"28%", width:"17%", height:"36px", background:"rgba(0,0,0,0.05)", borderRadius:"10px" }} />
      {[34,41,48,55].map((t,i) => (
        <div key={i} style={{ position:"absolute", left:"8%", top:`${t}%`, width:"37%", height:"36px", background:"rgba(0,0,0,0.05)", borderRadius:"10px" }} />
      ))}
      <div style={{ position:"absolute", left:"8%", top:"64%", width:"37%", height:"44px", background:"rgba(40,220,79,0.18)", borderRadius:"12px" }} />

      <div style={{ position:"absolute", right:"5%", top:"8%", width:"29%", height:"60%", background:"rgba(255,255,255,0.55)", borderRadius:"20px" }} />
      <div style={{ position:"absolute", right:"8%", top:"12%", width:"11%", height:"8px", background:"rgba(0,0,0,0.08)", borderRadius:"5px" }} />
      <div style={{ position:"absolute", right:"23%", top:"17%", width:"7%",  height:"38px", background:"rgba(0,0,0,0.06)", borderRadius:"8px" }} />
      <div style={{ position:"absolute", right:"8%",  top:"17%", width:"13%", height:"7px",  background:"rgba(0,0,0,0.07)", borderRadius:"4px" }} />
      <div style={{ position:"absolute", right:"8%",  top:"21%", width:"9%",  height:"5px",  background:"rgba(0,0,0,0.05)", borderRadius:"4px" }} />
      {[29,34,39].map((t,i) => (
        <div key={i} style={{ position:"absolute", right:"8%", top:`${t}%`, width:"21%", height:"5px", background:"rgba(0,0,0,0.05)", borderRadius:"4px" }} />
      ))}
      <div style={{ position:"absolute", right:"8%", top:"46%", width:"21%", height:"9px", background:"rgba(0,0,0,0.09)", borderRadius:"5px" }} />
      <div style={{ position:"absolute", right:"5%", top:"55%", width:"29%", height:"13%", background:"rgba(240,240,240,0.5)", borderRadius:"12px" }} />
    </div>
  );
}

/* ─── icons ──────────────────────────────────────────────────── */

const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="9" cy="9" rx="8" ry="5.5" />
    <circle cx="9" cy="9" r="2.5" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 2.5l13 13" />
    <path d="M7.2 3.8A9 9 0 0 1 9 3.5c5 0 7.5 5.5 7.5 5.5a13 13 0 0 1-2.2 3" />
    <path d="M11.5 14a9 9 0 0 1-2.5.5C4 14.5 1.5 9 1.5 9A13 13 0 0 1 4 5.5" />
    <path d="M7 9.5a2.5 2.5 0 0 0 3.3 2.2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

function Field({ label, id, rightSlot, error, ...props }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="text-[14px] font-medium text-[#1E1E1E]">{label}</label>
      <div className="relative flex items-center">
        <input
          id={id}
          className="w-full rounded-xl border bg-[#F9FAFB] px-4 py-[14px] text-[14px] text-[#1E1E1E] outline-none transition-all placeholder:text-[#AEAEAE] focus:bg-white focus:ring-2 focus:ring-[#28DC4F]/15"
          style={{ borderColor: error ? "#EF4444" : "#EBEBEB", borderWidth: "1px" }}
          {...props}
        />
        {rightSlot && <div className="absolute right-3">{rightSlot}</div>}
      </div>
      {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
    </div>
  );
}

/* ─── otp box ────────────────────────────────────────────────── */

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

/* ─── password strength bar ──────────────────────────────────── */

function PasswordStrength({ password }) {
  if (!password) return null;
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#28DC4F"];

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="h-[3px] flex-1 rounded-full transition-all duration-300"
            style={{ background: s <= score ? colors[score] : "#E5E7EB" }}
          />
        ))}
      </div>
      {score > 0 && (
        <span className="text-[11px] font-medium" style={{ color: colors[score] }}>
          {labels[score]}
        </span>
      )}
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function RegisterPage() {
  const router = useRouter();

  /* step: "form" | "verify" */
  const [step, setStep] = useState("form");
  const [isCheckout,  setIsCheckout]  = useState(false);
  const [redirectTo,  setRedirectTo]  = useState("/dashboard/profile/setup");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect") === "checkout") {
      setIsCheckout(true);
      setRedirectTo("/checkout/shipping");
    }
  }, []);

  /* form state */
  const [fullName,        setFullName]        = useState("");
  const [email,           setEmail]           = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirm,         setConfirm]         = useState("");
  const [agreeTerms,      setAgreeTerms]      = useState(false);
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [fieldErrors,     setFieldErrors]     = useState({});

  /* otp state */
  const [otp,             setOtp]             = useState(Array(6).fill(""));
  const [otpLoading,      setOtpLoading]      = useState(false);
  const [otpError,        setOtpError]        = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef([]);

  /* auto-focus first OTP box when verification step mounts */
  useEffect(() => {
    if (step === "verify") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
      startResendCountdown();
    }
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

  /* ── form validation ── */
  const validate = () => {
    const errs = {};
    if (!fullName.trim())                               errs.fullName = "Full name is required.";
    if (!email.trim())                                  errs.email    = "Email is required.";
    if (!phone.trim())                                  errs.phone    = "Phone number is required.";
    if (password.length < 8)                            errs.password = "Password must be at least 8 characters.";
    if (password !== confirm)                           errs.confirm  = "Passwords do not match.";
    if (!agreeTerms)                                    errs.terms    = "You must accept the Terms & Conditions.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── submit signup ── */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await authService.register({
        full_name: fullName.trim(),
        email:     email.trim(),
        phone:     phone.trim(),
        password,
      });

      if (res?.data?.token && res?.data?.user) {
        authService.saveSession(res.data.token, res.data.user);
      }

      setStep("verify");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── submit otp ── */
  const handleVerify = async (e) => {
    e.preventDefault();
    setOtpError("");
    const code = otp.join("");
    if (code.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    setOtpLoading(true);

    try {
      await authService.verifyOtp({ email, otp: code });
      router.push(redirectTo);
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

  /* ── resend otp ── */
  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setOtp(Array(6).fill(""));
    setOtpError("");

    try {
      await authService.resendOtp({ email });
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
        {/* Background */}
        <div className="absolute inset-0 bg-[#F2F4F7]">
          <AuthBackground />
        </div>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[8px]" />

        {/* Modal */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-[440px] rounded-[24px] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.13)] sm:p-8">

            <ModalLogo />

            {/* ════════════════════════════════════════════ STEP 1 — Form */}
            {step === "form" && (
              <>
                <div className="mt-5 text-center">
                  <h1 className="text-[20px] font-bold text-[#111827] sm:text-[22px]">{isCheckout ? "Sign Up" : "Create your Profile"}</h1>
                  <p className="mt-1 text-[13px] text-[#6D6D6D]">Join TapMe and go contactless today</p>
                </div>

                {error && (
                  <div className="mt-4 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignup} className="mt-6 flex flex-col gap-4" noValidate>
                  {/* Full Name */}
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

                  {/* Email */}
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

                  {/* Phone */}
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

                  {/* Password */}
                  <div className="flex flex-col gap-[6px]">
                    <Field
                      label="Password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={fieldErrors.password}
                      autoComplete="new-password"
                      required
                      style={{ paddingRight: "44px" }}
                      rightSlot={
                        <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-[#9CA3AF] hover:text-[#111827]" aria-label={showPassword ? "Hide" : "Show"}>
                          {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                        </button>
                      }
                    />
                    <PasswordStrength password={password} />
                  </div>

                  {/* Confirm Password */}
                  <Field
                    label="Confirm Password"
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    error={fieldErrors.confirm}
                    autoComplete="new-password"
                    required
                    style={{ paddingRight: "44px" }}
                    rightSlot={
                      <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-[#9CA3AF] hover:text-[#111827]" aria-label={showConfirm ? "Hide" : "Show"}>
                        {showConfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </button>
                    }
                  />

                  {/* T&C */}
                  <div className="flex flex-col gap-1">
                    <label className="flex cursor-pointer items-start gap-3">
                      <div
                        onClick={() => setAgreeTerms((v) => !v)}
                        className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-all"
                        style={{ borderColor: agreeTerms ? "#28DC4F" : (fieldErrors.terms ? "#EF4444" : "#D1D5DB"), background: agreeTerms ? "#28DC4F" : "transparent" }}
                        role="checkbox"
                        aria-checked={agreeTerms}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === " " && setAgreeTerms((v) => !v)}
                      >
                        {agreeTerms && <CheckIcon />}
                      </div>
                      <span className="text-[13px] leading-relaxed text-[#6D6D6D]">
                        I agree to the{" "}
                        <Link href="#" className="font-medium text-[#111827] hover:text-[#28DC4F]">Terms &amp; Conditions</Link>
                        {" "}and{" "}
                        <Link href="#" className="font-medium text-[#111827] hover:text-[#28DC4F]">Privacy Policy</Link>
                      </span>
                    </label>
                    {fieldErrors.terms && <p className="ml-7 text-[12px] text-[#EF4444]">{fieldErrors.terms}</p>}
                  </div>

                  {/* Submit */}
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
                        Creating Account...
                      </>
                    ) : (
                      <>Create Account <ArrowRightIcon /></>
                    )}
                  </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#F0F0F0]" />
                  <span className="text-[12px] text-[#9CA3AF]">or</span>
                  <div className="h-px flex-1 bg-[#F0F0F0]" />
                </div>

                <p className="text-center text-[14px] text-[#6D6D6D]">
                  Already registered?{" "}
                  <Link
                    href={isCheckout ? "/login?redirect=/checkout/shipping" : "/login"}
                    className="font-semibold text-[#111827] hover:text-[#28DC4F]"
                  >
                    Log in
                  </Link>
                </p>
              </>
            )}

            {/* ════════════════════════════════════════════ STEP 2 — Verify */}
            {step === "verify" && (
              <>
                {/* Mail icon */}
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
                  {/* OTP boxes */}
                  <OtpBoxes otp={otp} onChange={setOtp} inputRefs={otpRefs} />

                  {/* Expiry hint */}
                  <p className="text-center text-[12px] text-[#9CA3AF]">Code expires in <span className="font-medium text-[#111827]">10 minutes</span></p>

                  {/* Verify button */}
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
                      <>Verify Email <ArrowRightIcon /></>
                    )}
                  </button>
                </form>

                {/* Resend + Change email */}
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
                    Change Email Address
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
