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
      <p className="text-[14px] font-medium text-[#1E1E1E]">{label}</p>
      <div className="grid grid-cols-3 gap-1 rounded-[10px] border border-[#F4F4F4] bg-[#FAFAFA] p-[6px]">
        {LOGO_PLACEMENTS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            title={p.label}
            className="flex items-center justify-center rounded-[7px] py-[9px] text-[15px] transition-all"
            style={{
              background: value === p.id ? "#18181B" : "transparent",
              color:      value === p.id ? "#28DC4F" : "#AEAEAE",
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

const WifiIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1 4.5C2.93 2.83 5.35 2 7 2C8.65 2 11.07 2.83 13 4.5" stroke="#28DC4F" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M3.2 6.7C4.38 5.63 5.66 5.1 7 5.1C8.34 5.1 9.62 5.63 10.8 6.7" stroke="#28DC4F" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="7" cy="9.5" r="1.2" fill="#28DC4F" />
  </svg>
);

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M5 3l4 4-4 4" />
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

      <div
        className="pointer-events-none absolute left-0 right-0"
        style={{ bottom: "16%", height: "1px", background: "rgba(255,255,255,0.06)" }}
      />

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
    <div className="flex flex-col gap-[6px]">
      <label className="text-[16px] font-medium text-black">Upload Logo</label>
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
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] py-6 transition-colors"
        style={{
          background: dragOver ? "#F0FFF4" : "#FAFAFA",
          border: `1.5px dashed ${dragOver ? "#28DC4F" : "#87909E"}`,
          minHeight: "119px",
        }}
      >
        <div className="text-black"><UploadIcon /></div>
        <p className="text-[14px] font-medium text-black">
          {file ? file.name : "Upload Logo"}
        </p>
        <p className="text-[10px] font-semibold text-[#6D6D6D]">
          Drag &amp; drop or Choose from file (png/svg)
        </p>
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
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-medium text-black">{label}</span>
          {required
            ? <span className="text-[#EF4444]">*</span>
            : <span className="ml-1 text-[11px] text-[#9CA3AF]">(optional)</span>}
        </div>
        <div
          className="relative overflow-hidden rounded-[12px]"
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
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center gap-1">
          <span className="text-[15px] font-medium text-black">{label}</span>
          {required
            ? <span className="text-[#EF4444]">*</span>
            : <span className="ml-1 text-[11px] text-[#9CA3AF]">(optional)</span>}
        </div>
        <div
          className="flex items-center gap-3 rounded-[10px] px-4 py-3"
          style={{ background: "#FAFAFA", border: "1px solid #F4F4F4" }}
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
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-center gap-1">
        <span className="text-[15px] font-medium text-black">{label}</span>
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
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] py-8 transition-colors"
        style={{
          background: dragOver ? "#F0FFF4" : "#FAFAFA",
          border: `1.5px dashed ${error ? "#EF4444" : dragOver ? "#28DC4F" : "#D1D5DB"}`,
          minHeight: "120px",
        }}
      >
        <div className="text-[#9CA3AF]"><UploadIcon /></div>
        <p className="text-[14px] font-medium text-[#111827]">Click or drag to upload</p>
        <p className="px-6 text-center text-[11px] text-[#9CA3AF]">JPG, PNG, PDF, SVG · Max 20 MB</p>
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

/* ─── main component ─────────────────────────────────────────── */

export default function ProductDetail({ product }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("front");

  /* design method */
  const [designMethod, setDesignMethod] = useState("customize_online");

  /* uploaded design files (upload_own_design) */
  const [uploadedFrontFile, setUploadedFrontFile] = useState(null);
  const [uploadedBackFile,  setUploadedBackFile]  = useState(null);
  const [uploadedFrontDataUrl, setUploadedFrontDataUrl] = useState(null);
  const [uploadedBackDataUrl,  setUploadedBackDataUrl]  = useState(null);

  /* front-side state */
  const [name, setName] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [moreDetails, setMoreDetails] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  /* back-side state */
  const [selectedBackDesign, setSelectedBackDesign] = useState("brand-logo");
  const [backContent, setBackContent] = useState("logo");
  const [backLogoFile, setBackLogoFile] = useState(null);

  /* logo data URLs */
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

  /* logo placement and size */
  const [logoPlacement,     setLogoPlacement]     = useState("top-left");
  const [backLogoPlacement, setBackLogoPlacement] = useState("center");
  const [logoSize,          setLogoSize]          = useState(44);
  const [backLogoSize,      setBackLogoSize]      = useState(44);

  /* QR code foreground color */
  const [qrFgColor, setQrFgColor] = useState("#18181B");

  /* Front-side optional QR code */
  const [frontQrEnabled,   setFrontQrEnabled]   = useState(false);
  const [frontQrPlacement, setFrontQrPlacement] = useState("bottom-right");
  const [frontQrColor,     setFrontQrColor]     = useState("#18181B");

  /* Card & font colour customization */
  const [cardColor, setCardColor] = useState("#18181B");
  const [fontColor, setFontColor] = useState("#FFFFFF");

  /* form validation errors */
  const [errors, setErrors] = useState({});

  /* background — fixed default */
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
        name,
        subTitle,
        moreDetails,
        frontBg,
        logoDataUrl:      logoDataUrl     || null,
        logoPlacement,
        logoSize,
        frontQrEnabled,
        frontQrPlacement,
        frontQrColor,
        cardColor:  product.allowColorCustomization ? cardColor : null,
        fontColor:  product.allowColorCustomization ? fontColor : null,
        selectedBackDesign,
        backContent,
        backBg,
        backLogoDataUrl:  backLogoDataUrl || null,
        backLogoPlacement,
        backLogoSize,
        qrFgColor,
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

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1440px] px-4 py-6 md:px-[120px]">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1">
          <Link href="/" className="text-[14px] font-normal text-[#7F7F7F] transition-colors hover:text-black">
            Home
          </Link>
          <ChevronRight />
          <Link href="/#products" className="text-[14px] font-normal text-[#7F7F7F] transition-colors hover:text-black">
            Products
          </Link>
          <ChevronRight />
          <span className="text-[14px] font-medium text-[#4B5563]">{product.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-[30px]">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-6 lg:w-[580px] lg:shrink-0">

            {/* Card image area */}
            <div className="overflow-hidden rounded-[20px] bg-[#F5F5F5]">

              {/* Mockup / uploaded design preview */}
              <div className="px-6 py-8">
                {designMethod === "upload_own_design" ? (
                  (() => {
                    const src = isBack ? uploadedBackDataUrl : uploadedFrontDataUrl;
                    if (src) {
                      return (
                        <div
                          className="overflow-hidden rounded-[14px] shadow-xl"
                          style={{ aspectRatio: "5/3", background: "#111" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={isBack ? "Back design" : "Front design"}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        </div>
                      );
                    }
                    return (
                      <div
                        className="flex flex-col items-center justify-center rounded-[14px]"
                        style={{ aspectRatio: "5/3", background: "#EBEBEB", border: "2px dashed #D1D5DB" }}
                      >
                        <div className="text-center text-[#9CA3AF]">
                          <div className="mb-2 flex justify-center"><UploadIcon /></div>
                          <p className="text-[13px]">
                            {isBack ? "Back design not uploaded yet" : "Upload your front design →"}
                          </p>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  (() => {
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
                            name,
                            subTitle,
                            logoDataUrl,
                            logoPlacement,
                            logoSize,
                            frontQrEnabled,
                            frontQrPlacement,
                            frontQrColor,
                            cardColor: product.allowColorCustomization ? cardColor : null,
                            fontColor: product.allowColorCustomization ? fontColor : null,
                            backContent,
                            backLogoDataUrl,
                            backLogoPlacement,
                            backLogoSize,
                            qrFgColor,
                          }}
                        />
                      );
                    }

                    return (
                      <div style={{ perspective: "1200px" }}>
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "420px",
                            margin: "0 auto",
                            aspectRatio: "460 / 276",
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
                  })()
                )}
              </div>

              {/* Front / Back tabs */}
              <div className="flex border-t border-[#EBEBEB]">
                {["front", "back"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex flex-1 items-center justify-center py-[11px] text-[16px] font-medium transition-all duration-300"
                    style={{
                      background: activeTab === tab ? "#18181B" : "transparent",
                      color:      activeTab === tab ? "#fff"    : "#18181B",
                    }}
                  >
                    {tab === "front" ? "Front Side" : "Back Side"}
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-[28px] font-semibold leading-tight text-black">{product.name}</h1>
                <p className="text-[14px] font-normal text-[#999999]">{product.variant}</p>
              </div>

              {product.rating != null && (
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} />
                  <span className="text-[14px] font-normal text-[#6D6D6D]">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="text-[30px] font-semibold leading-none text-black">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-[20px] font-normal text-[#BBBBBB] line-through">{product.originalPrice}</span>
                )}
                {product.discount && (
                  <span className="rounded-[6px] bg-[#28DC4F]/10 px-2 py-[3px] text-[14px] font-medium text-[#28DC4F]">
                    {product.discount}
                  </span>
                )}
              </div>

              <div className="h-px bg-[#EBEBEB]" />

              <div className="flex flex-col gap-4">
                <p className="text-[16px] font-normal leading-[26px] text-[#555555]">{product.description}</p>

                {product.features?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((f) => (
                      <span key={f} className="flex items-center gap-[6px] rounded-[8px] bg-[#F5F5F5] px-3 py-[7px] text-[14px] font-normal text-[#444444]">
                        <CheckIcon />{f}
                      </span>
                    ))}
                  </div>
                )}

                {product.nfcNote && (
                  <div className="flex items-start gap-3 rounded-[10px] px-4 py-3" style={{ background: "#F8FAF8", border: "1px solid #28DC4F" }}>
                    <WifiIcon />
                    <p className="text-[13px] font-normal text-[#444444]">{product.nfcNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            {product.reviews?.length > 0 && (
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-semibold text-black">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <StarRating rating={product.rating} />
                    <span className="text-[14px] text-[#6D6D6D]">{product.rating} / 5</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {product.reviews.map((review) => (
                    <div key={review.name} className="rounded-[12px] border border-[#F0F0F0] bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#28DC4F] text-[15px] font-bold text-white">
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[14px] font-semibold text-[#111827]">{review.name}</p>
                            <span className="text-[12px] text-[#9CA3AF]">{review.date}</span>
                          </div>
                          <p className="text-[12px] text-[#9CA3AF]">{review.role}</p>
                          <div className="mt-1"><StarRating rating={review.rating} /></div>
                          <p className="mt-2 text-[14px] font-normal leading-[22px] text-[#4B5563]">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full rounded-[10px] border border-[#EBEBEB] py-3 text-[14px] font-medium text-[#6D6D6D] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F]">
                  See More Reviews
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex flex-1 flex-col gap-4">

            {/* Design method selector */}
            <div className="rounded-[16px] border border-[#F0F0F0] bg-white p-6 shadow-sm">
              <p className="mb-3 text-[15px] font-semibold text-[#111827]">How do you want to design your card?</p>
              <div className="flex flex-col gap-1 rounded-[10px] p-1" style={{ background: "#FAFAFA", border: "1px solid #F4F4F4" }}>
                {[
                  { value: "customize_online",  label: "Customize Online",    desc: "Use our built-in editor to personalise your card" },
                  { value: "upload_own_design",  label: "Upload My Own Design", desc: "Upload your own print-ready artwork file" },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => { setDesignMethod(value); setErrors({}); }}
                    className="flex items-start gap-3 rounded-[8px] px-3 py-[10px] text-left transition-colors"
                    style={{ background: designMethod === value ? "#fff" : "transparent" }}
                  >
                    <div
                      className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                      style={{ borderColor: designMethod === value ? "#28DC4F" : "#D1D5DB" }}
                    >
                      {designMethod === value && <div className="h-[8px] w-[8px] rounded-full bg-[#28DC4F]" />}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-[#1E1E1E]">{label}</p>
                      <p className="mt-0.5 text-[12px] text-[#9CA3AF]">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── CUSTOMIZE ONLINE FORMS ── */}
            {designMethod === "customize_online" && (
              <div style={{ position: "relative" }}>

                {/* FRONT SIDE FORM */}
                <div
                  className="rounded-[16px] border border-[#F0F0F0] bg-white p-6 shadow-sm transition-all duration-500"
                  style={{
                    position:      isBack ? "absolute" : "relative",
                    width:         "100%",
                    top:           0,
                    opacity:       isBack ? 0 : 1,
                    pointerEvents: isBack ? "none" : "auto",
                    transform:     isBack ? "translateX(-12px)" : "translateX(0)",
                    visibility:    isBack ? "hidden" : "visible",
                  }}
                >
                  <div className="flex flex-col gap-4">

                    {product.allowColorCustomization && (
                      <div className="flex flex-col gap-4 rounded-[12px] border border-[#F4F4F4] bg-[#FAFAFA] p-4">

                        {/* Card Colour */}
                        {(() => {
                          const isCustomCard = !CARD_COLORS.some((cc) => cc.color.toLowerCase() === cardColor.toLowerCase());
                          return (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[15px] font-semibold text-black">Card Colour</p>
                                <label
                                  title="Pick a custom card colour"
                                  className="flex cursor-pointer items-center gap-[6px] rounded-[8px] border px-2 py-1 transition-colors hover:bg-[#F0F0F0]"
                                  style={{
                                    borderColor: isCustomCard ? "#28DC4F" : "#EBEBEB",
                                    background:  isCustomCard ? "#F0FFF4" : "transparent",
                                  }}
                                >
                                  <span
                                    className="inline-block h-4 w-4 rounded-[4px] border border-black/10"
                                    style={{ background: cardColor }}
                                  />
                                  <span className="text-[11px] font-medium text-[#6D6D6D]">
                                    {isCustomCard ? cardColor.toUpperCase() : "Custom"}
                                  </span>
                                  <input
                                    type="color"
                                    value={cardColor}
                                    onChange={(e) => setCardColor(e.target.value)}
                                    className="sr-only"
                                  />
                                </label>
                              </div>

                              <div className="grid grid-cols-5 gap-2">
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
                                        if (cc.color === "#F5F5F5") setFontColor("#18181B");
                                        else setFontColor("#FFFFFF");
                                      }}
                                      className="relative rounded-[8px] transition-all"
                                      style={{
                                        height: "36px",
                                        background: cc.color,
                                        border: selected ? "2px solid #28DC4F" : "2px solid transparent",
                                        boxShadow: selected ? "0 0 0 1px #28DC4F" : "0 0 0 1px rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      {selected && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                            <path d="M2.5 7L5.5 10L11.5 4" stroke={isLight ? "#18181B" : "#fff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        </div>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              <p className="text-[11px] text-[#9CA3AF]">
                                {isCustomCard
                                  ? `Custom · ${cardColor.toUpperCase()}`
                                  : (CARD_COLORS.find((cc) => cc.color.toLowerCase() === cardColor.toLowerCase())?.label ?? "Matte Black")}
                              </p>
                            </div>
                          );
                        })()}

                        {/* Font Colour */}
                        {(() => {
                          const isCustomFont = !FONT_COLORS.some((fc) => fc.color.toLowerCase() === fontColor.toLowerCase());
                          return (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[14px] font-medium text-black">Text Colour</p>
                                <label
                                  title="Pick a custom text colour"
                                  className="flex cursor-pointer items-center gap-[6px] rounded-[8px] border px-2 py-1 transition-colors hover:bg-[#F0F0F0]"
                                  style={{
                                    borderColor: isCustomFont ? "#28DC4F" : "#EBEBEB",
                                    background:  isCustomFont ? "#F0FFF4" : "transparent",
                                  }}
                                >
                                  <span
                                    className="inline-block h-4 w-4 rounded-full border border-black/10"
                                    style={{ background: fontColor }}
                                  />
                                  <span className="text-[11px] font-medium text-[#6D6D6D]">
                                    {isCustomFont ? fontColor.toUpperCase() : "Custom"}
                                  </span>
                                  <input
                                    type="color"
                                    value={fontColor}
                                    onChange={(e) => setFontColor(e.target.value)}
                                    className="sr-only"
                                  />
                                </label>
                              </div>

                              <div className="flex gap-2">
                                {FONT_COLORS.map((fc) => {
                                  const selected = fontColor.toLowerCase() === fc.color.toLowerCase();
                                  const isLight  = ["#ffffff", "#e2e8f0", "#f59e0b"].includes(fc.color.toLowerCase());
                                  return (
                                    <button
                                      key={fc.id}
                                      type="button"
                                      title={fc.label}
                                      onClick={() => setFontColor(fc.color)}
                                      className="relative h-9 w-9 rounded-full transition-all"
                                      style={{
                                        background: fc.color,
                                        border: selected ? "2px solid #28DC4F" : "2px solid rgba(0,0,0,0.12)",
                                        boxShadow: selected ? "0 0 0 2px #28DC4F" : "none",
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
                                {isCustomFont
                                  ? `Custom · ${fontColor.toUpperCase()}`
                                  : (FONT_COLORS.find((fc) => fc.color.toLowerCase() === fontColor.toLowerCase())?.label ?? "White")}
                              </p>
                            </div>
                          );
                        })()}

                      </div>
                    )}

                    {[
                      { label: "Name",         value: name,        setter: setName,        placeholder: "Jane Smith",                                         errorKey: "name"     },
                      { label: "Sub Title",    value: subTitle,    setter: setSubTitle,    placeholder: "e.g. Phone Number, Job Title or Company Name",        errorKey: "subTitle" },
                      { label: "More Details", value: moreDetails, setter: setMoreDetails, placeholder: "e.g. Phone Number, Job Title or Company Name",        errorKey: null       },
                    ].map(({ label, value, setter, placeholder, errorKey }) => (
                      <div key={label} className="flex flex-col gap-[6px]">
                        <label className="text-[16px] font-medium text-black">
                          {label}
                          {errorKey && <span className="ml-1 text-[#EF4444]">*</span>}
                        </label>
                        <div
                          className="flex items-center rounded-[10px] px-4 py-[10px]"
                          style={{
                            background: "#FAFAFA",
                            border: `1px solid ${errorKey && errors[errorKey] ? "#EF4444" : "#F4F4F4"}`,
                          }}
                        >
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                              setter(e.target.value);
                              if (errorKey && errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: "" }));
                            }}
                            placeholder={placeholder}
                            className="w-full bg-transparent text-[14px] text-black outline-none placeholder:text-[#AEAEAE]"
                          />
                        </div>
                        {errorKey && errors[errorKey] && (
                          <p className="text-[12px] text-[#EF4444]">{errors[errorKey]}</p>
                        )}
                      </div>
                    ))}

                    <UploadZone file={logoFile} onChange={setLogoFile} />

                    {logoDataUrl && (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logoDataUrl}
                            alt="Logo preview"
                            className="rounded-[8px] border border-[#F0F0F0]"
                            style={{ height: "48px", maxWidth: "80px", objectFit: "contain" }}
                          />
                          <button
                            onClick={() => { setLogoFile(null); }}
                            className="rounded-[8px] border border-[#EBEBEB] px-3 py-[6px] text-[12px] font-medium text-[#EF4444] transition-colors hover:border-[#EF4444]"
                          >
                            Remove
                          </button>
                        </div>
                        <LogoPlacementPicker value={logoPlacement} onChange={setLogoPlacement} />
                        <div className="flex items-center gap-3">
                          <span className="shrink-0 text-[14px] font-medium text-[#1E1E1E]">Logo Size</span>
                          <input
                            type="range"
                            min={20}
                            max={80}
                            value={logoSize}
                            onChange={(e) => setLogoSize(Number(e.target.value))}
                            className="flex-1 accent-[#28DC4F]"
                          />
                          <span className="w-9 text-right text-[12px] text-[#9CA3AF]">{logoSize}px</span>
                        </div>
                      </div>
                    )}

                    {/* Front QR Code (optional) */}
                    <div className="flex flex-col gap-3 rounded-[12px] border border-[#F4F4F4] bg-[#FAFAFA] p-4">
                      <button
                        type="button"
                        onClick={() => setFrontQrEnabled((v) => !v)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                            style={{ borderColor: frontQrEnabled ? "#28DC4F" : "#D1D5DB" }}
                          >
                            {frontQrEnabled && <div className="h-[8px] w-[8px] rounded-full bg-[#28DC4F]" />}
                          </div>
                          <span className="text-[14px] font-medium text-[#1E1E1E]">Add QR Code on Front</span>
                        </div>
                        <span className="text-[11px] font-medium" style={{ color: frontQrEnabled ? "#28DC4F" : "#9CA3AF" }}>
                          {frontQrEnabled ? "On" : "Off"}
                        </span>
                      </button>

                      {frontQrEnabled && (
                        <div className="flex flex-col gap-3 pt-1">
                          <div className="flex flex-col gap-2">
                            <p className="text-[13px] font-medium text-[#1E1E1E]">QR Code Colour</p>
                            <div className="grid grid-cols-5 gap-2">
                              {QR_COLORS.map((c) => {
                                const selected = frontQrColor === c.color;
                                const isLight  = c.color === "#28DC4F";
                                return (
                                  <button
                                    key={c.id}
                                    type="button"
                                    title={c.label}
                                    onClick={() => setFrontQrColor(c.color)}
                                    className="relative rounded-[8px] transition-all"
                                    style={{
                                      height: "32px",
                                      background: c.color,
                                      border: selected ? "2px solid #28DC4F" : "2px solid transparent",
                                      boxShadow: selected ? "0 0 0 1px #28DC4F" : "none",
                                    }}
                                  >
                                    {selected && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                          <path d="M2.5 7L5.5 10L11.5 4" stroke={isLight ? "#18181B" : "#fff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[11px] text-[#9CA3AF]">
                              {QR_COLORS.find((c) => c.color === frontQrColor)?.label ?? "Black"}
                            </p>
                          </div>
                          <LogoPlacementPicker value={frontQrPlacement} onChange={setFrontQrPlacement} label="QR Code Placement" />
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* BACK SIDE FORM */}
                <div
                  className="rounded-[16px] border border-[#F0F0F0] bg-white p-6 shadow-sm transition-all duration-500"
                  style={{
                    position:      isBack ? "relative" : "absolute",
                    width:         "100%",
                    top:           0,
                    opacity:       isBack ? 1 : 0,
                    pointerEvents: isBack ? "auto" : "none",
                    transform:     isBack ? "translateX(0)" : "translateX(12px)",
                    visibility:    isBack ? "visible" : "hidden",
                  }}
                >
                  <div className="flex flex-col gap-3">
                    <p className="text-[16px] font-medium text-[#1E1E1E]">Choose Back Design</p>
                    <div className="flex gap-3">
                      {BACK_DESIGN_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSelectedBackDesign(opt.id);
                            setBackContent(opt.id === "qr-only" ? "qr" : "logo");
                          }}
                          className="flex flex-col items-center gap-1"
                        >
                          <div
                            className="overflow-hidden rounded-[8px] transition-all"
                            style={{
                              width: "90px", height: "56px",
                              border: selectedBackDesign === opt.id ? "2px solid #28DC4F" : "2px solid #EBEBEB",
                            }}
                          >
                            {opt.preview}
                          </div>
                          <span className="text-[12px] font-medium" style={{ color: selectedBackDesign === opt.id ? "#28DC4F" : "#6D6D6D" }}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="my-5 h-px bg-[#F4F4F4]" />

                  <div className="flex flex-col gap-3">
                    <p className="text-[16px] font-medium text-[#1E1E1E]">Back Content</p>

                    <div className="flex flex-col gap-2 rounded-[10px] p-1" style={{ background: "#FAFAFA", border: "1px solid #F4F4F4" }}>
                      {[
                        { value: "logo", label: "Logo" },
                        { value: "qr",   label: "Place QR Code" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setBackContent(value)}
                          className="flex items-center gap-3 rounded-[8px] px-3 py-[10px] transition-colors"
                          style={{ background: backContent === value ? "#fff" : "transparent" }}
                        >
                          <div
                            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                            style={{ borderColor: backContent === value ? "#28DC4F" : "#D1D5DB" }}
                          >
                            {backContent === value && <div className="h-[8px] w-[8px] rounded-full bg-[#28DC4F]" />}
                          </div>
                          <span className="text-[14px] font-normal text-[#1E1E1E]">{label}</span>
                        </button>
                      ))}
                    </div>

                    {backContent === "qr" && (
                      <div className="flex flex-col gap-2">
                        <p className="text-[14px] font-medium text-[#1E1E1E]">QR Code Colour</p>
                        <div className="grid grid-cols-5 gap-2">
                          {QR_COLORS.map((c) => {
                            const selected = qrFgColor === c.color;
                            const isLight  = c.color === "#28DC4F";
                            return (
                              <button
                                key={c.id}
                                title={c.label}
                                onClick={() => setQrFgColor(c.color)}
                                className="relative rounded-[8px] transition-all"
                                style={{
                                  height: "36px",
                                  background: c.color,
                                  border: selected ? "2px solid #28DC4F" : "2px solid transparent",
                                  boxShadow: selected ? "0 0 0 1px #28DC4F" : "none",
                                }}
                              >
                                {selected && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                      <path d="M2.5 7L5.5 10L11.5 4" stroke={isLight ? "#18181B" : "#fff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
                                className="rounded-[8px] border border-[#F0F0F0]"
                                style={{ height: "48px", maxWidth: "80px", objectFit: "contain" }}
                              />
                              <button
                                onClick={() => { setBackLogoFile(null); }}
                                className="rounded-[8px] border border-[#EBEBEB] px-3 py-[6px] text-[12px] font-medium text-[#EF4444] transition-colors hover:border-[#EF4444]"
                              >
                                Remove
                              </button>
                            </div>
                            <LogoPlacementPicker value={backLogoPlacement} onChange={setBackLogoPlacement} />
                            <div className="flex items-center gap-3">
                              <span className="shrink-0 text-[14px] font-medium text-[#1E1E1E]">Logo Size</span>
                              <input
                                type="range"
                                min={20}
                                max={80}
                                value={backLogoSize}
                                onChange={(e) => setBackLogoSize(Number(e.target.value))}
                                className="flex-1 accent-[#28DC4F]"
                              />
                              <span className="w-9 text-right text-[12px] text-[#9CA3AF]">{backLogoSize}px</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── UPLOAD OWN DESIGN FORM ── */}
            {designMethod === "upload_own_design" && (
              <div className="rounded-[16px] border border-[#F0F0F0] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5">

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

                  {/* Print-ready guidelines */}
                  <div
                    className="rounded-[12px] px-4 py-4"
                    style={{ background: "rgba(40,220,79,0.06)", border: "1px solid rgba(40,220,79,0.2)" }}
                  >
                    <p className="mb-2 text-[13px] font-semibold text-[#111827]">
                      Please upload a print-ready design in the correct card size.
                    </p>
                    <ul className="flex flex-col gap-1 pl-4 text-[12px] leading-[20px] text-[#6B7280]" style={{ listStyleType: "disc" }}>
                      <li>Recommended size: <strong>1200 × 720 px</strong></li>
                      <li>Aspect ratio: <strong>5:3</strong></li>
                      <li>High resolution <strong>PNG or PDF</strong> preferred</li>
                      <li>Include at least 3 mm bleed on each edge</li>
                    </ul>
                  </div>

                </div>
              </div>
            )}

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="block w-full rounded-[10px] py-[13px] text-center text-[16px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
              style={{ background: "#28DC4F" }}
            >
              Buy Now
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2">
              {["Free Delivery", "Secure Payment", "Easy Returns"].map((badge) => (
                <div key={badge} className="flex items-center gap-1">
                  <CheckIcon />
                  <span className="text-[13px] text-[#6D6D6D]">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
