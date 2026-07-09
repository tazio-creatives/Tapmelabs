"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import orderService from "@/services/orderService";

const PRODUCT_TYPE_LABELS = {
  standee_social: "Google Review + Instagram + WhatsApp Standee",
  standee_google: "Google Review Standee",
  card_google:    "Google Review NFC Card",
};

function LogoDropzone({ previewUrl, onChange }) {
  const inputRef = useRef(null);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-[#374151]">Upload Your Logo <span className="text-red-500">*</span></span>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ""; }}
      />
      {previewUrl ? (
        <div className="group relative h-32 w-32 overflow-hidden rounded-xl border" style={{ borderColor: "#E5E7EB" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Logo preview" className="h-32 w-32 object-contain" style={{ background: "#F9FAFB" }} />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-[#9CA3AF] transition-colors hover:border-[#28DC4F] hover:bg-[#28DC4F]/5"
          style={{ borderColor: "#D1D5DB" }}
        >
          <span className="text-[24px]">+</span>
          <span className="text-[11px]">Upload Logo</span>
        </button>
      )}
    </div>
  );
}

function TextField({ label, required, error, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#374151]">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border px-3.5 py-2.5 text-[14px] text-[#111827] outline-none focus:border-[#28DC4F] focus:ring-2 focus:ring-[#28DC4F]/15"
        style={{ borderColor: "#E5E7EB" }}
      />
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

export default function ReviewProductDetail({ product }) {
  const router = useRouter();
  const isSocial = product.productType === "standee_social";

  const [logoFile, setLogoFile]         = useState(null);
  const [logoDataUrl, setLogoDataUrl]   = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl]   = useState("");
  const [errors, setErrors]             = useState({});
  const [submitError, setSubmitError]   = useState("");

  useEffect(() => {
    if (!logoFile) { setLogoDataUrl(null); return; }
    const reader = new FileReader();
    reader.onload = (e) => setLogoDataUrl(e.target.result);
    reader.readAsDataURL(logoFile);
  }, [logoFile]);

  function validate() {
    const errs = {};
    if (!logoDataUrl) errs.logo = "Please upload your logo.";
    if (!businessName.trim()) errs.businessName = "Business name is required.";
    if (!googleReviewUrl.trim()) errs.googleReviewUrl = "Google Review URL is required.";
    if (isSocial) {
      if (!instagramUrl.trim()) errs.instagramUrl = "Instagram URL is required.";
      if (!whatsappUrl.trim()) errs.whatsappUrl = "WhatsApp URL is required.";
    }
    return errs;
  }

  async function handleBuyNow() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError("");

    const checkoutItem = {
      id:           Date.now().toString(),
      productId:    product.id,
      productName:  product.name,
      productSlug:  product.slug,
      productType:  product.productType,
      productImage: Array.isArray(product.images) ? product.images[0] : null,
      rawPrice:     product.rawPrice,
      rawSalePrice: product.rawSalePrice,
      design_method: null,
      customization: null,
      uploaded_front_design: null,
      uploaded_back_design:  null,
      review_tag_data: {
        businessName,
        logoDataUrl,
        googleReviewUrl,
        instagramUrl: isSocial ? instagramUrl : null,
        whatsappUrl:  isSocial ? whatsappUrl  : null,
      },
      addedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("checkoutItem", JSON.stringify(checkoutItem));
    } catch {}

    // Reseller mode — bypass customer checkout
    const resellerToken = sessionStorage.getItem("resellerToken");
    const resellerMode  = sessionStorage.getItem("resellerMode");
    if (resellerToken && resellerMode === "1") {
      router.push("/checkout/reseller");
      return;
    }

    const token = localStorage.getItem("customerToken");
    if (token) {
      try {
        const res = await orderService.getMyOrders();
        const orders = res.data?.orders ?? [];
        const hasActive = orders.some(
          (o) => ["pending", "paid"].includes(o.payment_status) && o.order_status !== "cancelled"
        );
        if (hasActive) {
          setSubmitError("You already have an active order. Please visit your dashboard to track it.");
          return;
        }
      } catch {
        // if check fails, allow through — backend will enforce as fallback
      }
      router.push("/checkout/shipping");
    } else {
      router.push("/checkout/guest");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* Left: product image + info */}
          <div className="flex flex-col gap-4 lg:w-[420px] lg:shrink-0">
            <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "5/3", background: "#F3F4F6" }}>
              {product.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-black">{product.name}</h1>
              <p className="mt-1 text-[13px] text-[#6B7280]">{PRODUCT_TYPE_LABELS[product.productType] || ""}</p>
              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="text-[20px] font-bold text-black">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-[14px] text-[#BBBBBB] line-through">{product.originalPrice}</span>
                )}
              </div>
              {product.description && (
                <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-[#4B5563]">{product.description}</p>
              )}
            </div>
          </div>

          {/* Right: customization form */}
          <div className="flex-1 rounded-2xl border p-6" style={{ borderColor: "#E5E7EB" }}>
            <h2 className="mb-1 text-[16px] font-semibold text-black">
              Set up your {isSocial ? "social & review" : "review"} tag
            </h2>
            <p className="mb-5 text-[13px] text-[#6B7280]">
              Add your logo and links now — no setup needed after payment. It&apos;ll be ready to use as soon as it arrives.
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <LogoDropzone previewUrl={logoDataUrl} onChange={setLogoFile} />
                {errors.logo && <p className="mt-1 text-[12px] text-red-500">{errors.logo}</p>}
              </div>

              <TextField
                label="Business Name" required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. The Coffee House"
                error={errors.businessName}
              />

              <TextField
                label="Google Review URL" required
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                placeholder="https://g.page/r/xxxxxxxxxx/review"
                error={errors.googleReviewUrl}
              />

              {isSocial && (
                <>
                  <TextField
                    label="Instagram URL" required
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/yourbusiness"
                    error={errors.instagramUrl}
                  />
                  <TextField
                    label="WhatsApp URL" required
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="https://wa.me/91XXXXXXXXXX"
                    error={errors.whatsappUrl}
                  />
                </>
              )}

              {submitError && <p className="text-[12px] text-red-500">{submitError}</p>}

              <button
                onClick={handleBuyNow}
                className="mt-2 rounded-xl px-6 py-3 text-[15px] font-bold text-black transition-opacity active:opacity-80"
                style={{ background: "#28DC4F" }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
