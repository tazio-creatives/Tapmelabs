"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ResellerLayout from "@/components/ResellerLayout";
import commissionService from "@/services/commissionService";

const TYPE_COLORS = {
  earned:    "bg-green-100 text-green-700",
  used:      "bg-blue-100 text-blue-700",
  withdrawn: "bg-purple-100 text-purple-700",
  refunded:  "bg-red-100 text-red-600",
};

function StatCard({ label, value, color = "#111827", sub }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
      <p className="text-[12px] text-[#6B7280] mb-1">{label}</p>
      <p className="text-[22px] font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function CommissionPage() {
  const [summary, setSummary] = useState(null);
  const [ledger, setLedger]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [ledgerLoading, setLedgerLoading] = useState(true);

  useEffect(() => {
    commissionService.summary()
      .then((r) => setSummary(r.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLedgerLoading(true);
    commissionService.ledger({ page, limit: 20 })
      .then((r) => {
        setLedger(r.data.ledger || []);
        setTotal(r.data.total || 0);
        setPages(r.data.pages || 1);
      })
      .finally(() => setLedgerLoading(false));
  }, [page]);

  const fmt = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <ResellerLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[#111827]">Commission</h2>
            <p className="text-[13px] text-[#6B7280]">Your earnings and transaction history</p>
          </div>
          <Link href="/commission/payout"
            className="bg-[#111827] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#374151] transition-colors">
            Request Payout
          </Link>
        </div>

        {/* Summary cards */}
        {!loading && summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Available Balance" value={fmt(summary.commission_balance)} color="#28DC4F" sub="Ready to use or withdraw" />
            <StatCard label="Total Earned"      value={fmt(summary.total_earned)}        color="#111827" />
            <StatCard label="Commission Rate"   value={`${summary.commission_rate || 0}%`} color="#1D4ED8" />
            <StatCard label="Total Withdrawn"   value={fmt(summary.total_withdrawn)}     color="#7C3AED" />
          </div>
        )}

        {/* Ledger */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
            <h3 className="text-[13px] font-semibold text-[#111827]">Transaction History</h3>
            <span className="text-[12px] text-[#6B7280]">{total} records</span>
          </div>

          {ledgerLoading ? (
            <div className="py-12 text-center text-[13px] text-[#6B7280]">Loading…</div>
          ) : ledger.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-[#9CA3AF]">No transactions yet.</div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] text-[#6B7280] uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Type</th>
                  <th className="text-left px-5 py-3">Amount</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Balance After</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Note</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${TYPE_COLORS[entry.type] || "bg-gray-100 text-gray-600"}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-[#111827]">
                      {entry.type === "earned" || entry.type === "refunded" ? "+" : "−"}
                      {fmt(entry.amount)}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#6B7280]">{fmt(entry.balance_after)}</td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#9CA3AF] text-[12px] max-w-[200px] truncate">{entry.note || "—"}</td>
                    <td className="px-5 py-3 text-[#9CA3AF]">{new Date(entry.createdAt || entry.created_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 text-[12px] border border-[#E2E8F0] rounded-lg disabled:opacity-40">← Prev</button>
            <span className="text-[12px] text-[#6B7280]">{page} / {pages}</span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 text-[12px] border border-[#E2E8F0] rounded-lg disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </ResellerLayout>
  );
}
