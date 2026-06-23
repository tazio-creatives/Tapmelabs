"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sidebar, TopHeader } from "@/components/dashboard/shared";
import profileService from "@/services/profileService";
import orderService from "@/services/orderService";
import CardMockupOverlay from "@/components/product/CardMockupOverlay";

/* ─── card background constants ──────────────────────────────────────────── */

const DEFAULT_BG = { type: "solid", id: "matte-black", color: "#18181B" };

function getBgStyle(bg) {
  if (!bg) return { background: "#18181B" };
  if (bg.type === "solid")    return { background: bg.color };
  if (bg.type === "gradient") return { background: bg.css };
  if (bg.type === "pattern")  return bg.style ?? { background: "#18181B" };
  return { background: "#18181B" };
}

function getLogoStyle(placement, size = 44) {
  const pct = Math.round((size / 80) * 14) + 8;
  const base = {
    position: "absolute",
    pointerEvents: "none",
    width: `${pct}%`,
    height: "auto",
    maxHeight: "25%",
    objectFit: "contain",
  };
  switch (placement) {
    case "top-left":      return { ...base, top: "6%",    left: "5%"  };
    case "top-center":    return { ...base, top: "6%",    left: "50%", transform: "translateX(-50%)" };
    case "top-right":     return { ...base, top: "6%",    right: "5%" };
    case "center-left":   return { ...base, top: "50%",   left: "5%",  transform: "translateY(-50%)" };
    case "center":        return { ...base, top: "50%",   left: "50%", transform: "translate(-50%,-50%)" };
    case "center-right":  return { ...base, top: "50%",   right: "5%", transform: "translateY(-50%)" };
    case "bottom-left":   return { ...base, bottom: "22%", left: "5%" };
    case "bottom-center": return { ...base, bottom: "22%", left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":  return { ...base, bottom: "18%", right: "5%" };
    default:              return { ...base, top: "6%",    left: "5%"  };
  }
}

function isLightBg(bg) {
  if (!bg || bg.type !== "solid" || !bg.color?.startsWith("#")) return false;
  const r = parseInt(bg.color.slice(1, 3), 16);
  const g = parseInt(bg.color.slice(3, 5), 16);
  const b = parseInt(bg.color.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

/* ─── card face components (mirrors ProductDetail.js visuals) ───────────── */

function FrontCardPreview({ bg, name, subTitle, logoDataUrl, logoPlacement, logoSize, fontColor, skinSvgContent = null }) {
  const light = isLightBg(bg);
  const tc    = fontColor || (light ? "rgba(0,0,0,0.85)"  : "rgba(255,255,255,0.9)");
  const stc   = fontColor ? fontColor + "99" : (light ? "rgba(0,0,0,0.45)"  : "rgba(255,255,255,0.45)");
  const lMain = fontColor || (light ? "#000000"            : "#ffffff");
  const arc   = fontColor ? fontColor + "55" : (light ? "rgba(0,0,0,0.2)"   : "rgba(255,255,255,0.25)");
  const ring  = (o) => light ? `rgba(0,0,0,${o})` : `rgba(255,255,255,${o})`;
  const dm    = fontColor || (light ? "#000" : "#fff");

  return (
    <div
      style={{
        width: "100%", maxWidth: "460px", aspectRatio: "5 / 3",
        borderRadius: "14px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        position: "relative", overflow: "hidden", containerType: "inline-size",
        ...getBgStyle(bg),
      }}
    >
      {skinSvgContent && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(skinSvgContent)}`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
      )}
      {!skinSvgContent && !light && (
        <div style={{ pointerEvents: "none", position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 20%,rgba(40,220,79,0.09) 0%,transparent 55%)" }} />
      )}
      {["33%", "50%", "66%"].map((sz, i) => (
        <div key={i} style={{ pointerEvents: "none", position: "absolute", width: sz, height: sz, bottom: `calc(-${sz} / 2)`, right: `calc(-${sz} / 2)`, borderRadius: "50%", border: `1px solid ${ring(0.06 - i * 0.015)}` }} />
      ))}

      {/* Top-left: TapMe branding — hidden when custom logo is placed top-left */}
      {!(logoDataUrl && logoPlacement === "top-left") && (
        <div style={{ position: "absolute", left: "4%", top: "8%", display: "flex", alignItems: "center", gap: "3%" }}>
          <svg style={{ width: "5.5cqw", height: "5.5cqw" }} viewBox="0 0 40 40" fill="none">
            <path d="M1.875 30.199C1.875 25.3665 5.79251 21.449 10.625 21.449H23.4375C25.6812 21.449 27.5 19.6301 27.5 17.3865C27.5 15.1428 25.6812 13.324 23.4375 13.324H4.0625V8.94897H23.4375C28.0974 8.94897 31.875 12.7266 31.875 17.3865C31.875 22.0464 28.0974 25.824 23.4375 25.824H10.625C8.20875 25.824 6.25 27.7827 6.25 30.199V31.449H1.875V30.199Z" fill={lMain} />
            <path d="M34.2477 8.75089C36.6257 10.8686 38.1256 13.9518 38.1256 17.3866C38.1256 21.028 36.4401 24.2741 33.8092 26.3935L30.192 24.3046C32.6785 22.9974 34.3756 20.3908 34.3756 17.3866C34.3756 14.605 32.9203 12.1644 30.7311 10.7802L34.2477 8.75089Z" fill="#28DC4F" />
            <circle cx="23.125" cy="17.5" r="1.875" fill="#28DC4F" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-text.svg" alt="TAPME LABS" style={{ height: "2cqw", filter: light ? "none" : "brightness(0) invert(1)" }} />
        </div>
      )}

      {/* Customer logo at selected placement */}
      {logoDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoDataUrl} alt="Logo" style={getLogoStyle(logoPlacement ?? "top-left", logoSize ?? 44)} />
      )}

      {/* Top-right: NFC icon */}
      <div style={{ position: "absolute", right: "4%", top: "8%" }}>
        <svg style={{ width: "5cqw", height: "5cqw" }} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="16" r="1.5" fill={arc} />
          <path d="M7 13a4.2 4.2 0 0 1 6 0" stroke={arc} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M4 10a8.5 8.5 0 0 1 12 0" stroke={arc} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Bottom-left: name + subtitle */}
      <div style={{ position: "absolute", bottom: "12%", left: "5%", right: "30%", overflow: "hidden" }}>
        <p style={{ color: tc, fontSize: "clamp(7px, 3.5cqw, 18px)", fontWeight: 600, lineHeight: 1.3, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name || "Your Name"}</p>
        <p style={{ color: stc, fontSize: "clamp(5px, 2.4cqw, 13px)", marginTop: "0.25em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subTitle || "Title · Company"}</p>
      </div>

      {/* Bottom-right: data-matrix placeholder */}
      <div style={{ position: "absolute", bottom: "8%", right: "4%", width: "8%", aspectRatio: "1", opacity: 0.18 }}>
        <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
          <rect x="0.5" y="0.5" width="9" height="9" rx="1" stroke={dm} strokeWidth="1" fill="none" />
          <rect x="2.5" y="2.5" width="5" height="5" fill={dm} />
          <rect x="12.5" y="0.5" width="9" height="9" rx="1" stroke={dm} strokeWidth="1" fill="none" />
          <rect x="14.5" y="2.5" width="5" height="5" fill={dm} />
          <rect x="0.5" y="12.5" width="9" height="9" rx="1" stroke={dm} strokeWidth="1" fill="none" />
          <rect x="2.5" y="14.5" width="5" height="5" fill={dm} />
          <rect x="12.5" y="12.5" width="4" height="4" fill={dm} />
          <rect x="18.5" y="12.5" width="3" height="3" fill={dm} />
          <rect x="12.5" y="18.5" width="3" height="3" fill={dm} />
          <rect x="17.5" y="17.5" width="4" height="4" fill={dm} />
        </svg>
      </div>
    </div>
  );
}

function BackCardPreview({ backContent, bg, backLogoDataUrl, backLogoPlacement, backLogoSize, qrFgColor }) {
  const qr = qrFgColor || "#18181B";
  return (
    <div
      style={{
        width: "100%", maxWidth: "460px", aspectRatio: "5 / 3",
        borderRadius: "14px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        position: "relative", overflow: "hidden", containerType: "inline-size",
        ...getBgStyle(bg ?? DEFAULT_BG),
      }}
    >
      <div style={{ pointerEvents: "none", position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 20%,rgba(40,220,79,0.10) 0%,transparent 55%)" }} />
      {["53%", "73%", "93%"].map((sz, i) => (
        <div key={i} style={{ pointerEvents: "none", position: "absolute", width: sz, height: sz, bottom: `calc(-${sz} / 2)`, left: `calc(-${sz} / 2)`, borderRadius: "50%", border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})` }} />
      ))}

      {/* NFC icon — top-right */}
      <div style={{ position: "absolute", right: "4%", top: "8%" }}>
        <svg style={{ width: "5cqw", height: "5cqw" }} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="16" r="1.5" fill="rgba(255,255,255,0.25)" />
          <path d="M7 13a4.2 4.2 0 0 1 6 0" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M4 10a8.5 8.5 0 0 1 12 0" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div style={{ pointerEvents: "none", position: "absolute", left: 0, right: 0, bottom: "16%", height: "1px", background: "rgba(255,255,255,0.06)" }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3%" }}>
        {backContent === "qr" ? (
          <>
            {/* QR box: 28% of card width, square */}
            <div style={{ width: "28%", aspectRatio: "1", background: "white", borderRadius: "6px", padding: "4%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
                <rect x="0.5"  y="0.5"  width="9" height="9" rx="1" stroke={qr} strokeWidth="1" fill="none" />
                <rect x="2.5"  y="2.5"  width="5" height="5" fill={qr} />
                <rect x="12.5" y="0.5"  width="9" height="9" rx="1" stroke={qr} strokeWidth="1" fill="none" />
                <rect x="14.5" y="2.5"  width="5" height="5" fill={qr} />
                <rect x="0.5"  y="12.5" width="9" height="9" rx="1" stroke={qr} strokeWidth="1" fill="none" />
                <rect x="2.5"  y="14.5" width="5" height="5" fill={qr} />
                <rect x="12.5" y="12.5" width="4" height="4" fill={qr} />
                <rect x="18.5" y="12.5" width="3" height="3" fill={qr} />
                <rect x="12.5" y="18.5" width="3" height="3" fill={qr} />
                <rect x="17.5" y="17.5" width="4" height="4" fill={qr} />
              </svg>
            </div>
            <span style={{ fontSize: "clamp(5px, 2.2cqw, 11px)", fontWeight: 500, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)" }}>SCAN TO CONNECT</span>
          </>
        ) : backLogoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={backLogoDataUrl} alt="Logo" style={getLogoStyle(backLogoPlacement ?? "center", backLogoSize ?? 44)} />
        ) : (
          <>
            <svg style={{ width: "13cqw", height: "13cqw" }} viewBox="0 0 40 40" fill="none">
              <path d="M1.875 30.199C1.875 25.3665 5.79251 21.449 10.625 21.449H23.4375C25.6812 21.449 27.5 19.6301 27.5 17.3865C27.5 15.1428 25.6812 13.324 23.4375 13.324H4.0625V8.94897H23.4375C28.0974 8.94897 31.875 12.7266 31.875 17.3865C31.875 22.0464 28.0974 25.824 23.4375 25.824H10.625C8.20875 25.824 6.25 27.7827 6.25 30.199V31.449H1.875V30.199Z" fill="white" />
              <path d="M34.2477 8.75089C36.6257 10.8686 38.1256 13.9518 38.1256 17.3866C38.1256 21.028 36.4401 24.2741 33.8092 26.3935L30.192 24.3046C32.6785 22.9974 34.3756 20.3908 34.3756 17.3866C34.3756 14.605 32.9203 12.1644 30.7311 10.7802L34.2477 8.75089Z" fill="#28DC4F" />
              <circle cx="23.125" cy="17.5" r="1.875" fill="#28DC4F" />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-text.svg" alt="TAPME LABS" style={{ width: "20%", height: "auto", filter: "brightness(0) invert(1)" }} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── helpers ─────────────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatOrderId(order) {
  if (!order) return "—";
  if (order.order_number) return `#${order.order_number}`;
  const raw = String(order.id || order._id || "");
  return raw ? `#ORD-${raw.slice(-8).toUpperCase()}` : "—";
}

function formatAddress(addr) {
  if (!addr) return ["—", ""];
  const line1 = addr.street || addr.address || addr.line1 || addr.full_name || "—";
  const line2 = [addr.city, addr.state, addr.pincode]
    .filter(Boolean)
    .join(", ");
  return [line1, line2];
}

const STATUS_STYLE = {
  delivered:  { bg: "rgba(40,220,79,0.12)",   color: "#28DC4F" },
  paid:       { bg: "rgba(40,220,79,0.12)",   color: "#28DC4F" },
  processing: { bg: "rgba(59,130,246,0.12)",  color: "#3B82F6" },
  shipped:    { bg: "rgba(59,130,246,0.12)",  color: "#3B82F6" },
  pending:    { bg: "rgba(251,191,36,0.12)",  color: "#F59E0B" },
  failed:     { bg: "rgba(239,68,68,0.12)",   color: "#EF4444" },
  cancelled:  { bg: "rgba(239,68,68,0.12)",   color: "#EF4444" },
};

function statusStyle(raw) {
  const key = (raw || "").toLowerCase();
  return STATUS_STYLE[key] ?? { bg: "rgba(40,220,79,0.12)", color: "#28DC4F" };
}

/* ─── QR display ──────────────────────────────────────────────────────── */

function getQrStyleOptions(qrStyle, color) {
  const map = {
    minimal:    { dotsOptions: { color, type: "dots"           }, cornersSquareOptions: { color, type: "extra-rounded" }, cornersDotOptions: { color, type: "dot"    } },
    futuristic: { dotsOptions: { color, type: "square"         }, cornersSquareOptions: { color, type: "square"        }, cornersDotOptions: { color, type: "square" } },
    glass:      { dotsOptions: { color, type: "rounded"        }, cornersSquareOptions: { color, type: "extra-rounded" }, cornersDotOptions: { color, type: "dot"    } },
    editorial:  { dotsOptions: { color, type: "classy-rounded" }, cornersSquareOptions: { color, type: "square"        }, cornersDotOptions: { color, type: "square" } },
    creative:   { dotsOptions: { color, type: "extra-rounded"  }, cornersSquareOptions: { color, type: "extra-rounded" }, cornersDotOptions: { color, type: "dot"    } },
  };
  return map[qrStyle] || map.minimal;
}

function isLightColor(hex) {
  if (!hex?.startsWith("#") || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

function StyledQRDisplay({ profileUrl, qrColor = "#18181B", qrStyle = "minimal", size = 180 }) {
  const ref  = useRef(null);
  const data = profileUrl || "https://tapmelabs.com";
  const qrBg = isLightColor(qrColor) ? "#1a1a1a" : "#ffffff";

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !ref.current) return;
      const qr = new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data,
        margin: 4,
        backgroundOptions: { color: qrBg },
        ...getQrStyleOptions(qrStyle, qrColor),
      });
      ref.current.innerHTML = "";
      qr.append(ref.current);
      const svg = ref.current.querySelector("svg");
      if (svg) { svg.style.width = "100%"; svg.style.height = "100%"; }
    });
    return () => { cancelled = true; };
  }, [data, qrColor, qrStyle, size, qrBg]);

  return <div ref={ref} style={{ width: size, height: size }} />;
}

/* ─── icons ────────────────────────────────────────────────────────────── */

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.667 3.333H3.333A1.333 1.333 0 0 0 2 4.667v8A1.333 1.333 0 0 0 3.333 14h8A1.333 1.333 0 0 0 12.667 12.667V9.333" />
      <path d="M9.333 2h4.667v4.667" />
      <path d="M6.667 9.333 14 2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 10v2.667A1.333 1.333 0 0 1 12.667 14H3.333A1.333 1.333 0 0 1 2 12.667V10" />
      <path d="M4.667 6.667 8 10l3.333-3.333" />
      <path d="M8 10V2" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12.667" cy="2.667" r="1.333" />
      <circle cx="3.333" cy="8" r="1.333" />
      <circle cx="12.667" cy="13.333" r="1.333" />
      <path d="M4.547 7.153 11.46 3.513" />
      <path d="M4.547 8.847 11.46 12.487" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.667 8.667a3.333 3.333 0 0 0 4.806.247l2-2A3.333 3.333 0 0 0 8.78 2.22L7.727 3.273" />
      <path d="M9.333 7.333a3.333 3.333 0 0 0-4.806-.247l-2 2a3.333 3.333 0 0 0 4.693 4.694L8.273 12.727" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.333 2.667V6h3.334" />
      <path d="M2.16 9.667A6 6 0 1 0 3.107 6.08l-1.774-.08" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.667" y="7.333" width="10.667" height="7.333" rx="1.333" />
      <path d="M5.333 7.333V5.333a2.667 2.667 0 0 1 5.334 0v2" />
    </svg>
  );
}

/* ─── shared subcomponents ────────────────────────────────────────────── */

function ActiveBadge() {
  return (
    <span
      className="inline-flex items-center rounded-full px-[10px] py-[4px] text-[12px] font-semibold"
      style={{ background: "rgba(40,220,79,0.12)", color: "#28DC4F" }}
    >
      Active
    </span>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div className={`rounded-[16px] border border-[#EBEBEB] bg-white p-8 ${className}`}>
      {children}
    </div>
  );
}

/* ─── left column ─────────────────────────────────────────────────────── */

function PhysicalCardSection({ customization, productImages, profile, onReorder, onLock, designMethod, uploadedFrontDesign, uploadedBackDesign }) {
  const [cardSide, setCardSide] = useState("front");
  const isUploadMethod = designMethod === "upload_own_design";
  const hasCust = !!customization || isUploadMethod;
  const c = customization || {};
  const imgs = productImages || { front: null, back: null };

  // Card customization logo takes priority; profile logo is fallback only
  const cardName     = profile?.name    || c.name    || "";
  const cardSubTitle = profile
    ? profile.designation || c.subTitle || ""
    : c.subTitle || "";
  const profileLogoUrl = profile?.company_logo
    ? (profile.company_logo.startsWith("http")
        ? profile.company_logo
        : `${typeof window !== "undefined" ? window.location.origin : ""}${profile.company_logo.startsWith("/") ? "" : "/"}${profile.company_logo}`)
    : null;
  const cardLogoUrl = c.logoDataUrl || profileLogoUrl || null;

  return (
    <SectionCard>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[20px] font-bold text-[#111827]">Physical NFC Card</h2>
        <ActiveBadge />
      </div>

      {hasCust ? (
        <>
          {/* Card preview */}
          <div className="mb-4 overflow-hidden rounded-[12px] bg-[#F5F5F5]">
            {/* Front/Back toggle */}
            <div className="mb-3 flex rounded-[10px] border border-[#EBEBEB] overflow-hidden">
              {["front", "back"].map((side) => (
                <button
                  key={side}
                  onClick={() => setCardSide(side)}
                  className="flex flex-1 items-center justify-center py-[9px] text-[13px] font-medium transition-all"
                  style={{
                    background: cardSide === side ? "#18181B" : "transparent",
                    color:      cardSide === side ? "#fff"    : "#6B7280",
                  }}
                >
                  {side === "front" ? "Front Side" : "Back Side"}
                </button>
              ))}
            </div>

            {/* Card visual */}
            {isUploadMethod ? (
              (() => {
                const src = cardSide === "front" ? uploadedFrontDesign : uploadedBackDesign;
                if (src) {
                  return (
                    <div className="overflow-hidden rounded-[12px] mx-3 my-3" style={{ aspectRatio: "5/3", background: "#111" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`${cardSide} design`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                  );
                }
                return (
                  <div className="flex items-center justify-center rounded-[12px] mx-3 my-3" style={{ aspectRatio: "5/3", background: "#F0F0F0", border: "2px dashed #D1D5DB" }}>
                    <p className="text-[13px] text-[#9CA3AF]">
                      {cardSide === "front" ? "Front design" : "Back design (not uploaded)"}
                    </p>
                  </div>
                );
              })()
            ) : (() => {
              const mockupSrc = cardSide === "front"
                ? imgs.front || null
                : imgs.back  || imgs.front || null;

              const svgBg     = c.svgBackground;
              const skinSvg   = svgBg?.backgroundType === "svg" ? (svgBg.customizedSvgContent || null) : null;
              const resolvedFrontBg = svgBg?.backgroundType === "plain"
                ? { type: "solid", color: svgBg.plainColor }
                : c.cardColor
                  ? { type: "solid", color: c.cardColor }
                  : (c.frontBg || DEFAULT_BG);
              const resolvedBackBg = c.cardColor
                ? { type: "solid", color: c.cardColor }
                : (c.backBg || DEFAULT_BG);

              if (mockupSrc) {
                return (
                  <CardMockupOverlay
                    mockupSrc={mockupSrc}
                    alt={`Card ${cardSide} side`}
                    side={cardSide}
                    customization={{ ...c, name: cardName, subTitle: cardSubTitle, logoDataUrl: cardLogoUrl, skinSvgContent: skinSvg, frontBg: resolvedFrontBg, backBg: resolvedBackBg }}
                    className="rounded-[12px] overflow-hidden"
                  />
                );
              }

              // Fallback: 3-D flip card preview
              return (
                <div
                  className="flex items-center justify-center px-6 py-8"
                  style={{ perspective: "1200px" }}
                >
                  <div
                    style={{
                      position: "relative", width: "100%", maxWidth: "460px",
                      aspectRatio: "460 / 276", transformStyle: "preserve-3d",
                      transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
                      transform: cardSide === "back" ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front face */}
                    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FrontCardPreview
                        bg={resolvedFrontBg}
                        name={cardName}
                        subTitle={cardSubTitle}
                        logoDataUrl={cardLogoUrl}
                        logoPlacement={c.logoPlacement}
                        logoSize={c.logoSize}
                        fontColor={c.fontColor}
                        skinSvgContent={skinSvg}
                      />
                    </div>
                    {/* Back face */}
                    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BackCardPreview
                        backContent={c.backContent || "logo"}
                        bg={c.cardColor ? { type: "solid", color: c.cardColor } : (c.backBg || DEFAULT_BG)}
                        backLogoDataUrl={c.backLogoDataUrl}
                        backLogoPlacement={c.backLogoPlacement}
                        backLogoSize={c.backLogoSize}
                        qrFgColor={c.qrFgColor}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Customization summary pill */}
          {(c.selectedCard || cardName || cardSubTitle) && (
            <div className="mb-5 rounded-[10px] bg-[#F9FAFB] px-4 py-3 text-[12px] text-[#6B7280]">
              {[
                c.selectedCard && `Card: ${c.selectedCard.charAt(0).toUpperCase() + c.selectedCard.slice(1)}`,
                cardName       && `Name: ${cardName}`,
                cardSubTitle   && cardSubTitle,
              ].filter(Boolean).join(" · ")}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Fallback: generic card image + message */}
          <div className="relative mb-3 overflow-hidden rounded-[12px]" style={{ aspectRatio: "525/300" }}>
            <Image
              src="/images/dashboard/mycard-card-image.png"
              alt="Physical NFC Card"
              fill
              sizes="(max-width: 1280px) 100vw, 560px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <p className="mb-5 text-center text-[13px] text-[#9CA3AF]">
            No customized card found yet.
          </p>
        </>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReorder}
          className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] text-[13px] font-medium text-white transition-opacity hover:opacity-80 active:opacity-70"
          style={{ height: "50px", background: "#18181B" }}
        >
          <RefreshIcon />
          Re-Order Physical Card
        </button>
        <button
          onClick={onLock}
          className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-[#E5E7EB] text-[13px] font-medium text-white transition-opacity hover:opacity-80 active:opacity-70"
          style={{ height: "50px", background: "#18181B" }}
        >
          <LockIcon />
          Lock Card (Lost/Stolen)
        </button>
      </div>
    </SectionCard>
  );
}

function OrderDetailsSection({ order }) {
  const { bg, color } = statusStyle(order?.order_status || order?.status || order?.payment_status);
  const displayStatus = order?.order_status || order?.status || order?.payment_status || "—";
  const [addrLine1, addrLine2] = formatAddress(order?.shipping_address);

  const rows = [
    {
      label: "Order ID",
      value: (
        <span className="text-[14px] font-semibold text-[#111827]">
          {formatOrderId(order)}
        </span>
      ),
    },
    {
      label: "Date Ordered",
      value: (
        <span className="text-[14px] text-[#111827]">
          {order ? formatDate(order.created_at || order.createdAt) : "—"}
        </span>
      ),
    },
    {
      label: "Status",
      value: order ? (
        <span
          className="rounded-full px-[10px] py-[4px] text-[12px] font-semibold"
          style={{ background: bg, color }}
        >
          {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
        </span>
      ) : (
        <span className="text-[14px] text-[#6B7280]">—</span>
      ),
    },
    {
      label: "Shipping Address",
      value: order ? (
        <span className="text-right text-[14px] leading-[1.6] text-[#111827]">
          {addrLine1}
          {addrLine2 && <><br />{addrLine2}</>}
        </span>
      ) : (
        <span className="text-[14px] text-[#6B7280]">No orders yet</span>
      ),
    },
  ];

  return (
    <SectionCard>
      <h2 className="mb-5 text-[20px] font-bold text-[#111827]">Order Details</h2>

      <div className="flex flex-col divide-y divide-[#F4F4F4]">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between py-[14px]">
            <span className="text-[14px] text-[#6B7280]">{label}</span>
            {value}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ─── right column ────────────────────────────────────────────────────── */

function ActionsSection({ profileUrl, cardTapUrl, onViewProfile, onDownloadQR, onShare, onCopy, copied, qrColor, qrStyle }) {
  const qrData = cardTapUrl || profileUrl; // QR points to card tap URL first
  const actionBtns = [
    {
      label:   "Download QR Code",
      icon:    <DownloadIcon />,
      onClick: onDownloadQR,
      style:   { background: "#fff", color: "#374151" },
      cls:     "border border-[#E5E7EB]",
    },
    {
      label:   "Share Profile",
      icon:    <ShareIcon />,
      onClick: onShare,
      style:   { background: "#fff", color: "#374151" },
      cls:     "border border-[#E5E7EB]",
    },
    {
      label:   copied ? "Copied!" : "Copy Profile",
      icon:    <LinkIcon />,
      onClick: onCopy,
      style:   { background: "#fff", color: copied ? "#28DC4F" : "#374151" },
      cls:     `border ${copied ? "border-[#28DC4F]" : "border-[#E5E7EB]"}`,
    },
  ];

  return (
    <SectionCard className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-[20px] font-bold text-[#111827]">Actions</h2>
        <ActiveBadge />
      </div>

      {/* QR section */}
      <div className="rounded-[12px] bg-[#F9FAFB] px-6 py-8">
        <div
          className="mx-auto mb-5 flex items-center justify-center rounded-[10px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          style={{ width: "fit-content", backgroundColor: isLightColor(qrColor || "#18181B") ? "#1a1a1a" : "#ffffff" }}
        >
          <StyledQRDisplay profileUrl={qrData} qrColor={qrColor} qrStyle={qrStyle} size={180} />
        </div>
        <p className="text-center text-[13px] leading-[1.6] text-[#6B7280]">
          {cardTapUrl ? "Scan to open your card link (form or profile based on your setting)." : "Scan this QR code to view your digital profile."}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        {/* Primary green button */}
        <button
          onClick={onViewProfile}
          disabled={!profileUrl}
          className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[8px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ background: "#28DC4F" }}
        >
          <ExternalLinkIcon />
          View Digital Profile
        </button>

        {/* Secondary white buttons */}
        {actionBtns.map(({ label, icon, onClick, style, cls }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex h-[50px] w-full items-center justify-center gap-2 rounded-[8px] text-[14px] font-medium transition-colors hover:bg-[#F9FAFB] ${cls}`}
            style={style}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */

export default function MyCardsPage() {
  const router = useRouter();

  const [sidebarOpen,          setSidebarOpen]          = useState(false);
  const [initials,             setInitials]             = useState("U");
  const [profile,              setProfile]              = useState(null);
  const [latestOrder,          setLatestOrder]          = useState(null);
  const [customization,        setCustomization]        = useState(null);
  const [productImages,        setProductImages]        = useState({ front: null, back: null });
  const [designMethod,         setDesignMethod]         = useState("customize_online");
  const [uploadedFrontDesign,  setUploadedFrontDesign]  = useState(null);
  const [uploadedBackDesign,   setUploadedBackDesign]   = useState(null);
  const [copied,               setCopied]               = useState(false);
  const [loading,              setLoading]              = useState(true);
  const [apiError,             setApiError]             = useState("");
  const [cardAction,           setCardAction]           = useState("profile");
  const [cardUid,              setCardUid]              = useState(null);
  const [forms,                setForms]                = useState([]);
  const [selectedFormId,       setSelectedFormId]       = useState(null);
  const [savingAction,         setSavingAction]         = useState(false);
  const [actionSaved,          setActionSaved]          = useState(false);
  const [copiedCard,           setCopiedCard]           = useState(false);
  const [copiedProfile,        setCopiedProfile]        = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("customerToken");
    if (!token) { router.push("/login"); return; }

    const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
    const displayName = stored.full_name || stored.name || "";
    setInitials(
      displayName.split(" ").map((w) => w[0] || "").join("").toUpperCase().slice(0, 2) || "U"
    );

    Promise.allSettled([
      profileService.getMyProfile(),
      orderService.getMyOrders(),
    ]).then(([profileRes, ordersRes]) => {
      if (profileRes.status === "fulfilled") {
        const raw = profileRes.value;
        setProfile(raw?.data?.profile ?? raw?.profile ?? raw?.data ?? raw ?? null);
      }
      /* 404 on profile = no profile yet → profile stays null */

      if (ordersRes.status === "fulfilled") {
        const raw = ordersRes.value;
        const candidate = Array.isArray(raw) ? raw : (raw?.orders ?? raw?.data?.orders ?? raw?.data ?? []);
        const list = Array.isArray(candidate) ? candidate : [];
        /* most recent order first */
        const sorted = [...list].sort(
          (a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt)
        );
        const order = sorted[0] ?? null;
        setLatestOrder(order);

        // 1. Try API order's card_customization (future-proofed once backend stores it)
        if (order?.card_customization) {
          const cust = order.card_customization;

          // Set product images so CardMockupOverlay is used (shows backgroundStyle, fontFamily, accentColor etc.)
          if (order.product) {
            const imgs = Array.isArray(order.product.images) ? order.product.images : [];
            setProductImages({
              front: order.product.front_image || imgs[0] || null,
              back:  order.product.back_image  || imgs[1] || imgs[0] || null,
            });
          }

          if (cust.design_method === "upload_own_design") {
            setDesignMethod("upload_own_design");
            setUploadedFrontDesign(cust.uploaded_front_design || null);
            setUploadedBackDesign(cust.uploaded_back_design || null);
          } else {
            setDesignMethod(cust.design_method || "customize_online");
            setCustomization(cust);

            // Load Google Font if a custom font was selected
            if (cust.fontFamily && cust.fontFamily !== "sans-serif") {
              const fontName = cust.fontFamily.replace(/'/g, "").split(",")[0].trim();
              const fontId   = `gfont-dashboard-${fontName.toLowerCase().replace(/\s+/g, "-")}`;
              if (fontName && !document.getElementById(fontId)) {
                const link = document.createElement("link");
                link.id   = fontId;
                link.rel  = "stylesheet";
                link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600&display=swap`;
                document.head.appendChild(link);
              }
            }
          }
          return; // skip localStorage fallback
        }
      } else if (ordersRes.reason?.response?.status !== 404) {
        setApiError("Could not load order details.");
      }

      // 2. Always fall back to localStorage if API has no customization data.
      //    Check checkoutItem first (new flow), then cartItems (legacy).
      try {
        const singleItem = JSON.parse(localStorage.getItem("checkoutItem") || "null");
        if (singleItem) {
          setDesignMethod(singleItem.design_method || "customize_online");
          setUploadedFrontDesign(singleItem.uploaded_front_design || null);
          setUploadedBackDesign(singleItem.uploaded_back_design || null);
          if (singleItem.customization) {
            setCustomization(singleItem.customization);
            setProductImages({ front: singleItem.front_image || null, back: singleItem.back_image || null });
            // Load font
            const ff = singleItem.customization.fontFamily;
            if (ff && ff !== "sans-serif") {
              const fn = ff.replace(/'/g, "").split(",")[0].trim();
              const fid = `gfont-dashboard-${fn.toLowerCase().replace(/\s+/g, "-")}`;
              if (fn && !document.getElementById(fid)) {
                const l = document.createElement("link");
                l.id = fid; l.rel = "stylesheet";
                l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fn)}:wght@400;600&display=swap`;
                document.head.appendChild(l);
              }
            }
          }
        } else {
          const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
          const lastItem = cart.length > 0 ? cart[cart.length - 1] : null;
          if (lastItem?.customization) setCustomization(lastItem.customization);
        }
      } catch { /* storage unavailable */ }
    }).finally(() => setLoading(false));

    // Load NFC card action setting and forms
    import("@/services/api").then(({ default: api }) => {
      api.get("/nfc-cards/mine").then(r => {
        if (r.data.card) {
          setCardAction(r.data.card.default_action || "profile");
          setSelectedFormId(r.data.card.form_id || null);
          setCardUid(r.data.card.card_uid || null);
        }
      }).catch(() => {});
      api.get("/forms").then(r => setForms(r.data.forms || [])).catch(() => {});
    });
  }, [router]);

  const origin     = typeof window !== "undefined" ? window.location.origin : "";
  const profileUrl = profile?.slug ? `${origin}/u/${profile.slug}` : null;
  const cardTapUrl = cardUid ? `${origin}/c/${cardUid}` : null;

  function copyCardUrl() {
    if (!cardTapUrl) return;
    navigator.clipboard.writeText(cardTapUrl);
    setCopiedCard(true); setTimeout(() => setCopiedCard(false), 2000);
  }
  function copyProfileUrl() {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopiedProfile(true); setTimeout(() => setCopiedProfile(false), 2000);
  }

  function handleViewProfile() {
    if (profileUrl) window.open(profileUrl, "_blank");
  }

  async function handleDownloadQR() {
    const qrData = cardTapUrl || profileUrl;
    if (!qrData) return;
    const { default: QRCodeStyling } = await import("qr-code-styling");
    const qrColor = customization?.qrFgColor || "#18181B";
    const qr = new QRCodeStyling({
      width: 400, height: 400, type: "svg", data: qrData,
      margin: 10, backgroundOptions: { color: "#ffffff" },
      ...getQrStyleOptions(customization?.qrStyle || "minimal", qrColor),
    });
    qr.download({ name: `tapme-qr-${profile?.slug || "profile"}`, extension: "svg" });
  }

  function handleShare() {
    const shareUrl = cardTapUrl || profileUrl;
    if (!shareUrl) return;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "My TapMe Card", url: shareUrl }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  function handleCopy() {
    if (!profileUrl || typeof navigator === "undefined") return;
    /* TODO: POST /api/analytics/share-event to record share action */
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  function handleReorder() {
    /* TODO: Navigate to re-order flow — /dashboard/orders/reorder or open modal */
    router.push("/products");
  }

  function handleLock() {
    /* TODO: Show confirmation dialog, then PATCH /api/cards/:id/lock once NFC card API is implemented */
  }

  async function saveCardAction() {
    setSavingAction(true);
    try {
      const { default: api } = await import("@/services/api");
      await api.patch("/nfc-cards/mine/action", {
        default_action: cardAction,
        form_id: cardAction === "form" ? selectedFormId : null,
      });
      setActionSaved(true);
      setTimeout(() => setActionSaved(false), 2500);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to save";
      setApiError(msg);
      setTimeout(() => setApiError(""), 3000);
    } finally {
      setSavingAction(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
        <Sidebar open={false} onClose={() => {}} activeNav="My Cards" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopHeader onMenuClick={() => {}} initials={initials} />
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#28DC4F] border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="My Cards" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        <main className="flex-1 overflow-y-auto px-6 py-6">

          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-[24px] font-bold text-[#111827]">My Cards</h1>
            <p className="mt-1 text-[14px] text-[#6B7280]">
              Manage your card and share it with others instantly.
            </p>
          </div>

          {/* Error banner */}
          {apiError && (
            <div className="mb-5 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
              {apiError}
            </div>
          )}

          {/* Two-column layout: left stacks, right is actions */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_420px]">

            {/* ── LEFT column ── */}
            <div className="flex flex-col gap-5">
              <PhysicalCardSection
                customization={customization}
                productImages={productImages}
                profile={profile}
                onReorder={handleReorder}
                onLock={handleLock}
                designMethod={designMethod}
                uploadedFrontDesign={uploadedFrontDesign}
                uploadedBackDesign={uploadedBackDesign}
              />
              <OrderDetailsSection order={latestOrder} />

              {/* Card Links */}
              <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5">
                <h3 className="text-[15px] font-bold text-[#111827] mb-4">Your Card Links</h3>

                {/* Card Tap URL */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: "#28DC4F" }}>1</span>
                    <p className="text-[12px] font-semibold text-[#111827]">NFC Card Tap URL</p>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mb-2 ml-7">This URL is programmed on your physical card chip. Redirects based on your toggle setting.</p>
                  {cardTapUrl ? (
                    <div className="flex items-center gap-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-2.5">
                      <span className="text-[11px] text-[#374151] truncate flex-1 font-mono">{cardTapUrl}</span>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={copyCardUrl}
                          className="rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors"
                          style={{ background: copiedCard ? "#28DC4F" : "#111827", color: "#fff" }}>
                          {copiedCard ? "✓ Copied" : "Copy"}
                        </button>
                        <button onClick={() => window.open(cardTapUrl, "_blank")}
                          className="rounded-lg border border-[#E5E7EB] px-2.5 py-1 text-[11px] font-medium text-[#374151] hover:bg-white">
                          Open →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="ml-7 text-[11px] text-[#9CA3AF]">Card not assigned yet</p>
                  )}
                  {cardTapUrl && (
                    <p className="mt-1.5 ml-7 text-[11px]" style={{ color: cardAction === "form" ? "#16A34A" : "#2563EB" }}>
                      Currently redirects to: <strong>{cardAction === "form" ? "Lead Form ✅" : "Digital Profile ✅"}</strong>
                    </p>
                  )}
                </div>

                {/* Profile URL */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: "#2563EB" }}>2</span>
                    <p className="text-[12px] font-semibold text-[#111827]">Digital Profile URL</p>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mb-2 ml-7">Direct link to your profile. Always shows your digital profile — not affected by toggle.</p>
                  {profileUrl ? (
                    <div className="flex items-center gap-2 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-2.5">
                      <span className="text-[11px] text-[#374151] truncate flex-1 font-mono">{profileUrl}</span>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={copyProfileUrl}
                          className="rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors"
                          style={{ background: copiedProfile ? "#28DC4F" : "#111827", color: "#fff" }}>
                          {copiedProfile ? "✓ Copied" : "Copy"}
                        </button>
                        <button onClick={() => window.open(profileUrl, "_blank")}
                          className="rounded-lg border border-[#E5E7EB] px-2.5 py-1 text-[11px] font-medium text-[#374151] hover:bg-white">
                          Open →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="ml-7 text-[11px] text-[#9CA3AF]">Complete your profile to get this link</p>
                  )}
                </div>
              </div>

              {/* Card Tap Mode */}
              <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5">
                <h3 className="text-[15px] font-bold text-[#111827] mb-1">When Someone Taps Your Card</h3>
                <p className="text-[12px] text-[#9CA3AF] mb-4">Choose what opens when someone scans your NFC card</p>

                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { value: "profile", label: "Digital Profile", desc: "Show your contact info and social links" },
                    { value: "form",    label: "Lead Form",       desc: "Collect their name, email and message" },
                  ].map(opt => (
                    <button key={opt.value} type="button" onClick={() => setCardAction(opt.value)}
                      className="flex items-start gap-3 rounded-xl border p-4 text-left transition-all"
                      style={{ borderColor: cardAction === opt.value ? "#28DC4F" : "#EBEBEB", background: cardAction === opt.value ? "#F0FFF4" : "#fff" }}>
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                        style={{ borderColor: cardAction === opt.value ? "#28DC4F" : "#D1D5DB" }}>
                        {cardAction === opt.value && <div className="h-2.5 w-2.5 rounded-full bg-[#28DC4F]" />}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#111827]">{opt.label}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {cardAction === "form" && (
                  <div className="mb-4">
                    <label className="text-[12px] font-medium text-[#374151] block mb-1.5">Select Form</label>
                    {forms.length === 0 ? (
                      <p className="text-[12px] text-[#9CA3AF]">
                        No forms yet. <a href="/dashboard/forms" className="text-[#28DC4F] font-medium">Create one →</a>
                      </p>
                    ) : (
                      <select value={selectedFormId || ""} onChange={e => setSelectedFormId(e.target.value)}
                        className="w-full rounded-xl border border-[#EBEBEB] bg-[#F9FAFB] px-3 py-2.5 text-[13px] text-[#111827] outline-none focus:border-[#28DC4F]">
                        <option value="">Select a form…</option>
                        {forms.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                      </select>
                    )}
                  </div>
                )}

                <button onClick={saveCardAction} disabled={savingAction || (cardAction === "form" && !selectedFormId)}
                  className="w-full rounded-xl py-3 text-[13px] font-semibold disabled:opacity-50 transition-colors"
                  style={{ background: actionSaved ? "#16A34A" : "#28DC4F", color: actionSaved ? "#fff" : "#000" }}>
                  {savingAction ? "Saving…" : actionSaved ? "✓ Saved!" : "Save Setting"}
                </button>
              </div>
            </div>

            {/* ── RIGHT column ── */}
            <ActionsSection
              profileUrl={profileUrl}
              cardTapUrl={cardTapUrl}
              onViewProfile={handleViewProfile}
              onDownloadQR={handleDownloadQR}
              onShare={handleShare}
              onCopy={handleCopy}
              copied={copied}
              qrColor={customization?.qrFgColor || "#18181B"}
              qrStyle={customization?.qrStyle || "minimal"}
            />
          </div>

        </main>
      </div>
    </div>
  );
}
