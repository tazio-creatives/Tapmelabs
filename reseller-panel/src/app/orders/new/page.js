"use client";
import { useEffect, useState } from "react";
import ResellerLayout from "@/components/ResellerLayout";
import api from "@/services/api";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export default function NewOrderPage() {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [resellerToken, setResellerToken] = useState("");

  useEffect(() => {
    api.get("/products?status=active")
      .then((r) => setProducts(r.data?.data?.products || r.data?.products || []))
      .finally(() => setLoading(false));
    setResellerToken(localStorage.getItem("resellerToken") || "");
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ResellerLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>Select Product</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "3px 0 0" }}>Choose a product to create an order</p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 360 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px 9px 36px", fontSize: 13,
              border: "1px solid #E2E8F0", borderRadius: 8, outline: "none",
              background: "#fff", color: "#111827", boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = "#28DC4F"}
            onBlur={(e)  => e.target.style.borderColor = "#E2E8F0"}
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ height: 160, background: "#F1F5F9" }} />
                <div style={{ padding: 14 }}>
                  <div style={{ height: 14, background: "#F1F5F9", borderRadius: 4, marginBottom: 8 }} />
                  <div style={{ height: 12, background: "#F1F5F9", borderRadius: 4, width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>No products found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {filtered.map((p) => {
              const image = Array.isArray(p.images) ? p.images[0] : null;
              const price = Number(p.sale_price || p.price || 0);
              const original = p.sale_price ? Number(p.price) : null;
              const inStock = p.status !== "out_of_stock";

              const handleCustomize = () => {
                if (!inStock || !p.slug) return;
                const url = `${FRONTEND_URL}/product/${p.slug}?reseller=1&rt=${encodeURIComponent(resellerToken)}`;
                window.open(url, "_blank");
              };

              return (
                <div
                  key={p.id}
                  onClick={handleCustomize}
                  style={{
                    background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12,
                    overflow: "hidden", cursor: inStock ? "pointer" : "not-allowed",
                    transition: "box-shadow 0.15s, transform 0.15s",
                    opacity: inStock ? 1 : 0.6,
                  }}
                  onMouseEnter={(e) => { if (inStock) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  {/* Image */}
                  <div style={{ height: 160, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    {image ? (
                      <img src={image} alt={p.name} style={{ width: 180, height: 120, objectFit: "contain" }} />
                    ) : (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    )}
                    {!inStock && (
                      <span style={{ position: "absolute", bottom: 8, left: 8, fontSize: 11, fontWeight: 600, background: "#FEE2E2", color: "#DC2626", padding: "2px 8px", borderRadius: 20 }}>
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.4 }}>{p.name}</p>
                    {p.short_description && (
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {p.short_description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#28DC4F" }}>₹{price.toLocaleString("en-IN")}</span>
                      {original && <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>₹{original.toLocaleString("en-IN")}</span>}
                    </div>
                    <div style={{ marginTop: 10, background: inStock ? "#28DC4F" : "#E5E7EB", borderRadius: 8, padding: "8px 0", textAlign: "center", fontSize: 13, fontWeight: 600, color: inStock ? "#000" : "#9CA3AF" }}>
                      {inStock ? "Customize Your Card" : "Out of Stock"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ResellerLayout>
  );
}
