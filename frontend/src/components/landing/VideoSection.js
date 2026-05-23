"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    title: "Instant Sharing",
    desc: "Share your full profile in one tap — no app needed.",
  },
  {
    title: "Always Updated",
    desc: "Edit your profile anytime; changes reflect immediately.",
  },
  {
    title: "Better Follow-ups",
    desc: "Track who viewed your profile and when.",
  },
  {
    title: "Works Everywhere",
    desc: "Compatible with all modern Android and iPhone devices.",
  },
];

export default function VideoSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* ── Left: text + feature chips ── */}
          <ScrollReveal>
            <span className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-[25px] py-2 text-xs font-medium text-gray-500">
              See It In Action
            </span>

            <h2 className="mt-5 text-[36px] font-semibold leading-tight text-[#111827]">
              Watch How TapMe<br />Works in Real Life
            </h2>

            <p className="mt-3 max-w-md text-[16px] leading-[26px] text-[#6B7280]">
              One tap — that&apos;s all it takes to share your full professional profile, social links, portfolio, and contact details instantly.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 rounded-[10px] bg-[#F9FAFB] px-4 py-3"
                  style={{ border: "1px solid #F0F0F0" }}
                >
                  <div
                    className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
                    style={{ background: "linear-gradient(180deg, #28DC4F 0%, #9BFFB1 100%)" }}
                  >
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5l2 2L7.5 2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111827]">{f.title}</p>
                    <p className="mt-0.5 text-[12px] leading-[18px] text-[#6B7280]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full bg-[#28DC4F] px-8 py-[14px] text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200"
              >
                Get Your Smart Card
              </a>
            </div>
          </ScrollReveal>

          {/* ── Right: video thumbnail ── */}
          <ScrollReveal delay={120}>
            <div
              className="relative overflow-hidden rounded-[18px]"
              style={{
                background: "#0B1410",
                aspectRatio: "16/9",
                boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              }}
            >
              {/* Background card image at low opacity */}
              <Image
                src="/images/card1.svg"
                alt=""
                fill
                style={{ objectFit: "cover", opacity: 0.08 }}
              />

              {/* Subtle green gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse 80% 80% at 60% 40%, rgba(40,220,79,0.10) 0%, transparent 65%)" }}
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white shadow-2xl transition-transform hover:scale-105"
                  aria-label="Play demo video"
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <polygon points="8,4 22,13 8,22" fill="#28DC4F" />
                  </svg>
                </button>
              </div>

              {/* Label badge */}
              <div
                className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold text-white"
                style={{
                  background: "rgba(40,220,79,0.12)",
                  border: "1px solid rgba(40,220,79,0.28)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <span
                  className="inline-block h-[7px] w-[7px] rounded-full"
                  style={{ background: "#28DC4F" }}
                />
                How TapMe Works
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
