import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Tap to Share",
    description:
      "Share your details instantly with a simple tap. Just hold your NFC card near any compatible smartphone and your digital profile opens automatically — fast, smooth, and impressive.",
    points: [
      "Instantly open your digital profile",
      "Works on most modern smartphones",
      "No apps or setup required",
    ],
  },
  {
    number: "02",
    title: "Scan the QR Code",
    description:
      "No NFC support? No problem. Every card includes a unique QR code that instantly opens your digital profile when scanned — ensuring you can connect with anyone, anywhere.",
    points: [
      "Works on all smartphones",
      "Quick and reliable access",
      "Perfect backup for universal sharing",
    ],
  },
  {
    number: "03",
    title: "Connect Instantly",
    description:
      "Once your profile opens, sharing becomes effortless. Let others save your contact, explore your links, and connect with you instantly — all from one smart digital profile.",
    points: [
      "Save contact details in one tap",
      "Share social and business links",
      "Make every interaction memorable",
    ],
  },
];

// Figma-exact composition data for each step's left panel
const stepVisuals = [
  {
    bg:    { src: "/images/hiw-step1-bg.png",    nw: 758, nh: 454, w: 379, h: 227 },
    phone: { src: "/images/hiw-step1-phone.png", nw: 460, nh: 566, w: 230, h: 283, top: 75,  left: 75  },
    container: { w: 379, h: 358 },
  },
  {
    bg:    { src: "/images/hiw-step2-bg.png",    nw: 800, nh: 480, w: 400, h: 240 },
    phone: { src: "/images/hiw-step2-phone.png", nw: 460, nh: 672, w: 230, h: 336, top: 26,  left: 207 },
    container: { w: 437, h: 362 },
  },
  {
    bg:    { src: "/images/hiw-step3-bg.png",    nw: 758, nh: 454, w: 379, h: 227 },
    phone: { src: "/images/hiw-step3-phone.png", nw: 440, nh: 708, w: 220, h: 354, top: 24,  left: 13  },
    container: { w: 379, h: 378 },
  },
];

function StepLeft({ index }) {
  const { bg, phone, container } = stepVisuals[index];
  const orderClass = index === 1 ? "md:order-2" : "";
  return (
    <div
      className={`relative flex min-h-[420px] w-full items-center justify-center overflow-hidden bg-[#F9F9F9] ${orderClass}`}
    >
      <div className="relative" style={{ width: container.w, height: container.h }}>
        {/* Dark card from Figma */}
        <Image
          src={bg.src}
          alt=""
          width={bg.nw}
          height={bg.nh}
          className="absolute left-0 top-0"
          style={{ width: bg.w, height: bg.h }}
        />
        {/* Phone mockup from Figma, positioned per Figma coordinates */}
        <Image
          src={phone.src}
          alt="Step demonstration"
          width={phone.nw}
          height={phone.nh}
          className="absolute drop-shadow-2xl"
          style={{ width: phone.w, height: phone.h, top: phone.top, left: phone.left }}
        />
      </div>
    </div>
  );
}

const checkIcon = (
  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
    <path
      d="M1 5.5L5 9.5L13 1.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="text-center">
          <span className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-[25px] py-2 text-xs font-medium text-gray-500">
            How It Works
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight text-gray-950 sm:text-4xl">
            From Card to Connections,
            <br />
            In Three Simple Steps
          </h2>
        </ScrollReveal>

        <div className="mt-10 space-y-6">
          {steps.map((step, index) => (
            <ScrollReveal key={step.title} delay={index * 120}>
              <div className="grid gap-0 overflow-hidden rounded-[31px] bg-white shadow-md ring-[7px] ring-white md:grid-cols-2">
                {/* Visual panel — right side on step 02, left on 01 & 03 */}
                <StepLeft index={index} />

                {/* Content panel — left side on step 02, right on 01 & 03 */}
                <div className={`flex flex-col justify-center px-8 py-10${index === 1 ? " md:order-1" : ""}`}>
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-[#28DC4F]/10 px-3 py-1 text-xs font-bold text-[#28DC4F]">
                    Step {step.number}
                  </span>

                  <h3 className="text-[26px] font-semibold leading-tight text-[#2A2A2A]">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-[18px] font-normal leading-[28px] text-[#707070]">
                    {step.description}
                  </p>

                  <ul className="mt-6 space-y-[15px]">
                    {step.points.map((point) => (
                      <li key={point} className="flex items-center gap-3 text-[16px] leading-[24px] text-[#2A2A2A]">
                        <span className="flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-[10px] bg-[#28DC4F]">
                          {checkIcon}
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
