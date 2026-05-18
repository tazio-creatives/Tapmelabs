"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    line1: "Your Network.",
    line2: "One Tap Away.",
    description:
      "Share your digital identity instantly with NFC-powered smart business cards. Just tap and connect.",
  },
  {
    line1: "Go Paperless.",
    line2: "Stay Connected.",
    description:
      "Replace paper cards forever. Your TapMe smart card keeps your contacts updated in real time — no reprinting needed.",
  },
  {
    line1: "First Impressions.",
    line2: "Redefined.",
    description:
      "Make networking memorable with a sleek NFC card that shares everything about you in a single tap.",
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
      }, 400);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  function goTo(index) {
    if (index === current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setVisible(true);
    }, 400);
  }

  const slide = slides[current];

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.30)_0%,rgba(40,220,79,0.30)_75.25%)]"
    >
      <div className="mx-auto flex min-h-[745px] w-full max-w-[1440px] flex-col items-center justify-between gap-10 px-5 py-12 md:flex-row md:px-[120px]">
        {/* Left Content */}
        <div className="w-full max-w-[520px] animate-hero-left">
          <div className="inline-flex items-center justify-center gap-[10px] rounded-full bg-white px-[25px] py-2 shadow-sm">
            <span className="text-sm font-medium text-[#111827]">
              The Future of Networking
            </span>
          </div>

          {/* Carousel text — fades in/out on slide change */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <div className="mt-6">
              <h1 className="flex min-h-[85px] max-w-[438px] flex-col justify-center text-[44px] font-bold leading-[52px] text-[#111827] md:text-[60px] md:leading-[72px]">
                {slide.line1}
              </h1>
              <h2 className="flex min-h-[85px] max-w-[471px] flex-col justify-center text-[44px] font-bold leading-[52px] text-[#28DC4F] md:text-[60px] md:leading-[72px]">
                {slide.line2}
              </h2>
            </div>

            <p className="mt-5 max-w-[427px] text-[16px] font-normal leading-[26px] text-[#4B5563] md:text-[18px] md:leading-[28px]">
              {slide.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-[10px] rounded-full bg-[#28DC4F] px-8 py-[18px] text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-200"
            >
              Get Your Smart Card
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D1D5DB] bg-white px-[33px] py-[19px] text-sm font-bold text-[#111827] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              See How It Works
            </a>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300"
                style={{
                  width: i === current ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  background: i === current ? "#28DC4F" : "#D1D5DB",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>

        {/* Right — cards + decorative background */}
        <div className="animate-hero-right relative mt-8 flex h-[420px] w-full max-w-[640px] items-center justify-center md:mt-0 md:h-[560px]">

          {/* Figma Group 13 — decorative curved lines pattern (5% opacity baked in SVG) */}
          <Image
            src="/images/hero-bg-pattern.svg"
            alt=""
            aria-hidden="true"
            width={930}
            height={931}
            className="pointer-events-none absolute z-0"
            style={{
              width: "930px",
              height: "931px",
              top: "-82px",
              right: "-290px",
            }}
          />

          {/* Figma Ellipse 1 — white 50% opacity, 500×500px */}
          <div
            className="pointer-events-none absolute z-0 rounded-full"
            style={{
              width: "500px",
              height: "500px",
              background: "rgba(255,255,255,0.50)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {/* Back card (card2.svg) — rotation baked in at -8.78°, SVG viewBox 472×334 */}
          <div className="float-card absolute left-1/2 top-1/2 z-10 -translate-x-[58%] -translate-y-[45%]">
            <Image
              src="/images/card2.svg"
              alt="TapMe Lab NFC card back"
              width={472}
              height={334}
              loading="eager"
              className="drop-shadow-2xl"
              style={{ width: "472px", height: "334px" }}
            />
          </div>

          {/* Front card (card1.svg) — rotation baked in at +16.72°, SVG viewBox 538×427 */}
          <div className="float-card-alt absolute left-1/2 top-1/2 z-20 -translate-x-[35%] -translate-y-[35%]">
            <Image
              src="/images/card1.svg"
              alt="TapMe Lab NFC card front"
              width={538}
              height={427}
              loading="eager"
              className="drop-shadow-2xl"
              style={{ width: "538px", height: "427px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
