"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar, TopHeader } from "@/components/dashboard/shared";
import api from "@/services/api";

export default function FormsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initials,    setInitials]    = useState("U");
  const [forms,       setForms]       = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) { router.replace("/login"); return; }
    try {
      const u = JSON.parse(localStorage.getItem("customerUser") || "{}");
      const name = u.full_name || u.name || "";
      setInitials(name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "U");
    } catch {}
    loadForms();
  }, [router]);

  async function loadForms() {
    try {
      const r = await api.get("/forms");
      setForms(r.data.forms || []);
    } finally {
      setLoading(false);
    }
  }


  async function toggleActive(form) {
    await api.patch(`/forms/${form.id}`, { is_active: !form.is_active });
    setForms(p => p.map(f => f.id === form.id ? { ...f, is_active: !f.is_active } : f));
  }

  async function deleteForm(id) {
    if (!confirm("Delete this form? All leads will be lost.")) return;
    await api.delete(`/forms/${id}`);
    setForms(p => p.filter(f => f.id !== id));
  }

  const FRONTEND = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="My Forms" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold text-[#111827]">My Forms</h1>
              <p className="mt-1 text-[14px] text-[#6B7280]">Collect leads when someone taps your card</p>
            </div>
            <button onClick={() => router.push("/dashboard/forms/new")}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-black"
              style={{ background: "#28DC4F" }}>
              + New Form
            </button>
          </div>

          {/* Forms list */}
          {loading ? (
            <div className="py-12 text-center text-[13px] text-[#9CA3AF]">Loading…</div>
          ) : forms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-white py-16 text-center">
              <p className="text-[15px] font-semibold text-[#111827]">No forms yet</p>
              <p className="mt-1 text-[13px] text-[#9CA3AF]">Create a form to start collecting leads from your card</p>
              <button onClick={() => router.push("/dashboard/forms/new")}
                className="mt-4 rounded-xl px-6 py-2.5 text-[13px] font-semibold text-black"
                style={{ background: "#28DC4F" }}>
                Create your first form
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-3xl">
              {forms.map(form => (
                <div key={form.id} className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-[#111827] truncate">{form.title}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${form.is_active ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                          {form.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-[#9CA3AF]">
                        {form.fields?.length || 0} fields
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => router.push(`/dashboard/forms/${form.id}`)}
                        className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-[#F9FAFB]">
                        Edit
                      </button>
                      <button onClick={() => toggleActive(form)}
                        className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-[#F9FAFB]">
                        {form.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => deleteForm(form.id)}
                        className="rounded-lg border border-[#FEE2E2] px-3 py-1.5 text-[12px] font-medium text-[#EF4444] hover:bg-[#FEF2F2]">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Form link */}
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F9FAFB] px-3 py-2">
                    <span className="text-[11px] text-[#9CA3AF] truncate flex-1">{FRONTEND}/f/{form.slug}</span>
                    <button onClick={() => navigator.clipboard.writeText(`${FRONTEND}/f/${form.slug}`)}
                      className="shrink-0 text-[11px] font-medium text-[#28DC4F] hover:opacity-75">
                      Copy link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
