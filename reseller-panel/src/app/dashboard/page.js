"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ResellerLayout from "@/components/ResellerLayout";
import commissionService from "@/services/commissionService";
import orderService from "@/services/orderService";

const STATUS_COLORS = {
  paid:      { bg: "#DCFCE7", color: "#16A34A" },
  pending:   { bg: "#FEF9C3", color: "#D97706" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626" },
};

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "16px 18px" }}>
      <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, color: accent || "#111827", margin: "6px 0 0" }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "#9CA3AF", margin: "3px 0 0" }}>{sub}</p>}
    </div>
  );
}

const QUICK = [
  { href: "/orders/new", label: "+ New Order",    bg: "#28DC4F", color: "#000" },
  { href: "/orders",     label: "Order History",  bg: "#EFF6FF", color: "#1D4ED8" },
  { href: "/commission", label: "Commission",     bg: "#F5F3FF", color: "#7C3AED" },
  { href: "/profile",    label: "My Profile",     bg: "#F0FDF4", color: "#16A34A" },
];

export default function DashboardPage() {
  const [stats, setStats]   = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      commissionService.dashboardStats(),
      orderService.list({ limit: 5 }),
    ]).then(([s, o]) => {
      setStats(s.data);
      setOrders(o.data.orders || []);
    }).finally(() => setLoading(false));
  }, []);

  const fmt = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <ResellerLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "3px 0 0" }}>Overview of your reseller activity</p>
        </div>

        {loading ? (
          <div style={{ fontSize: 13, color: "#9CA3AF" }}>Loading…</div>
        ) : (
          <>
            {/* Row 1 — order counts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <StatCard label="Total Orders"   value={stats?.total_orders   ?? 0} />
              <StatCard label="Paid"           value={stats?.paid_orders    ?? 0} accent="#16A34A" />
              <StatCard label="Pending"        value={stats?.pending_orders ?? 0} accent="#D97706" />
            </div>

            {/* Row 2 — commission */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <StatCard label="Balance"       value={fmt(stats?.commission_balance)} accent="#28DC4F" sub="Available to use or withdraw" />
              <StatCard label="Total Earned"  value={fmt(stats?.total_earned)} />
              <StatCard label="Commission Rate" value={`${stats?.commission_rate ?? 0}%`} accent="#7C3AED" />
            </div>

            {/* Quick links */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {QUICK.map((q) => (
                <Link key={q.href} href={q.href}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    height: 44, borderRadius: 10, fontSize: 13, fontWeight: 600,
                    textDecoration: "none", background: q.bg, color: q.color,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  {q.label}
                </Link>
              ))}
            </div>

            {/* Recent orders */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>Recent Orders</p>
                <Link href="/orders" style={{ fontSize: 12, color: "#28DC4F", fontWeight: 500, textDecoration: "none" }}>View all</Link>
              </div>
              {orders.length === 0 ? (
                <div style={{ padding: "32px 18px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>No orders yet.</p>
                  <Link href="/orders/new" style={{ fontSize: 13, color: "#28DC4F", fontWeight: 500, textDecoration: "none" }}>Create your first order →</Link>
                </div>
              ) : (
                <div>
                  {orders.map((o) => (
                    <Link key={o.id} href={`/orders/${o.id}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid #F8FAFC", textDecoration: "none", transition: "background 0.1s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "#111827", margin: 0 }}>{o.customer_name || "—"}</p>
                        <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>₹{Number(o.order_total).toLocaleString("en-IN")}</p>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                        ...(STATUS_COLORS[o.status] || { bg: "#F1F5F9", color: "#64748B" }),
                        background: (STATUS_COLORS[o.status] || { bg: "#F1F5F9" }).bg,
                      }}>{o.status}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ResellerLayout>
  );
}
