"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import paymentService from "@/services/paymentService";
import orderService from "@/services/orderService";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const SpinnerSVG = () => (
  <svg className="animate-spin" style={{ animationDuration: "0.9s" }} width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="22" stroke="#F0F0F0" strokeWidth="4" />
    <circle cx="26" cy="26" r="22" stroke="#28DC4F" strokeWidth="4" strokeLinecap="round" strokeDasharray="44 94" />
  </svg>
);

export default function PaymentModal({ onClose, onSuccess }) {
  const router = useRouter();
  const [status,    setStatus]    = useState("loading"); // loading | ready | error | no-order
  const [errorMsg,  setErrorMsg]  = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    initPayment();
  }, []);

  async function initPayment() {
    setStatus("loading");
    setErrorMsg("");

    let order = null;
    let user  = {};
    try {
      const raw = localStorage.getItem("currentOrder");
      if (raw) order = JSON.parse(raw);
      const rawUser = localStorage.getItem("customerUser");
      if (rawUser) user = JSON.parse(rawUser);
    } catch {}

    // If no localStorage order (or it's already paid), fetch latest unpaid from API
    if (!order?.id || order.payment_status === "paid") {
      try {
        const res    = await orderService.getMyOrders();
        const orders = res?.data?.orders ?? [];
        order = orders.find((o) => o.payment_status !== "paid") ?? null;
      } catch {}
    }

    if (!order?.id) {
      setStatus("no-order");
      return;
    }

    setOrderInfo(order);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setErrorMsg("Failed to load payment gateway. Check your connection and try again.");
      setStatus("error");
      return;
    }

    let rzpData = null;
    try {
      const result = await paymentService.createRazorpayOrder(order.id);
      rzpData = result.data;
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Could not initiate payment. Please try again.");
      setStatus("error");
      return;
    }

    const shippingAddr = order.shipping_address || {};

    const rzp = new window.Razorpay({
      key:         rzpData.key_id,
      amount:      rzpData.amount,
      currency:    rzpData.currency,
      order_id:    rzpData.razorpay_order_id,
      name:        "TAPME Labs",
      description: "NFC Business Card Order",
      prefill: {
        name:    user.full_name || user.name || "",
        email:   user.email    || "",
        contact: shippingAddr.phone || user.phone || "",
      },
      theme: { color: "#28DC4F" },

      handler: async function (response) {
        try {
          await paymentService.verifyRazorpayPayment({
            order_id:            order.id,
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          });
          try {
            const stored = JSON.parse(localStorage.getItem("currentOrder") || "{}");
            localStorage.setItem("currentOrder", JSON.stringify({
              ...stored,
              payment_status: "paid",
              payment_id: response.razorpay_payment_id,
            }));
            sessionStorage.setItem("tapme:hasPaidOrder", "true");
            sessionStorage.removeItem("tapme:hasProfile");
          } catch {}
          onSuccess();
          router.push("/payment/success");
        } catch {
          setErrorMsg("Payment verification failed. Please contact support if amount was deducted.");
          setStatus("error");
        }
      },

      modal: {
        ondismiss: function () {
          onClose();
        },
      },
    });

    rzp.on("payment.failed", function () {
      setErrorMsg("Payment was declined. Please try again with a different payment method.");
      setStatus("error");
    });

    setStatus("ready");
    rzp.open();
  }

  function handleRetry() {
    didInit.current = false;
    initPayment();
  }

  const totalAmount = orderInfo ? Number(orderInfo.total_amount) : 0;
  const orderId     = orderInfo
    ? (orderInfo.order_number || `TML-${String(orderInfo.id).padStart(6, "0")}`)
    : "—";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-[420px] rounded-[24px] border border-[#F0F0F0] bg-white px-8 py-10 shadow-[0_16px_60px_rgba(0,0,0,0.18)]">

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F5F5F5] hover:text-[#111827]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 2l12 12M14 2 2 14" />
          </svg>
        </button>

        {/* ── Loading ── */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <SpinnerSVG />
            <div>
              <h2 className="text-[20px] font-bold text-[#111827]">Opening Payment Gateway</h2>
              <p className="mt-2 text-[14px] text-[#6D6D6D]">Connecting to Razorpay securely…</p>
            </div>
          </div>
        )}

        {/* ── Razorpay open — show order summary behind it ── */}
        {status === "ready" && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(40,220,79,0.10)" }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <rect x="3" y="9" width="24" height="17" rx="3" stroke="#28DC4F" strokeWidth="1.8" />
                <path d="M3 14h24" stroke="#28DC4F" strokeWidth="1.8" />
                <path d="M8 19h4" stroke="#28DC4F" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M9 6.5a6 6 0 0 1 12 0" stroke="#28DC4F" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#111827]">Complete Your Payment</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6D6D6D]">
                Finish payment in the Razorpay popup to activate your profile.
              </p>
            </div>
            <div className="w-full rounded-[12px] bg-[#F9F9F9] px-4 py-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#9CA3AF]">Order</span>
                <span className="text-[13px] font-semibold text-[#111827]">{orderId}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#111827]">Amount</span>
                <span className="text-[16px] font-bold text-[#111827]">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "rgba(239,68,68,0.10)" }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="11" stroke="#EF4444" strokeWidth="1.8" />
                <path d="M10 10l10 10M20 10 10 20" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#111827]">Payment Failed</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6D6D6D]">{errorMsg}</p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <button
                onClick={handleRetry}
                className="w-full rounded-[12px] py-[13px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#28DC4F" }}
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-[12px] border border-[#E5E7EB] py-[13px] text-[15px] font-semibold text-[#374151] transition-opacity hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── No order found ── */}
        {status === "no-order" && (
          <div className="flex flex-col items-center gap-5 py-4 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "#F5F5F5" }}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4L4 8v17a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8l-3-4z" />
                <line x1="4" y1="8" x2="26" y2="8" />
                <path d="M19 12a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#111827]">No Pending Order</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6D6D6D]">
                You don&apos;t have any pending order. Browse our products to get started.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <a
                href="/products"
                className="block w-full rounded-[12px] py-[13px] text-center text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#28DC4F" }}
              >
                Shop Now
              </a>
              <button
                onClick={onClose}
                className="w-full rounded-[12px] border border-[#E5E7EB] py-[13px] text-[15px] font-semibold text-[#374151] transition-opacity hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
