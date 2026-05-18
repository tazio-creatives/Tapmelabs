"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import authService from "@/services/authService";

/* ─── icons ─────────────────────────────────────────────────────────────── */

export function Icon({ k, size = 18, color = "currentColor", strokeWidth = 1.5 }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid:         <svg {...p}><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></svg>,
    palette:      <svg {...p}><circle cx="10" cy="10" r="8"/><circle cx="7" cy="8.5" r="1" fill={color} stroke="none"/><circle cx="13" cy="8.5" r="1" fill={color} stroke="none"/><circle cx="10" cy="13" r="1" fill={color} stroke="none"/></svg>,
    card:         <svg {...p}><rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16"/><path d="M6 13h3"/></svg>,
    box:          <svg {...p}><path d="M16.5 6.5l-6.5-4-6.5 4v7l6.5 4 6.5-4v-7Z"/><path d="M3.5 6.5l6.5 4 6.5-4M10 10.5v7"/></svg>,
    settings:     <svg {...p}><circle cx="10" cy="10" r="3"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg>,
    logout:       <svg {...p}><path d="M13 3h4v14h-4M9 14l4-4-4-4M13 10H3"/></svg>,
    bell:         <svg {...p}><path d="M10 2a6 6 0 0 1 6 6v3l1.5 2.5H2.5L4 11V8a6 6 0 0 1 6-6Z"/><path d="M8 17a2 2 0 0 0 4 0"/></svg>,
    search:       <svg {...p}><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5 17 17"/></svg>,
    menu:         <svg {...p}><path d="M3 5h14M3 10h14M3 15h14"/></svg>,
    phone:        <svg {...p}><path d="M3 3h4l2 4-2.5 1.5A12 12 0 0 0 14.5 16L16 13.5l4 2v4c-8.5 1-16.5-7-17-15.5Z"/></svg>,
    mail:         <svg {...p}><rect x="2" y="4" width="16" height="13" rx="2"/><path d="M2 6l8 6 8-6"/></svg>,
    globe:        <svg {...p}><circle cx="10" cy="10" r="8"/><path d="M2 10h16M10 2a14 14 0 0 0 0 16M10 2a14 14 0 0 1 0 16"/></svg>,
    download:     <svg {...p}><path d="M10 3v10M6 9l4 4 4-4"/><path d="M3 16h14"/></svg>,
    camera:       <svg {...p}><path d="M13 4H7L5 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2L13 4Z"/><circle cx="10" cy="11" r="2.5"/></svg>,
    building:     <svg {...p}><path d="M3 18V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13M3 18h14M7 8h2M11 8h2M7 12h2M11 12h2M9 18v-4h2v4"/></svg>,
    chevron_down: <svg {...p}><path d="M4 7l6 6 6-6"/></svg>,
    chevron_right:<svg {...p}><path d="M7 4l6 6-6 6"/></svg>,
    plus:         <svg {...p}><path d="M10 4v12M4 10h12"/></svg>,
    edit:         <svg {...p}><path d="M14 3l3 3-9 9H5v-3L14 3Z"/><path d="M11.5 5.5l3 3"/></svg>,
    mic:          <svg {...p}><path d="M10 3a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z"/><path d="M5 10a5 5 0 0 0 10 0"/><path d="M10 15v3"/></svg>,
    user:         <svg {...p}><circle cx="10" cy="7" r="4"/><path d="M2 18c0-3.3 3.6-6 8-6s8 2.7 8 6"/></svg>,
    share:        <svg {...p}><circle cx="15" cy="4" r="2"/><circle cx="5" cy="10" r="2"/><circle cx="15" cy="16" r="2"/><path d="M7 9l6-3.5M7 11l6 3.5"/></svg>,
    trend_up:     <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M3 13l5-5 4 3 5-6"/><path d="M14 5h4v4"/></svg>,
  };
  return icons[k] ?? null;
}

/* ─── nav items ─────────────────────────────────────────────────────────── */

export const NAV_ITEMS = [
  { key: "Dashboard", href: "/dashboard",          iconKey: "grid"     },
  { key: "Themes",    href: "/dashboard/themes",   iconKey: "palette"  },
  { key: "My Cards",  href: "/dashboard/my-cards", iconKey: "card"     },
  { key: "Orders",    href: "/dashboard/orders",   iconKey: "box"      },
  { key: "Settings",  href: "/dashboard/settings", iconKey: "settings" },
];

/* ─── sidebar ───────────────────────────────────────────────────────────── */

export function Sidebar({ open, onClose, activeNav = "Dashboard" }) {
  const router = useRouter();

  function handleLogout() {
    authService.clearSession();
    globalThis.window?.dispatchEvent(new Event("tapme:authchange"));
    router.push("/login");
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-[#EBEBEB] bg-white transition-transform duration-300 lg:relative lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-[61px] shrink-0 items-center gap-[10px] border-b border-[#EBEBEB] px-5">
          <Image src="/images/logo.svg" alt="TapMe Lab Logo" width={32} height={32} priority />
          <Image src="/images/logo-text.svg" alt="TapMe Labs" width={120} height={11} priority />
        </div>

        <nav className="mt-4 flex flex-col gap-[2px] px-3">
          {NAV_ITEMS.map(({ key, href, iconKey }) => {
            const isActive = activeNav === key;
            return (
              <Link
                key={key}
                href={href}
                onClick={onClose}
                className="flex w-full items-center gap-[10px] rounded-[8px] px-3 py-[10px] transition-all"
                style={{ background: isActive ? "#28DC4F" : "transparent", color: isActive ? "#FFFFFF" : "#4B5563" }}
              >
                <Icon k={iconKey} size={16} color={isActive ? "#FFFFFF" : "#4B5563"} strokeWidth={1.6} />
                <span className="text-[12px] font-medium">{key}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#EBEBEB] px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-[10px] rounded-[8px] px-3 py-[10px] text-[12px] font-medium text-[#4B5563] transition-colors hover:bg-[#F5F5F5]"
          >
            <Icon k="logout" size={16} color="#4B5563" strokeWidth={1.6} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── top header ────────────────────────────────────────────────────────── */

export function TopHeader({ onMenuClick, initials = "JS" }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="flex h-[61px] shrink-0 items-center justify-between border-b border-[#EBEBEB] bg-white px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#6D6D6D] transition-colors hover:bg-[#F5F5F5] lg:hidden"
          aria-label="Open sidebar"
        >
          <Icon k="menu" size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-[8px] px-3 py-[9px] md:flex" style={{ background: "#E0E3E5", width: "300px" }}>
          <Icon k="search" size={15} color="#6B7280" />
          <input
            type="text"
            placeholder="Search analytics..."
            className="flex-1 bg-transparent text-[14px] text-[#1E1E1E] outline-none placeholder:text-[#6B7280]"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#EBEBEB] bg-white text-[#6D6D6D] transition-colors hover:bg-[#F5F5F5]"
            aria-label="Notifications"
          >
            <Icon k="bell" size={17} />
            <span className="absolute right-[7px] top-[7px] h-[6px] w-[6px] rounded-full border border-white bg-[#EF4444]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 z-30 w-[280px] rounded-[12px] border border-[#F0F0F0] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
              <div className="flex items-center justify-between border-b border-[#F4F4F4] px-4 py-3">
                <p className="text-[13px] font-semibold text-[#111827]">Notifications</p>
                <span className="rounded-full bg-[#28DC4F]/10 px-2 py-[2px] text-[11px] font-semibold text-[#28DC4F]">3 new</span>
              </div>
              {[
                { text: "Your profile was viewed 23 times today", time: "5 min ago" },
                { text: "Arjun Mehta saved your contact",          time: "1 hr ago"  },
                { text: "New tap recorded — Mumbai",               time: "3 hrs ago" },
              ].map((n, i) => (
                <div key={i} className="border-b border-[#F9F9F9] px-4 py-3 last:border-0">
                  <p className="text-[13px] text-[#111827]">{n.text}</p>
                  <p className="mt-[2px] text-[11px] text-[#9CA3AF]">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#28DC4F] text-[12px] font-bold text-white">
          {initials}
        </button>
      </div>
    </header>
  );
}

/* ─── profile preview card ──────────────────────────────────────────────── */

function SocialIcon({ platform, size = 28 }) {
  const s = size;
  if (platform === "whatsapp") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#25D366"/>
      <path fill="white" d="M16 7.5A8.5 8.5 0 0 0 9.1 20.1L7.5 24.5l4.5-1.6A8.5 8.5 0 1 0 16 7.5Zm0 15.5a7 7 0 0 1-3.8-1.1l-.3-.2-3 1 .9-2.9-.2-.3A7 7 0 1 1 16 23Zm3.7-5.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1-.2-.1-1-.4-1.8-1.2a7 7 0 0 1-1.4-1.6c-.1-.2 0-.3.1-.4l.4-.4.2-.4V14l-.7-1.7c-.2-.4-.4-.4-.4-.4H12a.9.9 0 0 0-.7.3 2.7 2.7 0 0 0-.8 2c0 1.5 1.1 3 1.2 3.2 1.4 2.1 3 2.7 4.7 3.4.4.1.7.1 1 .1.4 0 .7 0 1.1-.2.5-.2.8-.5 1-.8.2-.3.2-.6 0-.8l-.8-.7Z"/>
    </svg>
  );
  if (platform === "linkedin") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0A66C2"/>
      <path fill="white" d="M11 14H8.5V24H11V14Zm-1.3-4.3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM24 18.5c0-2.6-1.3-4.5-3.8-4.5-1 0-2 .6-2.5 1.6V14h-2.5V24h2.8v-5.8c0-1.2.6-2.1 1.7-2.1 1.1 0 1.5.9 1.5 2.1V24H24V18.5Z"/>
    </svg>
  );
  if (platform === "messenger") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0084FF"/>
      <path fill="white" d="M16 8C11.6 8 8 11.3 8 15.5c0 2.2 1 4.1 2.7 5.5V24l2.7-1.5c.7.2 1.5.3 2.6.3 4.4 0 8-3.3 8-7.5S20.4 8 16 8Zm.8 10-2.3-2.5-4.3 2.5 4.6-4.9 2.3 2.9 4.3-2.9-4.6 4.9Z"/>
    </svg>
  );
  if (platform === "instagram") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#C13584"/>
      <rect x="10" y="10" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="3" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="20.2" cy="11.8" r="0.9" fill="white"/>
    </svg>
  );
  if (platform === "twitter") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#000000"/>
      <path fill="white" d="M17.8 14.9 22.5 9h-1.1l-4.1 4.8L14 9H9.5l5 7.1L9.5 23H10.6l4.4-5.1 3.5 5.1H23l-5.2-8.1Zm-1.5 1.8-.5-.7-4-5.7H13l3.2 4.6.5.7 4.2 5.9H19.7l-3.4-4.8Z"/>
    </svg>
  );
  if (platform === "snapchat") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#FFFC00"/>
      <path fill="#1a1a1a" d="M16 8c-2.4 0-4.4 2-4.4 4.4V13c-.6.1-1.3-.2-1.3-.2s-.3.7.5 1.2c-.3.5-.8 1.5-2 1.9s.2 1 .8 1c.5 0 .6.3.4.7-.3.4-1 .9-1.3 1.2.5.7 2 1.4 4.4 1.6.3.6.8 1.6 1.6 1.6h.2c.8 0 1.4-.9 1.6-1.6 2.4-.2 3.9-.9 4.4-1.6-.3-.3-1-.8-1.3-1.2-.2-.4-.1-.7.4-.7.6 0 1.3-.4.8-1-1.2-.5-1.7-1.4-2-1.9.8-.5.5-1.2.5-1.2s-.8.3-1.3.2v-.6C20.4 10 18.4 8 16 8Z"/>
    </svg>
  );
  return null;
}

const SOCIAL_KEYS_ALL = ["whatsapp", "linkedin", "messenger", "instagram", "twitter", "snapchat"];

export function ProfilePreviewCard({
  name            = "Jane Smith",
  designation     = "Marketing Director",
  company         = "TechCorp Inc.",
  city            = "Mumbai",
  phone           = "+91 98765 43210",
  email           = "jane@techcorp.com",
  website         = "jane.tapmelabs.com",
  connectedSocials = [],
  profileImage    = null,
  companyLogo     = null,
  bizPhone        = null,
  bizEmail        = null,
  showActions     = false,
}) {
  const visibleSocials = connectedSocials.filter((k) => SOCIAL_KEYS_ALL.includes(k));
  const firstName = (name || "Jane").split(" ")[0];
  const lastName  = (name || "Jane Smith").split(" ").slice(1).join(" ");

  return (
    <div className="flex flex-col overflow-hidden bg-white" style={{ borderRadius: "16px", border: "1px solid rgb(229,229,229)" }}>
      {/* NFC Card */}
      <div className="flex flex-col px-[25px] pt-[25px]">
        <div className="relative overflow-hidden" style={{ width: "100%", height: "280px", borderRadius: "9px" }}>
          {profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profileImage} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
          ) : (
            <Image src="/images/dashboard/profile-card-bg.png" alt="NFC Card" fill sizes="(max-width: 1280px) 350px, 350px" style={{ objectFit: "cover" }} />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 55%)" }} />
          <div className="absolute bottom-4 left-4">
            <p className="font-semibold leading-tight text-white" style={{ fontSize: "24px", fontWeight: 600 }}>
              {firstName}<br />{lastName}
            </p>
          </div>
        </div>

        {/* Bio row */}
        <div className="mt-[16px] flex items-center gap-3 pb-[20px]">
          {companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={companyLogo} alt={company} style={{ width: 48, height: 48, borderRadius: "5px", objectFit: "contain", flexShrink: 0 }} />
          ) : (
            <Image src="/images/dashboard/profile-avatar.png" alt="Avatar" width={48} height={48} style={{ borderRadius: "5px", objectFit: "cover", flexShrink: 0 }} />
          )}
          <p className="text-[12px] leading-[1.5] text-[#21283F]">
            {designation}<br />at {company}<br />in {city}, India.
          </p>
        </div>
      </div>

      <div className="mx-[25px] h-px bg-[#E5E5E5]" />

      {/* Contact */}
      <div className="flex flex-col px-[65px] py-[20px]">
        <div className="flex items-center gap-3 py-[5px]">
          <Icon k="phone" size={14} color="#1C1B1F" strokeWidth={1.6} />
          <span className="text-[12px] font-semibold text-[#21283F]">{phone}</span>
        </div>
        <div className="flex items-center gap-3 py-[5px]">
          <Icon k="mail" size={14} color="#1C1B1F" strokeWidth={1.6} />
          <span className="truncate text-[12px] text-[#21283F]">{email}</span>
        </div>
        <div className="flex items-center gap-3 py-[5px]">
          <Icon k="globe" size={14} color="#1C1B1F" strokeWidth={1.6} />
          <span className="truncate text-[12px] text-[#21283F]">{website}</span>
        </div>
        {bizPhone && (
          <div className="flex items-center gap-3 py-[5px]">
            <Icon k="phone" size={14} color="#1C1B1F" strokeWidth={1.6} />
            <span className="text-[12px] font-semibold text-[#21283F]">
              {bizPhone} <span style={{ color: "#9CA3AF", fontSize: 10 }}>(work)</span>
            </span>
          </div>
        )}
        {bizEmail && (
          <div className="flex items-center gap-3 py-[5px]">
            <Icon k="mail" size={14} color="#1C1B1F" strokeWidth={1.6} />
            <span className="truncate text-[12px] text-[#21283F]">
              {bizEmail} <span style={{ color: "#9CA3AF", fontSize: 10 }}>(work)</span>
            </span>
          </div>
        )}
      </div>

      <div className="mx-[25px] h-px bg-[#E5E5E5]" />

      {/* Socials */}
      {visibleSocials.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-[16px] py-[20px] px-[16px]">
          {visibleSocials.map((key) => (
            <button key={key} className="transition-transform hover:scale-110">
              <SocialIcon platform={key} size={28} />
            </button>
          ))}
        </div>
      )}

      {/* Actions — only in list/card view, not in edit previews */}
      {showActions && (
        <div className="flex flex-col items-center gap-[24px] px-[34px] pb-[25px]">
          <button
            className="flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{ width: "124px", height: "32px", borderRadius: "20px", border: "1px solid rgb(164,182,196)", fontSize: "12px", color: "rgb(28,27,31)" }}
          >
            <Icon k="download" size={13} color="rgb(28,27,31)" strokeWidth={1.8} />
            Save Contact
          </button>

          <div className="flex w-full items-center justify-center overflow-hidden" style={{ height: "50px", borderRadius: "99px", background: "#000000" }}>
            <button className="flex flex-1 items-center justify-center text-[14px] text-white transition-opacity hover:opacity-80">Share</button>
            <div className="h-5 w-px bg-white/30" />
            <Link href="/dashboard/profile/basics" className="flex flex-1 items-center justify-center text-[14px] text-white transition-opacity hover:opacity-80">Edit Profile</Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── profile tabs ──────────────────────────────────────────────────────── */

export function ProfileTabs({ active }) {
  const tabs = [
    { key: "basics",   href: "/dashboard/profile/basics",   label: "Basics"   },
    { key: "business", href: "/dashboard/profile/business", label: "Business" },
    { key: "social",   href: "/dashboard/profile/social",   label: "Social"   },
  ];

  return (
    <div className="mb-5 flex gap-1">
      {tabs.map(({ key, href, label }) => {
        const isActive = active === key;
        return (
          <Link
            key={key}
            href={href}
            className="rounded-[8px] px-4 py-[8px] text-[14px] font-medium transition-all"
            style={{
              background: isActive ? "#28DC4F" : "transparent",
              color:      isActive ? "#FFFFFF"  : "#6B7280",
            }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

/* ─── form field ────────────────────────────────────────────────────────── */

export function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[14px] font-medium text-[#374151]">{label}</label>
      {children}
    </div>
  );
}

export const inputClass =
  "h-[48px] w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-[16px] text-black outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#28DC4F] focus:ring-2 focus:ring-[#28DC4F]/15";
