"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import themeService from "@/services/themeService";

// ── Fallback colour previews keyed by theme.key ───────────────────────────────
// Used when a theme has no preview_image stored in the DB.
const KEY_PREVIEWS = {
  "default":       { cardBg: "#0D0D0D", infoBg: "#FFFFFF", accent: "#28DC4F" },
  "midnight-dark": { cardBg: "#000000", infoBg: "#111111", accent: "#28DC4F" },
  "professional":  { cardBg: "#1E3A5F", infoBg: "#FFFFFF", accent: "#1E3A5F" },
  "modern":        { cardBg: "#7C3AED", infoBg: "#FFFFFF", accent: "#7C3AED" },
  "vibrant":       { cardBg: "#FF6D00", infoBg: "#FFF3E0", accent: "#FF6D00" },
  "minimal":       { cardBg: "#C62828", infoBg: "#FFF5F5", accent: "#C62828" },
};
const DEFAULT_PREVIEW = { cardBg: "#334155", infoBg: "#F8FAFC", accent: "#28DC4F" };

function getPreview(key) {
  return KEY_PREVIEWS[key] ?? DEFAULT_PREVIEW;
}

// ── Blank form shapes ─────────────────────────────────────────────────────────

const BLANK_ADD  = { name: "", key: "", preview_image: "", status: "active" };
const BLANK_EDIT = { name: "", preview_image: "", status: "active" };

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ThemesPage() {
  const [themes, setThemes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Add modal
  const [addModal, setAddModal]   = useState(false);
  const [addForm, setAddForm]     = useState(BLANK_ADD);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError]   = useState("");

  // Edit modal
  const [editModal, setEditModal]   = useState(null); // holds the full theme object
  const [editForm, setEditForm]     = useState(BLANK_EDIT);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError]   = useState("");

  // Delete
  const [deletingId, setDeletingId] = useState(null);

  // ── Data fetching ───────────────────────────────────────────────────────────

  async function fetchThemes() {
    setLoading(true);
    setError("");
    try {
      const res = await themeService.getAllThemes();
      setThemes(res.data?.themes ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load themes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchThemes(); }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleAdd(e) {
    e.preventDefault();
    setAddSaving(true);
    setAddError("");
    try {
      const payload = {
        name:   addForm.name.trim(),
        key:    addForm.key.trim(),
        status: addForm.status,
        // preview_image comes from the upload API response URL — see comment in form below
        ...(addForm.preview_image.trim() && { preview_image: addForm.preview_image.trim() }),
      };
      await themeService.createTheme(payload);
      setAddModal(false);
      setAddForm(BLANK_ADD);
      await fetchThemes();
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to create theme.");
    } finally {
      setAddSaving(false);
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    setEditSaving(true);
    setEditError("");
    try {
      const payload = {
        name:   editForm.name.trim(),
        status: editForm.status,
        // preview_image comes from the upload API response URL — see comment in form below
        ...(editForm.preview_image.trim() && { preview_image: editForm.preview_image.trim() }),
      };
      await themeService.updateTheme(editModal.id, payload);
      setEditModal(null);
      await fetchThemes();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to save theme.");
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete(theme) {
    if (!window.confirm(`Delete theme "${theme.name}"? This will hide it from all customers.`)) return;
    setDeletingId(theme.id);
    try {
      await themeService.deleteTheme(theme.id);
      await fetchThemes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete theme.");
    } finally {
      setDeletingId(null);
    }
  }

  function openEdit(theme) {
    setEditModal(theme);
    setEditForm({
      name:          theme.name,
      preview_image: theme.preview_image ?? "",
      status:        theme.status,
    });
    setEditError("");
  }

  // ── Derived ─────────────────────────────────────────────────────────────────

  const totalUsage = themes.reduce((a, t) => a + (t.usage_count || 0), 0);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Themes">
      <div className="flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-slate-500">
            {loading
              ? "Loading…"
              : `${themes.length} themes · ${themes.filter((t) => t.status === "active").length} active`}
          </p>
          <button
            onClick={() => { setAddModal(true); setAddForm(BLANK_ADD); setAddError(""); }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold text-black"
            style={{ background: "#28DC4F" }}
          >
            + Add Theme
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600"
            style={{ border: "1px solid #FECACA" }}>
            {error}
          </div>
        )}

        {/* Theme cards grid */}
        {loading ? (
          <div className="py-16 text-center text-[13px] text-slate-400">Loading themes…</div>
        ) : themes.length === 0 ? (
          <div className="rounded-xl bg-white py-16 text-center" style={{ border: "1px solid #E2E8F0" }}>
            <p className="text-[14px] font-medium text-slate-600">No themes yet.</p>
            <p className="mt-1 text-[12px] text-slate-400">Click "+ Add Theme" to create the first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {themes.map((theme) => {
              const preview   = getPreview(theme.key);
              const isActive  = theme.status === "active";
              const isDeleting = deletingId === theme.id;

              return (
                <div key={theme.id} className="rounded-xl bg-white overflow-hidden"
                  style={{ border: "1px solid #E2E8F0" }}>

                  {/* Preview area — shows uploaded image when available, else colour mockup */}
                  <div className="relative h-40 flex items-center justify-center overflow-hidden"
                    style={{ background: theme.preview_image ? "#F1F5F9" : preview.cardBg }}>

                    {theme.preview_image ? (
                      <img
                        src={theme.preview_image}
                        alt={theme.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      /* Colour-based mini card mockup — replaced once preview_image is uploaded */
                      <div className="rounded-lg px-4 py-3 text-center"
                        style={{ background: preview.infoBg, minWidth: "120px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                        <div className="mx-auto mb-1.5 h-8 w-8 rounded-full"
                          style={{ background: preview.cardBg }} />
                        <div className="h-2 rounded-full mb-1"
                          style={{ background: preview.cardBg, opacity: 0.3, width: "80px" }} />
                        <div className="h-1.5 rounded-full"
                          style={{ background: preview.accent, width: "50px", margin: "0 auto" }} />
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: isActive ? "#DCFCE7" : "#F1F5F9",
                          color:      isActive ? "#16A34A" : "#64748B",
                        }}>
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-3">
                        <h3 className="text-[14px] font-semibold text-slate-800 truncate">{theme.name}</h3>
                        <p className="mt-0.5 text-[11px] font-mono text-slate-400 truncate">{theme.key}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[18px] font-bold text-slate-800">{theme.usage_count ?? 0}</p>
                        <p className="text-[10px] text-slate-400">users</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openEdit(theme)}
                        className="flex-1 rounded-lg border border-slate-200 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(theme)}
                        disabled={isDeleting}
                        className="flex-1 rounded-lg py-2 text-[12px] font-medium transition-colors disabled:opacity-50"
                        style={{ background: "#FEE2E2", color: "#DC2626" }}
                      >
                        {isDeleting ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Theme usage stats */}
        {!loading && themes.length > 0 && (
          <div className="rounded-xl bg-white p-5" style={{ border: "1px solid #E2E8F0" }}>
            <h2 className="mb-4 text-[14px] font-semibold text-slate-800">Theme Usage</h2>
            {themes.map((t) => {
              const pct     = totalUsage ? Math.round(((t.usage_count || 0) / totalUsage) * 100) : 0;
              const preview = getPreview(t.key);
              return (
                <div key={t.id} className="mb-3 flex items-center gap-4">
                  <div className="w-28 text-[12px] text-slate-600 truncate">{t.name}</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-2 rounded-full transition-all"
                      style={{ width: pct + "%", background: preview.accent }} />
                  </div>
                  <div className="w-10 text-right text-[12px] font-semibold text-slate-700">{pct}%</div>
                  <div className="w-8 text-right text-[11px] text-slate-400">{t.usage_count ?? 0}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add Theme Modal ─────────────────────────────────────────────────── */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddModal(false)} />
          <div className="relative z-10 w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="mb-5 text-[16px] font-semibold text-slate-800">Add Theme</h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">

              {addError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600"
                  style={{ border: "1px solid #FECACA" }}>
                  {addError}
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">Theme Name</label>
                <input
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Ocean Blue"
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-green-400"
                  required
                />
              </div>

              {/* Key */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">
                  Theme Key <span className="font-normal text-slate-400">(unique identifier)</span>
                </label>
                <input
                  value={addForm.key}
                  onChange={(e) =>
                    setAddForm({ ...addForm, key: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })
                  }
                  placeholder="e.g. ocean-blue"
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] font-mono outline-none focus:border-green-400"
                  required
                />
                <p className="text-[11px] text-slate-400">Lowercase letters and hyphens only. Cannot be changed after creation.</p>
              </div>

              {/* Preview Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">
                  Preview Image URL <span className="font-normal text-slate-400">(optional)</span>
                </label>
                {/*
                  TODO: Replace this text input with an image upload button.
                  Call POST /api/uploads/theme-preview (multipart/form-data),
                  then set addForm.preview_image to the returned { url } value.
                */}
                <input
                  value={addForm.preview_image}
                  onChange={(e) => setAddForm({ ...addForm, preview_image: e.target.value })}
                  placeholder="https://…"
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-green-400"
                />
                <p className="text-[11px] text-slate-400">Image upload will be available soon. Paste a URL for now.</p>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">Status</label>
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-green-400 bg-white"
                >
                  <option value="active">Active — visible to customers</option>
                  <option value="inactive">Inactive — hidden from customers</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600">
                  Cancel
                </button>
                <button type="submit" disabled={addSaving}
                  className="rounded-lg px-4 py-2 text-[13px] font-semibold text-black disabled:opacity-60"
                  style={{ background: "#28DC4F" }}>
                  {addSaving ? "Creating…" : "Create Theme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Theme Modal ─────────────────────────────────────────────────── */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditModal(null)} />
          <div className="relative z-10 w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h2 className="mb-5 text-[16px] font-semibold text-slate-800">Edit Theme</h2>
            <form onSubmit={handleEdit} className="flex flex-col gap-4">

              {editError && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600"
                  style={{ border: "1px solid #FECACA" }}>
                  {editError}
                </div>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">Theme Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-green-400"
                  required
                />
              </div>

              {/* Key — read-only */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">Theme Key</label>
                <input
                  value={editModal.key}
                  disabled
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] font-mono text-slate-400 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">Key cannot be changed — it is referenced by customer profiles.</p>
              </div>

              {/* Preview Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">
                  Preview Image URL <span className="font-normal text-slate-400">(optional)</span>
                </label>
                {/*
                  TODO: Replace this text input with an image upload button.
                  Call POST /api/uploads/theme-preview (multipart/form-data),
                  then set editForm.preview_image to the returned { url } value.
                */}
                <input
                  value={editForm.preview_image}
                  onChange={(e) => setEditForm({ ...editForm, preview_image: e.target.value })}
                  placeholder="https://…"
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-green-400"
                />
                {editForm.preview_image && (
                  <img
                    src={editForm.preview_image}
                    alt="Preview"
                    className="mt-1 h-20 w-full rounded-lg object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
                <p className="text-[11px] text-slate-400">Image upload will be available soon. Paste a URL for now.</p>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-slate-600">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] outline-none focus:border-green-400 bg-white"
                >
                  <option value="active">Active — visible to customers</option>
                  <option value="inactive">Inactive — hidden from customers</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditModal(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-600">
                  Cancel
                </button>
                <button type="submit" disabled={editSaving}
                  className="rounded-lg px-4 py-2 text-[13px] font-semibold text-black disabled:opacity-60"
                  style={{ background: "#28DC4F" }}>
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
