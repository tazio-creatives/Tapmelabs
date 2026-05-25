import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  {
    value: "1,000+",
    label: "Cards in Use",
    desc: "Professionals networking smarter",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#28DC4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    value: "98%",
    label: "Device Compatibility",
    desc: "Works on all modern smartphones",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#28DC4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    value: "100%",
    label: "Digital Networking",
    desc: "No paper, no reprinting ever",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#28DC4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/>
        <path d="M8 11.5l8-4M8 12.5l8 4"/>
      </svg>
    ),
  },
];

export default function StatsSection() {
  return (
    <section style={{ background: "#111827" }} className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-2 sm:gap-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 80}>
              <div className="flex flex-col items-center text-center">
                {/* Icon circle */}
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12"
                  style={{ background: "rgba(40,220,79,0.1)" }}
                >
                  {stat.icon}
                </div>

                {/* Value */}
                <span
                  className="text-[28px] font-extrabold leading-none sm:text-[40px] md:text-[48px]"
                  style={{ color: "#28DC4F" }}
                >
                  {stat.value}
                </span>

                {/* Label */}
                <span className="mt-1.5 text-[12px] font-semibold text-white sm:text-[14px]">
                  {stat.label}
                </span>

                {/* Description — hidden on small mobile */}
                <span className="mt-1 hidden text-[11px] leading-snug text-[#6B7280] sm:block">
                  {stat.desc}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
