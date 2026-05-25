"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import authService from "@/services/authService";

/* ─── blurred shipping-page background ───────────────────────── */

function AuthBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Ambient color blobs */}
      <div style={{ position:"absolute", top:"-8%", left:"10%",  width:"45%", height:"55%", borderRadius:"50%", background:"rgba(40,220,79,0.07)",  filter:"blur(90px)" }} />
      <div style={{ position:"absolute", bottom:"-5%", right:"8%", width:"40%", height:"50%", borderRadius:"50%", background:"rgba(99,102,241,0.06)", filter:"blur(100px)" }} />
      <div style={{ position:"absolute", top:"40%", right:"25%", width:"30%", height:"35%", borderRadius:"50%", background:"rgba(251,191,36,0.04)",   filter:"blur(80px)" }} />

      {/* ── Left column — form card ── */}
      <div style={{ position:"absolute", left:"5%", top:"8%", width:"43%", height:"76%", background:"rgba(255,255,255,0.55)", borderRadius:"20px" }} />
      {/* Breadcrumb + steps */}
      <div style={{ position:"absolute", left:"8%", top:"11%", width:"14%", height:"8px", background:"rgba(0,0,0,0.07)", borderRadius:"5px" }} />
      <div style={{ position:"absolute", left:"8%", top:"15%", display:"flex", gap:"6px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width:"28px", height:"28px", borderRadius:"50%", background: i===0 ? "rgba(40,220,79,0.25)" : "rgba(0,0,0,0.06)" }} />
        ))}
      </div>
      {/* Form title */}
      <div style={{ position:"absolute", left:"8%", top:"22%", width:"20%", height:"10px", background:"rgba(0,0,0,0.09)", borderRadius:"5px" }} />
      {/* Name row */}
      <div style={{ position:"absolute", left:"8%",  top:"27%", width:"19%", height:"36px", background:"rgba(0,0,0,0.05)", borderRadius:"10px" }} />
      <div style={{ position:"absolute", left:"28%", top:"27%", width:"17%", height:"36px", background:"rgba(0,0,0,0.05)", borderRadius:"10px" }} />
      {/* Single inputs */}
      {[33,40,47,54].map((t,i) => (
        <div key={i} style={{ position:"absolute", left:"8%", top:`${t}%`, width:"37%", height:"36px", background:"rgba(0,0,0,0.05)", borderRadius:"10px" }} />
      ))}
      {/* CTA block */}
      <div style={{ position:"absolute", left:"8%", top:"63%", width:"37%", height:"44px", background:"rgba(40,220,79,0.18)", borderRadius:"12px" }} />

      {/* ── Right column — order summary card ── */}
      <div style={{ position:"absolute", right:"5%", top:"8%", width:"29%", height:"62%", background:"rgba(255,255,255,0.55)", borderRadius:"20px" }} />
      {/* Summary title */}
      <div style={{ position:"absolute", right:"8%", top:"12%", width:"11%", height:"8px", background:"rgba(0,0,0,0.08)", borderRadius:"5px" }} />
      {/* Product row */}
      <div style={{ position:"absolute", right:"23%", top:"17%", width:"7%",  height:"38px", background:"rgba(0,0,0,0.06)", borderRadius:"8px" }} />
      <div style={{ position:"absolute", right:"8%",  top:"17%", width:"13%", height:"7px",  background:"rgba(0,0,0,0.07)", borderRadius:"4px" }} />
      <div style={{ position:"absolute", right:"8%",  top:"21%", width:"9%",  height:"5px",  background:"rgba(0,0,0,0.05)", borderRadius:"4px" }} />
      {/* Price rows */}
      {[29,34,39].map((t,i) => (
        <div key={i} style={{ position:"absolute", right:"8%", top:`${t}%`, width:"21%", height:"5px", background:"rgba(0,0,0,0.05)", borderRadius:"4px" }} />
      ))}
      {/* Total */}
      <div style={{ position:"absolute", right:"8%", top:"46%", width:"21%", height:"9px", background:"rgba(0,0,0,0.09)", borderRadius:"5px" }} />
      {/* Trust badges */}
      <div style={{ position:"absolute", right:"5%", top:"55%", width:"29%", height:"13%", background:"rgba(240,240,240,0.5)", borderRadius:"12px" }} />
    </div>
  );
}

/* ─── icons ──────────────────────────────────────────────────── */

const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="9" cy="9" rx="8" ry="5.5" />
    <circle cx="9" cy="9" r="2.5" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 2.5l13 13" />
    <path d="M7.2 3.8A9 9 0 0 1 9 3.5c5 0 7.5 5.5 7.5 5.5a13 13 0 0 1-2.2 3" />
    <path d="M11.5 14a9 9 0 0 1-2.5.5C4 14.5 1.5 9 1.5 9A13 13 0 0 1 4 5.5" />
    <path d="M7 9.5a2.5 2.5 0 0 0 3.3 2.2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" />
  </svg>
);

/* ─── modal logo ─────────────────────────────────────────────── */

function ModalLogo() {
  return (
    <div className="flex items-center justify-center gap-[10px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo.svg" alt="TapMe" width={32} height={32} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logo-text.svg" alt="TAPME LABS" style={{ height: 13 }} />
    </div>
  );
}

/* ─── input field ────────────────────────────────────────────── */

function Field({ label, id, rightSlot, ...props }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={id} className="text-[14px] font-medium text-[#1E1E1E]">{label}</label>
      <div className="relative flex items-center">
        <input
          id={id}
          className="w-full rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] px-4 py-[14px] text-[14px] text-[#1E1E1E] outline-none transition-all placeholder:text-[#AEAEAE] focus:border-[#28DC4F] focus:bg-white focus:ring-2 focus:ring-[#28DC4F]/15"
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-3">{rightSlot}</div>
        )}
      </div>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function LoginPage() {
  const router = useRouter();

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [redirectTo,   setRedirectTo]   = useState("/dashboard");

  // Read ?redirect= from the URL without useSearchParams (no Suspense needed)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dest = params.get("redirect");
    if (dest) setRedirectTo(dest);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.login({ email, password });
      const { token, user } = result.data;

      // Only customers may log in here; admins use the admin panel.
      if (user?.role !== "customer") {
        throw new Error("Access denied. Please use the admin panel to log in.");
      }

      authService.saveSession(token, user);
      router.push(redirectTo);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="relative flex flex-1 flex-col">
        {/* Shipping-page decoration behind blur */}
        <div className="absolute inset-0 bg-[#F2F4F7]">
          <AuthBackground />
        </div>

        {/* Blur overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[8px]" />

        {/* Centered modal */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.13)] sm:p-8">

            {/* Logo */}
            <ModalLogo />

            {/* Title */}
            <div className="mt-5 text-center">
              <h1 className="text-[20px] font-bold text-[#111827] sm:text-[22px]">Welcome Back!</h1>
              <p className="mt-1 text-[13px] text-[#6D6D6D]">Sign in to your TapMe account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
              <Field
                label="Email Address"
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Field
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: "44px" }}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[#9CA3AF] transition-colors hover:text-[#111827]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                }
              />

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-[13px] font-medium text-[#28DC4F] transition-opacity hover:opacity-75"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: "#28DC4F" }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" style={{ animationDuration:"0.75s" }} width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <circle cx="8.5" cy="8.5" r="6.5" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                      <circle cx="8.5" cy="8.5" r="6.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 26" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>Log In <ArrowRightIcon /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#F0F0F0]" />
              <span className="text-[12px] text-[#9CA3AF]">or</span>
              <div className="h-px flex-1 bg-[#F0F0F0]" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-[14px] text-[#6D6D6D]">
              New User?{" "}
              <Link
                href={redirectTo === "/dashboard" ? "/register" : `/register?redirect=${encodeURIComponent(redirectTo)}`}
                className="font-semibold text-[#111827] transition-colors hover:text-[#28DC4F]"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
