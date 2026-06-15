"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar, TopHeader } from "@/components/dashboard/shared";
import orderService from "@/services/orderService";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatINR(n) {
  const num = Number(n);
  if (!num && num !== 0) return "—";
  return `₹${num.toLocaleString("en-IN")}`;
}

function formatOrderId(order) {
  if (!order) return "—";
  if (order.order_number) return `#${order.order_number}`;
  const raw = String(order.id || order._id || "");
  return raw ? `#ORD-${raw.slice(-8).toUpperCase()}` : "—";
}

function formatAddress(addr) {
  if (!addr) return "—";
  return [addr.full_name, addr.street || addr.address || addr.line1, addr.city, addr.state, addr.pincode]
    .filter(Boolean).join(", ");
}

/* ─── status badge ────────────────────────────────────────────────────────── */

const STATUS_MAP = {
  delivered:  { bg: "rgba(40,220,79,0.12)",  color: "#28DC4F", label: "Delivered"  },
  paid:       { bg: "rgba(40,220,79,0.12)",  color: "#28DC4F", label: "Paid"       },
  processing: { bg: "rgba(59,130,246,0.12)", color: "#3B82F6", label: "Processing" },
  shipped:    { bg: "rgba(59,130,246,0.12)", color: "#3B82F6", label: "Shipped"    },
  pending:    { bg: "rgba(251,191,36,0.12)", color: "#F59E0B", label: "Pending"    },
  failed:     { bg: "rgba(239,68,68,0.12)",  color: "#EF4444", label: "Failed"     },
  cancelled:  { bg: "rgba(239,68,68,0.12)",  color: "#EF4444", label: "Cancelled"  },
};

function StatusBadge({ raw }) {
  const key = (raw || "pending").toLowerCase();
  const { bg, color, label } = STATUS_MAP[key] ?? STATUS_MAP.pending;
  return (
    <span
      className="inline-flex items-center rounded-full px-[10px] py-[3px] text-[12px] font-semibold"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  );
}

/* ─── icons ───────────────────────────────────────────────────────────────── */

function PackageIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M33 13L20 6 7 13v14l13 7 13-7V13Z" />
      <path d="M7 13l13 7M20 34V20M33 13l-13 7" />
      <path d="M13.5 9.5l13 7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.333 2.667V6h3.334" />
      <path d="M2.16 9.667A6 6 0 1 0 3.107 6.08l-1.774-.08" />
    </svg>
  );
}

/* ─── order row ───────────────────────────────────────────────────────────── */

function OrderRow({ order }) {
  const status = order.order_status || order.status || order.payment_status || "pending";
  const productName = order.product?.name || order.product_name || order.items?.[0]?.product_name || "NFC Card";
  const productImage = order.product?.images?.[0] || order.product_image || order.items?.[0]?.product_image || null;
  const total = order.total_amount ?? order.amount ?? order.total ?? 0;

  return (
    <div className="flex items-center gap-4 rounded-[12px] border border-[#F0F0F0] bg-white px-5 py-4 transition-shadow hover:shadow-sm">
      {/* Product thumbnail */}
      <div
        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
        style={{ background: "#F5F5F5" }}
      >
        {productImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={productImage} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 8l-8-4-8 4v8l8 4 8-4V8Z" />
            <path d="M4 8l8 4M12 20V12M20 8l-8 4" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#111827]">{productName}</p>
            <p className="mt-[2px] text-[12px] text-[#9CA3AF]">{formatOrderId(order)}</p>
          </div>
          <p className="shrink-0 text-[15px] font-semibold text-[#111827]">{formatINR(total)}</p>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <StatusBadge raw={status} />
          <span className="text-[12px] text-[#9CA3AF]">{formatDate(order.created_at || order.createdAt)}</span>
        </div>
      </div>

      <ChevronRightIcon />
    </div>
  );
}

/* ─── order detail drawer ─────────────────────────────────────────────────── */

function OrderDetailPanel({ order, onClose }) {
  if (!order) return null;

  const status = order.order_status || order.status || order.payment_status || "pending";
  const productName = order.product?.name || order.product_name || order.items?.[0]?.product_name || "NFC Card";
  const productImage = order.product?.images?.[0] || order.product_image || order.items?.[0]?.product_image || null;
  const total = order.total_amount ?? order.amount ?? order.total ?? 0;
  const shipping = order.shipping_cost ?? (total >= 799 ? 0 : 99);
  const subtotal = total - shipping;

  const STEPS = [
    { key: "pending",    label: "Order Placed"  },
    { key: "processing", label: "Processing"    },
    { key: "shipped",    label: "Shipped"       },
    { key: "delivered",  label: "Delivered"     },
  ];
  const statusKey = status.toLowerCase();
  const stepIndex = STEPS.findIndex((s) => s.key === statusKey);
  const activeStep = stepIndex >= 0 ? stepIndex : (statusKey === "paid" ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="relative flex h-full w-full max-w-[440px] flex-col overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F0F0F0] px-6 py-5">
          <div>
            <p className="text-[18px] font-bold text-[#111827]">{formatOrderId(order)}</p>
            <p className="mt-[2px] text-[12px] text-[#9CA3AF]">{formatDate(order.created_at || order.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F5F5F5] hover:text-[#111827]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">

          {/* Status + product */}
          <div className="flex items-center gap-4 rounded-[12px] bg-[#F9FAFB] p-4">
            <div
              className="flex h-[56px] w-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
              style={{ background: "#EBEBEB" }}
            >
              {productImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={productImage} alt={productName} className="h-full w-full object-cover" />
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 8l-8-4-8 4v8l8 4 8-4V8Z" />
                  <path d="M4 8l8 4M12 20V12M20 8l-8 4" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#111827]">{productName}</p>
              <p className="mt-1 text-[13px] text-[#6B7280]">Qty: 1</p>
            </div>
            <StatusBadge raw={status} />
          </div>

          {/* Order tracker */}
          {!["failed", "cancelled"].includes(statusKey) && (
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-semibold text-[#111827]">Order Tracking</p>
              <div className="relative flex flex-col gap-0">
                {STEPS.map((step, i) => {
                  const done    = i <= activeStep;
                  const current = i === activeStep;
                  const last    = i === STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex gap-3">
                      {/* dot + line */}
                      <div className="flex flex-col items-center">
                        <div
                          className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full"
                          style={{ background: done ? "#28DC4F" : "#E5E7EB" }}
                        >
                          {done && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5 3.5-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        {!last && <div className="my-[2px] w-[2px] flex-1" style={{ background: i < activeStep ? "#28DC4F" : "#E5E7EB", minHeight: "24px" }} />}
                      </div>
                      {/* label */}
                      <div className="pb-5">
                        <p className="text-[13px] font-medium" style={{ color: current ? "#111827" : done ? "#28DC4F" : "#9CA3AF" }}>
                          {step.label}
                        </p>
                        {current && (
                          <p className="text-[11px] text-[#9CA3AF]">In progress</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price summary */}
          <div className="rounded-[12px] border border-[#F0F0F0] px-5 py-4">
            <p className="mb-3 text-[14px] font-semibold text-[#111827]">Price Summary</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Subtotal",  value: formatINR(subtotal > 0 ? subtotal : total) },
                { label: "Shipping",  value: shipping === 0 ? "Free" : formatINR(shipping) },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6B7280]">{label}</span>
                  <span className="text-[13px] text-[#111827]">{value}</span>
                </div>
              ))}
              <div className="my-1 h-px bg-[#F0F0F0]" />
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#111827]">Total</span>
                <span className="text-[15px] font-bold text-[#111827]">{formatINR(total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          {order.shipping_address && (
            <div className="rounded-[12px] border border-[#F0F0F0] px-5 py-4">
              <p className="mb-2 text-[14px] font-semibold text-[#111827]">Shipping Address</p>
              <p className="text-[13px] leading-[1.7] text-[#6B7280]">{formatAddress(order.shipping_address)}</p>
            </div>
          )}

          {/* Payment info */}
          <div className="rounded-[12px] border border-[#F0F0F0] px-5 py-4">
            <p className="mb-3 text-[14px] font-semibold text-[#111827]">Payment</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Method",  value: order.payment_method || "Online" },
                { label: "Status",  value: <StatusBadge raw={order.payment_status || status} /> },
                order.payment_id && { label: "Payment ID", value: <span className="font-mono text-[11px]">{order.payment_id}</span> },
              ].filter(Boolean).map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6B7280]">{label}</span>
                  <span className="text-[13px] text-[#111827]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Re-order CTA */}
          <Link
            href="/products"
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#28DC4F" }}
          >
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── page ────────────────────────────────────────────────────────────────── */

export default function OrdersPage() {
  const router = useRouter();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [initials,     setInitials]     = useState("U");
  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) { router.push("/login"); return; }

    const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
    const displayName = stored.full_name || stored.name || "";
    setInitials(
      displayName.split(" ").map((w) => w[0] || "").join("").toUpperCase().slice(0, 2) || "U"
    );

    orderService.getMyOrders()
      .then((raw) => {
        const candidate = Array.isArray(raw)
          ? raw
          : (raw?.orders ?? raw?.data?.orders ?? raw?.data ?? []);
        const list = Array.isArray(candidate) ? candidate : [];
        const sorted = [...list].sort(
          (a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
        );
        setOrders(sorted);
      })
      .catch((err) => {
        setError("Could not load your orders. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
        <Sidebar open={false} onClose={() => {}} activeNav="Orders" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopHeader onMenuClick={() => {}} initials={initials} />
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#28DC4F] border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Orders" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold text-[#111827]">Orders</h1>
              <p className="mt-1 text-[14px] text-[#6B7280]">
                {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? "s" : ""} found` : "Track your NFC card orders here."}
              </p>
            </div>
            <button
              onClick={() => {
                setLoading(true);
                setError("");
                orderService.getMyOrders()
                  .then((raw) => {
                    const candidate = Array.isArray(raw)
                      ? raw
                      : (raw?.orders ?? raw?.data?.orders ?? raw?.data ?? []);
                    const list = Array.isArray(candidate) ? candidate : [];
                    setOrders([...list].sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)));
                  })
                  .catch(() => setError("Could not refresh orders."))
                  .finally(() => setLoading(false));
              }}
              className="flex items-center gap-2 rounded-[10px] border border-[#EBEBEB] bg-white px-4 py-[9px] text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
            >
              <RefreshIcon />
              Refresh
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
              {error}
            </div>
          )}

          {/* Orders list */}
          {orders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <button
                  key={order.id || order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="w-full text-left"
                >
                  <OrderRow order={order} />
                </button>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-[#F0F0F0] bg-white px-6 py-16 text-center">
              <PackageIcon />
              <h2 className="mt-4 text-[18px] font-semibold text-[#111827]">No orders yet</h2>
              <p className="mt-2 max-w-[280px] text-[14px] text-[#6B7280]">
                Once you place an order your NFC card orders will appear here.
              </p>
              <Link
                href="/products"
                className="mt-6 flex items-center gap-2 rounded-[10px] px-6 py-[11px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#28DC4F" }}
              >
                Shop Now
              </Link>
            </div>
          )}

        </main>
      </div>

      {/* Order detail side panel */}
      {selectedOrder && (
        <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
