"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { getImageUrl } from "@/lib/imageUrl";
import authService from "@/services/authService";

function formatPrice(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-5 py-24 text-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: "#F6F6F6" }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <div>
        <h2 className="text-[22px] font-semibold text-[#111827]">Your cart is empty</h2>
        <p className="mt-2 text-[14px] text-[#6B7280]">
          You haven&apos;t added any products yet.
        </p>
      </div>
      <Link
        href="/products"
        className="rounded-[10px] px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "#28DC4F" }}
      >
        Browse Products
      </Link>
    </div>
  );
}

// ── Cart item row ─────────────────────────────────────────────────────────────

function CartItem({ item, onRemove }) {
  const image        = getImageUrl(item.productImage);
  const displayPrice = item.rawSalePrice ?? item.rawPrice;
  const strikePrice  = item.rawSalePrice ? item.rawPrice : null;
  const { name, subTitle, selectedCard } = item.customization ?? {};

  return (
    <div className="flex gap-4 rounded-2xl border border-[#F0F0F0] bg-white p-4 shadow-sm">

      {/* Thumbnail */}
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl"
        style={{ width: "90px", height: "90px", background: "#F6F6F6" }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={item.productName}
            style={{ width: "72px", height: "72px", objectFit: "contain" }}
          />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-semibold leading-snug text-[#111827]">
            {item.productName}
          </h3>
          {(name || subTitle || selectedCard) && (
            <p className="mt-1 text-[12px] text-[#6B7280]">
              {[selectedCard, name, subTitle].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-[#28DC4F]">
              {formatPrice(displayPrice)}
            </span>
            {strikePrice && (
              <span className="text-[12px] text-gray-400 line-through">
                {formatPrice(strikePrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="rounded-lg p-1.5 text-[#9CA3AF] transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="Remove item"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order summary ─────────────────────────────────────────────────────────────

function OrderSummary({ items, onCheckout }) {
  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.rawSalePrice ?? item.rawPrice ?? 0);
  }, 0);

  return (
    <div className="rounded-2xl border border-[#F0F0F0] bg-white p-5 shadow-sm">
      <h2 className="text-[16px] font-semibold text-[#111827]">Order Summary</h2>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex justify-between text-[14px] text-[#6B7280]">
          <span>Subtotal ({items.length} {items.length === 1 ? "item" : "items"})</span>
          <span className="font-medium text-[#111827]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[14px] text-[#6B7280]">
          <span>Shipping</span>
          <span className="font-medium text-[#28DC4F]">Free</span>
        </div>
        <div className="h-px bg-[#F0F0F0]" />
        <div className="flex justify-between text-[15px] font-semibold text-[#111827]">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="mt-5 block w-full rounded-[10px] py-3 text-center text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        style={{ background: "#28DC4F" }}
      >
        Proceed to Checkout
      </button>

      <Link
        href="/products"
        className="mt-3 block w-full rounded-[10px] border border-[#E5E7EB] py-3 text-center text-[14px] font-medium text-[#6B7280] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F]"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const router = useRouter();
  const [items, setItems]     = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setItems(Array.isArray(stored) ? stored : []);
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, []);

  function removeItem(id) {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    try {
      localStorage.setItem("cartItems", JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }

  function handleCheckout() {
    if (!authService.isLoggedIn()) {
      router.push("/register?redirect=checkout");
      return;
    }
    router.push("/checkout/shipping");
  }

  return (
    <>
      <Header />

      <main className="bg-white px-4 py-12 sm:px-6 lg:px-8" style={{ minHeight: "70vh" }}>
        <div className="mx-auto max-w-5xl">

          <h1 className="text-[28px] font-semibold text-[#111827]">Your Cart</h1>

          {/* Wait for localStorage hydration to avoid flash */}
          {!hydrated ? null : items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">

              {/* Item list */}
              <div className="flex flex-1 flex-col gap-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>

              {/* Summary sidebar */}
              <div className="lg:w-[320px] lg:shrink-0">
                <OrderSummary items={items} onCheckout={handleCheckout} />
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
