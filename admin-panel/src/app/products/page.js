"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import productService from "@/services/productService";

const STATUS_STYLES = {
  active:        { bg: "#DCFCE7", text: "#16A34A", label: "Active" },
  out_of_stock:  { bg: "#FEE2E2", text: "#DC2626", label: "Out of Stock" },
  draft:         { bg: "#F1F5F9", text: "#64748B", label: "Draft" },
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");

  async function fetchProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await productService.getProducts();
      setProducts(res.data?.products ?? []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product.");
    }
  }

  // Client-side filter — all products are already in memory
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Active"       && p.status === "active") ||
      (filter === "Draft"        && p.status === "draft") ||
      (filter === "Out of Stock" && p.status === "out_of_stock");
    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="Products">
      <div className="flex flex-col gap-5">

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Out of Stock", "Draft"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors"
                style={{
                  background: filter === f ? "#28DC4F" : "#F1F5F9",
                  color: filter === f ? "#000" : "#64748B",
                  border: filter === f ? "none" : "1px solid #E2E8F0",
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-[13px] outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
                style={{ width: "220px" }}
              />
            </div>
            <Link
              href="/products/add"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold text-black"
              style={{ background: "#28DC4F" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600" style={{ border: "1px solid #FECACA" }}>
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  {["Product", "Slug", "Price", "Sale Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[13px] text-slate-400">
                      Loading products…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[13px] text-slate-400">
                      {products.length === 0 ? "No products yet. Add your first product." : "No products match your search."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const s = STATUS_STYLES[p.status] ?? STATUS_STYLES.draft;
                    // First image in the array, or a placeholder initial
                    const thumb = Array.isArray(p.images) && p.images[0];
                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid #F8FAFC" }} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg text-[11px] font-bold text-slate-400"
                              style={{ background: "#F1F5F9" }}
                            >
                              {/* TODO: Replace with <img> when image upload is connected */}
                              {thumb ? (
                                <img src={thumb} alt={p.name} className="h-full w-full object-cover" />
                              ) : (
                                p.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <span className="text-[13px] font-medium text-slate-800">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[12px] font-mono text-slate-500">{p.slug}</td>
                        <td className="px-5 py-4 text-[13px] font-semibold text-slate-800">
                          ₹{Number(p.price).toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-[13px] text-slate-600">
                          {p.sale_price ? `₹${Number(p.sale_price).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: s.bg, color: s.text }}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/products/edit/${p.id}`} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                            </Link>
                            <button onClick={() => handleDelete(p.id, p.name)} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
