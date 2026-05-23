"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import orderService from "@/services/orderService";

// ── Status style maps ─────────────────────────────────────────────────────────

const ORDER_STATUS = {
  pending:    { bg: "#FEF3C7", text: "#D97706", label: "Pending"    },
  processing: { bg: "#DBEAFE", text: "#1D4ED8", label: "Processing" },
  shipped:    { bg: "#FEF9C3", text: "#A16207", label: "Shipped"    },
  delivered:  { bg: "#DCFCE7", text: "#16A34A", label: "Delivered"  },
  cancelled:  { bg: "#FEE2E2", text: "#DC2626", label: "Cancelled"  },
};

const PAYMENT_STATUS = {
  pending:  { bg: "#FEF3C7", text: "#D97706", label: "Pending"  },
  paid:     { bg: "#DCFCE7", text: "#16A34A", label: "Paid"     },
  failed:   { bg: "#FEE2E2", text: "#DC2626", label: "Failed"   },
  refunded: { bg: "#F3E8FF", text: "#7C3AED", label: "Refunded" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function StatusBadge({ map, value }) {
  const s = map[value] ?? { bg: "#F1F5F9", text: "#64748B", label: value ?? "—" };
  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected]       = useState(null);
  const [updating, setUpdating]       = useState(false);
  const [updateError, setUpdateError] = useState("");

  async function fetchOrders() {
    setLoading(true);
    setError("");
    try {
      const res = await orderService.getAllOrders();
      setOrders(res.data?.orders ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  async function handleUpdateOrderStatus(id, order_status) {
    setUpdating(true);
    setUpdateError("");
    try {
      await orderService.updateOrderStatus(id, order_status);
      const fresh = await orderService.getAllOrders();
      const freshOrders = fresh.data?.orders ?? [];
      setOrders(freshOrders);
      // Keep drawer open with updated data
      setSelected((prev) => prev ? freshOrders.find((o) => o.id === prev.id) ?? null : null);
    } catch (err) {
      setUpdateError(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleUpdatePaymentStatus(id, payment_status) {
    setUpdating(true);
    setUpdateError("");
    try {
      await orderService.updatePaymentStatus(id, payment_status);
      const fresh = await orderService.getAllOrders();
      const freshOrders = fresh.data?.orders ?? [];
      setOrders(freshOrders);
      setSelected((prev) => prev ? freshOrders.find((o) => o.id === prev.id) ?? null : null);
    } catch (err) {
      setUpdateError(err.response?.data?.message || "Failed to update payment status.");
    } finally {
      setUpdating(false);
    }
  }

  // Client-side filter on already-loaded data
  const filtered = orders.filter((o) => {
    const term = search.toLowerCase();
    const matchSearch =
      o.order_number?.toLowerCase().includes(term) ||
      o.user?.full_name?.toLowerCase().includes(term) ||
      o.user?.email?.toLowerCase().includes(term);
    const matchFilter =
      statusFilter === "All" || o.order_status === statusFilter.toLowerCase();
    return matchSearch && matchFilter;
  });

  const colCount = 8;

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-col gap-5">

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((f) => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
                style={{
                  background: statusFilter === f ? "#28DC4F" : "#F1F5F9",
                  color: statusFilter === f ? "#000" : "#64748B",
                  border: statusFilter === f ? "none" : "1px solid #E2E8F0",
                }}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders…"
              className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-[13px] outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              style={{ width: "220px" }} />
          </div>
        </div>

        {/* API error */}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600" style={{ border: "1px solid #FECACA" }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  {["Order Number", "Customer", "Product", "Total Amount", "Payment", "Order Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={colCount} className="py-12 text-center text-[13px] text-slate-400">Loading orders…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="py-12 text-center text-[13px] text-slate-400">
                      {orders.length === 0 ? "No orders yet." : "No orders match your search."}
                    </td>
                  </tr>
                ) : filtered.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #F8FAFC" }} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-800">{o.order_number}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-slate-800">{o.user?.full_name ?? "—"}</p>
                      <p className="text-[11px] text-slate-400">{o.user?.email ?? ""}</p>
                    </td>
                    <td className="max-w-[160px] truncate px-5 py-3.5 text-[13px] text-slate-600">
                      {o.product?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-800">
                      ₹{Number(o.total_amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge map={PAYMENT_STATUS} value={o.payment_status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge map={ORDER_STATUS} value={o.order_status} />
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-400">{formatDate(o.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => router.push(`/orders/${o.id}`)}
                        className="rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                        style={{ border: "1px solid #E2E8F0" }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Order detail drawer ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative z-10 flex h-full w-full max-w-[420px] flex-col bg-white shadow-xl">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <h2 className="text-[15px] font-semibold text-slate-800">{selected.order_number}</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-5">

                {/* Details */}
                {/* TODO: Replace drawer with a dedicated /orders/[id] page for richer detail:
                    shipping address map, order timeline, invoice download, etc. */}
                <div className="flex flex-col gap-3">
                  {[
                    ["Customer",    selected.user?.full_name ?? "—"],
                    ["Email",       selected.user?.email     ?? "—"],
                    ["Phone",       selected.user?.phone     ?? "—"],
                    ["Product",     selected.product?.name   ?? "—"],
                    ["Total",       `₹${Number(selected.total_amount).toLocaleString()}`],
                    ["Date",        formatDate(selected.created_at)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <p className="text-[12px] font-medium text-slate-400 shrink-0">{k}</p>
                      <p className="text-[13px] text-slate-800 text-right">{v}</p>
                    </div>
                  ))}

                  {selected.shipping_address && (
                    <div>
                      <p className="text-[12px] font-medium text-slate-400">Shipping Address</p>
                      <p className="mt-0.5 text-[13px] text-slate-800">
                        {typeof selected.shipping_address === "string"
                          ? selected.shipping_address
                          : Object.values(selected.shipping_address).filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: "1px solid #E2E8F0" }} />

                {/* Current statuses */}
                <div className="flex gap-4">
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium text-slate-400">Payment Status</p>
                    <StatusBadge map={PAYMENT_STATUS} value={selected.payment_status} />
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium text-slate-400">Order Status</p>
                    <StatusBadge map={ORDER_STATUS} value={selected.order_status} />
                  </div>
                </div>

                {/* Update error */}
                {updateError && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600" style={{ border: "1px solid #FECACA" }}>
                    {updateError}
                  </div>
                )}

                <div style={{ borderTop: "1px solid #E2E8F0" }} />

                {/* Update order status */}
                <div>
                  <p className="mb-2 text-[12px] font-semibold text-slate-600">Update Order Status</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(ORDER_STATUS).map(([value, style]) => (
                      <button key={value}
                        disabled={updating || selected.order_status === value}
                        onClick={() => handleUpdateOrderStatus(selected.id, value)}
                        className="rounded-full px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ background: style.bg, color: style.text }}>
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Update payment status */}
                <div>
                  <p className="mb-2 text-[12px] font-semibold text-slate-600">Update Payment Status</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(PAYMENT_STATUS).map(([value, style]) => (
                      <button key={value}
                        disabled={updating || selected.payment_status === value}
                        onClick={() => handleUpdatePaymentStatus(selected.id, value)}
                        className="rounded-full px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ background: style.bg, color: style.text }}>
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {updating && (
                  <p className="text-center text-[12px] text-slate-400">Updating…</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
