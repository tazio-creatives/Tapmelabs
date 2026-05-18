import ScrollReveal from "@/components/ScrollReveal";
import {
  BriefcaseBusiness,
  Rocket,
  Star,
  Building2,
  Zap,
  Laptop,
} from "lucide-react";

const industries = [
  {
    Icon: BriefcaseBusiness,
    title: "Sales Professionals",
    description:
      "Perfect for networking events, client meetings, and trade shows. Instantly share your contact details, company information, and product links.",
  },
  {
    Icon: Rocket,
    title: "Entrepreneurs & Founders",
    description:
      "Make a strong first impression while pitching ideas, attending networking events, or meeting investors. Share your brand and contact details in seconds.",
  },
  {
    Icon: Star,
    title: "Influencers & Creators",
    description:
      "Easily share your social media profiles, portfolios, and content platforms with fans, collaborators, and brands with just one tap.",
  },
  {
    Icon: Building2,
    title: "Corporate Teams",
    description:
      "Equip your entire team with smart NFC business cards for seamless networking and modern digital contact sharing.",
  },
  {
    Icon: Zap,
    title: "Startups",
    description:
      "Modern networking tools for fast-growing startups that want to make strong impressions while building valuable connections.",
  },
  {
    Icon: Laptop,
    title: "Freelancers",
    description:
      "Showcase your portfolio, services, and contact information instantly when meeting potential clients or partners.",
  },
];

export default function AudienceSection() {
  return (
    <section id="industries" className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-[25px] py-2 text-xs font-medium text-gray-500">
            Industries
          </span>

          <h2 className="mt-5 text-[36px] font-semibold leading-tight text-[#111827]">
            Designed for Every Professional
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-[26px] text-[#6B7280]">
            Whether you&apos;re networking, growing a business, or building a personal brand &mdash; TapMe cards make connections effortless.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map(({ Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 80}>
              <div
                className="flex flex-col rounded-[10px] bg-white px-[22px] py-[18px] shadow-sm transition-shadow duration-300 hover:shadow-md"
                style={{ minHeight: "156px" }}
              >
                {/* Icon + Title row */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex shrink-0 items-center justify-center rounded-[7px]"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient(180deg, #28DC4F 0%, #9BFFB1 100%)",
                    }}
                  >
                    <Icon size={20} color="#fff" strokeWidth={2} />
                  </div>
                  <h3 className="text-[18px] font-semibold leading-snug text-[#192535]">
                    {title}
                  </h3>
                </div>

                {/* Description */}
                <p className="mt-3 text-[14px] leading-[22px] text-[#5F5F5F]">
                  {description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
