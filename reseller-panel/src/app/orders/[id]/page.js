"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ResellerLayout from "@/components/ResellerLayout";
import orderService from "@/services/orderService";

const STATUS = {
  paid:      { bg: "#DCFCE7", color: "#16A34A" },
  pending:   { bg: "#FEF9C3", color: "#D97706" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626" },
  refunded:  { bg: "#F1F5F9", color: "#64748B" },
};

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F8FAFC" }}>
      <span style={{ fontSize: 12, color: "#6B7280" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{value ?? "—"}</span>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px" }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>{title}</p>
      {children}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id }        = useParams();
  const searchParams  = useSearchParams();
  const success       = searchParams.get("success");
  const [order, setOrder]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError]         = useState("");

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

  if (loading) return <ResellerLayout><p style={{ fontSize: 13, color: "#9CA3AF" }}>Loading…</p></ResellerLayout>;
  if (error)   return <ResellerLayout><p style={{ fontSize: 13, color: "#DC2626" }}>{error}</p></ResellerLayout>;

  const o = order;
  const s = STATUS[o.status] || { bg: "#F1F5F9", color: "#64748B" };

  return (
    <ResellerLayout>
      <div style={{ maxWidth: 620, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

        {success && (
          <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#16A34A", fontWeight: 500 }}>
            ✓ Order placed successfully! Commission will be credited once confirmed.
          </div>
        )}

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Order Detail</h2>
            <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0", fontFamily: "monospace" }}>{o.id}</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
            {o.status}
          </span>
        </div>

        {/* Customer */}
        <Card title="Customer">
          <Row label="Name"  value={o.customer_name} />
          <Row label="Phone" value={o.customer_phone} />
          <Row label="Email" value={o.customer_email} />
        </Card>

        {/* Payment */}
        <Card title="Payment">
          <Row label="Order Total"        value={`₹${Number(o.order_total).toLocaleString("en-IN")}`} />
          <Row label="Commission Applied" value={`₹${Number(o.commission_applied).toLocaleString("en-IN")}`} />
          <Row label="Paid via Razorpay"  value={`₹${Number(o.razorpay_amount).toLocaleString("en-IN")}`} />
          <Row label="Payment Method"     value={o.payment_method} />
          {o.razorpay_payment_id && <Row label="Razorpay ID" value={o.razorpay_payment_id} />}
        </Card>

        {/* Commission */}
        <Card title="Commission">
          <Row label="Rate"             value={`${Number(o.commission_rate)}%`} />
          <Row label="Commission Earned" value={`₹${Number(o.commission_amount).toLocaleString("en-IN")}`} />
        </Card>

        {/* Dates */}
        <Card title="Dates">
          <Row label="Created" value={new Date(o.createdAt || o.created_at).toLocaleString("en-IN")} />
          <Row label="Updated" value={new Date(o.updatedAt || o.updated_at).toLocaleString("en-IN")} />
        </Card>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/orders"
            style={{ flex: 1, textAlign: "center", border: "1px solid #E2E8F0", fontSize: 13, fontWeight: 500, padding: "11px 0", borderRadius: 10, color: "#374151", textDecoration: "none", background: "#fff" }}>
            ← Back to Orders
          </Link>
          {o.status === "pending" && (
            <button onClick={handleCancel} disabled={cancelling}
              style={{ flex: 1, border: "1px solid #FECACA", fontSize: 13, fontWeight: 500, padding: "11px 0", borderRadius: 10, color: "#DC2626", background: "#fff", cursor: cancelling ? "not-allowed" : "pointer", opacity: cancelling ? 0.6 : 1 }}>
              {cancelling ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>
    </ResellerLayout>
  );
}
