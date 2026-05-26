const NAV_LINKS = [
  { label: "Home",             href: "#home"     },
  { label: "Products",         href: "#products" },
  { label: "Design Your Card", href: "#products" },
  { label: "Contact Us",       href: "#contact"  },
  { label: "Profile Login",    href: "/login"    },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Blog",           href: "#" },
];

const SOCIAL = [
  {
    label: "WhatsApp",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.886a.5.5 0 0 0 .614.612l6.218-1.635A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.522-5.17-1.43l-.37-.22-3.83 1.007.974-3.755-.24-.388A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.269h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Main footer content */}
        <div className="border-b border-[#1F1F1F] py-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">

            {/* Brand column */}
            <div className="flex flex-col gap-5 lg:w-64 lg:shrink-0">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.svg" alt="TapMe" width={28} height={28} style={{ filter: "brightness(0) invert(1)" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo-text.svg" alt="TAPME LABS" style={{ height: 12, filter: "brightness(0) invert(1)" }} />
              </div>
              <p className="text-[13px] leading-relaxed text-[#6B7280]">
                Smart NFC business cards that make every connection count. Tap, share, impress.
              </p>
              <div className="flex items-center gap-3">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition-colors hover:bg-[#1F1F1F] hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex-1">
              {/* Navigation */}
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#28DC4F]">Navigation</p>
                <ul className="flex flex-col gap-3">
                  {NAV_LINKS.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-[13px] text-[#6B7280] transition-colors hover:text-white">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#28DC4F]">Legal</p>
                <ul className="flex flex-col gap-3">
                  {LEGAL_LINKS.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-[13px] text-[#6B7280] transition-colors hover:text-white">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#28DC4F]">Contact</p>
                <ul className="flex flex-col gap-3">
                  <li className="text-[13px] text-[#6B7280]">info@tapmelabs.com</li>
                  <li>
                    <a href="#contact" className="text-[13px] text-[#6B7280] transition-colors hover:text-white">
                      Get in Touch
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-[13px] text-[#6B7280] transition-colors hover:text-white">
                      WhatsApp Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-[12px] text-[#4B5563]">
            &copy; 2026 TapMe Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="/privacy" className="text-[12px] text-[#4B5563] transition-colors hover:text-white">Privacy Policy</a>
            <a href="/terms" className="text-[12px] text-[#4B5563] transition-colors hover:text-white">Terms &amp; Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
