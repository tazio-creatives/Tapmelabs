"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import api from "@/services/api";

export default function NewResellerPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "", commission_rate: "10",
  });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/reseller/auth/register", form);
      router.push("/resellers");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create reseller");
    } finally {
      setLoading(false);
    }
  }

  const inp = "w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5 text-[13px] text-[#0F172A] outline-none focus:border-[#28DC4F] transition-colors";

  return (
    <AdminLayout title="Add Reseller">
      <div className="max-w-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/resellers" className="text-[13px] text-[#64748B] hover:text-[#0F172A]">← Resellers</Link>
          <span className="text-[#E2E8F0]">/</span>
          <h1 className="text-[20px] font-bold text-[#0F172A]">Add Reseller</h1>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#475569]">Full Name</label>
              <input className={inp} placeholder="John Doe" required
                value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#475569]">Email</label>
              <input className={inp} type="email" placeholder="reseller@example.com" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#475569]">Phone</label>
              <input className={inp} type="tel" placeholder="9876543210"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#475569]">Password</label>
              <input className={inp} type="password" placeholder="Min 8 characters" required minLength={8}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#475569]">Commission Rate (%)</label>
              <input className={inp} type="number" min={0} max={100} step={0.5} required
                value={form.commission_rate} onChange={(e) => setForm({ ...form, commission_rate: e.target.value })} />
              <p className="mt-1 text-[11px] text-[#94A3B8]">Percentage of each sale credited to the reseller</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/resellers"
                className="flex-1 rounded-lg border border-[#E2E8F0] py-2.5 text-center text-[13px] font-medium text-[#475569] hover:bg-[#F8FAFC] transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={loading}
                className="flex-1 rounded-lg py-2.5 text-[13px] font-semibold text-black transition-opacity hover:opacity-80 disabled:opacity-60"
                style={{ background: "#28DC4F" }}>
                {loading ? "Creating…" : "Create Reseller"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
