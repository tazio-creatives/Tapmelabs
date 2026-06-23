"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar, TopHeader } from "@/components/dashboard/shared";
import api from "@/services/api";

const FIELD_TYPES = [
  { value: "text",     label: "Short Text" },
  { value: "email",    label: "Email" },
  { value: "tel",      label: "Phone" },
  { value: "textarea", label: "Long Text" },
  { value: "select",   label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
];

function uid() { return Math.random().toString(36).slice(2, 9); }

/* ── Field Row ── */
function FieldRow({ field, index, total, onChange, onDelete, onMove }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setOpen(v => !v)}>
        <div className="flex flex-col gap-0.5 shrink-0">
          <button type="button" onClick={e => { e.stopPropagation(); onMove(index, -1); }}
            disabled={index === 0}
            className="text-[#9CA3AF] hover:text-[#374151] disabled:opacity-30 leading-none text-[10px]">▲</button>
          <button type="button" onClick={e => { e.stopPropagation(); onMove(index, 1); }}
            disabled={index === total - 1}
            className="text-[#9CA3AF] hover:text-[#374151] disabled:opacity-30 leading-none text-[10px]">▼</button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-[#111827] truncate">
              {field.label || "Untitled field"}
            </p>
            {field.required && (
              <span className="text-[10px] font-bold text-[#EF4444]">Required</span>
            )}
          </div>
          <p className="text-[11px] text-[#9CA3AF]">
            {FIELD_TYPES.find(t => t.value === field.type)?.label || "Text"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={e => { e.stopPropagation(); onDelete(field.id); }}
            className="rounded-lg p-1.5 text-[#EF4444] hover:bg-[#FEF2F2]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>

      {/* Expanded editor */}
      {open && (
        <div className="border-t border-[#F0F0F0] px-4 py-4 bg-[#FAFAFA] flex flex-col gap-3">
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
function FormPreview({ form }) {
  return (
    <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">Live Preview</p>

      <div className="rounded-xl border border-[#EBEBEB] bg-[#F9F9F9] p-5">
        <h2 className="mb-1 text-[17px] font-bold text-[#111827]">{form.title || "Untitled Form"}</h2>
        {form.description && <p className="mb-4 text-[13px] text-[#6D6D6D]">{form.description}</p>}

        <div className="flex flex-col gap-3">
          {(form.fields || []).map(field => (
            <div key={field.id}>
              <label className="mb-1 block text-[12px] font-medium text-[#374151]">
                {field.label || "Field"}
                {field.required && <span className="ml-1 text-[#EF4444]">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea disabled rows={2} placeholder={field.placeholder || ""}
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#9CA3AF]" />
              ) : field.type === "select" ? (
                <select disabled className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#9CA3AF]">
                  <option>{field.placeholder || "Select…"}</option>
                  {(field.options || []).map(o => <option key={o}>{o}</option>)}
                </select>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-2">
                  <input type="checkbox" disabled className="w-4 h-4" />
                  <span className="text-[12px] text-[#9CA3AF]">{field.placeholder || field.label}</span>
                </label>
              ) : (
                <input disabled type={field.type} placeholder={field.placeholder || ""}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] text-[#9CA3AF]" />
              )}
            </div>
          ))}

          <button disabled className="mt-1 w-full rounded-lg py-2.5 text-[13px] font-semibold text-black opacity-80"
            style={{ background: "#28DC4F" }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Embed Code ── */
function EmbedSection({ form }) {
  const [copied, setCopied] = useState(false);
  const ORIGIN = typeof window !== "undefined" ? window.location.origin : "https://tapmelabs.com";
  const iframeCode = `<iframe\n  src="${ORIGIN}/f/${form.slug}?embed=1"\n  width="100%"\n  height="520"\n  style="border:none;border-radius:12px;"\n  title="${form.title || "Contact Form"}"\n></iframe>`;

  function copy() {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-[14px] font-bold text-[#111827]">Embed on Your Website</h3>
      <p className="mb-4 text-[12px] text-[#9CA3AF]">Copy this code and paste it anywhere on your website</p>

      <div className="relative rounded-xl bg-[#18181B] p-4">
        <pre className="overflow-x-auto text-[11px] leading-relaxed text-[#28DC4F] whitespace-pre-wrap">
          {iframeCode}
        </pre>
        <button onClick={copy}
          className="absolute right-3 top-3 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors"
          style={{ background: copied ? "#28DC4F" : "rgba(255,255,255,0.1)", color: copied ? "#000" : "#fff" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <div className="mt-4 rounded-xl p-4" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <p className="text-[12px] font-semibold text-[#1D4ED8] mb-1">How to use</p>
        <ol className="text-[11px] text-[#374151] flex flex-col gap-1">
          <li>1. Copy the code above</li>
          <li>2. Paste it in your website's HTML where you want the form to appear</li>
          <li>3. The form will auto-resize and submit directly to your Leads dashboard</li>
        </ol>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F9FAFB] px-4 py-3">
        <p className="text-[11px] text-[#9CA3AF] truncate">Direct link: {ORIGIN}/f/{form.slug}</p>
        <button onClick={() => navigator.clipboard.writeText(`${ORIGIN}/f/${form.slug}`)}
          className="shrink-0 ml-3 text-[11px] font-medium text-[#28DC4F]">Copy</button>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function FormEditorPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initials,    setInitials]    = useState("U");
  const [form,        setForm]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) { router.replace("/login"); return; }
    try {
      const u = JSON.parse(localStorage.getItem("customerUser") || "{}");
      const name = u.full_name || u.name || "";
      setInitials(name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "U");
    } catch {}
    api.get(`/forms/${id}`)
      .then(r => setForm(r.data.form))
      .catch(() => setError("Form not found"))
      .finally(() => setLoading(false));
  }, [id, router]);

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

  async function save() {
    setSaving(true); setError("");
    try {
      await api.patch(`/forms/${id}`, {
        title:            form.title,
        description:      form.description,
        fields:           form.fields,
        thank_you_message: form.thank_you_message,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F7F8F9]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#28DC4F]" />
    </div>
  );

  if (error || !form) return (
    <div className="flex h-screen items-center justify-center bg-[#F7F8F9]">
      <p className="text-[14px] text-[#9CA3AF]">{error || "Form not found"}</p>
    </div>
  );

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
                className="text-[#9CA3AF] hover:text-[#374151]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
              </button>
              <div>
                <h1 className="text-[20px] font-bold text-[#111827]">Edit Form</h1>
                <p className="text-[13px] text-[#9CA3AF]">Customize your lead capture form</p>
              </div>
            </div>
            <button onClick={save} disabled={saving}
              className="rounded-xl px-5 py-2.5 text-[13px] font-semibold text-black disabled:opacity-60"
              style={{ background: saved ? "#16A34A" : "#28DC4F", color: saved ? "#fff" : "#000" }}>
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">

            {/* ── LEFT: Builder ── */}
            <div className="flex flex-col gap-5">

              {/* Form settings */}
              <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-[14px] font-bold text-[#111827]">Form Settings</h2>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1">FORM TITLE</label>
                    <input value={form.title || ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[13px] outline-none focus:border-[#28DC4F]"
                      placeholder="e.g. Contact Me" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1">DESCRIPTION (optional)</label>
                    <input value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[13px] outline-none focus:border-[#28DC4F]"
                      placeholder="Brief description shown above the form" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#9CA3AF] block mb-1">THANK YOU MESSAGE</label>
                    <input value={form.thank_you_message || ""} onChange={e => setForm(f => ({ ...f, thank_you_message: e.target.value }))}
                      className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-[13px] outline-none focus:border-[#28DC4F]"
                      placeholder="Shown after submission" />
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-[#111827]">Form Fields ({form.fields?.length || 0})</h2>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {(form.fields || []).map((field, idx) => (
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
                  {form.fields?.length === 0 && (
                    <p className="py-6 text-center text-[13px] text-[#9CA3AF]">No fields yet. Add one below.</p>
                  )}
                </div>

                {/* Warning — no message field */}
                {!(form.fields || []).some(f => f.type === "textarea" || /message|note|comment|detail/i.test(f.label)) && (form.fields || []).length > 0 && (
                  <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <span className="text-[16px] shrink-0">⚠️</span>
                    <div className="flex-1">
                      <p className="text-[12px] font-semibold text-[#D97706]">No message field</p>
                      <p className="text-[11px] text-[#92400E] mt-0.5">
                        AI scoring is limited to 5/10 without a message field. Add a <strong>Long Text</strong> field so leads can describe their need.
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
                  <p className="mb-2 text-[11px] font-semibold text-[#9CA3AF]">ADD FIELD</p>
                  <div className="flex flex-wrap gap-2">
                    {FIELD_TYPES.map(t => (
                      <button key={t.value} type="button" onClick={() => addField(t.value)}
                        className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:border-[#28DC4F] hover:text-[#28DC4F] transition-colors">
                        + {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Embed section */}
              <EmbedSection form={form} />
            </div>

            {/* ── RIGHT: Live Preview ── */}
            <div className="lg:sticky lg:top-6 self-start">
              <FormPreview form={form} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
