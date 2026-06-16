"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ResellerLayout from "@/components/ResellerLayout";
import orderService from "@/services/orderService";

const STATUS_COLORS = {
  paid:      "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-600",
  refunded:  "bg-gray-100 text-gray-600",
};

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [status, setStatus]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    orderService.list({ page, limit: 20, status: status || undefined })
      .then((r) => {
        setOrders(r.data.orders);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <ResellerLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[#111827]">Orders</h2>
            <p className="text-[13px] text-[#6B7280]">{total} total orders</p>
          </div>
          <Link href="/orders/new" className="bg-[#28DC4F] text-black text-[13px] font-semibold px-4 py-2 rounded-lg">
            + New Order
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["", "pending", "paid", "cancelled"].map((s) => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${status === s ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6B7280] border-[#E2E8F0] hover:border-[#111827]"}`}
            >
              {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-[13px] text-[#6B7280]">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[13px] text-[#9CA3AF]">No orders found.</p>
              <Link href="/orders/new" className="mt-2 inline-block text-[13px] text-[#28DC4F] font-medium">Create your first order →</Link>
            </div>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] text-[#6B7280] uppercase tracking-wide">
                  <th className="text-left px-5 py-3">Customer</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Amount</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Commission</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#111827]">{o.customer_name || "—"}</p>
                      <p className="text-[11px] text-[#9CA3AF]">{o.customer_phone || ""}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#111827]">₹{Number(o.order_total).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#16a34a] font-medium">₹{Number(o.commission_amount).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[o.status] || ""}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-[#9CA3AF]">
                      {new Date(o.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/orders/${o.id}`} className="text-[12px] text-[#28DC4F] font-medium">View →</Link>
                    </td>
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
