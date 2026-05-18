"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import nfcCardService from "@/services/nfcCardService";
import customerService from "@/services/customerService";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  active:     { bg: "#DCFCE7", text: "#16A34A", label: "Active"     },
  unassigned: { bg: "#FEF9C3", text: "#A16207", label: "Unassigned" },
  locked:     { bg: "#FEE2E2", text: "#DC2626", label: "Locked"     },
};

const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NFCCardsPage() {
  const [cards, setCards]         = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");

  // "Add NFC Card" modal
  const [addModal, setAddModal]   = useState(false);
  const [addUid, setAddUid]       = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError]   = useState("");

  // "Assign" modal
  const [assignModal, setAssignModal]   = useState(null); // card object
  const [selCustomer, setSelCustomer]   = useState(null); // full customer obj
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError]   = useState("");

  // Per-row action loading
  const [actionId, setActionId] = useState("");

  // ── Data fetching ───────────────────────────────────────────────────────────

  async function fetchCards() {
    setLoading(true);
    setError("");
    try {
      const res = await nfcCardService.getAllCards();
      setCards(res.data?.cards ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load NFC cards.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomers() {
    try {
      const res = await customerService.getAllCustomers();
      setCustomers(res.data?.customers ?? []);
    } catch {
      // Non-critical — assign modal will show empty dropdown
    }
  }

  useEffect(() => {
    fetchCards();
    fetchCustomers();
  }, []);

  // ── Create card ─────────────────────────────────────────────────────────────

  async function handleCreate(e) {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      await nfcCardService.createCard(addUid.trim());
      // TODO: Trigger physical NFC card write/programming workflow here.
      // Example: send card_uid to an NFC writer service or print queue so the
      // physical card is programmed with the profile URL before shipping.
      setAddModal(false);
      setAddUid("");
      fetchCards();
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to create card.");
    } finally {
      setAddLoading(false);
    }
  }

  // ── Assign card ─────────────────────────────────────────────────────────────

  function openAssignModal(card) {
    setAssignModal(card);
    setSelCustomer(null);
    setAssignError("");
  }

  async function handleAssign(e) {
    e.preventDefault();
    if (!selCustomer?.id || !selCustomer?.profile?.id) {
      setAssignError("Selected customer must have a profile.");
      return;
    }
    setAssignLoading(true);
    setAssignError("");
    try {
      await nfcCardService.assignCard(
        assignModal.id,
        selCustomer.id,
        selCustomer.profile.id
      );
      setAssignModal(null);
      setSelCustomer(null);
      fetchCards();
    } catch (err) {
      setAssignError(err.response?.data?.message || "Failed to assign card.");
    } finally {
      setAssignLoading(false);
    }
  }

  // ── Lock / Unlock / Delete ──────────────────────────────────────────────────

  async function handleLock(id) {
    setActionId(id);
    try {
      await nfcCardService.lockCard(id);
      fetchCards();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to lock card.");
    } finally {
      setActionId("");
    }
  }

  async function handleUnlock(id) {
    setActionId(id);
    try {
      await nfcCardService.unlockCard(id);
      fetchCards();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unlock card.");
    } finally {
      setActionId("");
    }
  }

  async function handleDelete(id, uid) {
    if (!confirm(`Deactivate card "${uid}"? This will lock the card.`)) return;
    setActionId(id);
    try {
      await nfcCardService.deleteCard(id);
      fetchCards();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate card.");
    } finally {
      setActionId("");
    }
  }

  // ── Filter / Search (client-side) ───────────────────────────────────────────

  const filtered = cards.filter((c) => {
    const t = search.toLowerCase();
    const matchSearch =
      c.card_uid?.toLowerCase().includes(t) ||
      c.user?.full_name?.toLowerCase().includes(t) ||
      c.profile?.slug?.toLowerCase().includes(t);
    const matchFilter =
      filter === "All" || c.status === filter.toLowerCase();
    return matchSearch && matchFilter;
  });

  // ── Summary counts ──────────────────────────────────────────────────────────

  const counts = {
    total:      cards.length,
    active:     cards.filter((c) => c.status === "active").length,
    unassigned: cards.filter((c) => c.status === "unassigned").length,
    locked:     cards.filter((c) => c.status === "locked").length,
  };

  const colCount = 6;

  return (
    <AdminLayout title="NFC Cards">
      <div className="flex flex-col gap-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Cards", value: counts.total,      color: "#3B82F6" },
            { label: "Active",      value: counts.active,     color: "#28DC4F" },
            { label: "Unassigned",  value: counts.unassigned, color: "#F59E0B" },
            { label: "Locked",      value: counts.locked,     color: "#EF4444" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white p-4" style={{ border: "1px solid #E2E8F0" }}>
              <p className="text-[12px] text-slate-500">{s.label}</p>
              <p className="mt-1 text-[24px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + actions row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {["All", "Active", "Unassigned", "Locked"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
                style={{ background: filter === f ? "#28DC4F" : "#F1F5F9", color: filter === f ? "#000" : "#64748B", border: filter === f ? "none" : "1px solid #E2E8F0" }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cards…"
                className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-[13px] outline-none focus:border-green-400"
                style={{ width: "220px" }} />
            </div>
            <button onClick={() => { setAddModal(true); setAddUid(""); setAddError(""); }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold text-black"
              style={{ background: "#28DC4F" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Card
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600" style={{ border: "1px solid #FECACA" }}>{error}</div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  {["Card UID", "Customer", "Profile", "Status", "Created", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={colCount} className="py-12 text-center text-[13px] text-slate-400">Loading NFC cards…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="py-12 text-center text-[13px] text-slate-400">
                      {cards.length === 0 ? "No NFC cards yet. Add your first card." : "No cards match your search."}
                    </td>
                  </tr>
                ) : filtered.map((c) => {
                  const s = STATUS_STYLES[c.status] ?? STATUS_STYLES.unassigned;
                  const busy = actionId === c.id;
                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid #F8FAFC" }} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5 text-[12px] font-mono text-slate-600 max-w-[160px] truncate" title={c.card_uid}>
                        {c.card_uid}
                      </td>
                      <td className="px-4 py-3.5">
                        {c.user ? (
                          <>
                            <p className="text-[13px] font-medium text-slate-800">{c.user.full_name}</p>
                            <p className="text-[11px] text-slate-400">{c.user.email}</p>
                          </>
                        ) : (
                          <span className="text-[12px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-slate-500">
                        {c.profile?.slug ?? "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: s.bg, color: s.text }}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-slate-400">{formatDate(c.created_at)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {c.status === "unassigned" && (
                            <button onClick={() => openAssignModal(c)} disabled={busy}
                              className="rounded-md px-2.5 py-1 text-[11px] font-semibold text-black disabled:opacity-40"
                              style={{ background: "#28DC4F" }}>
                              Assign
                            </button>
                          )}
                          {c.status === "active" && (
                            <button onClick={() => handleLock(c.id)} disabled={busy}
                              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-40">
                              {busy ? "…" : "Lock"}
                            </button>
                          )}
                          {c.status === "locked" && (
                            <button onClick={() => handleUnlock(c.id)} disabled={busy}
                              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-green-600 hover:bg-green-50 disabled:opacity-40">
                              {busy ? "…" : "Unlock"}
                            </button>
                          )}
                          <button onClick={() => handleDelete(c.id, c.card_uid)} disabled={busy}
                            className="rounded-md px-2.5 py-1 text-[11px] font-medium text-red-400 hover:bg-red-50 disabled:opacity-40">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add NFC Card Modal ── */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddModal(false)} />
          <div className="relative z-10 w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="mb-1 text-[16px] font-semibold text-slate-800">Add NFC Card</h2>
            <p className="mb-5 text-[12px] text-slate-400">
              Enter the UID printed on or scanned from the physical card.
              {/* TODO: Add NFC reader integration to auto-fill card_uid by tapping
                  the physical card on a connected reader device. */}
            </p>
            {addError && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600" style={{ border: "1px solid #FECACA" }}>{addError}</div>
            )}
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">Card UID <span className="text-red-400">*</span></label>
                <input required value={addUid} onChange={(e) => setAddUid(e.target.value)}
                  placeholder="e.g. 04:A3:F2:1B:8C:20:90" className={inputCls} />
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600">
                  Cancel
                </button>
                <button type="submit" disabled={addLoading}
                  className="rounded-lg px-4 py-2 text-[13px] font-semibold text-black disabled:opacity-60"
                  style={{ background: "#28DC4F" }}>
                  {addLoading ? "Adding…" : "Add Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign NFC Card Modal ── */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAssignModal(null)} />
          <div className="relative z-10 w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="mb-1 text-[16px] font-semibold text-slate-800">Assign NFC Card</h2>
            <p className="mb-1 text-[12px] font-mono text-slate-400">{assignModal.card_uid}</p>
            <p className="mb-5 text-[12px] text-slate-400">
              {/* TODO: Trigger NFC card programming/printing workflow after assignment.
                  Send card_uid + profile URL to the writer service so the physical
                  card is updated to redirect to the correct profile. */}
              Select a customer to link this card to their profile.
            </p>

            {assignError && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600" style={{ border: "1px solid #FECACA" }}>{assignError}</div>
            )}

            <form onSubmit={handleAssign} className="flex flex-col gap-4">
              {/* Customer dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">Customer <span className="text-red-400">*</span></label>
                <select required className={inputCls}
                  value={selCustomer?.id ?? ""}
                  onChange={(e) => {
                    const c = customers.find((x) => x.id === e.target.value) ?? null;
                    setSelCustomer(c);
                    setAssignError("");
                  }}>
                  <option value="">— Select customer —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
                  ))}
                </select>
              </div>

              {/* Profile info — auto-resolved from customer */}
              {selCustomer && (
                <div className="rounded-lg p-3" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  {selCustomer.profile ? (
                    <>
                      <p className="text-[11px] font-medium text-slate-400">Profile</p>
                      <p className="mt-0.5 text-[13px] font-semibold text-slate-800">{selCustomer.profile.name ?? selCustomer.profile.slug}</p>
                      <p className="text-[11px] text-slate-400">/{selCustomer.profile.slug}</p>
                    </>
                  ) : (
                    <p className="text-[12px] text-amber-600">
                      This customer has no profile. They must create one before a card can be assigned.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setAssignModal(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600">
                  Cancel
                </button>
                <button type="submit"
                  disabled={assignLoading || !selCustomer?.profile?.id}
                  className="rounded-lg px-4 py-2 text-[13px] font-semibold text-black disabled:opacity-60"
                  style={{ background: "#28DC4F" }}>
                  {assignLoading ? "Assigning…" : "Assign Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
