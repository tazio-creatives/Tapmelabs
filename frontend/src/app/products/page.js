"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import productService from "@/services/productService";
import { getImageUrl } from "@/lib/imageUrl";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

// ── Skeleton card — matches real card dimensions exactly ──────────────────────

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md animate-pulse">
      <div style={{ height: "208px", background: "#F6F6F6" }} />
      <div className="flex flex-col px-[15px] py-[15px]" style={{ minHeight: "176px" }}>
        <div className="h-[14px] w-3/4 rounded bg-gray-200" />
        <div className="mt-2 h-[12px] w-full rounded bg-gray-100" />
        <div className="mt-1 h-[12px] w-4/5 rounded bg-gray-100" />
        <div className="mt-4 flex items-center gap-2">
          <div className="h-5 w-16 rounded bg-gray-200" />
          <div className="h-3 w-12 rounded bg-gray-100" />
        </div>
        <div className="mt-3 h-9 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

// ── Product card — replicates the ProductCards.js design exactly ──────────────

function ProductCard({ product, index }) {
  const image    = getImageUrl(product.images);
  const inStock  = product.status !== "out_of_stock";

  // sale_price takes priority as the displayed price when present.
  const displayPrice = product.sale_price ?? product.price;
  const strikePrice  = product.sale_price ? product.price : null;

  return (
    <ScrollReveal delay={index * 80}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-300 hover:-translate-y-1">

        {/* Image area — #F6F6F6, 208px tall, matching ProductCards.js */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: "208px", background: "#F6F6F6" }}
        >
          {image ? (
            /*
              Using <img> instead of next/image because product images are served
              from the backend (http://localhost:5000/uploads/...) and adding
              remotePatterns to next.config.mjs is not needed for this stage.
              Swap to <Image> once a CDN/domain is finalised.
            */
            <img
              src={image}
              alt={product.name}
              style={{ width: "230px", height: "138px", objectFit: "contain" }}
            />
          ) : (
            // Placeholder when no image is uploaded yet
            <div
              className="flex items-center justify-center"
              style={{ width: "230px", height: "138px" }}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D1D5DB"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          {/* Out of stock badge */}
          {!inStock && (
            <div
              className="absolute bottom-2 left-2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ background: "#FEE2E2", color: "#DC2626" }}
            >
              Out of Stock
            </div>
          )}
        </div>

        {/* Info area — px/py 15px, minHeight 176px, matching ProductCards.js */}
        <div className="flex flex-col px-[15px] py-[15px]" style={{ minHeight: "176px" }}>
          <h3 className="text-[14px] font-semibold leading-snug text-[#111827]">
            {product.name}
          </h3>

          <p className="mt-1 text-[12px] leading-[18px] text-[#6B7280] line-clamp-2">
            {product.short_description || ""}
          </p>

          {/* Price row */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[16px] font-bold text-[#28DC4F]">
              {formatPrice(displayPrice)}
            </span>
            {strikePrice && (
              <span className="text-[12px] text-gray-400 line-through">
                {formatPrice(strikePrice)}
              </span>
            )}
          </div>

          {/* CTA — disabled when out of stock */}
          {inStock ? (
            <Link
              href={`/product/${product.slug}`}
              className="mt-3 block w-full rounded-lg py-[10px] text-center text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#28DC4F" }}
            >
              Customize Your card
            </Link>
          ) : (
            <button
              disabled
              className="mt-3 w-full cursor-not-allowed rounded-lg py-[10px] text-center text-[13px] font-semibold text-white opacity-50"
              style={{ background: "#6B7280" }}
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Detect reseller mode from URL and persist to sessionStorage
  useEffect(() => {
    const rt = searchParams.get("rt");
    const isReseller = searchParams.get("reseller");
    if (rt && isReseller === "1") {
      sessionStorage.setItem("resellerToken", rt);
      sessionStorage.setItem("resellerMode", "1");
    }
  }, [searchParams]);

  // Debounce the search input 400 ms before sending to backend
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // TODO: When this page is server-rendered (after adding a backend proxy or
  //       moving to server components), replace this useEffect with a server
  //       fetch inside an async page component using productService from a
  //       server-only module (no axios interceptors needed on server).
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await productService.getAllProducts(debouncedSearch);
        setProducts(res.data?.products ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load products. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [debouncedSearch]);

  return (
    <>
      <Header />

      <main className="bg-white px-4 py-16 sm:px-6 lg:px-8" style={{ minHeight: "60vh" }}>
        <div className="mx-auto max-w-6xl">

          {/* Page heading — same style as landing ProductCards section */}
          <ScrollReveal className="text-center">
            <span className="inline-flex items-center rounded-full border border-[#E6E6E6] bg-white px-[25px] py-2 text-xs font-medium text-gray-500">
              Products
            </span>
            <h1 className="mt-5 text-[36px] font-semibold leading-tight text-[#111827]">
              Choose Your Card
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-6 text-[#6B7280]">
              Select the material and finish that matches your brand.
            </p>
          </ScrollReveal>

          {/* Search */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-full max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-xl border border-[#E6E6E6] bg-white py-2.5 pl-9 pr-4 text-[14px] text-[#111827] outline-none transition focus:border-[#28DC4F] focus:ring-2 focus:ring-[#28DC4F]/20"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mt-8 rounded-xl px-5 py-4 text-center text-[14px]"
              style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
            >
              {error}
            </div>
          )}

          {/* Product grid — same class as ProductCards.js */}
          {(loading || products.length > 0) && (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && products.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-3 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "#F6F6F6" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-[#111827]">
                {debouncedSearch ? "No products found" : "No products available yet"}
              </p>
              <p className="text-[14px] text-[#6B7280]">
                {debouncedSearch
                  ? `No results for "${debouncedSearch}". Try a different search.`
                  : "Check back soon — new products are coming."}
              </p>
              {debouncedSearch && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-2 rounded-lg px-5 py-2 text-[13px] font-semibold text-white"
                  style={{ background: "#28DC4F" }}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
