import { Fragment } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  {
    number: "1",
    title: "Tap the Card",
    description: "Tap your TapMe card on any NFC-enabled smartphone.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hand holding card */}
        <rect x="8" y="10" width="22" height="14" rx="2.5" stroke="#28DC4F" strokeWidth="2.2" fill="none"/>
        <line x1="8" y1="16" x2="30" y2="16" stroke="#28DC4F" strokeWidth="2.2"/>
        {/* NFC waves */}
        <path d="M34 17a5 5 0 0 1 0 6" stroke="#28DC4F" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <path d="M37 14a9 9 0 0 1 0 12" stroke="#28DC4F" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        {/* Hand */}
        <path d="M12 24v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-4" stroke="#28DC4F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M12 28h16" stroke="#28DC4F" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    number: "2",
    title: "Open Digital Profile",
    description: "Your digital profile opens instantly with all your details and links.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Phone outline */}
        <rect x="14" y="6" width="20" height="36" rx="3" stroke="#28DC4F" strokeWidth="2.2" fill="none"/>
        <line x1="14" y1="12" x2="34" y2="12" stroke="#28DC4F" strokeWidth="2"/>
        <line x1="14" y1="36" x2="34" y2="36" stroke="#28DC4F" strokeWidth="2"/>
        <circle cx="24" cy="39" r="1.2" fill="#28DC4F"/>
        {/* Profile avatar */}
        <circle cx="24" cy="21" r="4" stroke="#28DC4F" strokeWidth="2" fill="none"/>
        {/* Profile lines */}
        <path d="M18 31c0-3.314 2.686-4 6-4s6 .686 6 4" stroke="#28DC4F" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    number: "3",
    title: "Save / Share Contact",
    description: "They can save your contact or share it in one tap.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Contact card */}
        <rect x="8" y="14" width="26" height="20" rx="2.5" stroke="#28DC4F" strokeWidth="2.2" fill="none"/>
        <circle cx="17" cy="22" r="3.5" stroke="#28DC4F" strokeWidth="2" fill="none"/>
        <path d="M11 30c0-2.5 2-3.5 6-3.5" stroke="#28DC4F" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <line x1="22" y1="22" x2="30" y2="22" stroke="#28DC4F" strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="26" x2="28" y2="26" stroke="#28DC4F" strokeWidth="2" strokeLinecap="round"/>
        {/* Share arrow */}
        <circle cx="38" cy="16" r="3" stroke="#28DC4F" strokeWidth="2" fill="none"/>
        <circle cx="38" cy="32" r="3" stroke="#28DC4F" strokeWidth="2" fill="none"/>
        <circle cx="30" cy="24" r="3" stroke="#28DC4F" strokeWidth="2" fill="none"/>
        <line x1="33" y1="22.5" x2="35.5" y2="18" stroke="#28DC4F" strokeWidth="2" strokeLinecap="round"/>
        <line x1="33" y1="25.5" x2="35.5" y2="30" stroke="#28DC4F" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const DashedArrow = () => (
  <div className="hidden md:flex items-center justify-center w-12 shrink-0">
    <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
      <line
        x1="0" y1="8" x2="40" y2="8"
        stroke="#28DC4F"
        strokeWidth="2"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
      <path
        d="M38 4l6 4-6 4"
        stroke="#28DC4F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </div>
);

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F9FAFB] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <ScrollReveal className="mb-8 text-center">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#28DC4F]">
            How It Works
          </p>
          <h2 className="text-[32px] font-extrabold leading-tight text-[#111827] sm:text-[38px]">
            Three{" "}
            <span style={{ color: "#28DC4F" }}>Simple</span>{" "}
            Steps
          </h2>
        </ScrollReveal>

        {/* Steps row */}
        <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-center md:gap-0">
          {steps.map((step, i) => (
            <Fragment key={step.number}>
              <ScrollReveal delay={i * 120} className="flex-1">
                <div
                  className="flex h-full flex-col items-center rounded-2xl bg-white px-6 py-8 text-center shadow-sm"
                  style={{ border: "1px solid #F0F0F0" }}
                >
                  {/* Number badge */}
                  <div
                    className="mb-5 flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
                    style={{ background: "#28DC4F" }}
                  >
                    {step.number}
                  </div>

                  {/* Icon circle */}
                  <div
                    className="mb-5 flex h-[88px] w-[88px] items-center justify-center rounded-full"
                    style={{ background: "rgba(40,220,79,0.08)" }}
                  >
                    {step.icon}
                  </div>

                  {/* Text */}
                  <h3 className="mb-3 text-[17px] font-bold text-[#111827]">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-[1.7] text-[#6B7280]">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>

              {/* Arrow between cards */}
              {i < steps.length - 1 && <DashedArrow />}
            </Fragment>
          ))}
        </div>

      </div>
    </section>
  );
}
