"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import api from "@/services/api";

const STATUS_COLORS = {
  active:  { bg: "#DCFCE7", color: "#16A34A" },
  blocked: { bg: "#FEE2E2", color: "#DC2626" },
};

export default function ResellersPage() {
  const [resellers, setResellers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    api.get("/admin/resellers")
      .then((r) => setResellers(r.data.resellers || r.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = resellers.filter((r) =>
    r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.phone?.includes(search)
  );

  return (
    <AdminLayout title="Resellers">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold text-[#0F172A]">Resellers</h1>
            <p className="text-[13px] text-[#64748B]">{resellers.length} total resellers</p>
          </div>
          <Link href="/resellers/new"
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-black transition-opacity hover:opacity-80"
            style={{ background: "#28DC4F" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Reseller
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text" placeholder="Search resellers…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-9 pr-3 text-[13px] text-[#0F172A] outline-none focus:border-[#28DC4F]"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
          {loading ? (
            <div className="py-16 text-center text-[13px] text-[#94A3B8]">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[13px] text-[#94A3B8]">No resellers found.</p>
              <Link href="/resellers/new" className="mt-2 inline-block text-[13px] text-[#28DC4F] font-medium">Add your first reseller →</Link>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] text-[#94A3B8] uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Phone</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Commission</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Balance</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#0F172A]">{r.full_name}</p>
                      <p className="text-[11px] text-[#94A3B8]">{r.email}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#475569]">{r.phone || "—"}</td>
                    <td className="px-5 py-3 hidden md:table-cell font-semibold text-[#7C3AED]">{r.commission_rate}%</td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#16A34A] font-medium">
                      ₹{Number(r.commission_balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={STATUS_COLORS[r.status] || { bg: "#F1F5F9", color: "#64748B" }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#94A3B8]">
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/resellers/${r.id}`} className="text-[12px] text-[#28DC4F] font-medium hover:underline">Manage →</Link>
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
