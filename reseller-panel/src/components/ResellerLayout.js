"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import authService from "@/services/authService";

const NAV = [
  { href: "/dashboard",         label: "Dashboard",   icon: "▦" },
  { href: "/orders",            label: "Orders",      icon: "📋" },
  { href: "/orders/new",        label: "New Order",   icon: "+" },
  { href: "/commission",        label: "Commission",  icon: "₹" },
  { href: "/profile",           label: "Profile",     icon: "👤" },
];

export default function ResellerLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [reseller, setReseller] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("resellerToken");
    if (!token) { router.replace("/login"); return; }
    authService.me()
      .then((r) => setReseller(r.data))
      .catch(() => { localStorage.removeItem("resellerToken"); router.replace("/login"); });
  }, [router]);

  async function handleLogout() {
    try { await authService.logout(); } catch {}
    localStorage.removeItem("resellerToken");
    localStorage.removeItem("resellerRefreshToken");
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        {/* Brand */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[#F1F5F9]">
          <div className="w-8 h-8 rounded-lg bg-[#28DC4F] flex items-center justify-center text-white font-black text-lg">T</div>
          <div>
            <p className="text-[13px] font-bold text-[#111827] leading-tight">TapMe Labs</p>
            <p className="text-[10px] text-[#6B7280]">Reseller Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${active ? "bg-[#28DC4F]/10 text-[#16a34a]" : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#111827]"}`}
              >
                <span className="text-base w-5 text-center">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Reseller info + logout */}
        <div className="px-4 py-4 border-t border-[#F1F5F9]">
          {reseller && (
            <div className="mb-3">
              <p className="text-[12px] font-semibold text-[#111827] truncate">{reseller.full_name}</p>
              <p className="text-[11px] text-[#6B7280] truncate">{reseller.email}</p>
              <p className="text-[11px] text-[#28DC4F] font-semibold mt-1">Balance: ₹{Number(reseller.commission_balance).toFixed(2)}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left text-[12px] text-[#EF4444] font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-5 py-3">
          <button className="md:hidden text-[#6B7280]" onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 className="text-[14px] font-semibold text-[#111827]">
            {NAV.find((n) => pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href)))?.label || "Dashboard"}
          </h1>
          <Link href="/orders/new" className="hidden md:flex items-center gap-1.5 bg-[#28DC4F] text-black text-[12px] font-semibold px-3 py-1.5 rounded-lg">
            + New Order
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
