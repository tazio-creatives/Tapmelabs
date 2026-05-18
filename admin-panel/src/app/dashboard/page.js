"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import dashboardService from "@/services/dashboardService";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatRupees(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

const ORDER_STATUS_STYLES = {
  pending:    { bg: "#FEF3C7", text: "#D97706" },
  processing: { bg: "#DBEAFE", text: "#1D4ED8" },
  shipped:    { bg: "#FEF9C3", text: "#A16207" },
  delivered:  { bg: "#DCFCE7", text: "#16A34A" },
  cancelled:  { bg: "#FEE2E2", text: "#DC2626" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, color, icon }) {
  return (
    <div className="rounded-xl bg-white p-5" style={{ border: "1px solid #E2E8F0" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 text-[26px] font-bold text-slate-900">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: color + "1A" }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniBar({ taps, maxTaps }) {
  const pct = maxTaps > 0 ? Math.round((taps / maxTaps) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ flex: 1 }}>
      <span className="text-[11px] text-slate-500">{taps}</span>
      <div className="w-full rounded-sm" style={{ height: "60px", background: "#F1F5F9", position: "relative", overflow: "hidden" }}>
        <div className="absolute bottom-0 left-0 right-0 rounded-sm" style={{ height: pct + "%", background: "#28DC4F", opacity: 0.85 }} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError("");
      try {
        const res = await dashboardService.getStats();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const stats       = data?.stats       ?? {};
  const recentOrders = data?.recent_orders ?? [];
  const dailyTaps   = data?.daily_taps  ?? [];
  const maxTaps     = dailyTaps.length ? Math.max(...dailyTaps.map((d) => d.taps), 1) : 1;
  const totalTaps   = dailyTaps.reduce((a, d) => a + d.taps, 0);

  const STAT_CARDS = [
    { label: "Total Revenue",   value: formatRupees(stats.total_revenue ?? 0),          color: "#28DC4F", icon: "₹" },
    { label: "Total Orders",    value: (stats.total_orders ?? 0).toLocaleString("en-IN"), color: "#3B82F6", icon: "🛍" },
    { label: "Active Products", value: stats.total_active_products ?? 0,                color: "#8B5CF6", icon: "📦" },
    { label: "Total Customers", value: (stats.total_customers ?? 0).toLocaleString("en-IN"), color: "#F59E0B", icon: "👥" },
  ];

  const QUICK_OVERVIEW = [
    { label: "Active NFC Cards",    value: stats.active_nfc_cards      ?? 0, color: "#28DC4F" },
    { label: "Pending Orders",      value: stats.pending_orders        ?? 0, color: "#F59E0B" },
    { label: "Out of Stock SKUs",   value: stats.out_of_stock_products ?? 0, color: "#EF4444" },
    { label: "New Customers Today", value: stats.new_customers_today   ?? 0, color: "#3B82F6" },
  ];

  return (
    <AdminLayout title="Dashboard">

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600" style={{ border: "1px solid #FECACA" }}>
          {error}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((s) => (
          loading
            ? <div key={s.label} className="rounded-xl bg-white p-5 animate-pulse" style={{ border: "1px solid #E2E8F0", height: "96px" }} />
            : <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Recent orders table */}
        <div className="xl:col-span-2 rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <h2 className="text-[14px] font-semibold text-slate-800">Recent Orders</h2>
            <a href="/orders" className="text-[12px] font-medium" style={{ color: "#28DC4F" }}>View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {["Order", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="py-10 text-center text-[13px] text-slate-400">Loading…</td></tr>
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan={6} className="py-10 text-center text-[13px] text-slate-400">No orders yet.</td></tr>
                ) : recentOrders.map((o) => {
                  const s = ORDER_STATUS_STYLES[o.order_status] ?? ORDER_STATUS_STYLES.pending;
                  return (
                    <tr key={o.id} style={{ borderBottom: "1px solid #F8FAFC" }} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 text-[13px] font-medium text-slate-800">{o.order_number}</td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-600">{o.user?.full_name ?? "—"}</td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-600">{o.product?.name ?? "—"}</td>
                      <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-800">{formatRupees(o.total_amount)}</td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize"
                          style={{ background: s.bg, color: s.text }}>
                          {o.order_status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-slate-400">{formatDate(o.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* NFC tap activity */}
          <div className="rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
              <h2 className="text-[14px] font-semibold text-slate-800">NFC Taps This Week</h2>
              <p className="mt-0.5 text-[12px] text-slate-400">
                {loading ? "Loading…" : `${totalTaps.toLocaleString("en-IN")} total taps`}
              </p>
            </div>
            {loading ? (
              <div className="px-5 py-6 text-center text-[13px] text-slate-400">Loading…</div>
            ) : (
              <>
                <div className="flex items-end gap-2 px-5 py-4" style={{ height: "130px" }}>
                  {dailyTaps.map((d) => (
                    <MiniBar key={d.date} taps={d.taps} maxTaps={maxTaps} />
                  ))}
                </div>
                <div className="flex gap-2 px-5 pb-4">
                  {dailyTaps.map((d) => (
                    <div key={d.date} className="flex-1 text-center text-[10px] text-slate-400">{d.day}</div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quick overview */}
          <div className="rounded-xl bg-white p-5" style={{ border: "1px solid #E2E8F0" }}>
            <h2 className="mb-4 text-[14px] font-semibold text-slate-800">Quick Overview</h2>
            {QUICK_OVERVIEW.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid #F8FAFC" }}>
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-[13px] text-slate-600">{item.label}</span>
                </div>
                <span className="text-[14px] font-bold text-slate-800">
                  {loading ? "…" : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
