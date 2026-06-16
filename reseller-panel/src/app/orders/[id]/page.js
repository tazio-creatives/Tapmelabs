"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ResellerLayout from "@/components/ResellerLayout";
import orderService from "@/services/orderService";

const STATUS_COLORS = {
  paid:      "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-600",
  refunded:  "bg-gray-100 text-gray-600",
};

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#F8FAFC] last:border-0">
      <span className="text-[12px] text-[#6B7280]">{label}</span>
      <span className="text-[13px] font-medium text-[#111827]">{value ?? "—"}</span>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id }       = useParams();
  const searchParams = useSearchParams();
  const success      = searchParams.get("success");

  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError]   = useState("");

  useEffect(() => {
    orderService.detail(id)
      .then((r) => setOrder(r.data))
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCancel() {
    if (!confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const { data } = await orderService.cancel(id);
      setOrder(data.reseller_order);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <ResellerLayout><div className="text-[13px] text-[#6B7280]">Loading…</div></ResellerLayout>;
  if (error)   return <ResellerLayout><div className="text-[13px] text-red-600">{error}</div></ResellerLayout>;

  const o = order;
  return (
    <ResellerLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        {success && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-[13px] text-green-700 font-medium">
            ✓ Order placed successfully! Commission will be credited once confirmed.
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-[#111827]">Order Detail</h2>
            <p className="text-[12px] text-[#9CA3AF] font-mono">{o.id}</p>
          </div>
          <span className={`text-[12px] font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[o.status] || ""}`}>
            {o.status}
          </span>
        </div>

        {/* Customer */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="text-[13px] font-semibold text-[#111827] mb-3">Customer</h3>
          <Row label="Name"  value={o.customer_name} />
          <Row label="Phone" value={o.customer_phone} />
          <Row label="Email" value={o.customer_email} />
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="text-[13px] font-semibold text-[#111827] mb-3">Payment</h3>
          <Row label="Order Total"         value={`₹${Number(o.order_total).toLocaleString("en-IN")}`} />
          <Row label="Commission Applied"  value={`₹${Number(o.commission_applied).toLocaleString("en-IN")}`} />
          <Row label="Paid via Razorpay"   value={`₹${Number(o.razorpay_amount).toLocaleString("en-IN")}`} />
          <Row label="Payment Method"      value={o.payment_method} />
          {o.razorpay_payment_id && <Row label="Razorpay ID" value={o.razorpay_payment_id} />}
        </div>

        {/* Commission */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="text-[13px] font-semibold text-[#111827] mb-3">Commission</h3>
          <Row label="Rate"             value={`${Number(o.commission_rate)}%`} />
          <Row label="Commission Earned" value={`₹${Number(o.commission_amount).toLocaleString("en-IN")}`} />
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="text-[13px] font-semibold text-[#111827] mb-3">Dates</h3>
          <Row label="Created" value={new Date(o.created_at).toLocaleString("en-IN")} />
          <Row label="Updated" value={new Date(o.updated_at).toLocaleString("en-IN")} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/orders" className="flex-1 text-center border border-[#E2E8F0] text-[13px] font-medium py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors">
            ← Back to Orders
          </Link>
          {o.status === "pending" && (
            <button onClick={handleCancel} disabled={cancelling}
              className="flex-1 border border-red-200 text-red-600 text-[13px] font-medium py-2.5 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              {cancelling ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </ResellerLayout>
  );
}
