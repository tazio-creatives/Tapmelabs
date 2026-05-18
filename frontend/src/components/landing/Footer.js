
const navColumns = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "#home" },
      { label: "Products", href: "#products" },
      { label: "Design Your Card", href: "#products" },
      { label: "Contact Us", href: "#contact" },
      { label: "Profile Login", href: "#" },
    ],
  },
  {
    title: "Documentation",
    links: [
      { label: "Blog", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "T & C", href: "#" },
    ],
  },
  {
    title: "Other Pages",
    links: [
      { label: "Pricing", href: "#" },
      { label: "404", href: "#" },
    ],
  },
  {
    title: "Social Connects",
    links: [
      { label: "Whatsapp", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-black">
      <div className="mx-auto max-w-[1200px] px-6 pt-12 lg:px-8">

        {/* Logo — top of footer content */}
        <div className="mb-8 flex items-center gap-[10px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="TapMe" width={32} height={32} style={{ filter: "brightness(0) invert(1)" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-text.svg" alt="TAPME LABS" style={{ height: 13, filter: "brightness(0) invert(1)" }} />
        </div>

        {/* Double-border links card */}
        <div className="rounded-[24px] border border-[#191919] p-[8px]">
          <div className="rounded-[16px] border border-[#191919] px-8 py-10 md:px-10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {navColumns.map((col) => (
                <div key={col.title}>
                  <h4 className="text-[18px] font-medium text-white">
                    {col.title}
                  </h4>
                  <ul className="mt-5 space-y-[14px]">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[16px] font-normal text-[#A1A1A1] transition-colors duration-200 hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-7">
          <div className="border-t border-[#6B6B6B]" />
          <div className="flex flex-col items-start justify-between gap-4 pb-10 pt-6 md:flex-row md:items-center">
            {/* Terms + Privacy (left) */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-[16px] font-normal text-[#A1A1A1] transition-colors duration-200 hover:text-white"
              >
                Terms &amp; Conditions
              </a>
              <a
                href="#"
                className="text-[16px] font-normal text-[#A1A1A1] transition-colors duration-200 hover:text-white"
              >
                Privacy Policy
              </a>
            </div>

            {/* Copyright (right) */}
            <p className="text-[16px] font-normal text-[#A1A1A1]">
              &copy; 2026 www.tapelabs.com. All rights reserved.
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}
