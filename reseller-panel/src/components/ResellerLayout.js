"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import authService from "@/services/authService";

const NAV = [
  {
    href: "/dashboard", label: "Dashboard",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  },
  {
    href: "/orders", label: "Orders",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  },
  {
    href: "/orders/new", label: "New Order",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  },
  {
    href: "/commission", label: "Commission",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  },
  {
    href: "/profile", label: "Profile",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
];

export default function ResellerLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [reseller, setReseller]     = useState(null);
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

  function isActive(href) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/orders") return pathname === "/orders" || (pathname.startsWith("/orders/") && pathname !== "/orders/new");
    return pathname.startsWith(href);
  }

  const initials = reseller?.full_name?.charAt(0)?.toUpperCase() || "R";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>

      {/* Sidebar */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40,
        width: 240, background: "#fff", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column",
        transform: sidebarOpen ? "translateX(0)" : undefined,
      }}
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200`}
      >
        {/* Brand */}
        <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 10 }}>
          <Image src="/images/logo.svg" alt="TapMe Labs" width={32} height={32} />
          <div>
            <Image src="/images/logo-text.svg" alt="TapMe Labs" width={88} height={8} />
            <p style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3, letterSpacing: "0.03em" }}>Reseller Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((n) => {
            const active = isActive(n.href);
            return (
              <Link key={n.href} href={n.href} onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  textDecoration: "none", transition: "background 0.12s, color 0.12s",
                  background: active ? "rgba(40,220,79,0.1)" : "transparent",
                  color: active ? "#16a34a" : "#6B7280",
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#111827"; }}}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6B7280"; }}}
              >
                <span style={{ flexShrink: 0, display: "flex" }}>{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #F1F5F9" }}>
          {reseller && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: "#28DC4F",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "#000", flexShrink: 0,
              }}>{initials}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#111827", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{reseller.full_name}</p>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{reseller.email}</p>
                <p style={{ fontSize: 11, color: "#28DC4F", fontWeight: 600, margin: "2px 0 0" }}>₹{Number(reseller.commission_balance || 0).toFixed(2)} balance</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout}
            style={{
              width: "100%", textAlign: "left", fontSize: 12, color: "#EF4444",
              fontWeight: 500, padding: "8px 10px", borderRadius: 8, border: "none",
              background: "transparent", cursor: "pointer", transition: "background 0.12s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            ← Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 30, background: "rgba(0,0,0,0.3)" }}
          className="md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }} className="md:ml-[240px]">
        {/* Top bar */}
        <header style={{
          position: "sticky", top: 0, zIndex: 20, background: "#fff",
          borderBottom: "1px solid #E2E8F0", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", height: 56,
        }}>
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", display: "flex", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 }}>
            {NAV.find((n) => isActive(n.href))?.label || "Dashboard"}
          </p>
          <Link href="/orders/new"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#28DC4F", color: "#000", fontSize: 12,
              fontWeight: 600, padding: "7px 14px", borderRadius: 8,
              textDecoration: "none",
            }}>
            + New Order
          </Link>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 20 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
