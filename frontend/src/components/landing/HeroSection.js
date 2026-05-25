"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    line1: "Your Network.",
    line2: "One Tap Away.",
    description: "Share your digital identity instantly with NFC-powered smart business cards. Just tap and connect.",
  },
  {
    line1: "Go Paperless.",
    line2: "Stay Connected.",
    description: "Replace paper cards forever. Your TapMe smart card keeps your contacts updated in real time.",
  },
  {
    line1: "First Impressions.",
    line2: "Redefined.",
    description: "Make networking memorable with a sleek NFC card that shares everything about you in one tap.",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setVisible(true);
      }, 350);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  function goTo(index) {
    if (index === current) return;
    setVisible(false);
    setTimeout(() => { setCurrent(index); setVisible(true); }, 350);
  }

  const slide = slides[current];

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden"
      style={{ background: "linear-gradient(160deg, #ffffff 0%, rgba(40,220,79,0.08) 60%, rgba(40,220,79,0.18) 100%)" }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-5 py-8 sm:py-12 md:flex-row md:items-center md:gap-12 md:px-10 md:py-14 lg:px-16">

        {/* ── Text column ── */}
        <div className="w-full text-center md:max-w-[500px] md:text-left">

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm" style={{ border: "1px solid #E5E7EB" }}>
            <span className="h-2 w-2 rounded-full" style={{ background: "#28DC4F" }} />
            <span className="text-[12px] font-semibold text-[#374151]">Smart NFC Business Cards</span>
          </div>

          {/* Heading */}
          <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}>
            <h1 className="text-[36px] font-extrabold leading-[1.15] tracking-tight text-[#111827] sm:text-[44px] md:text-[52px]">
              {slide.line1}
              <br />
              <span style={{ color: "#28DC4F" }}>{slide.line2}</span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6B7280] sm:text-[16px]">
              {slide.description}
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#products"
              className="flex w-full items-center justify-center rounded-full py-4 text-[14px] font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200 sm:w-auto sm:px-8"
              style={{ background: "#28DC4F" }}
            >
              Get Your Smart Card
            </a>
            <a
              href="#how-it-works"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white py-4 text-[14px] font-semibold text-[#111827] transition-all hover:-translate-y-0.5 hover:shadow-md sm:w-auto sm:px-8"
            >
              See How It Works
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Slide dots */}
          <div className="mt-6 flex items-center justify-center gap-2 md:justify-start">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? "24px" : "7px",
                  height: "7px",
                  borderRadius: "9999px",
                  background: i === current ? "#28DC4F" : "#D1D5DB",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Card visual ── */}
        <div className="relative flex w-full items-center justify-center md:flex-1">
          {/* Glow blob */}
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: "320px", height: "320px",
              background: "radial-gradient(circle, rgba(40,220,79,0.18) 0%, transparent 70%)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Back card — hidden on small mobile, visible sm+ */}
          <div
            className="float-card pointer-events-none absolute hidden sm:block"
            style={{ transform: "rotate(-8deg) translate(-22%, 8%)", zIndex: 10 }}
          >
            <Image
              src="/images/card2.svg"
              alt=""
              width={340}
              height={240}
              loading="eager"
              className="drop-shadow-xl"
              style={{ width: "min(340px, 55vw)", height: "auto" }}
            />
          </div>

          {/* Front card */}
          <div
            className="float-card-alt pointer-events-none relative"
            style={{ transform: "rotate(5deg)", zIndex: 20 }}
          >
            <Image
              src="/images/card1.svg"
              alt="TapMe NFC card"
              width={360}
              height={260}
              loading="eager"
              className="drop-shadow-2xl"
              style={{ width: "min(360px, 80vw)", height: "auto" }}
            />
          </div>
        </div>

      </div>

      {/* Trust strip */}
      <div
        className="border-t px-5 py-4"
        style={{ borderColor: "rgba(40,220,79,0.15)", background: "rgba(255,255,255,0.6)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { icon: "⚡", text: "Works without an app" },
            { icon: "📱", text: "All iPhones & Android" },
            { icon: "✏️", text: "Update anytime, free" },
            { icon: "🌿", text: "100% paperless" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-[12px] font-medium text-[#6B7280]">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
