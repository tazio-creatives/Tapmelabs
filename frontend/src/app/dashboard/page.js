"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar as SharedSidebar } from "@/components/dashboard/shared";
import ProfilePreviewCard from "@/components/dashboard/ProfilePreviewCard";
import profileService   from "@/services/profileService";
import orderService     from "@/services/orderService";
import analyticsService from "@/services/analyticsService";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0] ?? "").join("").toUpperCase().slice(0, 2);
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "Just now";
  if (mins  < 60)  return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24)  return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
  if (days  === 1) return "Yesterday";
  return `${days} days ago`;
}

/* ─── icons ──────────────────────────────────────────────────────────────── */

function Icon({ k, size = 18, color = "currentColor", strokeWidth = 1.5 }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid:      <svg {...p}><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></svg>,
    palette:   <svg {...p}><circle cx="10" cy="10" r="8"/><circle cx="7" cy="8.5" r="1" fill={color} stroke="none"/><circle cx="13" cy="8.5" r="1" fill={color} stroke="none"/><circle cx="10" cy="13" r="1" fill={color} stroke="none"/></svg>,
    card:      <svg {...p}><rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16"/><path d="M6 13h3"/></svg>,
    box:       <svg {...p}><path d="M16.5 6.5l-6.5-4-6.5 4v7l6.5 4 6.5-4v-7Z"/><path d="M3.5 6.5l6.5 4 6.5-4M10 10.5v7"/></svg>,
    settings:  <svg {...p}><circle cx="10" cy="10" r="3"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg>,
    logout:    <svg {...p}><path d="M13 3h4v14h-4M9 14l4-4-4-4M13 10H3"/></svg>,
    eye:       <svg {...p}><ellipse cx="10" cy="10" rx="8" ry="5.5"/><circle cx="10" cy="10" r="2.5"/></svg>,
    tap:       <svg {...p}><path d="M8 3v6.5L6.5 8 5 9.5l3.5 5.5h4.5c.5 0 1-.4 1-1v-6a1 1 0 0 0-2 0v-2a1 1 0 0 0-2 0v-2a1 1 0 0 0-1-1Z"/></svg>,
    qr:        <svg {...p}><rect x="2" y="2" width="6" height="6" rx="1"/><rect x="3.5" y="3.5" width="3" height="3" fill={color} stroke="none"/><rect x="12" y="2" width="6" height="6" rx="1"/><rect x="13.5" y="3.5" width="3" height="3" fill={color} stroke="none"/><rect x="2" y="12" width="6" height="6" rx="1"/><rect x="3.5" y="13.5" width="3" height="3" fill={color} stroke="none"/><rect x="12" y="12" width="3" height="3" fill={color} stroke="none"/><rect x="17" y="12" width="1" height="3" fill={color} stroke="none"/><rect x="12" y="17" width="3" height="1" fill={color} stroke="none"/><rect x="17" y="17" width="1" height="1" fill={color} stroke="none"/></svg>,
    user:      <svg {...p}><circle cx="10" cy="7" r="4"/><path d="M2 18c0-3.3 3.6-6 8-6s8 2.7 8 6"/></svg>,
    share:     <svg {...p}><circle cx="15" cy="4" r="2"/><circle cx="5" cy="10" r="2"/><circle cx="15" cy="16" r="2"/><path d="M7 9l6-3.5M7 11l6 3.5"/></svg>,
    bell:      <svg {...p}><path d="M10 2a6 6 0 0 1 6 6v3l1.5 2.5H2.5L4 11V8a6 6 0 0 1 6-6Z"/><path d="M8 17a2 2 0 0 0 4 0"/></svg>,
    search:    <svg {...p}><circle cx="9" cy="9" r="6"/><path d="M13.5 13.5 17 17"/></svg>,
    menu:      <svg {...p}><path d="M3 5h14M3 10h14M3 15h14"/></svg>,
    close:     <svg {...p}><path d="M4 4l12 12M16 4 4 16"/></svg>,
    phone:     <svg {...p}><path d="M3 3h4l2 4-2.5 1.5A12 12 0 0 0 14.5 16L16 13.5l4 2v4c-8.5 1-16.5-7-17-15.5Z"/></svg>,
    mail:      <svg {...p}><rect x="2" y="4" width="16" height="13" rx="2"/><path d="M2 6l8 6 8-6"/></svg>,
    globe:     <svg {...p}><circle cx="10" cy="10" r="8"/><path d="M2 10h16M10 2a14 14 0 0 0 0 16M10 2a14 14 0 0 1 0 16"/></svg>,
    copy:      <svg {...p}><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M13 7V4.5A1.5 1.5 0 0 0 11.5 3h-7A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13H7"/></svg>,
    edit:      <svg {...p}><path d="M14 3l3 3-9 9H5v-3L14 3Z"/><path d="M11.5 5.5l3 3"/></svg>,
    download:  <svg {...p}><path d="M10 3v10M6 9l4 4 4-4"/><path d="M3 16h14"/></svg>,
    trend_up:  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M3 13l5-5 4 3 5-6"/><path d="M14 5h4v4"/></svg>,
    form:      <svg {...p}><rect x="3" y="2" width="14" height="16" rx="2"/><path d="M7 7h6M7 10h6M7 13h4"/></svg>,
    leads:     <svg {...p}><circle cx="8" cy="7" r="3"/><path d="M2 17c0-2.8 2.7-5 6-5"/><path d="M14 11l2 2 4-4"/></svg>,
    linkedin:  <svg width={size} height={size} viewBox="0 0 20 20" fill={color}><path d="M5 7H2v11h3V7ZM3.5 5.8A1.8 1.8 0 1 0 3.5 2.2a1.8 1.8 0 0 0 0 3.6ZM18 11.6c0-2.7-1.4-4.6-3.9-4.6-1.2 0-2.3.7-2.8 1.7V7H8v11h3.3v-5.7c0-1.3.6-2.3 1.8-2.3 1.2 0 1.6 1 1.6 2.3V18H18v-6.4Z"/></svg>,
    instagram: <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.4"><rect x="3" y="3" width="14" height="14" rx="4"/><circle cx="10" cy="10" r="3.5"/><circle cx="14" cy="6" r="0.8" fill={color} stroke="none"/></svg>,
    twitter:   <svg width={size} height={size} viewBox="0 0 20 20" fill={color}><path d="M17.3 4.3c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1A3.9 3.9 0 0 0 7 7.7a11 11 0 0 1-8-4.1 3.9 3.9 0 0 0 1.2 5.2c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.4 3.1 3.8-.3.1-.7.1-1 .1-.3 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.6 2.6A7.8 7.8 0 0 1 .6 16.5c1.8 1.1 3.8 1.8 6 1.8 7.3 0 11.2-6 11.2-11.2v-.5c.8-.6 1.4-1.3 2-2.1l-.5-.2Z"/></svg>,
    whatsapp:  <svg width={size} height={size} viewBox="0 0 20 20" fill={color}><path d="M10 2A8 8 0 0 0 3.4 14.2L2 18l3.8-1.4A8 8 0 1 0 10 2Zm0 14.5a6.5 6.5 0 0 1-3.3-.9l-.2-.2-2.3.9.8-2.2-.2-.3A6.5 6.5 0 1 1 10 16.5Zm3.6-4.9c-.2-.1-1.2-.6-1.3-.6-.2-.1-.3-.1-.4.1l-.5.7c-.1.1-.2.2-.4.1-.2-.1-.8-.3-1.5-1a5.6 5.6 0 0 1-1.1-1.3c-.1-.2 0-.3.1-.4l.3-.4.2-.4v-.4l-.6-1.4c-.2-.4-.3-.3-.4-.3H7c-.2 0-.4.1-.5.2A2.1 2.1 0 0 0 6 9.5c0 1.3.9 2.5 1 2.7 1.1 1.7 2.5 2.7 3.8 3.2.5.2.9.3 1.3.3.4 0 .8-.1 1.1-.2.4-.2.6-.4.8-.7.1-.3.1-.6 0-.7l-.4-.6Z"/></svg>,
  };
  return icons[k] ?? null;
}

/* ─── QR + actions components ────────────────────────────────────────────── */

function QRCodeSVG({ size = 160 }) {
  const G = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,1,0,1,1,0,1,0,0,1,1,1,0,1,1,0,0,1],
    [0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,1,0,1,0,1,0],
    [1,0,0,1,1,0,1,0,0,0,1,0,0,1,1,0,1,0,0,0,1],
    [0,1,0,1,0,1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0],
    [1,1,1,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,1,1,0,0,1,0,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,0,0,1,1,0],
    [1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,0,1,1,0,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,1,0,1,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,1,0,1,1,0],
  ];
  const cell = size / 21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {G.flatMap((row, y) =>
        row.map((v, x) =>
          v ? <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell + 0.5} height={cell + 0.5} fill="#111827" /> : null
        )
      )}
    </svg>
  );
}

function QRDisplay({ profileUrl, size = 160 }) {
  if (!profileUrl) return <QRCodeSVG size={size} />;
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(profileUrl)}&bgcolor=ffffff&color=111827&margin=0`}
      alt="QR code for your digital profile"
      width={size}
      height={size}
      style={{ display: "block", borderRadius: "4px" }}
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}

function ActionsSection({ profileUrl, onViewProfile, onDownloadQR, onShare, onCopy, copied, actionError }) {
  return (
    <div className="rounded-[16px] border border-[#EBEBEB] bg-white p-5 flex flex-col gap-5">
      {/* QR */}
      <div className="rounded-[12px] bg-[#F9FAFB] px-4 py-6">
        <div className="mx-auto mb-4 flex items-center justify-center rounded-[10px] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]" style={{ width: "fit-content" }}>
          <QRDisplay profileUrl={profileUrl} size={160} />
        </div>
        <p className="text-center text-[12px] leading-[1.6] text-[#6B7280]">
          Scan this QR code to instantly view and save your digital profile.
        </p>
      </div>

      {/* Error */}
      {actionError && (
        <p className="rounded-[8px] bg-[#FFF5F5] px-3 py-2 text-[12px] text-[#EF4444] border border-[#FEE2E2]">{actionError}</p>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onViewProfile}
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#28DC4F" }}
        >
          <Icon k="eye" size={15} color="white" strokeWidth={2} />
          View Digital Profile
        </button>
        <Link
          href="/dashboard/themes"
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E7EB] text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] no-underline"
        >
          <Icon k="palette" size={15} color="#374151" strokeWidth={1.8} />
          Edit Theme
        </Link>
        <button
          onClick={onDownloadQR}
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E7EB] text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
        >
          <Icon k="download" size={15} color="#374151" strokeWidth={1.8} />
          Download QR Code
        </button>
        <button
          onClick={onShare}
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E7EB] text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
        >
          <Icon k="share" size={15} color="#374151" strokeWidth={1.8} />
          Share Profile
        </button>
        <button
          onClick={onCopy}
          className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] border text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] ${copied ? "border-[#28DC4F] text-[#28DC4F]" : "border-[#E5E7EB] text-[#374151]"}`}
        >
          <Icon k="copy" size={15} color={copied ? "#28DC4F" : "#374151"} strokeWidth={1.8} />
          {copied ? "Copied!" : "Copy Profile"}
        </button>
      </div>
    </div>
  );
}

/* ─── top header ──────────────────────────────────────────────────────────── */

function TopHeader({ onMenuClick, initials }) {
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
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-[8px] px-3 py-[9px] md:flex" style={{ background: "#E0E3E5", width: "300px" }}>
          <Icon k="search" size={15} color="#6B7280" />
          <input
            type="text"
            placeholder="Search analytics..."
            className="flex-1 bg-transparent text-[14px] text-[#1E1E1E] outline-none placeholder:text-[#6B7280]"
          />
        </div>

        {/* Notification bell */}
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

        {/* Avatar — initials from API user */}
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#28DC4F] text-[12px] font-bold text-white">
          {initials}
        </button>
      </div>
    </header>
  );
}

/* ─── analytics card ──────────────────────────────────────────────────────── */

function AnalyticsCard({ label, value, desc }) {
  const iconMap = {
    "Total Views":    "eye",
    "Total Taps":     "tap",
    "QR Scans":       "qr",
    "Contacts Saved": "user",
  };
  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-[#EBEBEB] bg-white p-5">
      {/* Icon + menu */}
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(40,220,79,0.12)" }}>
          <Icon k={iconMap[label]} size={18} color="#28DC4F" strokeWidth={1.8} />
        </div>
        <button className="text-[#C4C9D4] hover:text-[#6B7280]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/>
          </svg>
        </button>
      </div>

      {/* Label */}
      <p className="text-[13px] font-medium text-[#6B7280]">{label}</p>

      {/* Value */}
      <p className="text-[28px] font-bold leading-none text-[#111827]">{value}</p>

      {/* Description */}
      <p className="text-[11px] text-[#9CA3AF]">{desc}</p>

      {/* Change tag */}
      <span className="flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: "rgba(40,220,79,0.1)", color: "#28DC4F" }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 7l3-3 2 2 3-4"/><path d="M7 2h2v2"/>
        </svg>
        0% vs last 7 days
      </span>
    </div>
  );
}

/* ─── activity item ───────────────────────────────────────────────────────── */

function ActivityItem({ accent, iconKey, title, desc, time }) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ background: `${accent}18` }}
      >
        <Icon k={iconKey} size={17} color={accent} strokeWidth={1.6} />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[13px] font-semibold text-[#111827]">{title}</p>
        <p className="mt-[2px] truncate text-[12px] text-[#9CA3AF]">{desc}</p>
      </div>
      <span className="shrink-0 rounded-full border border-[#F0F0F0] bg-[#F9FAFB] px-2.5 py-1 text-[11px] text-[#6B7280]">{time}</span>
    </div>
  );
}

/* ─── loading state ───────────────────────────────────────────────────────── */

function LoadingState({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
      <SharedSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Dashboard" />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-[61px] shrink-0 items-center border-b border-[#EBEBEB] bg-white px-6">
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(40,220,79,0.2)" strokeWidth="3" />
              <path d="M4 12a8 8 0 018-8v8H4z" fill="#28DC4F" />
            </svg>
            <p className="text-[14px] text-[#6D6D6D]">Loading your dashboard…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── page ────────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [user,        setUser]        = useState(null);
  const [profile,     setProfile]     = useState(null);
  const [analytics,   setAnalytics]   = useState(null);
  const [orders,      setOrders]      = useState([]);
  const [copied,         setCopied]         = useState(false);
  const [actionError,    setActionError]    = useState("");
  const [cardAction,     setCardAction]     = useState("profile");
  const [cardUid,        setCardUid]        = useState(null);
  const [forms,          setForms]          = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [savingAction,   setSavingAction]   = useState(false);
  const [actionSaved,    setActionSaved]    = useState(false);

  useEffect(() => {
    // ── Auth guard ──────────────────────────────────────────────────────────
    const token = localStorage.getItem("customerToken");
    if (!token) { router.push("/login"); return; }

    try {
      const raw = localStorage.getItem("customerUser");
      if (raw) setUser(JSON.parse(raw));
    } catch {}

    // ── Fetch all data in parallel ──────────────────────────────────────────
    async function fetchData() {
      const [profileRes, ordersRes, analyticsRes] = await Promise.allSettled([
        profileService.getMyProfile(),
        orderService.getMyOrders(),
        analyticsService.getMyProfileAnalytics(),
      ]);

      if (profileRes.status === "fulfilled") {
        const p = profileRes.value;
        setProfile(p?.data?.profile ?? p?.profile ?? p?.data ?? null);
      }

      if (ordersRes.status === "fulfilled") {
        const o = ordersRes.value;
        setOrders(Array.isArray(o?.data?.orders) ? o.data.orders : []);
      }

      if (analyticsRes.status === "fulfilled") {
        const a = analyticsRes.value;
        setAnalytics(a?.data?.analytics ?? null);
      }

      setLoading(false);
    }

    fetchData();

    // Load NFC card action + forms
    import("@/services/api").then(({ default: api }) => {
      api.get("/nfc-cards/mine").then(r => {
        if (r.data.card) {
          setCardAction(r.data.card.default_action || "profile");
          setSelectedFormId(r.data.card.form_id || null);
          setCardUid(r.data.card.card_uid || null);
        }
      }).catch(() => {});
      api.get("/forms").then(r => setForms(r.data.forms || [])).catch(() => {});
    });
  }, []);

  if (loading) {
    return <LoadingState sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
  }

  // ── Derived display values ────────────────────────────────────────────────
  const displayName = profile?.name || user?.full_name || "there";
  const firstName   = displayName.split(" ")[0];
  const initials    = getInitials(displayName);

  // ── Card tap action save ──────────────────────────────────────────────────
  async function saveCardAction(action, formId) {
    setSavingAction(true);
    try {
      const { default: api } = await import("@/services/api");
      await api.patch("/nfc-cards/mine/action", {
        default_action: action,
        form_id: action === "form" ? formId : null,
      });
      setActionSaved(true);
      setTimeout(() => setActionSaved(false), 2000);
    } catch (e) {
      setActionError(e?.response?.data?.message || "Failed to save");
      setTimeout(() => setActionError(""), 3000);
    } finally {
      setSavingAction(false);
    }
  }

  // ── Analytics cards from API ──────────────────────────────────────────────
  const analyticsCards = [
    { label: "Total Views",    value: String(analytics?.total_views    ?? 0), change: null, hasChange: false, desc: "Number of times your profile was viewed" },
    { label: "Total Taps",     value: String(analytics?.total_taps     ?? 0), change: null, hasChange: false, desc: "Number of NFC tap interactions"          },
    { label: "QR Scans",       value: String(analytics?.qr_scans       ?? 0), change: null, hasChange: false, desc: "Number of QR code scans"                },
    { label: "Contacts Saved", value: String(analytics?.contacts_saved  ?? 0), change: null, hasChange: false, desc: "People who saved your contact"          },
  ];

  // ── Activity items derived from recent orders ─────────────────────────────
  // TODO: Replace with a dedicated GET /api/activity endpoint once the backend
  //       implements a granular activity log tracking profile views, NFC taps,
  //       QR code scans, contact saves, and profile shares with timestamps and
  //       location metadata. Until then, recent orders serve as a fallback.
  const STATUS_MAP = {
    pending:    { accent: "#9CA3AF", title: "Order Placed"    },
    processing: { accent: "#3B82F6", title: "Order Processing" },
    shipped:    { accent: "#F59E0B", title: "Order Shipped"    },
    delivered:  { accent: "#28DC4F", title: "Order Delivered"  },
    cancelled:  { accent: "#EF4444", title: "Order Cancelled"  },
  };

  const activityItems = orders.slice(0, 5).map((order) => {
    const s = STATUS_MAP[order.order_status || order.status] ?? { accent: "#9CA3AF", title: "Order Update" };
    return {
      accent:  s.accent,
      iconKey: "box",
      title:   s.title,
      desc:    `#TML-${String(order.id).padStart(6, "0")} · ₹${Number(order.total_amount).toLocaleString("en-IN")}`,
      time:    timeAgo(order.created_at),
    };
  });

  const profileUrl = profile?.slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/u/${profile.slug}`
    : null;

  function handleViewProfile() {
    if (!profileUrl) { setActionError("Please complete your profile first."); return; }
    setActionError("");
    window.open(profileUrl, "_blank");
  }

  async function handleDownloadQR() {
    if (!profileUrl) { setActionError("Please complete your profile first."); return; }
    setActionError("");
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(profileUrl)}&bgcolor=ffffff&color=111827&margin=10`;
    try {
      const res = await fetch(qrApiUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `tapme-qr-${profile?.slug || "profile"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch { window.open(qrApiUrl, "_blank"); }
  }

  function handleShare() {
    if (!profileUrl) { setActionError("Please complete your profile first."); return; }
    setActionError("");
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "My TapMe Profile", text: "Check out my digital profile", url: profileUrl }).catch(() => {});
    } else { handleCopy(); }
  }

  function handleCopy() {
    if (!profileUrl) { setActionError("Please complete your profile first."); return; }
    setActionError("");
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  const actionsProps = {
    profileUrl,
    onViewProfile: handleViewProfile,
    onDownloadQR:  handleDownloadQR,
    onShare:       handleShare,
    onCopy:        handleCopy,
    copied,
    actionError,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">

      {/* Sidebar */}
      <SharedSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav="Dashboard"
      />

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Header */}
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          initials={initials}
        />

        {/* Content row */}
        <div className="flex flex-1 overflow-hidden">

          {/* Scrollable main */}
          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">

            {/* Welcome */}
            <div className="mb-6">
              <h1 className="text-[22px] font-bold text-[#111827] sm:text-[24px]">Welcome back, {firstName} 👋</h1>
              <p className="mt-[4px] text-[14px] text-[#6B7280]">Here&apos;s how your NFC card is performing</p>
            </div>

            {/* Analytics 4-col grid */}
            <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {analyticsCards.map((card) => (
                <AnalyticsCard key={card.label} {...card} />
              ))}
            </div>

              {/* ── Card Tap Mode Toggle ── */}
              {cardUid && (
                <div className="rounded-[12px] border border-[#EBEBEB] bg-white px-5 py-5">
                  <p className="text-[15px] font-bold text-[#111827] mb-1">When Someone Taps Your Card</p>
                  <p className="text-[12px] text-[#9CA3AF] mb-4">Choose what opens when someone scans your NFC card</p>

                  <div className="flex flex-col gap-2 mb-4">
                    {[
                      { value: "profile", label: "Digital Profile", desc: "Show your contact info and social links" },
                      { value: "form",    label: "Lead Form",       desc: "Collect their name, email and message"  },
                    ].map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => setCardAction(opt.value)}
                        className="flex items-start gap-3 rounded-[12px] border p-4 text-left transition-all"
                        style={{ borderColor: cardAction === opt.value ? "#28DC4F" : "#EBEBEB", background: cardAction === opt.value ? "#F0FFF4" : "#fff" }}>
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                          style={{ borderColor: cardAction === opt.value ? "#28DC4F" : "#D1D5DB" }}>
                          {cardAction === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-[#28DC4F]" />}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#111827]">{opt.label}</p>
                          <p className="text-[12px] text-[#9CA3AF]">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {cardAction === "form" && forms.length === 0 && (
                    <p className="mb-3 text-[12px] text-[#9CA3AF]">
                      No forms yet. <a href="/dashboard/forms" className="text-[#28DC4F] font-medium">Create one →</a>
                    </p>
                  )}
                  {cardAction === "form" && forms.length > 1 && (
                    <div className="mb-3">
                      <select value={selectedFormId || ""}
                        onChange={e => setSelectedFormId(e.target.value)}
                        className="w-full rounded-[10px] border border-[#EBEBEB] bg-[#F9FAFB] px-3 py-2.5 text-[13px] text-[#111827] outline-none focus:border-[#28DC4F]">
                        <option value="">Select a form…</option>
                        {forms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      const fId = cardAction === "form" ? (selectedFormId || forms[0]?.id) : null;
                      if (cardAction === "form" && !fId) { window.location.href = "/dashboard/forms"; return; }
                      await saveCardAction(cardAction, fId);
                    }}
                    disabled={savingAction}
                    className="w-full rounded-[10px] py-3 text-[14px] font-bold text-black disabled:opacity-60 transition-colors"
                    style={{ background: actionSaved ? "#16A34A" : "#28DC4F", color: actionSaved ? "#fff" : "#000" }}>
                    {savingAction ? "Saving…" : actionSaved ? "✓ Saved!" : "Save Setting"}
                  </button>

                  {actionError && <p className="mt-2 text-[12px] text-center text-[#EF4444]">{actionError}</p>}
                </div>
              )}

            {/* Recent Activity */}
            <div className="rounded-[12px] border border-[#EBEBEB] bg-white px-6 py-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[15px] font-semibold text-[#111827]">Recent Activity</p>
                <Link href="/dashboard/orders" className="flex items-center gap-1 text-[12px] font-medium text-[#28DC4F] transition-opacity hover:opacity-70">
                  View all
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 3l4 4-4 4"/></svg>
                </Link>
              </div>

              {activityItems.length > 0 ? (
                <div className="divide-y divide-[#F4F4F4]">
                  {activityItems.map((item, i) => (
                    <ActivityItem key={i} {...item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Icon k="box" size={32} color="#D1D5DB" />
                  <p className="text-[13px] font-medium text-[#9CA3AF]">No activity yet</p>
                  <p className="text-[12px] text-[#C4C9D4]">
                    Orders and interactions will appear here.
                  </p>
                </div>
              )}
            </div>

            {/* Mobile profile + actions */}
            <div className="mt-6 xl:hidden">
              <p className="mb-3 text-[15px] font-semibold text-[#111827]">Profile Preview</p>
              <ProfilePreviewCard profile={profile} themeKey={profile?.theme_key || "default"} />
              {profileUrl && (
                <div className="mt-4">
                  <ActionsSection {...actionsProps} />
                </div>
              )}
            </div>
          </main>

          {/* Right panel — desktop only */}
          <aside className="hidden w-[400px] shrink-0 overflow-y-auto border-l border-[#EBEBEB] bg-white p-5 xl:block">
            <p className="mb-4 text-[13px] font-semibold text-[#6B7280]">Profile Preview</p>
            <ProfilePreviewCard profile={profile} themeKey={profile?.theme_key || "default"} />
            {profileUrl && (
              <div className="mt-5">
                <ActionsSection {...actionsProps} />
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}
