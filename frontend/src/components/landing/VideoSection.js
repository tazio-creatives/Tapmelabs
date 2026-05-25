"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  { title: "Instant Sharing",   desc: "Share your full profile in one tap — no app needed." },
  { title: "Always Updated",    desc: "Edit anytime; changes reflect immediately." },
  { title: "Better Follow-ups", desc: "Track who viewed your profile and when." },
  { title: "Works Everywhere",  desc: "Compatible with all Android and iPhone devices." },
];

export default function VideoSection() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* ── Text + features ── */}
          <ScrollReveal>
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#28DC4F]">
              See It In Action
            </p>
            <h2 className="text-[26px] font-extrabold leading-tight text-[#111827] sm:text-[32px]">
              Watch How TapMe<br />Works in Real Life
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#6B7280]">
              One tap — that&apos;s all it takes to share your full professional profile, social links, and contact details instantly.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 rounded-xl px-4 py-3"
                  style={{ background: "#F9FAFB", border: "1px solid #F0F0F0" }}
                >
                  <div
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#28DC4F" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111827]">{f.title}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-[#9CA3AF]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#products"
              className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-[13px] text-[13px] font-bold text-black transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-100"
              style={{ background: "#28DC4F" }}
            >
              Get Your Smart Card
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>

          {/* ── Video placeholder ── */}
          <ScrollReveal delay={100}>
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: "#0B1410",
                aspectRatio: "16/9",
                boxShadow: "0 16px 48px rgba(0,0,0,0.16)",
              }}
            >
              <Image
                src="/images/card1.svg"
                alt=""
                fill
                style={{ objectFit: "cover", opacity: 0.07 }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse 70% 70% at 55% 45%, rgba(40,220,79,0.12) 0%, transparent 65%)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl transition-transform hover:scale-105 sm:h-[72px] sm:w-[72px]"
                  aria-label="Play demo video"
                >
                  <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                    <polygon points="8,4 22,13 8,22" fill="#28DC4F" />
                  </svg>
                </button>
              </div>
              <div
                className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white sm:bottom-4 sm:left-4 sm:text-[12px]"
                style={{ background: "rgba(40,220,79,0.14)", border: "1px solid rgba(40,220,79,0.28)", backdropFilter: "blur(6px)" }}
              >
                <span className="h-[6px] w-[6px] rounded-full" style={{ background: "#28DC4F" }} />
                <span>How TapMe Works</span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
