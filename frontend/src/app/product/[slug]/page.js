"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ProductDetail from "@/components/product/ProductDetail";
import productService from "@/services/productService";

// ── Map raw backend product → shape expected by ProductDetail ─────────────────

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function mapProduct(raw) {
  const price     = Number(raw.price);
  const salePrice = raw.sale_price ? Number(raw.sale_price) : null;
  const discountPct = salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : null;

  return {
    // Fields used by the Add-to-Cart handler in ProductDetail
    id:                    raw.id,
    slug:                  raw.slug,
    images:                Array.isArray(raw.images) ? raw.images : [],
    front_image:           raw.front_image || null,
    back_image:            raw.back_image  || null,
    allowColorCustomization: raw.allow_color_customization ?? false,
    backgroundStyles:      Array.isArray(raw.background_styles) ? raw.background_styles.filter(s => s.status) : [],
    productType:           raw.product_type || "nfc_card",
    rawPrice:              price,
    rawSalePrice:          salePrice,

    // Display fields
    name:          raw.name,
    variant:       null,
    price:         formatINR(salePrice ?? price),
    originalPrice: salePrice ? formatINR(price) : null,
    discount:      discountPct ? `${discountPct}% OFF` : null,

    // Rating / reviews / features are not in the backend model yet.
    // ProductDetail renders these sections conditionally when present.
    rating:      null,
    reviewCount: null,
    reviews:     [],
    features:    [],
    nfcNote:     null,

    // Long description for the product info section
    description: raw.full_description || raw.short_description || "",
  };
}

// ── Loading skeleton — mirrors the two-column ProductDetail layout ─────────────

function ProductPageSkeleton() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1440px] animate-pulse px-4 py-6 md:px-[120px]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-10 rounded bg-gray-200" />
            <div className="h-3 w-3 rounded bg-gray-100" />
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-3 w-3 rounded bg-gray-100" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-[30px]">
            {/* Left column */}
            <div className="flex flex-col gap-6 lg:w-[580px] lg:shrink-0">
              <div className="h-[340px] rounded-[20px] bg-gray-100" />
              <div className="flex flex-col gap-3">
                <div className="h-8 w-2/3 rounded bg-gray-200" />
                <div className="h-4 w-1/3 rounded bg-gray-100" />
                <div className="h-9 w-40 rounded bg-gray-200" />
                <div className="h-px bg-gray-100" />
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-5/6 rounded bg-gray-100" />
                <div className="h-4 w-4/6 rounded bg-gray-100" />
              </div>
            </div>
            {/* Right column */}
            <div className="h-[560px] flex-1 rounded-[16px] bg-gray-100" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// ── Product not found ──────────────────────────────────────────────────────────

function ProductNotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-white px-4 text-center">
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
          <h1 className="text-[28px] font-semibold text-[#111827]">Product Not Found</h1>
          <p className="mt-2 text-[15px] text-[#6B7280]">
            This product doesn&apos;t exist or is no longer available.
          </p>
        </div>
        <Link
          href="/products"
          className="rounded-[10px] px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#28DC4F" }}
        >
          Browse All Products
        </Link>
      </main>
      <Footer />
    </>
  );
}

// ── Fetch error ────────────────────────────────────────────────────────────────

function ProductFetchError({ message, onRetry }) {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-white px-4 text-center">
        <div
          className="rounded-xl px-6 py-4 text-[14px]"
          style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
        >
          {message}
        </div>
        <button
          onClick={onRetry}
          className="rounded-[10px] px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#28DC4F" }}
        >
          Try Again
        </button>
      </main>
      <Footer />
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function ProductPageContent() {
  const { slug }       = useParams();
  const searchParams   = useSearchParams();
  const [product, setProduct]     = useState(null);
  const [pageState, setPageState] = useState("loading");
  const [errorMsg, setErrorMsg]   = useState("");

  // Persist reseller token if coming from reseller panel
  useEffect(() => {
    const rt = searchParams.get("rt");
    const isReseller = searchParams.get("reseller");
    if (rt && isReseller === "1") {
      sessionStorage.setItem("resellerToken", rt);
      sessionStorage.setItem("resellerMode", "1");
    }
  }, [searchParams]);

  async function fetchProduct() {
    setPageState("loading");
    try {
      const res = await productService.getProductBySlug(slug);
      const raw = res.data?.product;
      if (!raw) {
        setPageState("notfound");
        return;
      }
      setProduct(mapProduct(raw));
      setPageState("found");
    } catch (err) {
      if (err.response?.status === 404) {
        setPageState("notfound");
      } else {
        setErrorMsg(
          err.response?.data?.message ||
          "Failed to load product. Please check your connection and try again."
        );
        setPageState("error");
      }
    }
  }

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  if (pageState === "loading")  return <ProductPageSkeleton />;
  if (pageState === "notfound") return <ProductNotFound />;
  if (pageState === "error")    return <ProductFetchError message={errorMsg} onRetry={fetchProduct} />;

  return (
    <>
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={null}>
      <ProductPageContent />
    </Suspense>
  );
}
