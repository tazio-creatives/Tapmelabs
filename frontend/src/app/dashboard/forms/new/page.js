"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, TopHeader } from "@/components/dashboard/shared";
import api from "@/services/api";

const FIELD_TYPES = [
  { value: "text",     label: "Short Text",  icon: "T" },
  { value: "email",    label: "Email",       icon: "@" },
  { value: "tel",      label: "Phone",       icon: "☎" },
  { value: "textarea", label: "Long Text",   icon: "¶" },
  { value: "select",   label: "Dropdown",    icon: "▾" },
  { value: "checkbox", label: "Checkbox",    icon: "✓" },
];

const DEFAULT_FIELDS = [
  { id: "f1", label: "Full Name",  type: "text",     placeholder: "Enter your name",    required: true  },
  { id: "f2", label: "Email",      type: "email",    placeholder: "you@example.com",    required: true  },
  { id: "f3", label: "Phone",      type: "tel",      placeholder: "+91 98765 43210",    required: false },
  { id: "f4", label: "Message",    type: "textarea", placeholder: "How can I help you?",required: false },
];

function uid() { return Math.random().toString(36).slice(2, 9); }

/* ── Field Row ── */
function FieldRow({ field, index, total, onChange, onDelete, onMove }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border overflow-hidden transition-all"
      style={{ borderColor: open ? "#28DC4F" : "#E5E7EB" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none bg-white"
        onClick={() => setOpen(v => !v)}>
        <div className="flex flex-col shrink-0">
          <button type="button" onClick={e => { e.stopPropagation(); onMove(index, -1); }}
            disabled={index === 0}
            className="text-[#C4C9D4] hover:text-[#374151] disabled:opacity-30 text-[10px] leading-tight">▲</button>
          <button type="button" onClick={e => { e.stopPropagation(); onMove(index, 1); }}
            disabled={index === total - 1}
            className="text-[#C4C9D4] hover:text-[#374151] disabled:opacity-30 text-[10px] leading-tight">▼</button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#F0FFF4", color: "#28DC4F" }}>
              {FIELD_TYPES.find(t => t.value === field.type)?.icon || "T"}
            </span>
            <p className="text-[13px] font-semibold text-[#111827] truncate">
              {field.label || <span className="text-[#9CA3AF]">Untitled field</span>}
            </p>
            {field.required && <span className="text-[10px] font-bold text-[#EF4444]">Required</span>}
          </div>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">
            {FIELD_TYPES.find(t => t.value === field.type)?.label}
            {field.placeholder && ` · "${field.placeholder}"`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={e => { e.stopPropagation(); onDelete(field.id); }}
            className="rounded-lg p-1.5 text-[#EF4444] hover:bg-[#FEF2F2]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
            </svg>
          </button>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4C9D4" strokeWidth="2" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>

      {/* Editor */}
      {open && (
        <div className="border-t border-[#F0F0F0] bg-[#FAFAFA] px-4 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1">LABEL</label>
              <input value={field.label} onChange={e => onChange(field.id, "label", e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#28DC4F]"
                placeholder="Field label" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1">TYPE</label>
              <select value={field.type} onChange={e => onChange(field.id, "type", e.target.value)}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#28DC4F]">
                {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1">PLACEHOLDER</label>
            <input value={field.placeholder || ""} onChange={e => onChange(field.id, "placeholder", e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#28DC4F]"
              placeholder="Hint text shown inside the field" />
          </div>
          {field.type === "select" && (
            <div>
              <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1">OPTIONS (one per line)</label>
              <textarea rows={3} value={(field.options || []).join("\n")}
                onChange={e => onChange(field.id, "options", e.target.value.split("\n"))}
                className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#28DC4F]"
                placeholder={"Option 1\nOption 2\nOption 3"} />
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!field.required}
              onChange={e => onChange(field.id, "required", e.target.checked)}
              className="accent-[#28DC4F] w-4 h-4" />
            <span className="text-[13px] text-[#374151]">Required field</span>
          </label>
        </div>
      )}
    </div>
  );
}

/* ── Live Preview ── */
function LivePreview({ form }) {
  return (
    <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm sticky top-6">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">Live Preview</p>
      <div className="rounded-xl border border-[#EBEBEB] bg-[#F9F9F9] p-5">
        <h2 className="mb-1 text-[17px] font-bold text-[#111827]">{form.title || "Form Title"}</h2>
        {form.description && <p className="mb-4 text-[13px] text-[#6D6D6D]">{form.description}</p>}
        <div className="flex flex-col gap-3 mt-4">
          {(form.fields || []).map(field => (
            <div key={field.id}>
              <label className="mb-1 block text-[12px] font-medium text-[#374151]">
                {field.label || "Field"}
                {field.required && <span className="ml-1 text-[#EF4444]">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea disabled rows={2} placeholder={field.placeholder}
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#AEAEAE]" />
              ) : field.type === "select" ? (
                <select disabled className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#AEAEAE]">
                  <option>{field.placeholder || "Select…"}</option>
                </select>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-2">
                  <input type="checkbox" disabled className="w-4 h-4" />
                  <span className="text-[12px] text-[#AEAEAE]">{field.placeholder || field.label}</span>
                </label>
              ) : (
                <input disabled type={field.type} placeholder={field.placeholder}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#AEAEAE]" />
              )}
            </div>
          ))}
          <button disabled className="mt-2 w-full rounded-lg py-2.5 text-[13px] font-semibold text-black"
            style={{ background: "#28DC4F" }}>Submit</button>
        </div>
        <p className="mt-4 text-center text-[10px] text-[#C4C9D4]">Powered by TapMe Labs</p>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function NewFormPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initials,    setInitials]    = useState("U");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  const [form, setForm] = useState({
    title:            "",
    description:      "",
    thank_you_message: "Thanks for connecting! I will reach out shortly.",
    fields:           DEFAULT_FIELDS.map(f => ({ ...f })),
  });

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) { router.replace("/login"); return; }
    try {
      const u = JSON.parse(localStorage.getItem("customerUser") || "{}");
      const name = u.full_name || u.name || "";
      setInitials(name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "U");
    } catch {}
  }, [router]);

  function updateField(fieldId, key, value) {
    setForm(f => ({ ...f, fields: f.fields.map(field => field.id === fieldId ? { ...field, [key]: value } : field) }));
  }
  function deleteField(fieldId) {
    setForm(f => ({ ...f, fields: f.fields.filter(field => field.id !== fieldId) }));
  }
  function moveField(index, dir) {
    setForm(f => {
      const fields = [...f.fields];
      const newIdx = index + dir;
      if (newIdx < 0 || newIdx >= fields.length) return f;
      [fields[index], fields[newIdx]] = [fields[newIdx], fields[index]];
      return { ...f, fields };
    });
  }
  function addField(type = "text") {
    const newField = { id: uid(), label: "", type, placeholder: "", required: false };
    setForm(f => ({ ...f, fields: [...f.fields, newField] }));
  }

  const hasMessageField = form.fields.some(f => f.type === "textarea" || /message|note|comment|detail/i.test(f.label));

  async function handleCreate() {
    if (!form.title.trim()) { setError("Form title is required"); return; }
    if (form.fields.length === 0) { setError("Add at least one field"); return; }
    setSaving(true); setError("");
    try {
      await api.post("/forms", {
        title:            form.title.trim(),
        description:      form.description.trim() || null,
        fields:           form.fields,
        thank_you_message: form.thank_you_message.trim(),
      });
      router.push("/dashboard/forms");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create form. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="My Forms" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push("/dashboard/forms")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#9CA3AF] hover:text-[#374151]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
              </button>
              <div>
                <h1 className="text-[20px] font-bold text-[#111827]">Create New Form</h1>
                <p className="text-[13px] text-[#9CA3AF]">Set up your form, then save when ready</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => router.push("/dashboard/forms")}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#F9FAFB]">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={saving}
                className="rounded-xl px-5 py-2.5 text-[13px] font-semibold text-black disabled:opacity-60"
                style={{ background: "#28DC4F" }}>
                {saving ? "Creating…" : "Save Form"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-xl px-4 py-3 text-[13px]"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">

            {/* ── LEFT: Setup ── */}
            <div className="flex flex-col gap-5">

              {/* Form Details */}
              <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-[14px] font-bold text-[#111827]">Form Details</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1.5">FORM TITLE <span className="text-[#EF4444]">*</span></label>
                    <input value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[14px] outline-none focus:border-[#28DC4F] focus:ring-2 focus:ring-[#28DC4F]/10"
                      placeholder="e.g. Contact Me, Get a Quote, Book a Call…" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1.5">DESCRIPTION <span className="text-[#C4C9D4] font-normal">(optional)</span></label>
                    <input value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[14px] outline-none focus:border-[#28DC4F] focus:ring-2 focus:ring-[#28DC4F]/10"
                      placeholder="Brief description shown above the form" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1.5">THANK YOU MESSAGE</label>
                    <input value={form.thank_you_message}
                      onChange={e => setForm(f => ({ ...f, thank_you_message: e.target.value }))}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-[14px] outline-none focus:border-[#28DC4F] focus:ring-2 focus:ring-[#28DC4F]/10"
                      placeholder="Message shown after submission" />
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-[#111827]">
                    Form Fields
                    <span className="ml-2 rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-normal text-[#6B7280]">
                      {form.fields.length}
                    </span>
                  </h2>
                </div>

                <div className="flex flex-col gap-2 mb-5">
                  {form.fields.map((field, idx) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      index={idx}
                      total={form.fields.length}
                      onChange={updateField}
                      onDelete={deleteField}
                      onMove={moveField}
                    />
                  ))}
                  {form.fields.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#E5E7EB] py-8 text-center">
                      <p className="text-[13px] text-[#9CA3AF]">No fields yet. Add one below.</p>
                    </div>
                  )}
                </div>

                {/* Warning — no message field */}
                {!hasMessageField && form.fields.length > 0 && (
                  <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <span className="text-[16px] shrink-0">⚠️</span>
                    <div className="flex-1">
                      <p className="text-[12px] font-semibold text-[#D97706]">No message field</p>
                      <p className="text-[11px] text-[#92400E] mt-0.5">
                        Without a message field, AI scoring will be limited to 5/10 for all leads.
                        Add a <strong>Long Text</strong> field so leads can explain their need.
                      </p>
                    </div>
                    <button onClick={() => addField("textarea")}
                      className="shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white"
                      style={{ background: "#D97706" }}>
                      + Add
                    </button>
                  </div>
                )}

                {/* Add field */}
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Add Field</p>
                  <div className="flex flex-wrap gap-2">
                    {FIELD_TYPES.map(t => (
                      <button key={t.value} type="button" onClick={() => addField(t.value)}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:border-[#28DC4F] hover:text-[#28DC4F] transition-colors">
                        <span className="text-[11px]">{t.icon}</span>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save button at bottom too */}
              <button onClick={handleCreate} disabled={saving}
                className="w-full rounded-xl py-3.5 text-[14px] font-semibold text-black disabled:opacity-60"
                style={{ background: "#28DC4F" }}>
                {saving ? "Creating form…" : "Save Form"}
              </button>
            </div>

            {/* ── RIGHT: Live Preview ── */}
            <LivePreview form={form} />
          </div>
        </main>
      </div>
    </div>
  );
}
