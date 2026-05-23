"use client";

import Image from "next/image";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ProductCards from "@/components/landing/ProductCards";
import Testimonials from "@/components/landing/Testimonials";
import ScrollReveal from "@/components/ScrollReveal";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DESIGN TOKENS  (logo: black #000000 + green #28DC4F)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const G  = "#28DC4F";          // brand green
const BK = "#000000";          // logo black
const W  = "#FFFFFF";
const T1 = "#111827";          // primary text
const T2 = "#6B7280";          // secondary text
const T3 = "#9CA3AF";          // muted text
const BG = "#F9FAFB";          // light section bg

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SHARED ATOMS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ArrowRight = ({ color = "currentColor" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SectionLabel({ children, light = false }) {
  return (
    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: G }}>
      {children}
    </p>
  );
}

function GreenBtn({ href = "#", children }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-full px-7 py-[13px] text-[14px] font-semibold text-black transition-opacity hover:opacity-85" style={{ background: G }}>
      {children}
    </a>
  );
}

function OutlineBtn({ href = "#", dark = false, children }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-full border px-7 py-[13px] text-[14px] font-semibold transition-colors"
      style={{ borderColor: dark ? "#2A2A2A" : "#E5E7EB", color: dark ? W : T1 }}>
      {children}
    </a>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   1. HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Hero() {
  const badges = [
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="2.5" y="1" width="10" height="13" rx="2" stroke={G} strokeWidth="1.3"/>
          <path d="M5.5 5h4M5.5 7.5h4M5.5 10h2.5" stroke={G} strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      ),
      text: "No App Required",
    },
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="3" y="1.5" width="9" height="12" rx="2" stroke={G} strokeWidth="1.3"/>
          <circle cx="7.5" cy="10" r="1.2" fill={G}/>
          <path d="M5.5 4h4" stroke={G} strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
      ),
      text: "Works with All Smartphones",
    },
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="6" stroke={G} strokeWidth="1.3"/>
          <path d="M5 7.5l2 2L10 5.5" stroke={G} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      text: "One-time Setup",
    },
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M2.5 7.5c0-2.76 2.24-5 5-5 1.6 0 3.02.76 3.92 1.95" stroke={G} strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M12.5 7.5c0 2.76-2.24 5-5 5-1.6 0-3.02-.76-3.92-1.95" stroke={G} strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M11 4V2h2M4 11v2H2" stroke={G} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      text: "Update Anytime",
    },
  ];

  return (
    <section id="home" className="relative overflow-hidden" style={{ background: "#060E08" }}>
      {/* ── Large green radial glow — right half ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: `radial-gradient(ellipse 70% 80% at 78% 45%, ${G}2E 0%, ${G}12 30%, transparent 65%)`,
      }} />
      {/* ── Subtle bottom-left glow ── */}
      <div className="pointer-events-none absolute" style={{
        bottom: -100, left: -60, width: 480, height: 480,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${G}0C 0%, transparent 65%)`,
      }} />
      {/* ── Thin green swirl lines (hero-bg-pattern) ── */}
      <Image
        src="/images/hero-bg-pattern.svg"
        alt=""
        aria-hidden="true"
        width={860}
        height={860}
        className="pointer-events-none absolute opacity-[0.12]"
        style={{ right: -180, top: -60, width: 860, height: 860 }}
      />

      <div className="relative mx-auto flex min-h-[680px] w-full max-w-[1440px] flex-col items-center justify-between gap-8 px-5 py-16 md:flex-row md:px-[120px]">

        {/* ── Left ── */}
        <div className="w-full max-w-[510px] shrink-0">
          <h1 style={{ fontSize: "clamp(36px,3.8vw,54px)", fontWeight: 800, lineHeight: 1.14, color: W }}>
            Smart NFC<br />
            <span style={{ color: G }}>Business Cards</span><br />
            for Modern<br />
            Professionals
          </h1>

          <p className="mt-5 text-[15px] leading-[26px]" style={{ color: "#8FA89A", maxWidth: 420 }}>
            Share your profile, contact details, social links, portfolio, and business information instantly with one tap. No app required.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {/* Primary CTA */}
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-full px-6 py-[13px] text-[14px] font-semibold text-black transition-opacity hover:opacity-90"
              style={{ background: G }}
            >
              Design Your Card
              <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,0.18)" }}>
                <ArrowRight color={BK} />
              </span>
            </a>
            {/* Secondary CTA */}
            <a
              href="#products-v2"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-[13px] text-[14px] font-semibold transition-colors hover:border-white/40"
              style={{ borderColor: "rgba(255,255,255,0.22)", color: W }}
            >
              View Products
            </a>
          </div>

          {/* Trust badges — horizontal single row */}
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {badges.map((b) => (
              <div key={b.text} className="flex items-center gap-[6px]">
                <span className="shrink-0">{b.icon}</span>
                <span className="text-[12px] font-medium" style={{ color: "#8FA89A" }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: NFC card + phone mockup ── */}
        <div className="relative flex h-[460px] w-full max-w-[600px] shrink-0 items-center justify-center md:h-[560px]">

          {/* Green glow ring behind visuals */}
          <div className="pointer-events-none absolute" style={{
            width: 440, height: 440, borderRadius: "50%",
            background: `radial-gradient(circle, ${G}20 0%, transparent 65%)`,
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />

          {/* NFC Card — rotated, center-left */}
          <div
            className="absolute drop-shadow-2xl"
            style={{
              top: "50%", left: "12%",
              transform: "translate(0%, -52%) rotate(-8deg)",
              zIndex: 10,
              filter: "drop-shadow(0 20px 40px rgba(40,220,79,0.18))",
            }}
          >
            <Image
              src="/images/card1.svg"
              alt="TapMe NFC business card"
              width={310}
              height={246}
              style={{ width: 310, height: "auto" }}
            />
          </div>

          {/* "Tap to Share" label + curved arrow */}
          <div
            className="absolute z-30 flex flex-col items-center gap-[3px]"
            style={{ top: "18%", left: "43%", transform: "translateX(-50%)" }}
          >
            <span className="text-[11px] font-semibold tracking-wide" style={{ color: G }}>Tap to Share</span>
            {/* Curved arrow pointing right-down toward phone */}
            <svg width="56" height="34" viewBox="0 0 56 34" fill="none" style={{ transform: "scaleX(-1)" }}>
              <path d="M52 4 Q28 4 8 26" stroke={G} strokeWidth="1.5" strokeDasharray="3.5 2.5" fill="none" strokeLinecap="round"/>
              <path d="M4 22l4 5 5-2" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Phone mockup — right side */}
          <div
            className="absolute"
            style={{
              top: "50%", right: "2%",
              transform: "translateY(-50%)",
              zIndex: 20,
              filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.55))",
            }}
          >
            <Image
              src="/images/hiw-step1-phone.png"
              alt="TapMe digital profile on phone"
              width={224}
              height={276}
              style={{ width: 224, height: "auto" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   2. STATS BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function StatsBar() {
  const stats = [
    {
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="10" r="4" stroke={G} strokeWidth="1.8"/><path d="M6 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke={G} strokeWidth="1.8" strokeLinecap="round"/></svg>,
      value: "10,000+", label: "Happy Customers",
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="8" width="20" height="14" rx="2" stroke={G} strokeWidth="1.8"/><path d="M4 13h20" stroke={G} strokeWidth="1.8"/><path d="M9 18h4" stroke={G} strokeWidth="1.8" strokeLinecap="round"/></svg>,
      value: "50,000+", label: "Cards Delivered",
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="9" stroke={G} strokeWidth="1.8"/><path d="M5 14h18M14 5c-2.5 3-4 5.5-4 9s1.5 6 4 9M14 5c2.5 3 4 5.5 4 9s-1.5 6-4 9" stroke={G} strokeWidth="1.5" strokeLinecap="round"/></svg>,
      value: "25+", label: "Countries Served",
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4l2.5 7.5H24l-6.5 4.5 2.5 7.5-6.5-4.5-6.5 4.5 2.5-7.5L4 11.5h7.5z" stroke={G} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
      value: "4.9/5", label: "Customer Rating",
    },
  ];

  return (
    <div style={{ background: W, borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0" }}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 px-5 md:grid-cols-4 md:px-[120px]">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2 py-9"
            style={{ borderRight: i < 3 ? "1px solid #EBEBEB" : "none" }}>
            {s.icon}
            <span className="text-[30px] font-extrabold" style={{ color: T1 }}>{s.value}</span>
            <span className="text-[13px]" style={{ color: T2 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   3. HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HowItWorks() {
  const steps = [
    {
      num: 1,
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="14" y="6" width="16" height="26" rx="3" stroke={G} strokeWidth="1.8"/>
          <path d="M18 10h8M18 14h5" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="22" cy="26" r="1.5" fill={G}/>
          <path d="M10 36c1.5-4 6-7 12-7s10.5 3 12 7" stroke={G} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      title: "Tap the Card",
      desc: "Tap your TapMe card on any NFC-enabled smartphone. Works instantly.",
    },
    {
      num: 2,
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="8" y="4" width="28" height="36" rx="3" stroke={G} strokeWidth="1.8"/>
          <circle cx="22" cy="18" r="5" stroke={G} strokeWidth="1.8"/>
          <path d="M12 32c1-5 5-8 10-8s9 3 10 8" stroke={G} strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M17 9h10" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      title: "Open Digital Profile",
      desc: "Your digital profile opens instantly with all your details and links.",
    },
    {
      num: 3,
      icon: (
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M22 6l3 9h9.5l-7.7 5.5 2.9 9-7.7-5.6-7.7 5.6 2.9-9L9.5 15H19z" stroke={G} strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M16 34l6 5 6-5" stroke={G} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="22" y1="39" x2="22" y2="31" stroke={G} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      ),
      title: "Save / Share Contact",
      desc: "They can save your contact or share it with anyone in one tap.",
    },
  ];

  return (
    <section style={{ background: BG }} className="px-5 py-20 md:px-[120px]">
      <div className="mx-auto max-w-[1440px]">
        <ScrollReveal className="text-center">
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <h2 className="text-[36px] font-bold" style={{ color: T1 }}>
            Three <span style={{ color: G }}>Simple</span> Steps
          </h2>
        </ScrollReveal>

        <div className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 100} className="relative">
              {/* Dashed connector arrow */}
              {i < 2 && (
                <div className="absolute -right-[22px] top-[56px] z-10 hidden md:flex items-center">
                  <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
                    <path d="M2 10 Q22 2 42 10" stroke={G} strokeWidth="1.4" strokeDasharray="4 3" fill="none"/>
                    <path d="M36 6l6 4-6 4" stroke={G} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              <div className="flex flex-col items-center rounded-[22px] bg-white px-8 py-10 text-center"
                style={{ border: "1px solid #EBEBEB", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                {/* Green circle number */}
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full text-[16px] font-bold text-black"
                  style={{ background: G }}>
                  {step.num}
                </div>
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-[18px] font-bold" style={{ color: T1 }}>{step.title}</h3>
                <p className="mt-2 text-[14px] leading-[22px]" style={{ color: T2 }}>{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   4. SEE IN ACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SeeInAction() {
  const features = [
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={G} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
      title: "Instant Sharing", desc: "Share your details within seconds.",
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke={G} strokeWidth="1.6"/><circle cx="12" cy="17" r="1.2" fill={G}/></svg>,
      title: "No App Needed", desc: "Works directly on any smartphone.",
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 12c0-3.87 3.13-7 7-7 2.3 0 4.34 1.1 5.63 2.82" stroke={G} strokeWidth="1.6" strokeLinecap="round"/><path d="M21 12c0 3.87-3.13 7-7 7-2.3 0-4.34-1.1-5.63-2.82" stroke={G} strokeWidth="1.6" strokeLinecap="round"/><path d="M15 7.5V5h2.5M9 16.5V19H6.5" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: "Always Updated", desc: "Change your profile anytime, instantly.",
    },
    {
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-8 4 4 4-6 4 10" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: "Better Follow-ups", desc: "Track views, taps, and saved contacts.",
    },
  ];

  return (
    <section style={{ background: W }} className="px-5 py-20 md:px-[120px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2">

          {/* Left */}
          <ScrollReveal>
            <SectionLabel>SEE IT IN ACTION</SectionLabel>
            <h2 className="text-[34px] font-bold leading-[1.2]" style={{ color: T1 }}>
              See How TapMe Works<br />
              <span style={{ color: G }}>in Real Life</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: T2 }}>
              Watch how one tap can instantly share your professional identity, portfolio, social links, and contact details.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full px-7 py-[13px] text-[14px] font-semibold text-black" style={{ background: G }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><polygon points="3,1.5 11.5,6.5 3,11.5" fill="black"/></svg>
                Watch Demo
              </button>
              <OutlineBtn href="/products">Create Your Card</OutlineBtn>
            </div>
          </ScrollReveal>

          {/* Right — video */}
          <ScrollReveal delay={120}>
            <div className="relative overflow-hidden rounded-[22px]"
              style={{ background: "#0E1117", aspectRatio: "16/9", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
              <Image src="/images/card1.svg" alt="demo" fill style={{ objectFit: "cover", opacity: 0.15 }} />
              {/* Green tint overlay */}
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${G}0A 0%, transparent 60%)` }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="flex h-[68px] w-[68px] items-center justify-center rounded-full shadow-xl transition-transform hover:scale-105"
                  style={{ background: W }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <polygon points="8,4 20,12 8,20" fill={G} />
                  </svg>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Feature chips row */}
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 70}>
              <div className="flex flex-col items-center gap-3 rounded-[16px] px-5 py-6 text-center"
                style={{ background: BG, border: "1px solid #EBEBEB" }}>
                {f.icon}
                <p className="text-[14px] font-semibold" style={{ color: T1 }}>{f.title}</p>
                <p className="text-[12px]" style={{ color: T3 }}>{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   5. MINI CRM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MiniCRM() {
  const features = [
    {
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke={G} strokeWidth="1.4"/><path d="M4 17c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke={G} strokeWidth="1.4" strokeLinecap="round"/></svg>,
      title: "Lead Capture", desc: "Automatically capture leads from every connection.",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v4M10 14v4M2 10h4M14 10h4" stroke={G} strokeWidth="1.4" strokeLinecap="round"/><circle cx="10" cy="10" r="3" stroke={G} strokeWidth="1.4"/></svg>,
      title: "Follow-up Tracking", desc: "Track follow-ups and never miss an opportunity.",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 6h16M2 10h10M2 14h7" stroke={G} strokeWidth="1.4" strokeLinecap="round"/></svg>,
      title: "Contact Management", desc: "Organize and manage all your business contacts.",
    },
    {
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 14l4-5 4 3 4-7 4 5" stroke={G} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: "Analytics", desc: "Get insights on views, taps, and saved contacts.",
    },
  ];

  return (
    <section style={{ background: BK }} className="px-5 py-20 md:px-[120px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2">

          {/* Left */}
          <ScrollReveal>
            <SectionLabel>MINI CRM</SectionLabel>
            <h2 className="text-[34px] font-bold leading-[1.2] text-white">
              Mini CRM for{" "}
              <span style={{ color: G }}>Smarter Networking</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: T3 }}>
              TapMe Labs is more than an NFC card. It helps you capture leads, manage contacts and track every interaction from your digital profile.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3 rounded-[14px] p-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="mt-0.5 shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{f.title}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: T3 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <GreenBtn href="/dashboard">
                Explore Mini CRM <ArrowRight color={BK} />
              </GreenBtn>
            </div>
          </ScrollReveal>

          {/* Right — dashboard image */}
          <ScrollReveal delay={120}>
            <div className="overflow-hidden rounded-[20px]"
              style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
              <Image src="/images/dashboard/mycard-full-content.png" alt="TapMe Dashboard" width={640} height={420} style={{ width: "100%", height: "auto" }} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   6. WHO CAN USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function WhoCanUse() {
  const audience = [
    { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="10" width="24" height="16" rx="2" stroke={G} strokeWidth="1.8"/><path d="M10 10V8a6 6 0 0 1 12 0v2" stroke={G} strokeWidth="1.8" strokeLinecap="round"/><path d="M16 17v4M13 19h6" stroke={G} strokeWidth="1.6" strokeLinecap="round"/></svg>, label: "Sales Professionals" },
    { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 4l2.5 7H26l-6 4.5 2.5 7L16 18l-6.5 4.5 2.5-7L6 11h7.5z" stroke={G} strokeWidth="1.8" strokeLinejoin="round"/></svg>, label: "Entrepreneurs & Founders" },
    { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="6" width="24" height="20" rx="2" stroke={G} strokeWidth="1.8"/><path d="M4 12h24M9 18h6M9 22h4" stroke={G} strokeWidth="1.6" strokeLinecap="round"/></svg>, label: "Freelancers" },
    { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 4C10.48 4 6 8.48 6 14c0 7.5 10 16 10 16s10-8.5 10-16c0-5.52-4.48-10-10-10z" stroke={G} strokeWidth="1.8"/><circle cx="16" cy="14" r="3" stroke={G} strokeWidth="1.6"/></svg>, label: "Real Estate Agents" },
    { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="12" cy="11" r="4" stroke={G} strokeWidth="1.8"/><circle cx="22" cy="11" r="4" stroke={G} strokeWidth="1.8"/><path d="M4 26c0-4 3.58-7 8-7M28 26c0-4-3.58-7-8-7M16 20c2.5 0 5 1 6 4" stroke={G} strokeWidth="1.6" strokeLinecap="round"/></svg>, label: "Consultants" },
    { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="6" y="10" width="20" height="16" rx="2" stroke={G} strokeWidth="1.8"/><path d="M11 10V8a5 5 0 0 1 10 0v2M16 17v3" stroke={G} strokeWidth="1.8" strokeLinecap="round"/></svg>, label: "Corporate Teams" },
    { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="12" r="4" stroke={G} strokeWidth="1.8"/><path d="M8 26c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke={G} strokeWidth="1.8" strokeLinecap="round"/><path d="M24 8l2 2-2 2M8 8 6 10l2 2" stroke={G} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: "Influencers & Creators" },
    { icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="18" rx="2" stroke={G} strokeWidth="1.8"/><path d="M4 14h24M10 6h12" stroke={G} strokeWidth="1.6" strokeLinecap="round"/><circle cx="16" cy="20" r="2.5" stroke={G} strokeWidth="1.6"/></svg>, label: "Event Networkers" },
  ];

  return (
    <section style={{ background: BG }} className="px-5 py-20 md:px-[120px]">
      <div className="mx-auto max-w-[1440px]">
        <ScrollReveal className="text-center">
          <SectionLabel>PERFECT FOR EVERYONE</SectionLabel>
          <h2 className="text-[36px] font-bold" style={{ color: T1 }}>
            Who Can Use TapMe?
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-8">
          {audience.map((a, i) => (
            <ScrollReveal key={a.label} delay={i * 55}>
              <div className="flex flex-col items-center gap-3 rounded-[18px] bg-white px-3 py-6 text-center transition-shadow hover:shadow-md"
                style={{ border: "1px solid #EBEBEB", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                {a.icon}
                <p className="text-[11px] font-semibold leading-tight" style={{ color: T1 }}>{a.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 text-center">
          <OutlineBtn href="/products">
            Explore Products <ArrowRight />
          </OutlineBtn>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   7. ANALYTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Analytics() {
  const points = [
    { label: "Real-time Insights",    desc: "See who viewed your profile and when." },
    { label: "Track Tap Performance", desc: "Monitor NFC taps, QR scans, and link clicks." },
    { label: "Manage Performance",    desc: "Analyse which links get the most engagement." },
  ];

  return (
    <section style={{ background: W }} className="px-5 py-20 md:px-[120px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-2">

          {/* Left — image */}
          <ScrollReveal>
            <div className="overflow-hidden rounded-[20px]" style={{ border: "1px solid #F0F0F0", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
              <Image src="/images/dashboard/mycard-left-panel.png" alt="Analytics" width={640} height={440} style={{ width: "100%", height: "auto" }} />
            </div>
          </ScrollReveal>

          {/* Right — text */}
          <ScrollReveal delay={100}>
            <SectionLabel>TRACK EVERY INTERACTION</SectionLabel>
            <h2 className="text-[34px] font-bold leading-[1.2]" style={{ color: T1 }}>
              Powerful Analytics for{" "}
              <span style={{ color: G }}>Better Connections</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: T2 }}>
              Know how people interact with your profile and make every connection more meaningful.
            </p>

            <div className="mt-7 flex flex-col gap-5">
              {points.map((p) => (
                <div key={p.label} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${G}1A` }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 10l3-4 3 2.5 3-5 3 4" stroke={G} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: T1 }}>{p.label}</p>
                    <p className="text-[13px]" style={{ color: T3 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <GreenBtn href="/dashboard">
                Explore Dashboard <ArrowRight color={BK} />
              </GreenBtn>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   8. FINAL CTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FinalCTA() {
  return (
    <section style={{ background: BK }} className="relative overflow-hidden px-5 py-20 md:px-[120px]">
      {/* Glow */}
      <div className="pointer-events-none absolute" style={{ top: -80, right: -80, width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${G}1A 0%, transparent 65%)` }} />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <ScrollReveal>
            <h2 className="text-[40px] font-bold leading-[1.2] text-white">
              Ready to Upgrade<br />
              <span style={{ color: G }}>Your Networking?</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: T3 }}>
              Create your smart NFC business card and start sharing your profile instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GreenBtn href="/products">
                Design Your Card Now <ArrowRight color={BK} />
              </GreenBtn>
              <OutlineBtn href="/products" dark>View All Products</OutlineBtn>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120} className="flex justify-center md:justify-end">
            <div className="relative" style={{ width: 380 }}>
              <Image src="/images/card1.svg" alt="TapMe card" width={380} height={302} style={{ width: 380, height: "auto" }} className="drop-shadow-2xl" />
              <div className="absolute" style={{ bottom: -16, right: -24, zIndex: -1 }}>
                <Image src="/images/card2.svg" alt="TapMe card back" width={260} height={184} style={{ width: 260, height: "auto" }} className="drop-shadow-xl" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function HomeV2() {
  return (
    <>
      <Header />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <SeeInAction />
      <MiniCRM />
      <div id="products-v2">
        <ProductCards />
      </div>
      <WhoCanUse />
      <Analytics />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
}
