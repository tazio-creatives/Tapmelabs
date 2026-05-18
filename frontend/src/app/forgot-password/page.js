"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

/* ─── blurred background ─────────────────────────────────────── */

function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div style={{ position:"absolute", top:"-8%", left:"10%",  width:"45%", height:"55%", borderRadius:"50%", background:"rgba(40,220,79,0.07)",  filter:"blur(90px)" }} />
      <div style={{ position:"absolute", bottom:"-5%", right:"8%", width:"40%", height:"50%", borderRadius:"50%", background:"rgba(99,102,241,0.06)", filter:"blur(100px)" }} />
      <div style={{ position:"absolute", top:"40%", right:"25%", width:"30%", height:"35%", borderRadius:"50%", background:"rgba(251,191,36,0.04)",   filter:"blur(80px)" }} />

      <div style={{ position:"absolute", left:"5%", top:"8%", width:"43%", height:"76%", background:"rgba(255,255,255,0.55)", borderRadius:"20px" }} />
      <div style={{ position:"absolute", left:"8%", top:"13%", width:"14%", height:"8px",  background:"rgba(0,0,0,0.07)", borderRadius:"5px" }} />
      <div style={{ position:"absolute", left:"8%", top:"17%", display:"flex", gap:"6px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:"28px", height:"28px", borderRadius:"50%", background: i===1 ? "rgba(40,220,79,0.25)" : "rgba(0,0,0,0.06)" }} />
        ))}
      </div>
      {[23,30,37,44,51,60].map((t,i) => (
        <div key={i} style={{ position:"absolute", left:"8%", top:`${t}%`, width: i < 2 ? "19%" : "37%", height:"36px", background:"rgba(0,0,0,0.05)", borderRadius:"10px", marginLeft: i === 1 ? "20%" : 0 }} />
      ))}
      <div style={{ position:"absolute", left:"8%", top:"69%", width:"37%", height:"44px", background:"rgba(40,220,79,0.18)", borderRadius:"12px" }} />
      <div style={{ position:"absolute", right:"5%", top:"8%", width:"29%", height:"60%", background:"rgba(255,255,255,0.55)", borderRadius:"20px" }} />
      {[12,17,22,29,34,39,46].map((t,i) => (
        <div key={i} style={{ position:"absolute", right:"8%", top:`${t}%`, width: i===0 ? "11%" : "21%", height: i===0 ? "8px" : "5px", background:"rgba(0,0,0,0.06)", borderRadius:"5px" }} />
      ))}
      <div style={{ position:"absolute", right:"5%", top:"55%", width:"29%", height:"13%", background:"rgba(240,240,240,0.5)", borderRadius:"12px" }} />
    </div>
  );
}

/* ─── icons ──────────────────────────────────────────────────── */

const ArrowRightIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.25 9H3.75M8.25 13.5 3.75 9l4.5-4.5" />
  </svg>
);

const KeyIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="26" fill="#28DC4F" fillOpacity="0.10" />
    <circle cx="26" cy="26" r="18" fill="#28DC4F" fillOpacity="0.14" />
    <circle cx="22" cy="22" r="6" stroke="#28DC4F" strokeWidth="1.6" fill="none" />
    <path d="M26.2 26.2L34 34" stroke="#28DC4F" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M31 31l2.5 1.5M33 29l1.5 2.5" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MailCheckIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="26" fill="#28DC4F" fillOpacity="0.10" />
    <circle cx="26" cy="26" r="18" fill="#28DC4F" fillOpacity="0.14" />
    <rect x="13" y="18" width="26" height="16" rx="3" fill="none" stroke="#28DC4F" strokeWidth="1.5" />
    <path d="M13 21l13 8 13-8" stroke="#28DC4F" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="36" cy="34" r="5" fill="white" />
    <circle cx="36" cy="34" r="5" fill="#28DC4F" />
    <path d="M33.5 34l1.5 1.5 2.5-2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── modal logo ─────────────────────────────────────────────── */

function ModalLogo() {
  return (
    <div className="flex items-center justify-center gap-[8px]">
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <path d="M1.875 30.199C1.875 25.3665 5.79251 21.449 10.625 21.449H23.4375C25.6812 21.449 27.5 19.6301 27.5 17.3865C27.5 15.1428 25.6812 13.324 23.4375 13.324H4.0625V8.94897H23.4375C28.0974 8.94897 31.875 12.7266 31.875 17.3865C31.875 22.0464 28.0974 25.824 23.4375 25.824H10.625C8.20875 25.824 6.25 27.7827 6.25 30.199V31.449H1.875V30.199Z" fill="#18181B" />
        <path d="M34.2477 8.75089C36.6257 10.8686 38.1256 13.9518 38.1256 17.3866C38.1256 21.028 36.4401 24.2741 33.8092 26.3935L30.192 24.3046C32.6785 22.9974 34.3756 20.3908 34.3756 17.3866C34.3756 14.605 32.9203 12.1644 30.7311 10.7802L34.2477 8.75089Z" fill="#28DC4F" />
        <circle cx="23.125" cy="17.5" r="1.875" fill="#28DC4F" />
      </svg>
      <span className="text-[20px] font-semibold text-[#18181B]">Tap<span className="text-[#28DC4F]">Me</span></span>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function ForgotPasswordPage() {
  /* step: "request" | "sent" */
  const [step,    setStep]    = useState("request");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);

    try {
      /*
       * ─────────────────────────────────────────────────────────
       * TODO: Forgot Password API integration
       *
       * const res = await fetch("/api/auth/forgot-password", {
       *   method: "POST",
       *   headers: { "Content-Type": "application/json" },
       *   body: JSON.stringify({ email }),
       * });
       * const data = await res.json();
       * if (!res.ok) throw new Error(data.message || "Failed to send reset link");
       * // Advance to "sent" confirmation step
       * ─────────────────────────────────────────────────────────
       */
      await new Promise((r) => setTimeout(r, 1200)); // remove when API is connected
      setStep("sent");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.13)]">

            <ModalLogo />

            {/* ════════════════════ STEP 1 — Request */}
            {step === "request" && (
              <>
                <div className="mt-5 flex flex-col items-center text-center">
                  <KeyIcon />
                  <h1 className="mt-4 text-[22px] font-bold text-[#111827]">Forgot Password?</h1>
                  <p className="mt-1 max-w-[300px] text-[14px] leading-relaxed text-[#6D6D6D]">
                    No worries! Enter your registered email and we&apos;ll send you a reset link.
                  </p>
                </div>

                {error && (
                  <div className="mt-4 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                  {/* Email */}
                  <div className="flex flex-col gap-[6px]">
                    <label htmlFor="email" className="text-[14px] font-medium text-[#1E1E1E]">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full rounded-[10px] border border-[#EBEBEB] bg-[#FAFAFA] px-4 py-[13px] text-[14px] text-[#1E1E1E] outline-none transition-all placeholder:text-[#AEAEAE] focus:border-[#28DC4F] focus:bg-white focus:ring-2 focus:ring-[#28DC4F]/15"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: "#28DC4F" }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" style={{ animationDuration:"0.75s" }} width="17" height="17" viewBox="0 0 17 17" fill="none">
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 26" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>Send Reset Link <ArrowRightIcon /></>
                    )}
                  </button>
                </form>

                <div className="mt-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#F0F0F0]" />
                  <span className="text-[12px] text-[#9CA3AF]">remember it?</span>
                  <div className="h-px flex-1 bg-[#F0F0F0]" />
                </div>

                <Link
                  href="/login"
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#EBEBEB] py-[13px] text-[14px] font-semibold text-[#111827] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F]"
                >
                  <ArrowLeftIcon />
                  Back to Login
                </Link>
              </>
            )}

            {/* ════════════════════ STEP 2 — Sent */}
            {step === "sent" && (
              <>
                <div className="mt-5 flex flex-col items-center text-center">
                  <MailCheckIcon />
                  <h1 className="mt-4 text-[22px] font-bold text-[#111827]">Check your Email</h1>
                  <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-[#6D6D6D]">
                    We&apos;ve sent a password reset link to
                  </p>
                  <p className="mt-[3px] text-[14px] font-semibold text-[#28DC4F]">{email}</p>
                  <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-[#9CA3AF]">
                    Click the link in the email to reset your password. The link expires in <span className="font-medium text-[#111827]">15 minutes</span>.
                  </p>
                </div>

                {/* Checklist */}
                <div className="mt-6 flex flex-col gap-[10px] rounded-[12px] bg-[#F9F9F9] px-4 py-4">
                  {[
                    "Check your inbox and spam folder.",
                    "Click the \"Reset Password\" link in the email.",
                    "Create a new strong password.",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-white"
                        style={{ background: "#28DC4F", fontSize: "10px", fontWeight: 700 }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[13px] leading-relaxed text-[#4B5563]">{tip}</span>
                    </div>
                  ))}
                </div>

                {/* Resend */}
                <div className="mt-5 text-center">
                  <span className="text-[13px] text-[#6D6D6D]">Didn&apos;t receive it? </span>
                  <button
                    type="button"
                    onClick={() => {
                      /*
                       * TODO: Resend reset link API call
                       * await fetch("/api/auth/forgot-password", { method: "POST", ... });
                       */
                    }}
                    className="text-[13px] font-semibold text-[#111827] transition-colors hover:text-[#28DC4F]"
                  >
                    Resend email
                  </button>
                </div>

                <Link
                  href="/login"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#EBEBEB] py-[13px] text-[14px] font-semibold text-[#111827] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F]"
                >
                  <ArrowLeftIcon />
                  Back to Login
                </Link>
              </>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
