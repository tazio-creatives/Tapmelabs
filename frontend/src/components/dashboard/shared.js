"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import authService from "@/services/authService";
import RealProfilePreviewCard from "@/components/dashboard/ProfilePreviewCard";

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
    form:         <svg {...p}><rect x="3" y="2" width="14" height="16" rx="2"/><path d="M7 7h6M7 10h6M7 13h4"/></svg>,
    leads:        <svg {...p}><circle cx="8" cy="7" r="3"/><path d="M2 17c0-2.8 2.7-5 6-5"/><path d="M14 11l2 2 4-4"/></svg>,
  };
  return icons[k] ?? null;
}

/* ─── nav items ─────────────────────────────────────────────────────────── */

export const NAV_ITEMS = [
  { key: "Dashboard", href: "/dashboard",          iconKey: "grid"     },
  { key: "Themes",    href: "/dashboard/themes",   iconKey: "palette"  },
  { key: "My Cards",  href: "/dashboard/my-cards", iconKey: "card"     },
  { key: "Orders",    href: "/dashboard/orders",   iconKey: "box"      },
  { key: "My Forms",  href: "/dashboard/forms",    iconKey: "form"     },
  { key: "Leads",     href: "/dashboard/leads",    iconKey: "leads"    },
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

export function ProfilePreviewCard({
  /* individual props (legacy callers) */
  name            = "",
  designation     = "",
  company         = "",
  city            = "",
  phone           = "",
  email           = "",
  website         = "",
  connectedSocials = [],
  profileImage    = null,
  companyLogo     = null,
  bizPhone        = null,
  bizEmail        = null,
  /* new props */
  profile         = null,
  themeKey        = "default",
}) {
  const profileObj = profile || {
    name,
    email,
    phone,
    profile_image: profileImage,
    designation,
    company_name: company,
    company_logo: companyLogo,
    website,
    social_links: {
      city,
      work_phone: bizPhone,
      work_email: bizEmail,
      ...Object.fromEntries(connectedSocials.map((k) => [k, "1"])),
    },
  };

  return <RealProfilePreviewCard profile={profileObj} themeKey={themeKey} />;
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
