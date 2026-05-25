const testimonials = [
  {
    name: "Leslie Alexander",
    role: "Real Estate Agent",
    quote: "Closed 3 deals this month just by tapping my card at events. An incredible conversation starter.",
  },
  {
    name: "Brooklyn Simmons",
    role: "Web Designer",
    quote: "No more paper cards. My portfolio is instantly on my client's phone. The card quality is premium.",
  },
  {
    name: "Jacob Jones",
    role: "President of Sales",
    quote: "Bought for my entire team. We've seen a 40% increase in follow-up rates since switching to TapMe.",
  },
  {
    name: "Robert Fox",
    role: "Marketing Coordinator",
    quote: "I can update my links without printing new cards. Sustainable, smart, and looks incredible.",
  },
  {
    name: "Jenny Wilson",
    role: "Brand Manager",
    quote: "Simple, effective, and elegant. Setup was a breeze and it works with every phone I've tried.",
  },
  {
    name: "Courtney Henry",
    role: "Sales Director",
    quote: "The best investment for professional networking. Our team looks polished at every event.",
  },
];

const stars = (
  <div className="flex gap-0.5">
    {[0,1,2,3,4].map((i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 18 18">
        <path d="M9 1.5L11.163 6.573L16.5 7.388L12.75 11.04L13.725 16.5L9 13.897L4.275 16.5L5.25 11.04L1.5 7.388L6.837 6.573L9 1.5Z" fill="#EAB308"/>
      </svg>
    ))}
  </div>
);

function TestimonialCard({ t }) {
  return (
    <div
      className="flex w-[260px] shrink-0 flex-col gap-3 rounded-2xl bg-white p-4 sm:w-[280px]"
      style={{ border: "1px solid #F0F0F0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      {stars}
      <p className="text-[12px] leading-relaxed text-[#4B5563]" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: "#28DC4F" }}>
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="text-[12px] font-semibold leading-none text-[#111827]">{t.name}</p>
          <p className="mt-0.5 text-[10px] text-[#9CA3AF]">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const row1 = [...testimonials, ...testimonials];
  const row2 = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()];

  return (
    <section id="testimonials" className="overflow-hidden bg-white py-10 sm:py-12">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); }    }
        .ml { animation: marquee-left  30s linear infinite; }
        .mr { animation: marquee-right 30s linear infinite; }
        .marquee-wrap:hover .ml,
        .marquee-wrap:hover .mr { animation-play-state: paused; }
      `}} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#28DC4F]">Testimonials</p>
          <h2 className="text-[26px] font-extrabold text-[#111827] sm:text-[30px]">Real Stories, Real Results</h2>
        </div>
      </div>

      {/* Marquee rows */}
      <div className="marquee-wrap flex flex-col gap-3">
        {/* Row 1 — scrolls left */}
        <div className="flex overflow-hidden">
          <div className="ml flex gap-3 pr-3">
            {row1.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="flex overflow-hidden">
          <div className="mr flex gap-3 pr-3">
            {row2.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
