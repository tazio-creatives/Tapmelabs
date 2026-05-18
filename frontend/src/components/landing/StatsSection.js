import ScrollReveal from "@/components/ScrollReveal";

const stats = [
  { value: "1,000+", label: "Cards in Use" },
  { value: "98%", label: "Device Compatibility" },
  { value: "100%", label: "Digital Networking" },
];

export default function StatsSection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-0">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center">
              {index > 0 && (
                <div
                  className="mx-10 hidden shrink-0 sm:block"
                  style={{ width: "2px", height: "75px", background: "#EEEEEE" }}
                />
              )}
              <ScrollReveal delay={index * 100}>
                <div className="flex flex-col items-center text-center">
                  <span
                    className="leading-none text-black"
                    style={{ fontSize: "60px", fontWeight: 500 }}
                  >
                    {stat.value}
                  </span>
                  <span className="mt-2 text-[16px] font-normal text-[#6D6D6D]">
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
