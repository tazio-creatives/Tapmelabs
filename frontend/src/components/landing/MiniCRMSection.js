import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="#28DC4F" strokeWidth="1.5" />
        <path d="M4 17c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Lead Capture",
    desc: "Capture every connection as a lead the moment they tap your card.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M2 14l3.5-4.5 3.5 2.5 3.5-6 3.5 5" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Analytics Dashboard",
    desc: "Real-time data on profile views, link clicks, and tap activity.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="#28DC4F" strokeWidth="1.5" />
        <path d="M2 8h16M5.5 12h3M5.5 14h5" stroke="#28DC4F" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: "Contact Management",
    desc: "Organise all business contacts in one place with notes and history.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="#28DC4F" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Follow-up Tracking",
    desc: "Set reminders so no opportunity slips through the cracks.",
  },
];

export default function MiniCRMSection() {
  return (
    <section
      className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
      style={{ background: "#111827" }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute"
        style={{ top: -100, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(40,220,79,0.10) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-5xl">

        {/* Header */}
        <ScrollReveal className="mb-7 text-center">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#28DC4F]">
            Mini CRM
          </p>
          <h2 className="text-[26px] font-extrabold leading-tight text-white sm:text-[32px]">
            More Than a Card —{" "}
            <span style={{ color: "#28DC4F" }}>A Smarter Network</span>
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#9CA3AF]">
            Built-in CRM tools to capture leads, track interactions, and manage every connection.
          </p>
        </ScrollReveal>

        {/* Content */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

          {/* Dashboard image — appears first on mobile */}
          <ScrollReveal>
            <div
              className="overflow-hidden rounded-2xl"
              style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}
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

          {/* Feature list */}
          <ScrollReveal delay={100}>
            <div className="flex flex-col gap-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-4 rounded-xl px-4 py-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: "rgba(40,220,79,0.12)" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white">{f.title}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-[#9CA3AF]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/dashboard"
              className="mt-7 inline-flex items-center gap-2 rounded-full px-7 py-[13px] text-[13px] font-bold text-black transition-all hover:-translate-y-0.5 hover:opacity-90"
              style={{ background: "#28DC4F" }}
            >
              Explore Mini CRM
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}
