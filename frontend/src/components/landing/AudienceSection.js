import ScrollReveal from "@/components/ScrollReveal";

const industries = [
  {
    title: "Sales Professionals",
    tagline: "Close deals faster with instant sharing",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    title: "Entrepreneurs",
    tagline: "Make every first impression count",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
  },
  {
    title: "Influencers & Creators",
    tagline: "Share all your links in one tap",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    title: "Corporate Teams",
    tagline: "Unified digital cards for your whole team",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    title: "Startups",
    tagline: "Network like a modern brand",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: "Freelancers",
    tagline: "Showcase your portfolio on the spot",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
];

export default function AudienceSection() {
  return (
    <section id="industries" className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <ScrollReveal className="mb-10 text-center">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#28DC4F]">
            Industries
          </p>
          <h2 className="text-[30px] font-extrabold text-[#111827] sm:text-[36px]">
            Built for Every Professional
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#6B7280]">
            From solo freelancers to enterprise teams — TapMe fits every workflow.
          </p>
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map(({ icon, title, tagline }, index) => (
            <ScrollReveal key={title} delay={index * 60}>
              <div
                className="group flex items-start gap-4 rounded-xl px-5 py-4 transition-all duration-200 hover:bg-[#F9FAFB]"
                style={{ border: "1px solid #F0F0F0" }}
              >
                {/* Icon */}
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#28DC4F] transition-colors duration-200 group-hover:bg-[#28DC4F] group-hover:text-white"
                  style={{ background: "rgba(40,220,79,0.08)" }}
                >
                  {icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-[14px] font-semibold text-[#111827]">{title}</h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-[#9CA3AF]">{tagline}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
