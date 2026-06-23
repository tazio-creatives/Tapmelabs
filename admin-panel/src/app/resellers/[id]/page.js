"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import api from "@/services/api";

const STATUS_COLORS = {
  paid:      { bg: "#DCFCE7", color: "#16A34A" },
  pending:   { bg: "#FEF9C3", color: "#D97706" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626" },
  refunded:  { bg: "#F1F5F9", color: "#64748B" },
};

const PAYOUT_COLORS = {
  pending:  { bg: "#FEF9C3", color: "#D97706" },
  approved: { bg: "#DBEAFE", color: "#1D4ED8" },
  paid:     { bg: "#DCFCE7", color: "#16A34A" },
  rejected: { bg: "#FEE2E2", color: "#DC2626" },
};

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F8FAFC] py-2.5 last:border-0">
      <span className="text-[12px] text-[#64748B]">{label}</span>
      <span className="text-[13px] font-medium text-[#0F172A]">{value ?? "—"}</span>
    </div>
  );
}

export default function ResellerDetailPage() {
  const { id } = useParams();
  const [reseller, setReseller]   = useState(null);
  const [orders, setOrders]       = useState([]);
  const [payouts, setPayouts]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ type: "", text: "" });
  const [commRate, setCommRate]   = useState("");

  useEffect(() => {
    Promise.all([
      api.get(`/admin/resellers/${id}`),
      api.get(`/admin/resellers/${id}/orders`),
      api.get("/admin/resellers/payouts"),
    ]).then(([r, o, p]) => {
      setReseller(r.data.reseller || r.data);
      setCommRate(String(r.data.reseller?.commission_rate || r.data.commission_rate || "10"));
      setOrders(o.data.orders || o.data || []);
      const allPayouts = p.data.payouts || p.data || [];
      setPayouts(allPayouts.filter((px) => px.reseller_id === id));
    }).finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status) {
    setSaving(true); setMsg({ type: "", text: "" });
    try {
      const { data } = await api.patch(`/admin/resellers/${id}/status`, { status });
      setReseller(data.reseller || data);
      setMsg({ type: "success", text: `Status updated to ${status}` });
    } catch { setMsg({ type: "error", text: "Failed to update status" }); }
    finally { setSaving(false); }
  }

  async function updateCommission(e) {
    e.preventDefault();
    setSaving(true); setMsg({ type: "", text: "" });
    try {
      const { data } = await api.patch(`/admin/resellers/${id}/commission-rate`, { commission_rate: Number(commRate) });
      setReseller(data.reseller || data);
      setMsg({ type: "success", text: "Commission rate updated" });
    } catch { setMsg({ type: "error", text: "Failed to update commission rate" }); }
    finally { setSaving(false); }
  }

  async function handlePayout(payoutId, action) {
    setSaving(true); setMsg({ type: "", text: "" });
    try {
      await api.post(`/admin/resellers/payouts/${payoutId}/${action}`);
      const { data } = await api.get("/admin/resellers/payouts");
      const all = data.payouts || data || [];
      setPayouts(all.filter((px) => px.reseller_id === id));
      setMsg({ type: "success", text: `Payout ${action}d` });
    } catch { setMsg({ type: "error", text: `Failed to ${action} payout` }); }
    finally { setSaving(false); }
  }

  if (loading) return <AdminLayout title="Reseller"><div className="text-[13px] text-[#94A3B8]">Loading…</div></AdminLayout>;
  if (!reseller) return <AdminLayout title="Reseller"><div className="text-[13px] text-red-500">Reseller not found</div></AdminLayout>;

  const fmt = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <AdminLayout title="Manage Reseller">
      <div className="max-w-4xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/resellers" className="text-[13px] text-[#64748B] hover:text-[#0F172A]">← Resellers</Link>
          <span className="text-[#E2E8F0]">/</span>
          <h1 className="text-[20px] font-bold text-[#0F172A]">{reseller.full_name}</h1>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold ml-1"
            style={reseller.status === "active" ? { background: "#DCFCE7", color: "#16A34A" } : { background: "#FEE2E2", color: "#DC2626" }}>
            {reseller.status}
          </span>
        </div>

        {msg.text && (
          <div className={`rounded-lg border px-4 py-3 text-[13px] ${msg.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600"}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Profile */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <h3 className="mb-3 text-[13px] font-semibold text-[#0F172A]">Profile</h3>
            <Row label="Email"   value={reseller.email} />
            <Row label="Phone"   value={reseller.phone} />
            <Row label="Joined"  value={new Date(reseller.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
          </div>

          {/* Commission stats */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <h3 className="mb-3 text-[13px] font-semibold text-[#0F172A]">Commission Stats</h3>
            <Row label="Balance"    value={fmt(reseller.commission_balance)} />
            <Row label="Total Earned"    value={fmt(reseller.total_earned)} />
            <Row label="Total Withdrawn" value={fmt(reseller.total_withdrawn)} />
          </div>

          {/* Commission rate */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <h3 className="mb-3 text-[13px] font-semibold text-[#0F172A]">Commission Rate</h3>
            <form onSubmit={updateCommission} className="flex gap-3">
              <div className="relative flex-1">
                <input type="number" min={0} max={100} step={0.5} required
                  value={commRate} onChange={(e) => setCommRate(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-[13px] text-[#0F172A] outline-none focus:border-[#28DC4F] pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#94A3B8]">%</span>
              </div>
              <button type="submit" disabled={saving}
                className="rounded-lg px-4 py-2.5 text-[13px] font-semibold text-black disabled:opacity-60"
                style={{ background: "#28DC4F" }}>
                Update
              </button>
            </form>
          </div>

          {/* Status control */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
            <h3 className="mb-3 text-[13px] font-semibold text-[#0F172A]">Account Status</h3>
            <p className="mb-4 text-[12px] text-[#64748B]">Blocking a reseller prevents them from logging in.</p>
            <div className="flex gap-3">
              <button disabled={saving || reseller.status === "active"} onClick={() => updateStatus("active")}
                className="flex-1 rounded-lg border border-[#BBF7D0] py-2.5 text-[13px] font-medium text-[#16A34A] hover:bg-[#F0FDF4] transition-colors disabled:opacity-40">
                Activate
              </button>
              <button disabled={saving || reseller.status === "blocked"} onClick={() => updateStatus("blocked")}
                className="flex-1 rounded-lg border border-[#FECACA] py-2.5 text-[13px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors disabled:opacity-40">
                Block
              </button>
            </div>
          </div>
        </div>

        {/* Payout requests */}
        {payouts.length > 0 && (
          <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h3 className="text-[13px] font-semibold text-[#0F172A]">Payout Requests</h3>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {payouts.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-medium text-[#0F172A]">{fmt(p.amount)}</p>
                    <p className="text-[11px] text-[#94A3B8]">
                      {p.upi_id ? `UPI: ${p.upi_id}` : p.bank_name ? `Bank: ${p.bank_name}` : "—"}
                      {" · "}{new Date(p.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={PAYOUT_COLORS[p.status] || { background: "#F1F5F9", color: "#64748B" }}>
                      {p.status}
                    </span>
                    {p.status === "pending" && (
                      <>
                        <button onClick={() => handlePayout(p.id, "approve")} disabled={saving}
                          className="rounded-lg border border-[#BBF7D0] px-3 py-1.5 text-[12px] font-medium text-[#16A34A] hover:bg-[#F0FDF4] disabled:opacity-50">
                          Approve
                        </button>
                        <button onClick={() => handlePayout(p.id, "reject")} disabled={saving}
                          className="rounded-lg border border-[#FECACA] px-3 py-1.5 text-[12px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] disabled:opacity-50">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-[#0F172A]">Orders</h3>
            <span className="text-[12px] text-[#94A3B8]">{orders.length} orders</span>
          </div>
          {orders.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-[#94A3B8]">No orders yet.</div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] text-[#94A3B8] uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Customer</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Total</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Commission</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#0F172A]">{o.customer_name || "—"}</p>
                      <p className="text-[11px] text-[#94A3B8]">{o.customer_phone || ""}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#475569]">₹{Number(o.order_total).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 hidden md:table-cell font-medium text-[#16A34A]">₹{Number(o.commission_amount).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={STATUS_COLORS[o.status] || { background: "#F1F5F9", color: "#64748B" }}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#94A3B8]">
                      {new Date(o.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
