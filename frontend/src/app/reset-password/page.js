"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import api from "@/services/api";

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

const ArrowLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.25 9H3.75M8.25 13.5 3.75 9l4.5-4.5" />
  </svg>
);

const LockIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="26" fill="#28DC4F" fillOpacity="0.10" />
    <circle cx="26" cy="26" r="18" fill="#28DC4F" fillOpacity="0.14" />
    <rect x="17" y="25" width="18" height="13" rx="2.5" fill="none" stroke="#28DC4F" strokeWidth="1.6" />
    <path d="M20 25v-4a6 6 0 0 1 12 0v4" stroke="#28DC4F" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="26" cy="31.5" r="1.5" fill="#28DC4F" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="26" fill="#28DC4F" fillOpacity="0.10" />
    <circle cx="26" cy="26" r="18" fill="#28DC4F" fillOpacity="0.14" />
    <circle cx="26" cy="26" r="10" fill="none" stroke="#28DC4F" strokeWidth="1.6" />
    <path d="M22 26l2.5 2.5 4.5-5" stroke="#28DC4F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

export default function ResetPasswordPage() {
  const router = useRouter();

  const [token,           setToken]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [done,            setDone]            = useState(false);
  const [tokenMissing,    setTokenMissing]    = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setTokenMissing(true);
    } else {
      setToken(t);
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, password, confirmPassword]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="relative flex flex-1 flex-col">
        <div className="absolute inset-0 bg-[#F2F4F7]" />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[8px]" />

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.13)]">

            <ModalLogo />

            {/* ── Invalid / missing token ── */}
            {tokenMissing && (
              <div className="mt-6 flex flex-col items-center text-center">
                <p className="text-[15px] text-[#374151]">This reset link is invalid or has expired.</p>
                <Link
                  href="/forgot-password"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-semibold text-white"
                  style={{ background: "#28DC4F" }}
                >
                  Request a new link
                </Link>
              </div>
            )}

            {/* ── Success ── */}
            {!tokenMissing && done && (
              <>
                <div className="mt-5 flex flex-col items-center text-center">
                  <CheckCircleIcon />
                  <h1 className="mt-4 text-[22px] font-bold text-[#111827]">Password Updated!</h1>
                  <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-[#6D6D6D]">
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "#28DC4F" }}
                >
                  Log In <ArrowRightIcon />
                </Link>
              </>
            )}

            {/* ── Form ── */}
            {!tokenMissing && !done && (
              <>
                <div className="mt-5 flex flex-col items-center text-center">
                  <LockIcon />
                  <h1 className="mt-4 text-[22px] font-bold text-[#111827]">Set New Password</h1>
                  <p className="mt-1 max-w-[300px] text-[14px] leading-relaxed text-[#6D6D6D]">
                    Choose a strong password — at least 8 characters.
                  </p>
                </div>

                {error && (
                  <div className="mt-4 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                  {/* New password */}
                  <div className="flex flex-col gap-[6px]">
                    <label htmlFor="password" className="text-[14px] font-medium text-[#1E1E1E]">New Password</label>
                    <div className="relative flex items-center">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        style={{ paddingRight: "44px" }}
                        className="w-full rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] px-4 py-[14px] text-[14px] text-[#1E1E1E] outline-none transition-all placeholder:text-[#AEAEAE] focus:border-[#28DC4F] focus:bg-white focus:ring-2 focus:ring-[#28DC4F]/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 text-[#9CA3AF] transition-colors hover:text-[#111827]"
                      >
                        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="flex flex-col gap-[6px]">
                    <label htmlFor="confirmPassword" className="text-[14px] font-medium text-[#1E1E1E]">Confirm Password</label>
                    <div className="relative flex items-center">
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Repeat your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        style={{ paddingRight: "44px" }}
                        className="w-full rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] px-4 py-[14px] text-[14px] text-[#1E1E1E] outline-none transition-all placeholder:text-[#AEAEAE] focus:border-[#28DC4F] focus:bg-white focus:ring-2 focus:ring-[#28DC4F]/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 text-[#9CA3AF] transition-colors hover:text-[#111827]"
                      >
                        {showConfirm ? <EyeClosedIcon /> : <EyeOpenIcon />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[15px] font-semibold text-black transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: "#28DC4F" }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" style={{ animationDuration: "0.75s" }} width="17" height="17" viewBox="0 0 17 17" fill="none">
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5" />
                          <circle cx="8.5" cy="8.5" r="6.5" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 26" />
                        </svg>
                        Resetting...
                      </>
                    ) : (
                      <>Reset Password <ArrowRightIcon /></>
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

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
