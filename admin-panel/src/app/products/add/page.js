"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import productService from "@/services/productService";
import uploadService from "@/services/uploadService";
import { extractSvgColors } from "@/utils/svgColorUtils";

const inputCls = "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[13px] text-slate-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white";

function Section({ title, children }) {
  return (
    <div className="rounded-xl bg-white p-6" style={{ border: "1px solid #E2E8F0" }}>
      <h3 className="mb-4 text-[14px] font-semibold text-slate-800">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-slate-600">
        {label}{required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    sale_price: "",
    short_description: "",
    full_description: "",
    status: "draft",
  });
  const [images, setImages]           = useState([]);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [frontImage, setFrontImage]   = useState("");
  const [backImage,  setBackImage]    = useState("");
  const [mockupUploading, setMockupUploading] = useState({ front: false, back: false });
  const [mockupError, setMockupError] = useState("");
  const [allowColorCustomization, setAllowColorCustomization] = useState(false);
  const [backgroundStyles, setBackgroundStyles] = useState([]);
  const [svgUploading, setSvgUploading] = useState(false);
  const [svgUploadError, setSvgUploadError] = useState("");
  const [saving, setSaving]           = useState(false);
  const [success, setSuccess]         = useState("");
  const [error, setError]             = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploadError("");
    setUploading(true);
    try {
      const res = await uploadService.uploadProductImage(file);
      const url = res.data?.url;
      if (url) setImages((prev) => [...prev, url]);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleMockupUpload(side, file) {
    if (!file) return;
    setMockupError("");
    setMockupUploading((prev) => ({ ...prev, [side]: true }));
    try {
      const res = await uploadService.uploadProductImage(file);
      const url = res.data?.url;
      if (url) {
        if (side === "front") setFrontImage(url);
        else setBackImage(url);
      }
    } catch (err) {
      setMockupError(err.response?.data?.message || "Mockup upload failed. Please try again.");
    } finally {
      setMockupUploading((prev) => ({ ...prev, [side]: false }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name:              form.name,
        slug:              form.slug,
        price:             Number(form.price),
        sale_price:        form.sale_price ? Number(form.sale_price) : null,
        short_description: form.short_description || null,
        full_description:  form.full_description  || null,
        images,
        front_image:               frontImage || null,
        back_image:                backImage  || null,
        allow_color_customization: allowColorCustomization,
        status:                    form.status,
      };

      await productService.createProduct({ ...payload, background_styles: backgroundStyles });
      setSuccess("Product created successfully.");
      setTimeout(() => router.push("/products"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="Add Product">
      <div className="mx-auto max-w-3xl">

        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-2 text-[13px] text-slate-400">
          <a href="/products" className="hover:text-slate-600">Products</a>
          <span>/</span>
          <span className="text-slate-700">Add Product</span>
        </div>

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-[13px] text-green-700" style={{ border: "1px solid #BBF7D0" }}>
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600" style={{ border: "1px solid #FECACA" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Basic info */}
          <Section title="Basic Information">
            <Field label="Product Name" required>
              <input name="name" value={form.name} onChange={handleChange} required
                placeholder="e.g. Matte Black NFC Card" className={inputCls} />
            </Field>
            <Field label="Slug" required>
              <input name="slug" value={form.slug} onChange={handleChange} required
                placeholder="e.g. matte-black-nfc-card" className={inputCls} />
            </Field>
            <Field label="Short Description">
              <textarea name="short_description" value={form.short_description} onChange={handleChange}
                rows={3} placeholder="Brief product description…"
                className={inputCls} style={{ resize: "vertical" }} />
            </Field>
            <Field label="Full Description">
              <textarea name="full_description" value={form.full_description} onChange={handleChange}
                rows={5} placeholder="Detailed product description…"
                className={inputCls} style={{ resize: "vertical" }} />
            </Field>
          </Section>

          {/* Pricing */}
          <Section title="Pricing">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹)" required>
                <input name="price" type="number" min="0" step="0.01" value={form.price}
                  onChange={handleChange} required placeholder="1499" className={inputCls} />
              </Field>
              <Field label="Sale Price (₹)">
                <input name="sale_price" type="number" min="0" step="0.01" value={form.sale_price}
                  onChange={handleChange} placeholder="1299" className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* Images */}
          <Section title="Product Images">
            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg"
                    style={{ border: "1px solid #E2E8F0" }}>
                    <img src={url} alt={`Product image ${i + 1}`}
                      className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${uploading ? "border-slate-200 bg-slate-50" : "border-slate-200 hover:border-green-400 hover:bg-green-50/30"}`}>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.svg"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <div className="mb-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-green-500" />
                  <p className="text-[13px] text-slate-500">Uploading…</p>
                </>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className="text-[13px] text-slate-500">Click to upload image</p>
                  <p className="mt-1 text-[11px] text-slate-400">JPG, PNG, WebP, SVG · Max 2 MB</p>
                </>
              )}
            </label>

            {uploadError && (
              <p className="text-[12px] text-red-500">{uploadError}</p>
            )}
          </Section>

          {/* Card Mockup Images */}
          <Section title="Card Mockup Images">
            <p className="text-[11px] text-slate-400">
              Recommended: 1200 × 720 px · 5:3 ratio · WebP/PNG/JPG
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { side: "front", label: "Front Side Mockup", value: frontImage, uploading: mockupUploading.front },
                { side: "back",  label: "Back Side Mockup",  value: backImage,  uploading: mockupUploading.back  },
              ].map(({ side, label, value, uploading: up }) => (
                <div key={side} className="flex flex-col gap-2">
                  <p className="text-[12px] font-medium text-slate-600">{label}</p>
                  {value ? (
                    <div className="group relative overflow-hidden rounded-lg" style={{ border: "1px solid #E2E8F0" }}>
                      <img src={value} alt={label} className="h-32 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => side === "front" ? setFrontImage("") : setBackImage("")}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${up ? "border-slate-200 bg-slate-50" : "border-slate-200 hover:border-green-400 hover:bg-green-50/30"}`}>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        disabled={up}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (file) handleMockupUpload(side, file);
                        }}
                      />
                      {up ? (
                        <>
                          <div className="mb-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-green-500" />
                          <p className="text-[12px] text-slate-500">Uploading…</p>
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <p className="text-[12px] text-slate-500">Click or drag to upload</p>
                        </>
                      )}
                    </label>
                  )}
                </div>
              ))}
            </div>
            {mockupError && (
              <p className="text-[12px] text-red-500">{mockupError}</p>
            )}
          </Section>

          {/* Color Customization */}
          <Section title="Customization Options">
            <div className="flex items-center justify-between rounded-lg p-4" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">Allow Card Colour Customization</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Customer can pick card colour and font colour on the product page.</p>
              </div>
              <button
                type="button"
                onClick={() => setAllowColorCustomization((v) => !v)}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200"
                style={{ background: allowColorCustomization ? "#28DC4F" : "#D1D5DB" }}
                aria-checked={allowColorCustomization}
                role="switch"
              >
                <span
                  className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200"
                  style={{ transform: allowColorCustomization ? "translateX(20px)" : "translateX(0)" }}
                />
              </button>
            </div>
          </Section>

          {/* Background Styles */}
          <Section title="Background Styles">
            <p className="text-[11px] text-slate-400">Upload SVG background designs. Colors are extracted automatically and can be customized by customers.</p>

            {backgroundStyles.length > 0 && (
              <div className="flex flex-col gap-3">
                {backgroundStyles.map((style, idx) => (
                  <div key={idx} className="rounded-lg p-3 flex flex-col gap-3" style={{ border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* SVG preview thumbnail */}
                        <div className="shrink-0 rounded overflow-hidden" style={{ width: 64, height: 40, border: "1px solid #E2E8F0", background: "#111" }}>
                          {style.svgPreviewUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={style.svgPreviewUrl} alt={style.styleName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-slate-700 truncate">{style.styleName || `Style ${idx + 1}`}</p>
                          <p className="text-[11px] text-slate-400 truncate">{style.svgFile}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Enable/disable toggle */}
                        <button
                          type="button"
                          onClick={() => setBackgroundStyles(prev => prev.map((s, i) => i === idx ? { ...s, status: !s.status } : s))}
                          className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
                          style={{ background: style.status ? "#28DC4F" : "#D1D5DB" }}
                          title={style.status ? "Disable" : "Enable"}
                        >
                          <span className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform" style={{ transform: style.status ? "translateX(16px)" : "translateX(0)" }} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setBackgroundStyles(prev => prev.filter((_, i) => i !== idx))}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-red-400 hover:bg-red-50"
                          title="Remove"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* Style name input */}
                    <input
                      type="text"
                      placeholder="Style name (e.g. Modern Wave)"
                      value={style.styleName}
                      onChange={(e) => setBackgroundStyles(prev => prev.map((s, i) => i === idx ? { ...s, styleName: e.target.value } : s))}
                      className={inputCls}
                    />

                    {/* Extracted colors */}
                    {style.hasEmbeddedImage && (
                      <div className="rounded-lg px-3 py-2 text-[11px] text-amber-700" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                        ⚠ This SVG contains embedded image content, colors may not be editable.
                      </div>
                    )}
                    {style.extractedColors?.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <p className="text-[11px] font-medium text-slate-500">Extracted colors ({style.extractedColors.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {style.extractedColors.map((ec, ci) => (
                            <div key={ci} className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }}>
                              <div className="h-3.5 w-3.5 rounded-full shrink-0" style={{ background: ec.original, border: "1px solid rgba(0,0,0,0.1)" }} />
                              <span className="text-[10px] font-mono text-slate-600">{ec.original}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload new SVG */}
            <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${svgUploading ? "border-slate-200 bg-slate-50" : "border-slate-200 hover:border-green-400 hover:bg-green-50/30"}`}>
              <input
                type="file"
                accept=".svg,image/svg+xml"
                className="hidden"
                disabled={svgUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setSvgUploadError("");
                  setSvgUploading(true);
                  try {
                    const text = await file.text();
                    const colors = extractSvgColors(text);
                    const hasEmbeddedImage = /<image[\s>]/i.test(text);
                    const res = await uploadService.uploadSvgBackground(file);
                    const url = res.data?.url;
                    if (url) {
                      setBackgroundStyles(prev => [...prev, {
                        styleName: file.name.replace(/\.svg$/i, "").replace(/[-_]/g, " "),
                        svgFile: res.data?.filename,
                        svgPreviewUrl: url,
                        svgUrl: url,
                        extractedColors: colors.map(c => ({ original: c, current: c })),
                        hasEmbeddedImage,
                        status: true,
                      }]);
                    }
                  } catch (err) {
                    setSvgUploadError(err.response?.data?.message || "SVG upload failed.");
                  } finally {
                    setSvgUploading(false);
                  }
                }}
              />
              {svgUploading ? (
                <>
                  <div className="mb-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-green-500" />
                  <p className="text-[13px] text-slate-500">Uploading…</p>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className="text-[13px] text-slate-500">Click to upload SVG background</p>
                  <p className="mt-1 text-[11px] text-slate-400">SVG only · Max 2 MB</p>
                </>
              )}
            </label>
            {svgUploadError && <p className="text-[12px] text-red-500">{svgUploadError}</p>}
          </Section>

          {/* Status */}
          <Section title="Visibility">
            <Field label="Status">
              <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </Field>
          </Section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => router.push("/products")}
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading}
              className="rounded-lg px-5 py-2.5 text-[13px] font-semibold text-black disabled:opacity-60"
              style={{ background: "#28DC4F" }}>
              {saving ? "Saving…" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
