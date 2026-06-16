"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResellerLayout from "@/components/ResellerLayout";
import commissionService from "@/services/commissionService";

const PAYOUT_STATUS_COLORS = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  paid:     "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function PayoutPage() {
  const router = useRouter();
  const [summary, setSummary]   = useState(null);
  const [history, setHistory]   = useState([]);
  const [method, setMethod]     = useState("upi");
  const [form, setForm]         = useState({
    amount: "",
    upi_id: "",
    bank_account: "",
    bank_ifsc: "",
    bank_name: "",
  });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      commissionService.summary(),
      commissionService.payoutHistory(),
    ]).then(([s, h]) => {
      setSummary(s.data);
      setHistory(h.data.payouts || h.data || []);
    }).finally(() => setDataLoading(false));
  }, []);

  const balance = Number(summary?.commission_balance || 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const amount = Number(form.amount);
    if (!amount || amount <= 0) { setError("Enter a valid amount"); return; }
    if (amount > balance) { setError(`Amount exceeds your balance of ₹${balance.toFixed(2)}`); return; }
    if (method === "upi" && !form.upi_id.trim()) { setError("Enter your UPI ID"); return; }
    if (method === "bank") {
      if (!form.bank_account.trim() || !form.bank_ifsc.trim() || !form.bank_name.trim()) {
        setError("Fill in all bank details"); return;
      }
    }

    setLoading(true);
    try {
      await commissionService.requestPayout({
        amount,
        upi_id:       method === "upi" ? form.upi_id : undefined,
        bank_account: method === "bank" ? form.bank_account : undefined,
        bank_ifsc:    method === "bank" ? form.bank_ifsc : undefined,
        bank_name:    method === "bank" ? form.bank_name : undefined,
      });
      setSuccess("Payout request submitted! Admin will process it within 1-3 business days.");
      setForm({ amount: "", upi_id: "", bank_account: "", bank_ifsc: "", bank_name: "" });
      // Refresh history
      commissionService.payoutHistory().then((h) => setHistory(h.data.payouts || h.data || []));
      commissionService.summary().then((s) => setSummary(s.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit payout request");
    } finally {
      setLoading(false);
    }
  }

  const inp = "w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#28DC4F] transition-colors";

  return (
    <ResellerLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/commission" className="text-[13px] text-[#6B7280] hover:text-[#111827]">← Commission</Link>
          <span className="text-[#D1D5DB]">/</span>
          <h2 className="text-[18px] font-bold text-[#111827]">Request Payout</h2>
        </div>

        {/* Balance card */}
        {!dataLoading && (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4">
            <p className="text-[12px] text-[#6B7280] mb-0.5">Available Balance</p>
            <p className="text-[28px] font-black text-[#16a34a]">
              ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-4">
          <h3 className="text-[14px] font-semibold text-[#111827]">Payout Details</h3>

          {error   && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-600">{error}</div>}
          {success && <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-[13px] text-green-700">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Amount (₹)</label>
              <input type="number" min={1} max={balance} step="0.01" className={inp}
                placeholder={`Max ₹${balance.toFixed(2)}`}
                value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            {/* Method toggle */}
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-2">Payout Method</label>
              <div className="flex rounded-lg border border-[#E2E8F0] overflow-hidden">
                {["upi", "bank"].map((m) => (
                  <button key={m} type="button" onClick={() => setMethod(m)}
                    className={`flex-1 py-2 text-[13px] font-medium transition-colors ${method === m ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] hover:bg-[#F8FAFC]"}`}>
                    {m === "upi" ? "UPI" : "Bank Transfer"}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI */}
            {method === "upi" && (
              <div>
                <label className="block text-[12px] font-medium text-[#374151] mb-1">UPI ID</label>
                <input className={inp} placeholder="yourname@upi"
                  value={form.upi_id} onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
                />
              </div>
            )}

            {/* Bank */}
            {method === "bank" && (
              <>
                <div>
                  <label className="block text-[12px] font-medium text-[#374151] mb-1">Account Number</label>
                  <input className={inp} placeholder="Account number"
                    value={form.bank_account} onChange={(e) => setForm({ ...form, bank_account: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#374151] mb-1">IFSC Code</label>
                  <input className={inp} placeholder="SBIN0001234"
                    value={form.bank_ifsc} onChange={(e) => setForm({ ...form, bank_ifsc: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#374151] mb-1">Bank Name</label>
                  <input className={inp} placeholder="e.g. State Bank of India"
                    value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={loading || balance === 0}
              className="w-full bg-[#28DC4F] text-black font-semibold text-[14px] py-3 rounded-xl hover:bg-[#22c946] transition-colors disabled:opacity-60">
              {loading ? "Submitting…" : "Submit Payout Request"}
            </button>
          </form>
        </div>

        {/* Payout history */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h3 className="text-[13px] font-semibold text-[#111827]">Payout History</h3>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {history.map((p) => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-[#111827]">₹{Number(p.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{p.upi_id || p.bank_name || "—"} · {new Date(p.created_at).toLocaleDateString("en-IN")}</p>
                    {p.admin_note && <p className="text-[11px] text-[#6B7280] mt-0.5">{p.admin_note}</p>}
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${PAYOUT_STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ResellerLayout>
  );
}
