"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import paymentService from "@/services/paymentService";

/* ─── icons ──────────────────────────────────────────────────── */

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M7 1.167 1.75 3.5v3.792C1.75 10.062 4.083 12.54 7 13.125c2.917-.585 5.25-3.063 5.25-5.833V3.5L7 1.167Z"
      fill="#28DC4F"
      fillOpacity="0.15"
      stroke="#28DC4F"
      strokeWidth="1"
    />
    <path d="M4.667 7l1.75 1.75L9.333 5.833" stroke="#28DC4F" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BanIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="5.5" stroke="#EF4444" strokeWidth="1.1" />
    <path d="M3.1 3.1l7.8 7.8" stroke="#EF4444" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

const ArrowLoopIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#6D6D6D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1.5 7A5.5 5.5 0 0 0 10 11.8" />
    <path d="M12.5 7A5.5 5.5 0 0 0 4 2.2" />
    <path d="M10.5 10v2.5H13" />
    <path d="M3.5 4V1.5H1" />
  </svg>
);

const LockIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
    <rect width="36" height="36" rx="18" fill="#28DC4F" fillOpacity="0.10" />
    <rect x="10" y="17" width="16" height="11" rx="2.5" stroke="#28DC4F" strokeWidth="1.4" />
    <path d="M13 17v-3.5a5 5 0 0 1 10 0V17" stroke="#28DC4F" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="18" cy="22.5" r="1.5" fill="#28DC4F" />
    <path d="M18 24v1.5" stroke="#28DC4F" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/* ─── animated spinner ───────────────────────────────────────── */

function Spinner() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: "96px", height: "96px" }}>
      <span
        className="absolute inset-0 animate-ping rounded-full"
        style={{ background: "rgba(40,220,79,0.12)", animationDuration: "1.8s" }}
      />
      <svg
        className="animate-spin"
        style={{ animationDuration: "0.9s" }}
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="48" cy="48" r="40" stroke="#F0F0F0" strokeWidth="5" />
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="#28DC4F"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="80 172"
          strokeDashoffset="0"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <LockIcon />
      </div>
    </div>
  );
}

function PulseDots() {
  return (
    <div className="flex items-center gap-[6px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-[7px] w-[7px] animate-bounce rounded-full bg-[#28DC4F]"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  );
}

/* ─── load Razorpay checkout script ──────────────────────────── */

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script   = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/* ─── page ───────────────────────────────────────────────────── */

export default function PaymentRedirectPage() {
  const router = useRouter();

  const [currentOrder, setCurrentOrder] = useState(null);
  const [status,       setStatus]       = useState("loading"); // loading | error
  const [errorMsg,     setErrorMsg]     = useState("");
  const [elapsed,      setElapsed]      = useState(0);

  // Guard against opening Razorpay twice in React StrictMode double-effect
  const didOpen = useRef(false);

  useEffect(() => {
    if (didOpen.current) return;
    didOpen.current = true;

    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);

    async function initPayment() {
      let order = null;
      let user  = {};
      try {
        order = JSON.parse(localStorage.getItem("currentOrder") || "null");
        user  = JSON.parse(localStorage.getItem("customerUser")  || "{}");
      } catch {}

      if (!order?.id) {
        clearInterval(timer);
        router.replace("/products");
        return;
      }

      setCurrentOrder(order);

      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        clearInterval(timer);
        setErrorMsg("Failed to load payment gateway. Please check your internet connection and try again.");
        setStatus("error");
        return;
      }

      // 2. Create Razorpay order via backend
      let rzpData = null;
      try {
        const result = await paymentService.createRazorpayOrder(order.id);
        rzpData = result.data;
      } catch (err) {
        clearInterval(timer);
        setErrorMsg(
          err?.response?.data?.message || "Could not initiate payment. Please try again."
        );
        setStatus("error");
        return;
      }

      clearInterval(timer);

      // 3. Open Razorpay checkout dialog
      const shippingAddr = order.shipping_address || {};

      const options = {
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
            paymentDone = true;
            persistStatus("paid", response.razorpay_payment_id);
            rzp.close();
            router.push("/payment/success");
          } catch {
            persistStatus("failed");
            rzp.close();
            router.push("/payment/failed");
          }
        },

        modal: {
          ondismiss: function () {
            if (!paymentDone) {
              persistStatus("failed");
              router.push("/payment/failed");
            }
          },
        },
      };

      let paymentDone = false;
      let rzp;

      rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        persistStatus("failed");
        router.push("/payment/failed");
      });

      rzp.open();
    }

    initPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persistStatus(payment_status, payment_id) {
    try {
      const stored = localStorage.getItem("currentOrder");
      const order  = stored ? JSON.parse(stored) : {};
      localStorage.setItem(
        "currentOrder",
        JSON.stringify({ ...order, payment_status, ...(payment_id ? { payment_id } : {}) })
      );
    } catch {}
  }

  const orderId     = currentOrder
    ? (currentOrder.order_number || `TML-${String(currentOrder.id).padStart(6, "0")}`)
    : "—";
  const totalAmount = currentOrder ? Number(currentOrder.total_amount) : 0;

  return (
    <>
      <Header />

      <main
        className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-[#F9F9F9] px-4 py-12"
        aria-live="polite"
        aria-label="Payment redirecting"
      >
        {/* ── Main card ── */}
        <div className="w-full max-w-[480px] rounded-[24px] border border-[#F0F0F0] bg-white px-8 py-10 shadow-[0_8px_40px_rgba(0,0,0,0.07)]">

          {/* Spinner + heading */}
          <div className="flex flex-col items-center gap-5">
            <Spinner />

            <div className="flex flex-col items-center gap-2">
              <h1 className="text-[22px] font-bold text-[#111827]">
                {status === "error" ? "Payment Error" : "Opening Payment Gateway"}
              </h1>
              {status !== "error" && <PulseDots />}
            </div>

            <p className="max-w-[320px] text-center text-[14px] leading-[1.65] text-[#6D6D6D]">
              {status === "error"
                ? errorMsg
                : "Please wait while we securely connect you to Razorpay. This usually takes a few seconds."}
            </p>
          </div>

          <div className="my-6 h-px bg-[#F4F4F4]" />

          {/* Order summary */}
          <div className="flex flex-col gap-2.5 rounded-[12px] bg-[#F9F9F9] px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#9CA3AF]">Order ID</span>
              <span className="text-[13px] font-semibold text-[#111827]">{orderId}</span>
            </div>
            <div className="h-px bg-[#EBEBEB]" />
            {/* Breakdown */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#6D6D6D]">NFC Business Card</span>
              <span className="text-[13px] font-medium text-[#111827]">
                ₹{currentOrder?.pro_plan
                  ? (totalAmount - 999).toLocaleString("en-IN")
                  : totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            {currentOrder?.pro_plan && (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6D6D6D] flex items-center gap-1">
                  <span className="text-[11px]">⚡</span> Pro Plan (1 year)
                </span>
                <span className="text-[13px] font-medium text-[#28DC4F]">+₹999</span>
              </div>
            )}
            <div className="h-px bg-[#EBEBEB]" />
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#111827]">Total</span>
              <span className="text-[18px] font-bold text-[#111827]">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="my-6 h-px bg-[#F4F4F4]" />

          {status === "error" ? (
            /* Error state */
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => { didOpen.current = false; setStatus("loading"); setErrorMsg(""); setElapsed(0); }}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
                style={{ background: "#28DC4F" }}
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="flex w-full items-center justify-center rounded-[12px] border border-[#E5E7EB] py-[14px] text-[15px] font-semibold text-[#374151] transition-opacity hover:opacity-80"
              >
                Back to Shopping
              </button>
            </div>
          ) : (
            /* Processing — disabled button */
            <>
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-semibold text-white opacity-75"
                style={{ background: "#28DC4F" }}
                aria-busy="true"
              >
                <svg
                  className="animate-spin"
                  style={{ animationDuration: "0.75s" }}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                  <circle
                    cx="9" cy="9" r="7"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="15 29"
                  />
                </svg>
                Opening Payment Gateway…
              </button>

              {elapsed >= 6 && (
                <p className="mt-3 text-center text-[12px] text-[#9CA3AF]">
                  Taking longer than usual… please don&apos;t close this tab.
                </p>
              )}
            </>
          )}

          <div className="my-6 h-px bg-[#F4F4F4]" />

          {/* Security notices */}
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <ShieldIcon />
              <span className="text-[12px] text-[#6D6D6D]">
                Secure <span className="font-medium text-[#111827]">256-bit SSL</span> encrypted payment
              </span>
            </div>
            <div className="flex items-center gap-[10px]">
              <BanIcon />
              <span className="text-[12px] text-[#6D6D6D]">
                Do <span className="font-medium text-[#EF4444]">not refresh</span> or close this page
              </span>
            </div>
            <div className="flex items-center gap-[10px]">
              <ArrowLoopIcon />
              <span className="text-[12px] text-[#6D6D6D]">
                You will be <span className="font-medium text-[#111827]">redirected automatically</span>
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-[#9CA3AF]">
          Having trouble?{" "}
          <Link href="#" className="font-medium text-[#111827] underline underline-offset-2 hover:text-[#28DC4F]">
            Contact support
          </Link>{" "}
          or{" "}
          <Link href="/#products" className="font-medium text-[#111827] underline underline-offset-2 hover:text-[#28DC4F]">
            go back to shopping
          </Link>
          .
        </p>
      </main>
    </>
  );
}
