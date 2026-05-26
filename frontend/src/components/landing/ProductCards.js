"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import productService from "@/services/productService";
import { getImageUrl } from "@/lib/imageUrl";

function formatPrice(amount) {
  if (amount == null) return null;
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md">
      <div className="animate-pulse">
        <div style={{ height: "208px", background: "#F0F0F0" }} />
        <div className="flex flex-col px-[15px] py-[15px]" style={{ minHeight: "176px" }}>
          <div className="h-[14px] w-3/4 rounded bg-[#F0F0F0]" />
          <div className="mt-2 h-3 w-full rounded bg-[#F0F0F0]" />
          <div className="mt-1 h-3 w-4/5 rounded bg-[#F0F0F0]" />
          <div className="mt-4 h-5 w-1/3 rounded bg-[#F0F0F0]" />
          <div className="mt-3 h-9 w-full rounded-lg bg-[#F0F0F0]" />
        </div>
      </div>
    </div>
  );
}

export default function ProductCards() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    productService
      .getAllProducts()
      .then((res) => {
        const all = res.data?.products ?? [];
        setProducts(all.slice(0, 4));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="products" className="bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-8 text-center">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#28DC4F]">
            Products
          </p>
          <h2 className="text-[26px] font-extrabold text-[#111827] sm:text-[32px]">
            Choose Your Card
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-[14px] text-[#9CA3AF]">
            Select the material and finish that matches your brand.
          </p>
        </ScrollReveal>

        {/* 4-column grid matching Figma — 285px cards with 20px gaps */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
          {!loading && products.length === 0 && (
            <div className="col-span-4 py-16 text-center text-[14px] text-[#6B7280]">
              No products available yet. Check back soon.
            </div>
          )}
          {!loading && products.length > 0 && products.map((product, index) => {
              const image         = getImageUrl(product.images);
              const salePrice     = product.sale_price != null ? formatPrice(product.sale_price) : null;
              const regularPrice  = formatPrice(product.price);
              const displayPrice  = salePrice ?? regularPrice;
              const strikePrice   = salePrice ? regularPrice : null;

              return (
                <ScrollReveal key={product.id} delay={index * 80}>
                  <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-300 hover:-translate-y-1">

                    {/* Image area — #F6F6F6, 208px tall, card preview fills section */}
                    <div
                      className="overflow-hidden"
                      style={{ height: "208px", background: "#F6F6F6" }}
                    >
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#E5E7EB" }} />
                      )}
                    </div>

                    {/* Info area — white, 176px, 15px padding */}
                    <div className="flex flex-col px-[15px] py-[15px]" style={{ minHeight: "176px" }}>
                      <h3 className="text-[14px] font-semibold leading-snug text-[#111827]">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-[12px] leading-[18px] text-[#6B7280]">
                        {product.short_description ?? ""}
                      </p>

                      {/* Price row */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[16px] font-bold text-[#28DC4F]">
                          {displayPrice}
                        </span>
                        {strikePrice && (
                          <span className="text-[12px] text-gray-400 line-through">
                            {strikePrice}
                          </span>
                        )}
                      </div>

                      {/* CTA button */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="mt-3 block w-full rounded-lg py-[10px] text-center text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ background: "#28DC4F" }}
                      >
                        Customize Your card
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
        </div>
      </div>
    </section>
  );
}
