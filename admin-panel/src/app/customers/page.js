"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import customerService from "@/services/customerService";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function AccountBadge({ status }) {
  const active = status === "active";
  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: active ? "#DCFCE7" : "#F1F5F9", color: active ? "#16A34A" : "#64748B" }}>
      {active ? "Active" : status ?? "—"}
    </span>
  );
}

function ProfileBadge({ hasProfile }) {
  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: hasProfile ? "#DBEAFE" : "#F1F5F9", color: hasProfile ? "#1D4ED8" : "#94A3B8" }}>
      {hasProfile ? "Has Profile" : "No Profile"}
    </span>
  );
}

const NFC_STATUS_COLOR = {
  active:     "#16A34A",
  unassigned: "#D97706",
  locked:     "#DC2626",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [customers, setCustomers]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError]     = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError("");
      try {
        const res = await customerService.getAllCustomers();
        setCustomers(res.data?.customers ?? []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load customers.");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  async function openDetail(customer) {
    setSelected({ ...customer, _loading: true });
    setDetailError("");
    setDetailLoading(true);
    try {
      const res = await customerService.getCustomerById(customer.id);
      setSelected(res.data?.customer ?? customer);
    } catch (err) {
      setDetailError(err.response?.data?.message || "Failed to load customer details.");
      setSelected(customer);
    } finally {
      setDetailLoading(false);
    }
  }

  // Client-side search on already-loaded list
  const filtered = customers.filter((c) => {
    const t = search.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(t) ||
      c.email?.toLowerCase().includes(t) ||
      c.phone?.includes(t)
    );
  });

  const colCount = 7;

  return (
    <AdminLayout title="Customers">
      <div className="flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[13px] text-slate-500">
              {loading ? "Loading…" : `${customers.length} total customers`}
            </p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…"
              className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-[13px] outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              style={{ width: "260px" }} />
          </div>
        </div>

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
                  {["Customer", "Phone", "Profile Status", "Total Orders", "Joined Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={colCount} className="py-12 text-center text-[13px] text-slate-400">Loading customers…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="py-12 text-center text-[13px] text-slate-400">
                      {customers.length === 0 ? "No customers yet." : "No customers match your search."}
                    </td>
                  </tr>
                ) : filtered.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F8FAFC" }} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white" style={{ background: "#28DC4F" }}>
                          {c.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-slate-800">{c.full_name}</p>
                          <p className="text-[11px] text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-600">{c.phone ?? "—"}</td>
                    <td className="px-5 py-3.5"><ProfileBadge hasProfile={c.has_profile} /></td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-800">{c.order_count ?? 0}</td>
                    <td className="px-5 py-3.5 text-[12px] text-slate-400">{formatDate(c.created_at)}</td>
                    <td className="px-5 py-3.5"><AccountBadge status={c.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(c)}
                          className="rounded-md px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100">
                          View
                        </button>
                        {/* TODO: Implement block/unblock customer via PUT /api/admin/customers/:id/block
                            Update user.status to "blocked" and show reason modal */}
                        <button disabled
                          className="rounded-md px-2.5 py-1 text-[11px] font-medium text-red-300 cursor-not-allowed">
                          Block
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Customer detail drawer ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative z-10 flex h-full w-full max-w-[400px] flex-col bg-white shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E2E8F0" }}>
              <h2 className="text-[15px] font-semibold text-slate-800">Customer Details</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {detailLoading ? (
                <p className="py-10 text-center text-[13px] text-slate-400">Loading details…</p>
              ) : (
                <div className="flex flex-col gap-5">

                  {detailError && (
                    <div className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600" style={{ border: "1px solid #FECACA" }}>
                      {detailError}
                    </div>
                  )}

                  {/* Avatar + name */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white" style={{ background: "#28DC4F" }}>
                      {selected.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-[16px] font-semibold text-slate-900">{selected.full_name}</p>
                      <p className="text-[12px] text-slate-400">{selected.email}</p>
                    </div>
                  </div>

                  {/* User info grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Phone",        selected.phone ?? "—"],
                      ["Joined",       formatDate(selected.created_at)],
                      ["Orders",       selected.order_count ?? 0],
                      ["Total Spent",  selected.total_spent != null ? `₹${Number(selected.total_spent).toLocaleString()}` : "—"],
                      ["NFC Cards",    selected.nfc_card_count ?? 0],
                      ["Account",      selected.status ?? "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-lg p-3" style={{ background: "#F8FAFC" }}>
                        <p className="text-[11px] text-slate-400">{k}</p>
                        <p className="mt-0.5 text-[14px] font-semibold text-slate-800">{String(v)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Profile section */}
                  {selected.profile ? (
                    <>
                      <div style={{ borderTop: "1px solid #E2E8F0" }} />
                      <div>
                        <p className="mb-2 text-[12px] font-semibold text-slate-500 uppercase tracking-wide">Profile</p>
                        <div className="flex flex-col gap-2">
                          {[
                            ["Name",        selected.profile.name       ?? "—"],
                            ["Designation", selected.profile.designation ?? "—"],
                            ["Company",     selected.profile.company_name ?? "—"],
                            ["Slug",        selected.profile.slug        ?? "—"],
                          ].map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <p className="text-[12px] text-slate-400">{k}</p>
                              <p className="text-[12px] text-slate-700">{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-[12px] text-slate-400">No profile created yet.</p>
                  )}

                  {/* NFC cards section */}
                  {selected.nfc_cards?.length > 0 && (
                    <>
                      <div style={{ borderTop: "1px solid #E2E8F0" }} />
                      <div>
                        <p className="mb-2 text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                          NFC Cards ({selected.nfc_cards.length})
                        </p>
                        <div className="flex flex-col gap-2">
                          {selected.nfc_cards.map((card) => (
                            <div key={card.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "#F8FAFC" }}>
                              <p className="text-[12px] font-mono text-slate-700">{card.card_uid}</p>
                              <span className="text-[11px] font-semibold" style={{ color: NFC_STATUS_COLOR[card.status] ?? "#64748B" }}>
                                {card.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Orders section */}
                  {selected.orders?.length > 0 && (
                    <>
                      <div style={{ borderTop: "1px solid #E2E8F0" }} />
                      <div>
                        <p className="mb-2 text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                          Recent Orders ({selected.orders.length})
                        </p>
                        {/* TODO: Add "View all orders" link to /orders?customer=id once filtered
                            orders page is supported */}
                        <div className="flex flex-col gap-2">
                          {selected.orders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "#F8FAFC" }}>
                              <div>
                                <p className="text-[12px] font-semibold text-slate-700">{order.order_number}</p>
                                <p className="text-[11px] text-slate-400">{order.product?.name ?? "—"}</p>
                              </div>
                              <p className="text-[12px] font-semibold text-slate-800">
                                ₹{Number(order.total_amount).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* TODO: Add Edit Customer button to update full_name/phone/status
                      via PUT /api/admin/customers/:id when that endpoint is added */}

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
