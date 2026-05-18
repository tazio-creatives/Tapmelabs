import ScrollReveal from "@/components/ScrollReveal";

const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path
      d="M4 22V14C4 9.582 7.582 6 12 6V9C9.239 9 7 11.239 7 14H11V22H4Z"
      fill="#E5E7EB"
    />
    <path
      d="M17 22V14C17 9.582 20.582 6 25 6V9C22.239 9 20 11.239 20 14H24V22H17Z"
      fill="#E5E7EB"
    />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      d="M9 1.5L11.163 6.573L16.5 7.388L12.75 11.04L13.725 16.5L9 13.897L4.275 16.5L5.25 11.04L1.5 7.388L6.837 6.573L9 1.5Z"
      fill="#EAB308"
    />
  </svg>
);

const testimonials = [
  {
    name: "Leslie Alexander",
    role: "Real Estate Agent",
    company: "Century Homes",
    quote:
      "“I’ve closed 3 deals this month just by tapping my card at networking events. It’s an incredible conversation starter and looks so professional.”",
  },
  {
    name: "Brooklyn Simmons",
    role: "Web Designer",
    company: "Louis Vuitton",
    quote:
      "“No more paper cards that get thrown away. My portfolio is instantly on my client’s phone. The metal card quality is absolutely premium.”",
  },
  {
    name: "Jacob Jones",
    role: "President of Sales",
    company: "MasterCard",
    quote:
      "“Bought these for my entire sales team. We’ve seen a 40% increase in follow-up rates since switching to TapMe. Highly recommended.”",
  },
  {
    name: "Robert Fox",
    role: "Marketing Coordinator",
    company: "McDonald’s",
    quote:
      "“The holographic card matches my brand perfectly. I love how I can update my links without printing new cards. It’s sustainable and smart.”",
  },
  {
    name: "Jenny Wilson",
    role: "Marketing Coordinator",
    company: "The Walt Disney Company",
    quote:
      "“Simple, effective, and elegant. The setup was a breeze and it works with every phone I’ve tried. Best investment for networking.”",
  },
  {
    name: "Courtney Henry",
    role: "Marketing Coordinator",
    company: "IBM",
    quote:
      "“Bought these for my entire sales team. We’ve seen a 40% increase in follow-up rates since switching to TapMe. Highly recommended.”",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-[25px] py-2 text-[14px] font-medium text-[#6D6D6D]">
            Testimonials
          </span>

          <h2 className="mt-5 text-[36px] font-semibold leading-tight text-[#2A2A2A]">
            Real Stories, Real Results
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-[26px] text-[#707070]">
            Join thousands of professionals upgrading their networking.
          </p>
        </div>

        {/* 3-col × 2-row grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <ScrollReveal key={t.name + index} delay={index * 80}>
              <div
                className="flex flex-col rounded-[16px] bg-white p-6 shadow-sm ring-1 ring-gray-100"
                style={{ minHeight: "280px" }}
              >
                {/* Quote icon */}
                <QuoteIcon />

                {/* 5 stars */}
                <div className="mt-3 flex gap-[3px]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon key={i} />
                  ))}
                </div>

                {/* Quote text */}
                <p className="mt-3 flex-1 text-[14px] font-medium leading-[22px] text-[#4B5563]">
                  {t.quote}
                </p>

                {/* Author */}
                <div className="mt-4 flex items-center gap-3">
                  <div
                    className="flex shrink-0 items-center justify-center rounded-full bg-[#28DC4F] text-[16px] font-bold text-white"
                    style={{ width: "52px", height: "52px" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#111827]">
                      {t.name}
                    </p>
                    <p className="text-[12px] font-normal text-[#9CA3AF]">
                      {t.role}
                    </p>
                    <p className="text-[11px] font-normal text-[#28DC4F]">
                      {t.company}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
