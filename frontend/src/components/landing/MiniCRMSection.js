import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="#28DC4F" strokeWidth="1.5" />
        <path d="M4 17c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Lead Capture",
    desc: "Automatically capture every connection as a lead the moment they tap your card.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 14l3.5-4.5 3.5 2.5 3.5-6 3.5 5" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Analytics Dashboard",
    desc: "See real-time data on profile views, link clicks, and tap activity at a glance.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="#28DC4F" strokeWidth="1.5" />
        <path d="M2 8h16M5.5 12h3M5.5 14h5" stroke="#28DC4F" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: "Contact Management",
    desc: "Organise all your business contacts in one place, with notes and history.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="#28DC4F" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Follow-up Tracking",
    desc: "Set reminders and track every follow-up so no opportunity slips through.",
  },
];

export default function MiniCRMSection() {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
      style={{ background: "#111827" }}
    >
      {/* Subtle green glow top-right */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -120,
          right: -100,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(40,220,79,0.12) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">

        {/* Header */}
        <ScrollReveal className="text-center">
          <span className="inline-flex items-center rounded-full border border-[#2A3A2E] bg-[#1A2A1E] px-[25px] py-2 text-xs font-medium text-[#28DC4F]">
            Mini CRM
          </span>
          <h2 className="mt-5 text-[36px] font-semibold leading-tight text-white">
            More Than a Business Card —<br />
            <span style={{ color: "#28DC4F" }}>A Smarter Way to Network</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-[26px] text-[#9CA3AF]">
            TapMe Labs gives you built-in CRM tools to capture leads, track interactions, and manage every connection from your digital profile.
          </p>
        </ScrollReveal>

        {/* Content grid */}
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          {/* Left — dashboard image */}
          <ScrollReveal>
            <div
              className="overflow-hidden rounded-[16px]"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              <Image
                src="/images/dashboard/mycard-full-content.png"
                alt="TapMe Mini CRM Dashboard"
                width={640}
                height={420}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </ScrollReveal>

          {/* Right — feature list */}
          <ScrollReveal delay={120}>
            <div className="flex flex-col gap-5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 rounded-[12px] px-5 py-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]"
                    style={{ background: "rgba(40,220,79,0.12)" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-white">{f.title}</p>
                    <p className="mt-1 text-[13px] leading-[20px] text-[#9CA3AF]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#28DC4F] px-8 py-[14px] text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
              >
                Explore Mini CRM
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
