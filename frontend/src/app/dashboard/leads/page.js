"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, TopHeader } from "@/components/dashboard/shared";
import api from "@/services/api";

const STATUS_CFG = {
  new:        { label: "New",        bg: "#EFF6FF", color: "#2563EB" },
  contacted:  { label: "Contacted",  bg: "#DCFCE7", color: "#16A34A" },
  follow_up:  { label: "Follow Up",  bg: "#FEF9C3", color: "#D97706" },
  closed:     { label: "Closed",     bg: "#F3F4F6", color: "#6B7280" },
};
const PRIORITY_CFG = {
  hot:  { emoji: "🔥", label: "Hot",  color: "#DC2626", bg: "#FEF2F2" },
  warm: { emoji: "🌡", label: "Warm", color: "#D97706", bg: "#FEF9C3" },
  cold: { emoji: "❄️", label: "Cold", color: "#2563EB", bg: "#EFF6FF" },
};

// Extract message from form data (skips name/email/phone)
function getLeadMessage(lead) {
  const data = lead.data || {};
  // Try common message field IDs first
  for (const key of ["f4", "message", "msg", "description", "note", "f5", "f6"]) {
    if (data[key] && String(data[key]).trim().length > 3) return String(data[key]).trim();
  }
  // Fall back: find any value that isn't name/email/phone
  const name  = (lead.name || "").toLowerCase().trim();
  const email = (lead.email || "").toLowerCase();
  const phone = (lead.phone || "").replace(/\D/g, "");
  for (const val of Object.values(data)) {
    const v = String(val || "").trim();
    if (!v || v.length <= 3) continue;
    if (v.includes("@")) continue;
    if (/^\d{7,15}$/.test(v.replace(/\D/g, ""))) continue;
    if (v.toLowerCase() === name) continue;
    return v;
  }
  return "";
}

/* ── Icons ── */
const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
  </svg>
);
const WAIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

/* ── Reply Modal ── */
function ReplyModal({ lead, onClose, onSent }) {
  const [msg, setMsg]       = useState(lead.ai_reply_suggestion || "");
  const [sending, setSending] = useState(false);
  const [err, setErr]       = useState("");

  async function send() {
    setSending(true); setErr("");
    try { await api.post(`/leads/${lead.id}/send-reply`, { message: msg }); onSent(lead.id); onClose(); }
    catch (e) { setErr(e.response?.data?.message || "Failed to send."); setSending(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <div>
            <p className="text-[15px] font-bold text-[#111827]">Send Email</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">To: {lead.name} · {lead.email}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F3F4F6] text-[#9CA3AF] hover:bg-[#E5E7EB]">✕</button>
        </div>
        <div className="p-6">
          {err && <div className="mb-3 rounded-xl px-4 py-3 text-[13px] bg-[#FEF2F2] text-[#DC2626]">{err}</div>}
          <textarea rows={5} value={msg} onChange={e => setMsg(e.target.value)}
            className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-[13px] outline-none focus:border-[#28DC4F] focus:bg-white"
            placeholder="Type your message…" />
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Lead auto-marked as Contacted after sending.</p>
          <div className="flex gap-3 mt-4">
            <button onClick={onClose} className="flex-1 rounded-xl border border-[#E5E7EB] py-3 text-[13px] font-medium text-[#374151] hover:bg-[#F9FAFB]">Cancel</button>
            <button onClick={send} disabled={sending || !msg.trim()}
              className="flex-1 rounded-xl py-3 text-[13px] font-semibold text-black disabled:opacity-50"
              style={{ background: "#28DC4F" }}>
              {sending ? "Sending…" : "Send Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Lead Detail Drawer ── */
function LeadDrawer({ lead, onClose, onStatusChange, onSaveNote, notes, setNotes, saving, onReply, onWhatsApp }) {
  const sc  = STATUS_CFG[lead.status] || STATUS_CFG.new;
  const pc  = lead.ai_priority ? PRIORITY_CFG[lead.ai_priority] : null;
  const ini = (lead.name || "?")[0].toUpperCase();
  const msg = getLeadMessage(lead);
  const allFields = Object.entries(lead.data || {}).filter(([, v]) => v && String(v).trim());
  // Label map from form fields
  const fieldLabels = { f1: "Full Name", f2: "Email", f3: "Phone", f4: "Message", f5: "Company", f6: "Details", f7: "Other" };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-50 flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F0F0] bg-white">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
            style={{ background: pc ? pc.color : "#28DC4F" }}>
            {ini}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-[#111827]">{lead.name || "Unknown"}</p>
            <p className="text-[12px] text-[#9CA3AF]">
              {new Date(lead.createdAt || lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6] text-[#9CA3AF] hover:bg-[#E5E7EB]">✕</button>
        </div>

        {/* ── Scrollable info (score, contact, message, AI) ── */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

          {/* AI Score */}
          {pc && (
            <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: pc.bg }}>
              <span className="text-[13px] font-bold" style={{ color: pc.color }}>{pc.emoji} {pc.label} Lead</span>
              <span className="text-[22px] font-black" style={{ color: pc.color }}>{lead.ai_score}<span className="text-[12px] font-normal">/10</span></span>
            </div>
          )}

          {/* Contact */}
          <div className="rounded-xl border border-[#EBEBEB] overflow-hidden">
            <p className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] bg-[#FAFAFA]">Contact</p>
            {lead.email && <div className="flex items-center gap-3 px-4 py-3 border-t border-[#F0F0F0]"><EmailIcon /><p className="text-[13px] text-[#374151] break-all">{lead.email}</p></div>}
            {lead.phone && <div className="flex items-center gap-3 px-4 py-3 border-t border-[#F0F0F0]"><span className="text-[13px]">📞</span><p className="text-[13px] text-[#374151]">{lead.phone}</p></div>}
          </div>

          {/* ALL form responses — full text, message highlighted */}
          {allFields.length > 0 && (
            <div className="rounded-xl border border-[#EBEBEB] overflow-hidden">
              <p className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] bg-[#FAFAFA]">Form Responses</p>
              {allFields.map(([k, v]) => {
                const label = fieldLabels[k] || k;
                const val   = String(v || "").trim();
                if (!val) return null;
                const isMsg = k === "f4" || val.length > 40;
                return (
                  <div key={k} className="border-t border-[#F0F0F0]" style={{ background: isMsg ? "#FAFFF5" : "#fff" }}>
                    <p className="px-4 pt-2.5 text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]">{label}</p>
                    <p className="px-4 pb-3 pt-1 text-[13px] text-[#374151] break-words leading-relaxed whitespace-pre-wrap">
                      {val}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI insights */}
          {lead.ai_summary && (
            <div className="rounded-xl p-4" style={{ background: "#F0FFF4", border: "1px solid #BBF7D0" }}>
              <p className="text-[11px] font-bold text-[#16A34A] mb-1">✨ AI Summary</p>
              <p className="text-[12px] text-[#374151] leading-relaxed">{lead.ai_summary}</p>
            </div>
          )}
          {lead.ai_reply_suggestion && (
            <div className="rounded-xl p-4" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <p className="text-[11px] font-bold text-[#2563EB] mb-1">💬 Suggested Reply</p>
              <p className="text-[12px] text-[#374151] leading-relaxed">{lead.ai_reply_suggestion}</p>
            </div>
          )}
        </div>

        {/* ── Fixed bottom: actions + status + notes ── */}
        <div className="shrink-0 border-t border-[#F0F0F0] bg-white px-4 py-3 flex flex-col gap-3">

          {/* Email + WhatsApp */}
          <div className="flex gap-2">
            {lead.email && (
              <button onClick={() => onReply(lead)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white"
                style={{ background: "#111827" }}>
                <EmailIcon /> Email
              </button>
            )}
            {lead.phone && (
              <button onClick={() => onWhatsApp(lead)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white"
                style={{ background: "#25D366" }}>
                <WAIcon /> WhatsApp
              </button>
            )}
          </div>

          {/* Status 4-column */}
          <div className="grid grid-cols-4 gap-1.5">
            {Object.entries(STATUS_CFG).map(([k, v]) => (
              <button key={k} onClick={() => onStatusChange(lead, k)}
                className="rounded-lg py-1.5 text-[11px] font-semibold transition-all"
                style={{ background: lead.status === k ? v.color : "#F3F4F6", color: lead.status === k ? "#fff" : "#6B7280" }}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Notes */}
          <div>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a private note…"
              className="w-full resize-none rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] px-3 py-2 text-[12px] outline-none focus:border-[#28DC4F]" />
            <button onClick={onSaveNote} disabled={saving}
              className="mt-1.5 w-full rounded-xl py-2 text-[12px] font-semibold text-black disabled:opacity-60"
              style={{ background: "#28DC4F" }}>
              {saving ? "Saving…" : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
const PAGE_SIZE = 10;

export default function LeadsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initials,    setInitials]    = useState("U");
  const [leads,       setLeads]       = useState([]);
  const [stats,       setStats]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [page,        setPage]        = useState(1);
  // Filters
  const [statusFilter,   setStatusFilter]   = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search,         setSearch]         = useState("");
  // Detail
  const [selected,  setSelected]  = useState(null);
  const [notes,     setNotes]     = useState("");
  const [saving,    setSaving]    = useState(false);
  const [replyLead, setReplyLead] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) { router.replace("/login"); return; }
    try {
      const u = JSON.parse(localStorage.getItem("customerUser") || "{}");
      const name = u.full_name || u.name || "";
      setInitials(name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "U");
    } catch {}
    api.get("/leads/stats").then(r => setStats(r.data.stats)).catch(() => {});
  }, [router]);

  const loadLeads = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: PAGE_SIZE });
      if (statusFilter)   params.set("status",   statusFilter);
      if (priorityFilter) params.set("priority", priorityFilter);
      const r = await api.get(`/leads?${params}`);
      setLeads(r.data.leads || []);
      setTotal(r.data.total || 0);
      setPages(r.data.pages || 1);
      setPage(p);
    } finally { setLoading(false); }
  }, [statusFilter, priorityFilter]);

  useEffect(() => { loadLeads(1); }, [loadLeads]);

  async function updateStatus(lead, status) {
    await api.patch(`/leads/${lead.id}/status`, { status });
    setLeads(p => p.map(l => l.id === lead.id ? { ...l, status } : l));
    if (selected?.id === lead.id) setSelected(s => ({ ...s, status }));
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    await api.patch(`/leads/${selected.id}/notes`, { notes });
    setLeads(p => p.map(l => l.id === selected.id ? { ...l, notes } : l));
    setSaving(false);
  }

  function onReplySent(id) {
    setLeads(p => p.map(l => l.id === id ? { ...l, status: "contacted" } : l));
    if (selected?.id === id) setSelected(s => ({ ...s, status: "contacted" }));
  }

  function openWhatsApp(lead) {
    const phone = lead.phone?.replace(/\D/g, "");
    if (!phone) return;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(lead.ai_reply_suggestion || `Hi ${lead.name || "there"}, thanks for connecting!`)}`, "_blank");
    updateStatus(lead, "contacted");
  }

  const filtered = search
    ? leads.filter(l => [l.name, l.email, l.phone, getLeadMessage(l)].some(v => v?.toLowerCase().includes(search.toLowerCase())))
    : leads;

  const statusTabs = [
    { key: "", label: "All", count: stats?.total },
    { key: "new", label: "New", count: stats?.new },
    { key: "contacted", label: "Contacted" },
    { key: "follow_up", label: "Follow Up" },
    { key: "closed", label: "Closed" },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F7F8FA" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Leads" />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        {replyLead && <ReplyModal lead={replyLead} onClose={() => setReplyLead(null)} onSent={onReplySent} />}
        {selected && (
          <LeadDrawer lead={selected} onClose={() => setSelected(null)}
            onStatusChange={updateStatus} onSaveNote={saveNotes}
            notes={notes} setNotes={setNotes} saving={saving}
            onReply={setReplyLead} onWhatsApp={openWhatsApp} />
        )}

        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* Header */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-bold text-[#111827]">Leads</h1>
              <p className="text-[13px] text-[#9CA3AF]">{total} total leads</p>
            </div>
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads…"
                className="w-52 rounded-xl border border-[#E5E7EB] bg-white pl-8 pr-4 py-2 text-[13px] outline-none focus:border-[#28DC4F] focus:ring-2 focus:ring-[#28DC4F]/10" />
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total",     value: stats.total,     color: "#111827" },
                { label: "New",       value: stats.new,       color: "#2563EB" },
                { label: "🔥 Hot",   value: stats.hot,       color: "#DC2626" },
                { label: "Contacted", value: stats.contacted, color: "#16A34A" },
              ].map(s => (
                <div key={s.label} className="rounded-xl bg-white border border-[#F0F0F0] px-4 py-3.5 shadow-sm">
                  <p className="text-[11px] text-[#9CA3AF] mb-1">{s.label}</p>
                  <p className="text-[24px] font-black leading-none" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filters row */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {/* Status tabs */}
            <div className="flex rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              {statusTabs.map(t => (
                <button key={t.key} onClick={() => setStatusFilter(t.key)}
                  className="px-3.5 py-2 text-[12px] font-medium transition-colors border-r border-[#E5E7EB] last:border-0"
                  style={{ background: statusFilter === t.key ? "#111827" : "transparent", color: statusFilter === t.key ? "#fff" : "#6B7280" }}>
                  {t.label}{t.count !== undefined ? ` (${t.count})` : ""}
                </button>
              ))}
            </div>

            {/* Priority filter */}
            <div className="flex rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              {[{ key: "", label: "All Priority" }, { key: "hot", label: "🔥 Hot" }, { key: "warm", label: "🌡 Warm" }, { key: "cold", label: "❄️ Cold" }].map(p => (
                <button key={p.key} onClick={() => setPriorityFilter(p.key)}
                  className="px-3.5 py-2 text-[12px] font-medium transition-colors border-r border-[#E5E7EB] last:border-0"
                  style={{ background: priorityFilter === p.key ? "#111827" : "transparent", color: priorityFilter === p.key ? "#fff" : "#6B7280" }}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Clear filters */}
            {(statusFilter || priorityFilter || search) && (
              <button onClick={() => { setStatusFilter(""); setPriorityFilter(""); setSearch(""); }}
                className="rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-[12px] font-medium text-[#EF4444] hover:bg-[#FEF2F2]">
                ✕ Clear
              </button>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#28DC4F]" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center bg-white rounded-2xl border border-[#F0F0F0]">
              <div className="text-[32px]">🎯</div>
              <p className="text-[15px] font-semibold text-[#111827]">No leads found</p>
              <p className="text-[13px] text-[#9CA3AF]">
                {search || statusFilter || priorityFilter ? "Try adjusting your filters" : "Share your card link to start collecting leads"}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #EBEBEB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                {/* Header */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #EBEBEB" }}>
                      {["Contact & Message", "Score", "Status", "Date", "Actions"].map((h, i) => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9CA3AF", borderRight: i < 4 ? "1px solid #EBEBEB" : "none", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead, idx) => {
                      const pc  = lead.ai_priority ? PRIORITY_CFG[lead.ai_priority] : null;
                      const sc  = STATUS_CFG[lead.status] || STATUS_CFG.new;
                      const ini = (lead.name || "?")[0].toUpperCase();
                      const msg = getLeadMessage(lead);

                      return (
                        <tr key={lead.id}
                          style={{ borderTop: idx > 0 ? "1px solid #F0F0F0" : "none", cursor: "pointer", background: "transparent", transition: "background 0.1s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          onClick={() => { setSelected(lead); setNotes(lead.notes || ""); }}>

                          {/* Contact + message */}
                          <td style={{ padding: "14px 16px", borderRight: "1px solid #F0F0F0", maxWidth: 320 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                              <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: pc ? pc.color : "#28DC4F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 2 }}>
                                {ini}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {lead.name || "Unknown"}
                                </p>
                                <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: msg ? 5 : 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {[lead.email, lead.phone].filter(Boolean).join(" · ") || "—"}
                                </p>
                                {msg && (
                                  <p style={{ fontSize: 12, color: "#6B7280", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.5, maxWidth: 260 }}>
                                    {msg}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Score */}
                          <td style={{ padding: "14px 16px", borderRight: "1px solid #F0F0F0", whiteSpace: "nowrap" }}>
                            {pc ? (
                              <span style={{ borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700, background: pc.bg, color: pc.color }}>
                                {pc.emoji} {pc.label} {lead.ai_score && `· ${lead.ai_score}/10`}
                              </span>
                            ) : (
                              <span style={{ fontSize: 12, color: "#C4C9D4" }}>
                                {lead.scoring_status === "pending" ? "⏳ Pending" : "—"}
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td style={{ padding: "14px 12px", borderRight: "1px solid #F0F0F0" }}
                            onClick={e => e.stopPropagation()}>
                            <select value={lead.status} onChange={e => updateStatus(lead, e.target.value)}
                              style={{ border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color, outline: "none", cursor: "pointer" }}>
                              {Object.entries(STATUS_CFG).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                              ))}
                            </select>
                          </td>

                          {/* Date */}
                          <td style={{ padding: "14px 16px", borderRight: "1px solid #F0F0F0", whiteSpace: "nowrap" }}>
                            <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                              {new Date(lead.createdAt || lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "14px 12px" }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: "flex", gap: 6 }}>
                              {lead.email && (
                                <button onClick={() => setReplyLead(lead)} title="Send Email"
                                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151" }}
                                  onMouseEnter={e => e.currentTarget.style.background = "#F3F4F6"}
                                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                                  <EmailIcon />
                                </button>
                              )}
                              {lead.phone && (
                                <button onClick={() => openWhatsApp(lead)} title="WhatsApp"
                                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #DCF8C6", background: "#F0FDF4", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                  onMouseEnter={e => e.currentTarget.style.background = "#DCFCE7"}
                                  onMouseLeave={e => e.currentTarget.style.background = "#F0FDF4"}>
                                  <WAIcon />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[13px] text-[#9CA3AF]">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} leads
                  </p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => loadLeads(page - 1)} disabled={page === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#374151] disabled:opacity-40 hover:bg-[#F9FAFB]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                      const p = pages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= pages - 2 ? pages - 4 + i : page - 2 + i;
                      return (
                        <button key={p} onClick={() => loadLeads(p)}
                          className="h-8 w-8 rounded-lg border text-[13px] font-medium transition-colors"
                          style={{ borderColor: page === p ? "#111827" : "#E5E7EB", background: page === p ? "#111827" : "#fff", color: page === p ? "#fff" : "#374151" }}>
                          {p}
                        </button>
                      );
                    })}
                    <button onClick={() => loadLeads(page + 1)} disabled={page === pages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#374151] disabled:opacity-40 hover:bg-[#F9FAFB]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
