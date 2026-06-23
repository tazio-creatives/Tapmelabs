"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ResellerLayout from "@/components/ResellerLayout";
import orderService from "@/services/orderService";

const STATUS = {
  paid:      { bg: "#DCFCE7", color: "#16A34A" },
  pending:   { bg: "#FEF9C3", color: "#D97706" },
  cancelled: { bg: "#FEE2E2", color: "#DC2626" },
  refunded:  { bg: "#F1F5F9", color: "#64748B" },
};

const FILTERS = ["", "pending", "paid", "cancelled"];

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
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Orders</h2>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "3px 0 0" }}>{total} total orders</p>
          </div>
          <Link href="/orders/new"
            style={{ background: "#28DC4F", color: "#000", fontSize: 13, fontWeight: 600, padding: "9px 16px", borderRadius: 8, textDecoration: "none" }}>
            + New Order
          </Link>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6 }}>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => { setStatus(f); setPage(1); }}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: "1px solid",  cursor: "pointer", transition: "all 0.12s",
                background: status === f ? "#111827" : "#fff",
                color:      status === f ? "#fff"    : "#6B7280",
                borderColor: status === f ? "#111827" : "#E2E8F0",
              }}>
              {f === "" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Table card */}
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "48px 0", textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>Loading…</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 8px" }}>No orders found.</p>
              <Link href="/orders/new" style={{ fontSize: 13, color: "#28DC4F", fontWeight: 500, textDecoration: "none" }}>Create your first order →</Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    {["Customer", "Amount", "Commission", "Status", "Date", ""].map((h) => (
                      <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #F8FAFC", transition: "background 0.1s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px 18px" }}>
                        <p style={{ fontWeight: 500, color: "#111827", margin: 0 }}>{o.customer_name || "—"}</p>
                        <p style={{ fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>{o.customer_phone || ""}</p>
                      </td>
                      <td style={{ padding: "12px 18px", color: "#374151" }}>₹{Number(o.order_total).toLocaleString("en-IN")}</td>
                      <td style={{ padding: "12px 18px", color: "#16A34A", fontWeight: 500 }}>₹{Number(o.commission_amount).toLocaleString("en-IN")}</td>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, ...(STATUS[o.status] || { background: "#F1F5F9", color: "#64748B" }), background: (STATUS[o.status] || {}).bg }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                        {new Date(o.createdAt || o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "12px 18px", textAlign: "right" }}>
                        <Link href={`/orders/${o.id}`} style={{ fontSize: 12, color: "#28DC4F", fontWeight: 500, textDecoration: "none" }}>View →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              style={{ padding: "6px 14px", fontSize: 12, border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
              ← Prev
            </button>
            <span style={{ fontSize: 12, color: "#6B7280" }}>{page} / {pages}</span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
              style={{ padding: "6px 14px", fontSize: 12, border: "1px solid #E2E8F0", borderRadius: 8, background: "#fff", cursor: page === pages ? "not-allowed" : "pointer", opacity: page === pages ? 0.4 : 1 }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </ResellerLayout>
  );
}
