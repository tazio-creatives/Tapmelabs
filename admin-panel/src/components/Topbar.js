"use client";

import { useState } from "react";
import Link from "next/link";

export default function Topbar({ title, onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header
      className="flex items-center gap-4 bg-white px-6"
      style={{ height: "64px", borderBottom: "1px solid #E2E8F0", flexShrink: 0 }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Page title */}
      <h1 className="text-[17px] font-semibold text-slate-800">{title}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:block">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-[13px] text-slate-700 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
          style={{ width: "220px" }}
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {/* Badge */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full" style={{ background: "#28DC4F" }} />
        </button>

        {notifOpen && (
          <div
            className="absolute right-0 z-50 mt-2 rounded-xl bg-white shadow-lg"
            style={{ width: "300px", border: "1px solid #E2E8F0", top: "100%" }}
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-[13px] font-semibold text-slate-800">Notifications</p>
            </div>
            {[
              { text: "New order #ORD-9021 received", time: "2 min ago", dot: "#28DC4F" },
              { text: "Customer Maya Iyengar registered", time: "14 min ago", dot: "#3B82F6" },
              { text: "NFC card assigned to order #8847", time: "1 hr ago", dot: "#F59E0B" },
            ].map((n, i) => (
              <div key={i} className="flex gap-3 px-4 py-3 hover:bg-slate-50">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: n.dot }} />
                <div>
                  <p className="text-[12px] text-slate-700">{n.text}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{n.time}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-slate-100 px-4 py-3 text-center">
              <button className="text-[12px] font-medium" style={{ color: "#28DC4F" }}>
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white"
            style={{ background: "#28DC4F" }}
          >
            A
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[13px] font-medium text-slate-800">Admin</p>
            <p className="text-[11px] text-slate-400">admin@tapmelabs.com</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {userOpen && (
          <div
            className="absolute right-0 z-50 mt-2 rounded-xl bg-white shadow-lg"
            style={{ width: "180px", border: "1px solid #E2E8F0", top: "100%" }}
          >
            {[
              { label: "Profile", href: "/settings" },
              { label: "Settings", href: "/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setUserOpen(false)}
                className="block px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-slate-100" />
            <Link
              href="/login"
              onClick={() => setUserOpen(false)}
              className="block px-4 py-2.5 text-[13px] text-red-500 hover:bg-slate-50"
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
