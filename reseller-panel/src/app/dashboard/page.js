"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ResellerLayout from "@/components/ResellerLayout";
import commissionService from "@/services/commissionService";
import orderService from "@/services/orderService";

function StatCard({ label, value, sub, color = "#111827" }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
      <p className="text-[12px] text-[#6B7280] mb-1">{label}</p>
      <p className="text-[24px] font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{sub}</p>}
    </div>
  );
}

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
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-[18px] font-bold text-[#111827]">Dashboard</h2>
          <p className="text-[13px] text-[#6B7280]">Overview of your reseller activity</p>
        </div>

        {loading ? (
          <div className="text-[13px] text-[#6B7280]">Loading…</div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Orders"     value={stats?.total_orders   ?? 0} />
              <StatCard label="Paid Orders"      value={stats?.paid_orders    ?? 0} color="#16a34a" />
              <StatCard label="Pending Orders"   value={stats?.pending_orders ?? 0} color="#D97706" />
              <StatCard label="Commission Rate"  value={`${stats?.commission_rate ?? 0}%`} color="#7C3AED" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Commission Balance" value={fmt(stats?.commission_balance)} color="#28DC4F" sub="Available to use or withdraw" />
              <StatCard label="Total Earned"       value={fmt(stats?.total_earned)}        color="#111827" />
              <StatCard label="Total Withdrawn"    value={fmt(stats?.total_withdrawn)}     color="#6B7280" />
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { href: "/orders/new",   label: "Create Order",    bg: "#28DC4F", tc: "#000" },
                { href: "/orders",       label: "Order History",   bg: "#EFF6FF", tc: "#1D4ED8" },
                { href: "/commission",   label: "Commission",      bg: "#F5F3FF", tc: "#7C3AED" },
                { href: "/profile",      label: "My Profile",      bg: "#F0FDF4", tc: "#16A34A" },
              ].map((q) => (
                <Link key={q.href} href={q.href}
                  className="flex items-center justify-center h-12 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80"
                  style={{ background: q.bg, color: q.tc }}
                >
                  {q.label}
                </Link>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-xl border border-[#E2E8F0]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <h3 className="text-[13px] font-semibold text-[#111827]">Recent Orders</h3>
                <Link href="/orders" className="text-[12px] text-[#28DC4F] font-medium">View all</Link>
              </div>
              <div className="divide-y divide-[#F8FAFC]">
                {orders.length === 0 ? (
                  <p className="px-5 py-8 text-[13px] text-[#9CA3AF] text-center">No orders yet. <Link href="/orders/new" className="text-[#28DC4F] font-medium">Create your first order →</Link></p>
                ) : orders.map((o) => (
                  <Link key={o.id} href={`/orders/${o.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-[#F8FAFC] transition-colors">
                    <div>
                      <p className="text-[13px] font-medium text-[#111827]">{o.customer_name || "—"}</p>
                      <p className="text-[11px] text-[#6B7280]">₹{Number(o.order_total).toLocaleString("en-IN")}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${o.status === "paid" ? "bg-green-100 text-green-700" : o.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {o.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ResellerLayout>
  );
}
