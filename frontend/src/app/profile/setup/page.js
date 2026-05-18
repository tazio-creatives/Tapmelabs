"use client";

import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

/* ─── NFC card illustration ──────────────────────────────────── */

function NfcCardIllustration() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "240px",
        aspectRatio: "460 / 276",
        borderRadius: "12px",
        background: "linear-gradient(135deg,#18181B 0%,#302B63 60%,#24243E 100%)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
      }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 75% 20%,rgba(40,220,79,0.12) 0%,transparent 55%)" }} />
      {/* Rings */}
      {[80, 120, 160].map((sz, i) => (
        <div key={i} className="pointer-events-none absolute rounded-full"
          style={{ width: sz, height: sz, bottom: -sz / 2, right: -sz / 2, border: "1px solid rgba(255,255,255,0.06)" }} />
      ))}
      {/* Logo */}
      <div className="absolute left-3 top-3 flex items-center gap-[5px]">
        <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
          <path d="M1.875 30.199C1.875 25.3665 5.79251 21.449 10.625 21.449H23.4375C25.6812 21.449 27.5 19.6301 27.5 17.3865C27.5 15.1428 25.6812 13.324 23.4375 13.324H4.0625V8.94897H23.4375C28.0974 8.94897 31.875 12.7266 31.875 17.3865C31.875 22.0464 28.0974 25.824 23.4375 25.824H10.625C8.20875 25.824 6.25 27.7827 6.25 30.199V31.449H1.875V30.199Z" fill="white" />
          <path d="M34.2477 8.75089C36.6257 10.8686 38.1256 13.9518 38.1256 17.3866C38.1256 21.028 36.4401 24.2741 33.8092 26.3935L30.192 24.3046C32.6785 22.9974 34.3756 20.3908 34.3756 17.3866C34.3756 14.605 32.9203 12.1644 30.7311 10.7802L34.2477 8.75089Z" fill="#28DC4F" />
          <circle cx="23.125" cy="17.5" r="1.875" fill="#28DC4F" />
        </svg>
        <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.15em" }}>TAPME</span>
      </div>
      {/* Name placeholder */}
      <div className="absolute bottom-3 left-3">
        <div className="h-[8px] w-[80px] rounded-full bg-white/30" />
        <div className="mt-[4px] h-[5px] w-[55px] rounded-full bg-white/15" />
      </div>
      {/* NFC arc */}
      <div className="absolute right-3 top-3">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M4 2C8.4 2 12.4 3.87 15.31 6.87" stroke="rgba(255,255,255,0.3)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6.5 6.5C9.12 6.5 11.5 7.57 13.22 9.37" stroke="rgba(255,255,255,0.3)" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="10" cy="13" r="2" fill="rgba(255,255,255,0.3)" />
        </svg>
      </div>
    </div>
  );
}

/* ─── feature list ───────────────────────────────────────────── */

const FEATURES = [
  { label: "Share your contact in one tap" },
  { label: "Add social links, website & portfolio" },
  { label: "Showcase your business details" },
  { label: "Customise your digital profile theme" },
];

function CheckIcon() {
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: "#28DC4F" }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function ProfileSetupPage() {
  return (
    <>
      <Header />

      <main className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-[#F9F9F9] px-4 py-16">
        <div className="w-full max-w-[460px] rounded-[24px] border border-[#F0F0F0] bg-white p-8 shadow-[0_8px_40px_rgba(0,0,0,0.07)] text-center">

          {/* Illustration */}
          <div className="flex justify-center">
            <NfcCardIllustration />
          </div>

          {/* Success badge */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-[6px]">
            <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#28DC4F]" />
            <span className="text-[12px] font-semibold text-[#059669]">Order Confirmed</span>
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-[24px] font-bold leading-snug text-[#111827]">
            Set Up Your Digital Profile
          </h1>
          <p className="mt-2 text-[14px] leading-[1.65] text-[#6D6D6D]">
            Your NFC card is being prepared. While you wait, complete your digital profile so people can connect with you the moment they tap your card.
          </p>

          {/* Feature list */}
          <ul className="mt-5 flex flex-col gap-3 text-left">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <CheckIcon />
                <span className="text-[14px] text-[#374151]">{f.label}</span>
              </li>
            ))}
          </ul>

          <div className="my-6 h-px bg-[#F0F0F0]" />

          {/* CTAs */}
          <Link
            href="/dashboard/profile/setup"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            style={{ background: "#28DC4F" }}
          >
            Setup Profile Now
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            href="/dashboard"
            className="mt-3 flex w-full items-center justify-center rounded-[12px] border border-[#EBEBEB] py-[13px] text-[14px] font-medium text-[#6D6D6D] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F]"
          >
            Do it Later
          </Link>

          <p className="mt-4 text-[12px] text-[#9CA3AF]">
            You can always set up your profile from the Dashboard.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
