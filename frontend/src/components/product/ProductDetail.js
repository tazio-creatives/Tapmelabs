"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CardMockupOverlay from "./CardMockupOverlay";

/* ─── background constants ────────────────────────────────────── */

const DEFAULT_BG = { type: "solid", id: "matte-black", color: "#18181B" };

/* ─── bg helpers ─────────────────────────────────────────────── */

function getBgStyle(bg) {
  if (!bg) return { background: "#18181B" };
  if (bg.type === "solid") return { background: bg.color };
  if (bg.type === "gradient") return { background: bg.css };
  if (bg.type === "pattern") return bg.style ?? { background: "#18181B" };
  return { background: "#18181B" };
}

function isLightBg(bg) {
  if (!bg || bg.type !== "solid" || !bg.color?.startsWith("#")) return false;
  const r = parseInt(bg.color.slice(1, 3), 16);
  const g = parseInt(bg.color.slice(3, 5), 16);
  const b = parseInt(bg.color.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

/* ─── logo placement ──────────────────────────────────────────── */

const LOGO_PLACEMENTS = [
  { id: "top-left",      label: "Top Left",      symbol: "↖" },
  { id: "top-center",    label: "Top Center",    symbol: "↑" },
  { id: "top-right",     label: "Top Right",     symbol: "↗" },
  { id: "center-left",   label: "Center Left",   symbol: "←" },
  { id: "center",        label: "Center",        symbol: "✛" },
  { id: "center-right",  label: "Center Right",  symbol: "→" },
  { id: "bottom-left",   label: "Bottom Left",   symbol: "↙" },
  { id: "bottom-center", label: "Bottom Center", symbol: "↓" },
  { id: "bottom-right",  label: "Bottom Right",  symbol: "↘" },
];

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

/* ─── logo placement picker ───────────────────────────────────── */

function LogoPlacementPicker({ value, onChange, label = "Logo Placement" }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-medium text-[#374151]">{label}</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#F5F5F5] p-1.5">
        {LOGO_PLACEMENTS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            title={p.label}
            className="flex items-center justify-center rounded-lg py-2.5 text-[15px] transition-all"
            style={{
              background: value === p.id ? "#18181B" : "transparent",
              color:      value === p.id ? "#28DC4F" : "#9CA3AF",
            }}
          >
            {p.symbol}
          </button>
        ))}
      </div>
      <p className="text-[11px] text-[#9CA3AF]">
        {LOGO_PLACEMENTS.find((p) => p.id === value)?.label ?? "Top Left"}
      </p>
    </div>
  );
}

/* ─── front card preview ──────────────────────────────────────── */

function FrontCardPreview({ bg, name, subTitle, logoDataUrl, logoPlacement, logoSize, fontColor }) {
  const light = isLightBg(bg);
  const tc     = fontColor || (light ? "rgba(0,0,0,0.85)"  : "rgba(255,255,255,0.9)");
  const stc    = fontColor ? `${fontColor}CC` : (light ? "rgba(0,0,0,0.45)"  : "rgba(255,255,255,0.45)");
  const lMain  = light ? "#000000"            : "#ffffff";
  const arc    = light ? "rgba(0,0,0,0.2)"   : "rgba(255,255,255,0.25)";
  const ring   = (o) => light ? `rgba(0,0,0,${o})` : `rgba(255,255,255,${o})`;
  const dm     = light ? "#000" : "#fff";

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "100%",
        maxWidth: "420px",
        aspectRatio: "5 / 3",
        borderRadius: "14px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        containerType: "inline-size",
        ...getBgStyle(bg),
      }}
    >
      {!light && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 75% 20%,rgba(40,220,79,0.09) 0%,transparent 55%)" }}
        />
      )}

      {["33%", "50%", "66%"].map((sz, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: sz, height: sz,
            bottom: `calc(-${sz} / 2)`, right: `calc(-${sz} / 2)`,
            border: `1px solid ${ring(0.06 - i * 0.015)}`,
          }}
        />
      ))}

      {!(logoDataUrl && logoPlacement === "top-left") && (
        <div style={{ position: "absolute", left: "4%", top: "8%", display: "flex", alignItems: "center", gap: "3%" }}>
          <svg style={{ width: "5.5cqw", height: "5.5cqw" }} viewBox="0 0 40 40" fill="none">
            <path d="M1.875 30.199C1.875 25.3665 5.79251 21.449 10.625 21.449H23.4375C25.6812 21.449 27.5 19.6301 27.5 17.3865C27.5 15.1428 25.6812 13.324 23.4375 13.324H4.0625V8.94897H23.4375C28.0974 8.94897 31.875 12.7266 31.875 17.3865C31.875 22.0464 28.0974 25.824 23.4375 25.824H10.625C8.20875 25.824 6.25 27.7827 6.25 30.199V31.449H1.875V30.199Z" fill={lMain} />
            <path d="M34.2477 8.75089C36.6257 10.8686 38.1256 13.9518 38.1256 17.3866C38.1256 21.028 36.4401 24.2741 33.8092 26.3935L30.192 24.3046C32.6785 22.9974 34.3756 20.3908 34.3756 17.3866C34.3756 14.605 32.9203 12.1644 30.7311 10.7802L34.2477 8.75089Z" fill="#28DC4F" />
            <circle cx="23.125" cy="17.5" r="1.875" fill="#28DC4F" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-text.svg"
            alt="TAPME LABS"
            style={{ height: "2cqw", filter: light ? "none" : "brightness(0) invert(1)" }}
          />
        </div>
      )}

      {logoDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoDataUrl} alt="Logo" style={getLogoStyle(logoPlacement ?? "top-left", logoSize ?? 44)} />
      )}

      <div style={{ position: "absolute", right: "4%", top: "8%" }}>
        <svg style={{ width: "5cqw", height: "5cqw" }} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="16" r="1.5" fill={arc} />
          <path d="M7 13a4.2 4.2 0 0 1 6 0" stroke={arc} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M4 10a8.5 8.5 0 0 1 12 0" stroke={arc} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div style={{ position: "absolute", bottom: "12%", left: "5%", right: "30%", overflow: "hidden" }}>
        <p style={{ color: tc, fontSize: "clamp(7px, 3.5cqw, 18px)", fontWeight: 600, lineHeight: 1.3, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name || "Your Name"}
        </p>
        <p style={{ color: stc, fontSize: "clamp(5px, 2.4cqw, 13px)", marginTop: "0.25em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {subTitle || "Title · Company"}
        </p>
      </div>

      <div style={{ position: "absolute", bottom: "8%", right: "4%", width: "8%", aspectRatio: "1", opacity: 0.18 }}>
        <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
          <rect x="0.5"  y="0.5"  width="9" height="9" rx="1" stroke={dm} strokeWidth="1" fill="none" />
          <rect x="2.5"  y="2.5"  width="5" height="5" fill={dm} />
          <rect x="12.5" y="0.5"  width="9" height="9" rx="1" stroke={dm} strokeWidth="1" fill="none" />
          <rect x="14.5" y="2.5"  width="5" height="5" fill={dm} />
          <rect x="0.5"  y="12.5" width="9" height="9" rx="1" stroke={dm} strokeWidth="1" fill="none" />
          <rect x="2.5"  y="14.5" width="5" height="5" fill={dm} />
          <rect x="12.5" y="12.5" width="4" height="4" fill={dm} />
          <rect x="18.5" y="12.5" width="3" height="3" fill={dm} />
          <rect x="12.5" y="18.5" width="3" height="3" fill={dm} />
          <rect x="17.5" y="17.5" width="4" height="4" fill={dm} />
        </svg>
      </div>
    </div>
  );
}

/* ─── other constants ─────────────────────────────────────────── */

const BACK_DESIGN_OPTIONS = [
  {
    id: "brand-logo",
    label: "Logo",
    preview: (
      <div className="relative h-full w-full overflow-hidden rounded-[6px]" style={{ background: "#18181B" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[4px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.svg" alt="TapMe" style={{ width: 20, height: 20, filter: "brightness(0) invert(1)" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-text.svg" alt="Labs" style={{ height: 6, filter: "brightness(0) invert(1)" }} />
        </div>
      </div>
    ),
  },
  {
    id: "qr-only",
    label: "QR",
    preview: (
      <div className="relative h-full w-full overflow-hidden rounded-[6px]" style={{ background: "#18181B" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[4px]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="8" height="8" rx="1" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="3" y="3" width="4" height="4" fill="white"/>
            <rect x="13" y="1" width="8" height="8" rx="1" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="15" y="3" width="4" height="4" fill="white"/>
            <rect x="1" y="13" width="8" height="8" rx="1" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="3" y="15" width="4" height="4" fill="white"/>
            <rect x="13" y="13" width="3" height="3" fill="white"/>
            <rect x="18" y="13" width="3" height="3" fill="white"/>
            <rect x="13" y="18" width="3" height="3" fill="white"/>
            <rect x="18" y="18" width="3" height="3" fill="white"/>
          </svg>
          <span className="text-[5px] font-semibold text-[#999]">QR CODE</span>
        </div>
      </div>
    ),
  },
];

const QR_COLORS = [
  { id: "black",    label: "Black",       color: "#18181B" },
  { id: "navy",     label: "Navy Blue",   color: "#1B2B4B" },
  { id: "forest",   label: "Forest",      color: "#0D2B1B" },
  { id: "burgundy", label: "Burgundy",    color: "#3D0C11" },
  { id: "green",    label: "TapMe Green", color: "#28DC4F" },
  { id: "charcoal", label: "Charcoal",    color: "#2E3440" },
  { id: "purple",   label: "Purple",      color: "#3D1A78" },
  { id: "gold",     label: "Gold",        color: "#7B5C00" },
  { id: "slate",    label: "Slate",       color: "#2D3561" },
  { id: "rose",     label: "Rose",        color: "#6B2142" },
];

const CARD_COLORS = [
  { id: "black",    label: "Matte Black",  color: "#18181B" },
  { id: "navy",     label: "Navy Blue",    color: "#1B2B4B" },
  { id: "white",    label: "Arctic White", color: "#F5F5F5" },
  { id: "forest",   label: "Forest",       color: "#0D2B1B" },
  { id: "charcoal", label: "Charcoal",     color: "#2E3440" },
  { id: "rosegold", label: "Rose Gold",    color: "#C9856C" },
  { id: "royal",    label: "Royal Blue",   color: "#1E3A8A" },
  { id: "purple",   label: "Deep Purple",  color: "#3D1A78" },
  { id: "gold",     label: "Gold",         color: "#B8860B" },
  { id: "burgundy", label: "Burgundy",     color: "#3D0C11" },
];

const FONT_COLORS = [
  { id: "white",  label: "White",        color: "#FFFFFF" },
  { id: "black",  label: "Black",        color: "#18181B" },
  { id: "green",  label: "TapMe Green",  color: "#28DC4F" },
  { id: "gold",   label: "Gold",         color: "#F59E0B" },
  { id: "silver", label: "Silver",       color: "#E2E8F0" },
];

/* ─── icons ──────────────────────────────────────────────────── */

const StarIcon = ({ filled = true, half = false }) => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="half-fill" x1="0" x2="1" y1="0" y2="0">
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="50%" stopColor="#D1D5DB" />
      </linearGradient>
    </defs>
    <path
      d="M9 1.5L11.163 6.573L16.5 7.388L12.75 11.04L13.725 16.5L9 13.897L4.275 16.5L5.25 11.04L1.5 7.388L6.837 6.573L9 1.5Z"
      fill={half ? "url(#half-fill)" : filled ? "#EAB308" : "#D1D5DB"}
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="#28DC4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M5 3l4 4-4 4" />
  </svg>
);

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

/* ─── back-side card visual ──────────────────────────────────── */

function BackSideCardPreview({ backContent, bg, backLogoDataUrl, backLogoPlacement, backLogoSize, qrFgColor }) {
  const qr = qrFgColor || "#18181B";
  const bgStyle = getBgStyle(bg ?? DEFAULT_BG);
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "100%",
        maxWidth: "420px",
        aspectRatio: "5 / 3",
        borderRadius: "14px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        containerType: "inline-size",
        ...bgStyle,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 80% 20%,rgba(40,220,79,0.10) 0%,transparent 55%)" }}
      />

      {["53%", "73%", "93%"].map((sz, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: sz, height: sz,
            bottom: `calc(-${sz} / 2)`, left: `calc(-${sz} / 2)`,
            border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})`,
          }}
        />
      ))}

      <div style={{ position: "absolute", right: "4%", top: "8%" }}>
        <svg style={{ width: "5cqw", height: "5cqw" }} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="16" r="1.5" fill="rgba(255,255,255,0.25)" />
          <path d="M7 13a4.2 4.2 0 0 1 6 0" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M4 10a8.5 8.5 0 0 1 12 0" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3%]">
        {backContent === "qr" ? (
          <>
            <div
              style={{
                width: "28%", aspectRatio: "1", background: "white",
                borderRadius: "6px", padding: "4%", boxSizing: "border-box",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
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
            <span style={{ fontSize: "clamp(5px, 2.2cqw, 11px)", fontWeight: 500, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>SCAN TO CONNECT</span>
          </>
        ) : backLogoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backLogoDataUrl}
            alt="Logo"
            style={getLogoStyle(backLogoPlacement ?? "center", backLogoSize ?? 44)}
          />
        ) : (
          <div className="flex flex-col items-center gap-[3%]">
            <svg style={{ width: "13cqw", height: "13cqw" }} viewBox="0 0 40 40" fill="none">
              <path d="M1.875 30.199C1.875 25.3665 5.79251 21.449 10.625 21.449H23.4375C25.6812 21.449 27.5 19.6301 27.5 17.3865C27.5 15.1428 25.6812 13.324 23.4375 13.324H4.0625V8.94897H23.4375C28.0974 8.94897 31.875 12.7266 31.875 17.3865C31.875 22.0464 28.0974 25.824 23.4375 25.824H10.625C8.20875 25.824 6.25 27.7827 6.25 30.199V31.449H1.875V30.199Z" fill="white" />
              <path d="M34.2477 8.75089C36.6257 10.8686 38.1256 13.9518 38.1256 17.3866C38.1256 21.028 36.4401 24.2741 33.8092 26.3935L30.192 24.3046C32.6785 22.9974 34.3756 20.3908 34.3756 17.3866C34.3756 14.605 32.9203 12.1644 30.7311 10.7802L34.2477 8.75089Z" fill="#28DC4F" />
              <circle cx="23.125" cy="17.5" r="1.875" fill="#28DC4F" />
            </svg>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-text.svg"
              alt="TAPME LABS"
              style={{ width: "20%", height: "auto", filter: "brightness(0) invert(1)" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── star rating ────────────────────────────────────────────── */

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < full} half={i === full && hasHalf} />
      ))}
    </div>
  );
}

/* ─── logo upload zone ───────────────────────────────────────── */

function UploadZone({ file, onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const ref = useRef(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#374151]">Upload Logo</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) onChange(f);
        }}
        onClick={() => ref.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl py-5 transition-colors"
        style={{
          background: dragOver ? "#F0FFF4" : "#F9FAFB",
          border: `1.5px dashed ${dragOver ? "#28DC4F" : "#D1D5DB"}`,
        }}
      >
        <div className="text-[#9CA3AF]"><UploadIcon /></div>
        <p className="text-[13px] font-medium text-[#374151]">
          {file ? file.name : "Upload Logo"}
        </p>
        <p className="text-[11px] text-[#9CA3AF]">PNG or SVG</p>
        <input
          ref={ref}
          type="file"
          accept=".png,.svg"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}

/* ─── design upload zone ─────────────────────────────────────── */

function DesignUploadZone({ label, file, onChange, preview, required = false, error }) {
  const [dragOver, setDragOver] = useState(false);
  const ref = useRef(null);
  const isImage = file && (
    file.type?.startsWith("image/") ||
    /\.(png|jpg|jpeg|svg)$/i.test(file.name ?? "")
  );

  if (preview && isImage) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1">
          <span className="text-[13px] font-medium text-[#374151]">{label}</span>
          {required
            ? <span className="text-[#EF4444]">*</span>
            : <span className="ml-1 text-[11px] text-[#9CA3AF]">(optional)</span>}
        </div>
        <div
          className="relative overflow-hidden rounded-xl"
          style={{ aspectRatio: "5/3", border: "1px solid #F0F0F0", background: "#111" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          <button
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow"
            style={{ border: "1px solid #F0F0F0", color: "#EF4444" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="absolute bottom-2 left-2 max-w-[80%] truncate rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#6B7280] shadow"
            style={{ border: "1px solid #F0F0F0" }}
          >
            {file.name}
          </div>
        </div>
        {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
      </div>
    );
  }

  if (file && !isImage) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1">
          <span className="text-[13px] font-medium text-[#374151]">{label}</span>
          {required
            ? <span className="text-[#EF4444]">*</span>
            : <span className="ml-1 text-[11px] text-[#9CA3AF]">(optional)</span>}
        </div>
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: "#F9FAFB", border: "1px solid #F0F0F0" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-[13px] font-medium text-[#111827]">{file.name}</p>
            <p className="text-[11px] text-[#9CA3AF]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={() => onChange(null)} className="shrink-0 text-[12px] font-medium text-[#EF4444]">
            Remove
          </button>
        </div>
        {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <span className="text-[13px] font-medium text-[#374151]">{label}</span>
        {required
          ? <span className="text-[#EF4444]">*</span>
          : <span className="ml-1 text-[11px] text-[#9CA3AF]">(optional)</span>}
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) onChange(f);
        }}
        onClick={() => ref.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl py-7 transition-colors"
        style={{
          background: dragOver ? "#F0FFF4" : "#F9FAFB",
          border: `1.5px dashed ${error ? "#EF4444" : dragOver ? "#28DC4F" : "#D1D5DB"}`,
        }}
      >
        <div className="text-[#9CA3AF]"><UploadIcon /></div>
        <p className="text-[13px] font-medium text-[#374151]">Click or drag to upload</p>
        <p className="text-[11px] text-[#9CA3AF]">JPG, PNG, PDF, SVG · Max 20 MB</p>
        <input
          ref={ref}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.svg,image/jpeg,image/png,application/pdf,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            onChange(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-[12px] text-[#EF4444]">{error}</p>}
    </div>
  );
}

/* ─── expandable description ─────────────────────────────────── */

function ExpandableDescription({ text, className = "" }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  return (
    <div className={className}>
      <p className={`text-[14px] leading-relaxed text-[#6B7280] ${expanded ? "" : "line-clamp-2"}`}>
        {text}
      </p>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[#28DC4F]"
      >
        {expanded ? "Read less" : "Read more"}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M2 4l4 4 4-4" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* ─── section label ──────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">{children}</p>
  );
}

/* ─── main component ─────────────────────────────────────────── */

export default function ProductDetail({ product }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("front");

  const [designMethod, setDesignMethod] = useState("customize_online");

  const [uploadedFrontFile, setUploadedFrontFile] = useState(null);
  const [uploadedBackFile,  setUploadedBackFile]  = useState(null);
  const [uploadedFrontDataUrl, setUploadedFrontDataUrl] = useState(null);
  const [uploadedBackDataUrl,  setUploadedBackDataUrl]  = useState(null);

  const [name, setName] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const [selectedBackDesign, setSelectedBackDesign] = useState("brand-logo");
  const [backContent, setBackContent] = useState("logo");
  const [backLogoFile, setBackLogoFile] = useState(null);

  const [logoDataUrl,     setLogoDataUrl]     = useState(null);
  const [backLogoDataUrl, setBackLogoDataUrl] = useState(null);

  useEffect(() => {
    if (!logoFile) { setLogoDataUrl(null); return; }
    const reader = new FileReader();
    reader.onload = (e) => setLogoDataUrl(e.target.result);
    reader.readAsDataURL(logoFile);
  }, [logoFile]);

  useEffect(() => {
    if (!backLogoFile) { setBackLogoDataUrl(null); return; }
    const reader = new FileReader();
    reader.onload = (e) => setBackLogoDataUrl(e.target.result);
    reader.readAsDataURL(backLogoFile);
  }, [backLogoFile]);

  useEffect(() => {
    if (!uploadedFrontFile) { setUploadedFrontDataUrl(null); return; }
    const reader = new FileReader();
    reader.onload = (e) => setUploadedFrontDataUrl(e.target.result);
    reader.readAsDataURL(uploadedFrontFile);
  }, [uploadedFrontFile]);

  useEffect(() => {
    if (!uploadedBackFile) { setUploadedBackDataUrl(null); return; }
    const reader = new FileReader();
    reader.onload = (e) => setUploadedBackDataUrl(e.target.result);
    reader.readAsDataURL(uploadedBackFile);
  }, [uploadedBackFile]);

  const [logoPlacement,     setLogoPlacement]     = useState("top-left");
  const [backLogoPlacement, setBackLogoPlacement] = useState("center");
  const [logoSize,          setLogoSize]          = useState(44);
  const [backLogoSize,      setBackLogoSize]      = useState(44);

  const [qrFgColor, setQrFgColor] = useState("#18181B");

  const [frontQrEnabled,   setFrontQrEnabled]   = useState(false);
  const [frontQrPlacement, setFrontQrPlacement] = useState("bottom-right");
  const [frontQrColor,     setFrontQrColor]     = useState("#18181B");

  const [cardColor, setCardColor] = useState("#18181B");
  const [fontColor, setFontColor] = useState("#FFFFFF");

  const [errors, setErrors] = useState({});

  const frontBg = DEFAULT_BG;
  const backBg  = DEFAULT_BG;

  const isBack = activeTab === "back";

  function validate() {
    const errs = {};
    if (designMethod === "customize_online") {
      if (!name.trim()) errs.name = "Name is required.";
      if (!subTitle.trim()) errs.subTitle = "Sub Title is required.";
    } else {
      if (!uploadedFrontDataUrl) errs.uploadedFront = "Please upload your front design.";
    }
    return errs;
  }

  function handleBuyNow() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      if (designMethod === "customize_online" && errs.name && isBack) setActiveTab("front");
      return;
    }
    setErrors({});

    const checkoutItem = {
      id:           Date.now().toString(),
      productId:    product.id,
      productName:  product.name,
      productSlug:  product.slug,
      productImage: Array.isArray(product.images) ? product.images[0] : null,
      front_image:  product.front_image  || null,
      back_image:   product.back_image   || null,
      rawPrice:     product.rawPrice,
      rawSalePrice: product.rawSalePrice,
      design_method: designMethod,
      customization: designMethod === "customize_online" ? {
        name, subTitle, moreDetails, frontBg,
        logoDataUrl:      logoDataUrl     || null,
        logoPlacement, logoSize,
        frontQrEnabled, frontQrPlacement, frontQrColor,
        cardColor:  product.allowColorCustomization ? cardColor : null,
        fontColor:  product.allowColorCustomization ? fontColor : null,
        selectedBackDesign, backContent, backBg,
        backLogoDataUrl:  backLogoDataUrl || null,
        backLogoPlacement, backLogoSize, qrFgColor,
      } : null,
      uploaded_front_design: designMethod === "upload_own_design" ? (uploadedFrontDataUrl || null) : null,
      uploaded_back_design:  designMethod === "upload_own_design" ? (uploadedBackDataUrl  || null) : null,
      addedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("checkoutItem", JSON.stringify(checkoutItem));
    } catch { }

    const token = localStorage.getItem("customerToken");
    router.push(token ? "/checkout/shipping" : "/register?redirect=checkout");
  }

  /* ── card preview renderer ── */
  function renderCardPreview() {
    if (designMethod === "upload_own_design") {
      const src = isBack ? uploadedBackDataUrl : uploadedFrontDataUrl;
      if (src) {
        return (
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: "5/3", background: "#111" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={isBack ? "Back design" : "Front design"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        );
      }
      return (
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl"
          style={{ aspectRatio: "5/3", background: "#F3F4F6", border: "2px dashed #D1D5DB" }}
        >
          <div className="text-[#9CA3AF]"><UploadIcon /></div>
          <p className="text-[13px] text-[#9CA3AF]">
            {isBack ? "Back design not uploaded yet" : "Upload your front design below"}
          </p>
        </div>
      );
    }

    const frontSrc = product.front_image || product.images?.[0] || null;
    const backSrc  = product.back_image  || product.images?.[1] || product.images?.[0] || null;
    const activeSrc = isBack ? backSrc : frontSrc;

    if (activeSrc) {
      return (
        <CardMockupOverlay
          mockupSrc={activeSrc}
          alt={`${product.name} — ${isBack ? "back" : "front"}`}
          side={isBack ? "back" : "front"}
          customization={{
            name, subTitle, logoDataUrl, logoPlacement, logoSize,
            frontQrEnabled, frontQrPlacement, frontQrColor,
            cardColor: product.allowColorCustomization ? cardColor : null,
            fontColor: product.allowColorCustomization ? fontColor : null,
            backContent, backLogoDataUrl, backLogoPlacement, backLogoSize, qrFgColor,
          }}
        />
      );
    }

    return (
      <div style={{ perspective: "1200px" }}>
        <div
          style={{
            position: "relative", width: "100%", maxWidth: "420px",
            margin: "0 auto", aspectRatio: "460 / 276",
            transformStyle: "preserve-3d",
            transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
            transform: isBack ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FrontCardPreview
              bg={product.allowColorCustomization ? { type: "solid", color: cardColor } : frontBg}
              name={name} subTitle={subTitle}
              logoDataUrl={logoDataUrl} logoPlacement={logoPlacement} logoSize={logoSize}
              fontColor={product.allowColorCustomization ? fontColor : null}
            />
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BackSideCardPreview backContent={backContent} bg={backBg} backLogoDataUrl={backLogoDataUrl} backLogoPlacement={backLogoPlacement} backLogoSize={backLogoSize} qrFgColor={qrFgColor} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── STICKY MOBILE BUY BAR ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 border-t border-[#F0F0F0] bg-white px-4 py-3 lg:hidden"
        style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
      >
        <div className="flex-1 min-w-0">
          <p className="truncate text-[11px] text-[#9CA3AF]">{product.name}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-bold leading-none text-black">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[13px] text-[#BBBBBB] line-through">{product.originalPrice}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleBuyNow}
          className="shrink-0 rounded-xl px-6 py-3 text-[15px] font-bold text-black transition-opacity active:opacity-80"
          style={{ background: "#28DC4F" }}
        >
          Buy Now
        </button>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-28 pt-4 sm:px-6 lg:pb-12 lg:pt-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 hidden items-center gap-1 lg:flex">
          <Link href="/" className="text-[13px] text-[#9CA3AF] transition-colors hover:text-black">Home</Link>
          <ChevronRight />
          <Link href="/#products" className="text-[13px] text-[#9CA3AF] transition-colors hover:text-black">Products</Link>
          <ChevronRight />
          <span className="text-[11px] text-[#374151]">{product.name}</span>
        </nav>

        {/* ── MOBILE: name + price above preview ── */}
        <div className="mb-4 lg:hidden">
          <h1 className="text-[14px] font-bold leading-snug text-black">{product.name}</h1>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-[16px] font-bold text-black">{product.price}</span>
            {product.originalPrice && (
              <span className="text-[15px] text-[#BBBBBB] line-through">{product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="rounded-md bg-[#28DC4F]/10 px-2 py-0.5 text-[12px] font-semibold text-[#28DC4F]">
                {product.discount}
              </span>
            )}
          </div>
        </div>

        {/* ── MOBILE ONLY: sticky card preview ── */}
        <div className="sticky top-[70px] z-20 -mx-4 mb-4 overflow-hidden sm:-mx-6 lg:hidden" style={{ background: "#F3F4F6" }}>
          <div className="p-3 pb-0">{renderCardPreview()}</div>
          <div className="flex items-center justify-center border-t border-[#E5E7EB] px-4 py-2.5" style={{ background: "#F3F4F6" }}>
            <div className="flex rounded-xl p-1" style={{ background: "#E5E7EB" }}>
              {["front", "back"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="rounded-lg px-10 py-2 text-[13px] font-semibold transition-all"
                  style={{
                    background: activeTab === tab ? "#28DC4F" : "transparent",
                    color:      activeTab === tab ? "#000"    : "#9CA3AF",
                  }}
                >
                  {tab === "front" ? "Front" : "Back"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:w-[460px] lg:shrink-0">

            {/* Card preview box — desktop only */}
            <div className="hidden overflow-hidden rounded-2xl lg:block" style={{ background: "#F3F4F6" }}>
              <div className="p-3 pb-0">
                {renderCardPreview()}
              </div>

              {/* Front / Back tab */}
              <div className="flex items-center justify-center border-t border-[#E5E7EB] px-4 py-2.5" style={{ background: "#F3F4F6" }}>
                <div className="flex rounded-xl p-1" style={{ background: "#E5E7EB" }}>
                  {["front", "back"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="rounded-lg px-10 py-2 text-[13px] font-semibold transition-all"
                      style={{
                        background: activeTab === tab ? "#28DC4F" : "transparent",
                        color:      activeTab === tab ? "#000"    : "#9CA3AF",
                      }}
                    >
                      {tab === "front" ? "Front" : "Back"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DESKTOP: product info under preview */}
            <div className="hidden flex-col gap-3 lg:flex">
              <h1 className="text-[22px] font-bold leading-snug text-black">{product.name}</h1>

              {product.rating != null && (
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-[13px] text-[#6D6D6D]">{product.rating} ({product.reviewCount} reviews)</span>
                </div>
              )}

              <div className="flex items-baseline gap-2.5">
                <span className="text-[24px] font-bold text-black">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-[18px] text-[#BBBBBB] line-through">{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="rounded-md bg-[#28DC4F]/10 px-2 py-0.5 text-[13px] font-semibold text-[#28DC4F]">
                    {product.discount}
                  </span>
                )}
              </div>

              <div className="h-px bg-[#F0F0F0]" />
              <ExpandableDescription text={product.description} />
            </div>

            {/* Reviews — desktop only */}
            {product.reviews?.length > 0 && (
              <div className="hidden flex-col gap-4 lg:flex">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-semibold text-black">Reviews</h2>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={product.rating} />
                    <span className="text-[13px] text-[#6D6D6D]">{product.rating}/5</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {product.reviews.map((review) => (
                    <div key={review.name} className="rounded-xl border border-[#F0F0F0] bg-white p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#28DC4F] text-[13px] font-bold text-white">
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-semibold text-black">{review.name}</p>
                            <span className="text-[11px] text-[#9CA3AF]">{review.date}</span>
                          </div>
                          <p className="text-[11px] text-[#9CA3AF]">{review.role}</p>
                          <div className="mt-1"><StarRating rating={review.rating} /></div>
                          <p className="mt-1.5 text-[13px] leading-snug text-[#4B5563]">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-1 flex-col gap-3">

            {/* MOBILE: description */}
            <ExpandableDescription text={product.description} className="lg:hidden" />

            {/* ── DESIGN METHOD TOGGLE ── */}
            <div className="flex rounded-lg bg-[#F3F4F6] p-0.5">
              {[
                { value: "customize_online",  label: "Customize Online" },
                { value: "upload_own_design", label: "Upload My Design"  },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setDesignMethod(value); setErrors({}); }}
                  className="flex-1 rounded-md py-1.5 text-[12px] font-medium transition-all"
                  style={{
                    background: designMethod === value ? "#fff" : "transparent",
                    color:      designMethod === value ? "#111827" : "#9CA3AF",
                    boxShadow:  designMethod === value ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── CUSTOMIZE ONLINE ── */}
            {designMethod === "customize_online" && (
              <div className="flex flex-col gap-3">

                {/* Front side form */}
                {!isBack && (
                  <div className="flex flex-col gap-3">

                    {/* Card & font colour */}
                    {product.allowColorCustomization && (
                      <div className="flex flex-col gap-3 rounded-xl border border-[#F0F0F0] bg-white p-3.5">

                        {/* Card Colour */}
                        {(() => {
                          const isCustomCard = !CARD_COLORS.some((cc) => cc.color.toLowerCase() === cardColor.toLowerCase());
                          return (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <p className="text-[12px] font-medium text-[#374151]">
                                  Card Colour
                                  <span className="ml-2 text-[11px] text-[#9CA3AF]">
                                    {isCustomCard ? cardColor.toUpperCase() : (CARD_COLORS.find((cc) => cc.color.toLowerCase() === cardColor.toLowerCase())?.label ?? "")}
                                  </span>
                                </p>
                                <label
                                  title="Custom colour"
                                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1"
                                  style={{
                                    borderColor: isCustomCard ? "#28DC4F" : "#E5E7EB",
                                    background:  isCustomCard ? "#F0FFF4" : "transparent",
                                  }}
                                >
                                  <span className="inline-block h-3 w-3 rounded border border-black/10" style={{ background: cardColor }} />
                                  <span className="text-[11px] font-medium text-[#6B7280]">Custom</span>
                                  <input
                                    type="color"
                                    value={cardColor}
                                    onChange={(e) => setCardColor(e.target.value)}
                                    className="sr-only"
                                  />
                                </label>
                              </div>
                              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                                {CARD_COLORS.map((cc) => {
                                  const selected = cardColor.toLowerCase() === cc.color.toLowerCase();
                                  const isLight  = cc.color === "#F5F5F5";
                                  return (
                                    <button
                                      key={cc.id}
                                      type="button"
                                      title={cc.label}
                                      onClick={() => {
                                        setCardColor(cc.color);
                                        setFontColor(cc.color === "#F5F5F5" ? "#18181B" : "#FFFFFF");
                                      }}
                                      className="relative shrink-0 rounded-full transition-all"
                                      style={{
                                        width: "32px", height: "32px",
                                        background: cc.color,
                                        border: selected ? "2.5px solid #28DC4F" : "2px solid transparent",
                                        boxShadow: selected ? "0 0 0 1px #28DC4F" : "0 0 0 1px rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      {selected && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M2.5 7L5.5 10L11.5 4" stroke={isLight ? "#18181B" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Font Colour */}
                        {(() => {
                          const isCustomFont = !FONT_COLORS.some((fc) => fc.color.toLowerCase() === fontColor.toLowerCase());
                          return (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <p className="text-[12px] font-medium text-[#374151]">
                                  Text Colour
                                  <span className="ml-2 text-[11px] text-[#9CA3AF]">
                                    {isCustomFont ? fontColor.toUpperCase() : (FONT_COLORS.find((fc) => fc.color.toLowerCase() === fontColor.toLowerCase())?.label ?? "")}
                                  </span>
                                </p>
                                <label
                                  title="Custom text colour"
                                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1"
                                  style={{
                                    borderColor: isCustomFont ? "#28DC4F" : "#E5E7EB",
                                    background:  isCustomFont ? "#F0FFF4" : "transparent",
                                  }}
                                >
                                  <span className="inline-block h-3 w-3 rounded-full border border-black/10" style={{ background: fontColor }} />
                                  <span className="text-[11px] font-medium text-[#6B7280]">Custom</span>
                                  <input
                                    type="color"
                                    value={fontColor}
                                    onChange={(e) => setFontColor(e.target.value)}
                                    className="sr-only"
                                  />
                                </label>
                              </div>
                              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                                {FONT_COLORS.map((fc) => {
                                  const selected = fontColor.toLowerCase() === fc.color.toLowerCase();
                                  const isLight  = ["#ffffff", "#e2e8f0", "#f59e0b"].includes(fc.color.toLowerCase());
                                  return (
                                    <button
                                      key={fc.id}
                                      type="button"
                                      title={fc.label}
                                      onClick={() => setFontColor(fc.color)}
                                      className="relative h-8 w-8 shrink-0 rounded-full transition-all"
                                      style={{
                                        background: fc.color,
                                        border: selected ? "2.5px solid #28DC4F" : "2px solid rgba(0,0,0,0.12)",
                                        boxShadow: selected ? "0 0 0 2px #28DC4F" : "none",
                                      }}
                                    >
                                      {selected && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                            <path d="M2.5 7L5.5 10L11.5 4" stroke={isLight ? "#18181B" : "#fff"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Name fields */}
                    <div className="flex flex-col gap-3 rounded-xl border border-[#F0F0F0] bg-white p-3.5">
                      <SectionLabel>Your Details</SectionLabel>
                      {[
                        { label: "Name",         value: name,        setter: setName,        placeholder: "Jane Smith",                                  errorKey: "name"     },
                        { label: "Sub Title",    value: subTitle,    setter: setSubTitle,    placeholder: "e.g. Product Manager at Acme Co.",            errorKey: "subTitle" },
                        { label: "More Details", value: moreDetails, setter: setMoreDetails, placeholder: "e.g. +91 98765 43210",                       errorKey: null       },
                      ].map(({ label, value, setter, placeholder, errorKey }) => (
                        <div key={label} className="flex flex-col gap-1">
                          <label className="text-[12px] font-medium text-[#374151]">
                            {label}
                            {errorKey && <span className="ml-1 text-[#EF4444]">*</span>}
                          </label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                              setter(e.target.value);
                              if (errorKey && errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: "" }));
                            }}
                            placeholder={placeholder}
                            className="w-full rounded-xl px-3 text-[13px] text-black outline-none placeholder:text-[#C4C4C4] transition-colors"
                            style={{
                              height: "42px",
                              background: "#F9FAFB",
                              border: `1.5px solid ${errorKey && errors[errorKey] ? "#EF4444" : "#E5E7EB"}`,
                            }}
                          />
                          {errorKey && errors[errorKey] && (
                            <p className="text-[12px] text-[#EF4444]">{errors[errorKey]}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Logo upload */}
                    <div className="flex flex-col gap-3 rounded-xl border border-[#F0F0F0] bg-white p-3.5">
                      <SectionLabel>Logo (optional)</SectionLabel>
                      <UploadZone file={logoFile} onChange={setLogoFile} />

                      {logoDataUrl && (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={logoDataUrl}
                              alt="Logo preview"
                              className="rounded-lg border border-[#F0F0F0]"
                              style={{ height: "44px", maxWidth: "72px", objectFit: "contain" }}
                            />
                            <button
                              onClick={() => setLogoFile(null)}
                              className="rounded-lg border border-[#F0F0F0] px-3 py-1.5 text-[12px] font-medium text-[#EF4444]"
                            >
                              Remove
                            </button>
                          </div>
                          <LogoPlacementPicker value={logoPlacement} onChange={setLogoPlacement} />
                          <div className="flex items-center gap-3">
                            <span className="shrink-0 text-[13px] font-medium text-[#374151]">Logo Size</span>
                            <input
                              type="range" min={20} max={80} value={logoSize}
                              onChange={(e) => setLogoSize(Number(e.target.value))}
                              className="flex-1 accent-[#28DC4F]"
                            />
                            <span className="w-8 text-right text-[12px] text-[#9CA3AF]">{logoSize}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Front QR (optional) */}
                    <div className="rounded-xl bg-[#F9FAFB] p-4" style={{ border: "1px solid #F0F0F0" }}>
                      <button
                        type="button"
                        onClick={() => setFrontQrEnabled((v) => !v)}
                        className="flex w-full items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors"
                            style={{ borderColor: frontQrEnabled ? "#28DC4F" : "#D1D5DB" }}
                          >
                            {frontQrEnabled && <div className="h-2.5 w-2.5 rounded-full bg-[#28DC4F]" />}
                          </div>
                          <span className="text-[13px] font-medium text-[#374151]">Add QR Code on Front</span>
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: frontQrEnabled ? "#28DC4F" : "#9CA3AF" }}>
                          {frontQrEnabled ? "On" : "Off"}
                        </span>
                      </button>

                      {frontQrEnabled && (
                        <div className="mt-4 flex flex-col gap-3 border-t border-[#EBEBEB] pt-4">
                          <div className="flex flex-col gap-2">
                            <p className="text-[12px] font-medium text-[#374151]">QR Colour</p>
                            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                              {QR_COLORS.map((c) => {
                                const selected = frontQrColor === c.color;
                                const isLight  = c.color === "#28DC4F";
                                return (
                                  <button
                                    key={c.id}
                                    type="button"
                                    title={c.label}
                                    onClick={() => setFrontQrColor(c.color)}
                                    className="relative shrink-0 rounded-full transition-all"
                                    style={{
                                      width: "32px", height: "32px",
                                      background: c.color,
                                      border: selected ? "2px solid #28DC4F" : "2px solid transparent",
                                      boxShadow: selected ? "0 0 0 1px #28DC4F" : "0 0 0 1px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    {selected && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                          <path d="M2.5 7L5.5 10L11.5 4" stroke={isLight ? "#18181B" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <LogoPlacementPicker value={frontQrPlacement} onChange={setFrontQrPlacement} label="QR Placement" />
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {/* Back side form */}
                {isBack && (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                      <SectionLabel>Back Design</SectionLabel>
                      <div className="flex gap-3">
                        {BACK_DESIGN_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setSelectedBackDesign(opt.id);
                              setBackContent(opt.id === "qr-only" ? "qr" : "logo");
                            }}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div
                              className="overflow-hidden rounded-xl transition-all"
                              style={{
                                width: "88px", height: "54px",
                                border: selectedBackDesign === opt.id ? "2px solid #28DC4F" : "2px solid #E5E7EB",
                              }}
                            >
                              {opt.preview}
                            </div>
                            <span className="text-[12px] font-semibold" style={{ color: selectedBackDesign === opt.id ? "#28DC4F" : "#9CA3AF" }}>
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-[#F0F0F0]" />

                    <div className="flex flex-col gap-3">
                      <SectionLabel>Back Content</SectionLabel>
                      <div className="flex flex-col gap-1 overflow-hidden rounded-xl bg-[#F9FAFB]" style={{ border: "1px solid #F0F0F0" }}>
                        {[
                          { value: "logo", label: "Logo" },
                          { value: "qr",   label: "QR Code" },
                        ].map(({ value, label }) => (
                          <button
                            key={value}
                            onClick={() => setBackContent(value)}
                            className="flex items-center gap-3 px-4 py-3 transition-colors"
                            style={{ background: backContent === value ? "#fff" : "transparent" }}
                          >
                            <div
                              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                              style={{ borderColor: backContent === value ? "#28DC4F" : "#D1D5DB" }}
                            >
                              {backContent === value && <div className="h-2.5 w-2.5 rounded-full bg-[#28DC4F]" />}
                            </div>
                            <span className="text-[14px] text-[#374151]">{label}</span>
                          </button>
                        ))}
                      </div>

                      {backContent === "qr" && (
                        <div className="flex flex-col gap-2">
                          <p className="text-[13px] font-medium text-[#374151]">QR Colour</p>
                          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                            {QR_COLORS.map((c) => {
                              const selected = qrFgColor === c.color;
                              const isLight  = c.color === "#28DC4F";
                              return (
                                <button
                                  key={c.id}
                                  title={c.label}
                                  onClick={() => setQrFgColor(c.color)}
                                  className="relative shrink-0 rounded-full transition-all"
                                  style={{
                                    width: "32px", height: "32px",
                                    background: c.color,
                                    border: selected ? "2px solid #28DC4F" : "2px solid transparent",
                                    boxShadow: selected ? "0 0 0 1px #28DC4F" : "0 0 0 1px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  {selected && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                        <path d="M2.5 7L5.5 10L11.5 4" stroke={isLight ? "#18181B" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          <p className="text-[11px] text-[#9CA3AF]">
                            {QR_COLORS.find((c) => c.color === qrFgColor)?.label ?? "Black"}
                          </p>
                        </div>
                      )}

                      {backContent === "logo" && (
                        <>
                          <UploadZone file={backLogoFile} onChange={setBackLogoFile} />
                          {backLogoDataUrl && (
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={backLogoDataUrl}
                                  alt="Logo preview"
                                  className="rounded-lg border border-[#F0F0F0]"
                                  style={{ height: "44px", maxWidth: "72px", objectFit: "contain" }}
                                />
                                <button
                                  onClick={() => setBackLogoFile(null)}
                                  className="rounded-lg border border-[#F0F0F0] px-3 py-1.5 text-[12px] font-medium text-[#EF4444]"
                                >
                                  Remove
                                </button>
                              </div>
                              <LogoPlacementPicker value={backLogoPlacement} onChange={setBackLogoPlacement} />
                              <div className="flex items-center gap-3">
                                <span className="shrink-0 text-[13px] font-medium text-[#374151]">Logo Size</span>
                                <input
                                  type="range" min={20} max={80} value={backLogoSize}
                                  onChange={(e) => setBackLogoSize(Number(e.target.value))}
                                  className="flex-1 accent-[#28DC4F]"
                                />
                                <span className="w-8 text-right text-[12px] text-[#9CA3AF]">{backLogoSize}</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── UPLOAD OWN DESIGN ── */}
            {designMethod === "upload_own_design" && (
              <div className="flex flex-col gap-4">
                <SectionLabel>Upload Your Artwork</SectionLabel>

                <DesignUploadZone
                  label="Front Design"
                  file={uploadedFrontFile}
                  onChange={(f) => {
                    setUploadedFrontFile(f);
                    if (errors.uploadedFront) setErrors((prev) => ({ ...prev, uploadedFront: "" }));
                  }}
                  preview={uploadedFrontDataUrl}
                  required
                  error={errors.uploadedFront}
                />

                <DesignUploadZone
                  label="Back Design"
                  file={uploadedBackFile}
                  onChange={setUploadedBackFile}
                  preview={uploadedBackDataUrl}
                  required={false}
                />

                <div className="rounded-xl px-4 py-3" style={{ background: "rgba(40,220,79,0.06)", border: "1px solid rgba(40,220,79,0.2)" }}>
                  <p className="mb-1.5 text-[12px] font-semibold text-[#111827]">Print-ready artwork guidelines</p>
                  <ul className="flex flex-col gap-0.5 pl-4 text-[11px] leading-5 text-[#6B7280]" style={{ listStyleType: "disc" }}>
                    <li>Recommended: <strong>1200 × 720 px</strong> · Aspect ratio <strong>5:3</strong></li>
                    <li>High-res <strong>PNG or PDF</strong> preferred</li>
                    <li>Include at least 3 mm bleed on each edge</li>
                  </ul>
                </div>
              </div>
            )}

            {/* DESKTOP: Buy Now */}
            <div className="hidden lg:flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                className="w-full rounded-xl py-4 text-[16px] font-bold text-black transition-opacity hover:opacity-90 active:opacity-80"
                style={{ background: "#28DC4F" }}
              >
                Buy Now
              </button>

              <div className="flex items-center justify-center gap-5">
                {["Free Delivery", "Secure Payment", "Easy Returns"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1">
                    <CheckIcon />
                    <span className="text-[12px] text-[#9CA3AF]">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
