"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CardMockupOverlay, { QrSvg } from "./CardMockupOverlay";
import { extractSvgColors, replaceSvgColors } from "@/utils/svgColorUtils";
import orderService from "@/services/orderService";

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

function LogoPlacementPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {LOGO_PLACEMENTS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          title={p.label}
          className="flex items-center justify-center rounded-full transition-all"
          style={{
            width: 20, height: 20,
            background: value === p.id ? "#28DC4F" : "#E5E7EB",
            boxShadow: value === p.id ? "0 0 0 2px white, 0 0 0 4px #28DC4F" : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ─── front card preview ──────────────────────────────────────── */

function FrontCardPreview({ bg, name, subTitle, logoDataUrl, logoPlacement, logoSize, fontColor, skinSvgContent = null }) {
  const light = isLightBg(bg);
  const tc     = fontColor || (light ? "rgba(0,0,0,0.85)"  : "rgba(255,255,255,0.9)");
  const stc    = fontColor ? `${fontColor}CC` : (light ? "rgba(0,0,0,0.45)"  : "rgba(255,255,255,0.45)");
  const lMain  = light ? "#000000"            : "#ffffff";
  const arc    = light ? "rgba(0,0,0,0.2)"   : "rgba(255,255,255,0.25)";
  const ring   = (o) => light ? `rgba(0,0,0,${o})` : `rgba(255,255,255,${o})`;
  const dm     = light ? "#000" : "#fff";

  const isSkinBg = !!skinSvgContent;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "100%",
        maxWidth: "420px",
        aspectRatio: "1012 / 638",
        borderRadius: "14px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        ...getBgStyle(bg),
      }}
    >
      {isSkinBg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(skinSvgContent)}`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
      )}

      {!isSkinBg && (
        <>
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
        </>
      )}

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

const QR_STYLES = [
  { id: "minimal",    label: "Minimal"    },
  { id: "futuristic", label: "Futuristic" },
  { id: "glass",      label: "Glass"      },
  { id: "editorial",  label: "Editorial"  },
  { id: "creative",   label: "Creative"   },
];

const CARD_COLORS = [
  { id: "matte-black", label: "Matte Black", color: "#18181B" },
  { id: "white",       label: "White",       color: "#F8F8F8" },
  { id: "navy",        label: "Navy",        color: "#1B2B4B" },
  { id: "emerald",     label: "Emerald",     color: "#064E3B" },
  { id: "silver",      label: "Silver",      color: "#6B7280" },
  { id: "gold",        label: "Gold",        color: "#92700A" },
  { id: "rose-gold",   label: "Rose Gold",   color: "#C9856C" },
];

const ACCENT_COLORS = [
  { id: "gold",      label: "Gold",      color: "#D4AF37" },
  { id: "silver",    label: "Silver",    color: "#C0C0C0" },
  { id: "green",     label: "Green",     color: "#28DC4F" },
  { id: "blue",      label: "Blue",      color: "#3B82F6" },
  { id: "rose-gold", label: "Rose Gold", color: "#E8A598" },
  { id: "white",     label: "White",     color: "#FFFFFF" },
  { id: "black",     label: "Black",     color: "#18181B" },
];

const FONT_OPTIONS = [
  { id: "default",    label: "Default",           family: "sans-serif",                              url: null },
  { id: "inter",      label: "Inter",              family: "'Inter', sans-serif",                     url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" },
  { id: "poppins",    label: "Poppins",            family: "'Poppins', sans-serif",                   url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" },
  { id: "montserrat", label: "Montserrat",         family: "'Montserrat', sans-serif",                url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" },
  { id: "raleway",    label: "Raleway",            family: "'Raleway', sans-serif",                   url: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap" },
  { id: "josefin",    label: "Josefin Sans",       family: "'Josefin Sans', sans-serif",              url: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap" },
  { id: "space",      label: "Space Grotesk",      family: "'Space Grotesk', sans-serif",             url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&display=swap" },
  { id: "oswald",     label: "Oswald",             family: "'Oswald', sans-serif",                    url: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;600&display=swap" },
  { id: "bebas",      label: "Bebas Neue",         family: "'Bebas Neue', sans-serif",                url: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" },
  { id: "playfair",   label: "Playfair Display",   family: "'Playfair Display', serif",               url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" },
  { id: "cormorant",  label: "Cormorant",          family: "'Cormorant Garamond', serif",             url: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap" },
  { id: "cinzel",     label: "Cinzel",             family: "'Cinzel', serif",                         url: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap" },
  { id: "dmserif",    label: "DM Serif",           family: "'DM Serif Display', serif",               url: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap" },
  { id: "abril",      label: "Abril Fatface",      family: "'Abril Fatface', serif",                  url: "https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap" },
];

const FONT_COLORS = [
  { id: "white",  label: "White",  color: "#FFFFFF" },
  { id: "black",  label: "Black",  color: "#18181B" },
  { id: "gold",   label: "Gold",   color: "#D4AF37" },
  { id: "silver", label: "Silver", color: "#C0C0C0" },
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

/* ─── custom colour swatch ───────────────────────────────────── */

function CustomColorSwatch({ value, onChange, presets }) {
  const ref = useRef(null);
  const isCustom = !presets.some((p) => p.toLowerCase() === value.toLowerCase());
  return (
    <button
      type="button"
      title="Custom color"
      onClick={() => ref.current?.click()}
      className="relative shrink-0 rounded-full overflow-hidden transition-all"
      style={{
        width: 36, height: 36,
        background: isCustom
          ? value
          : "conic-gradient(red 0deg,yellow 60deg,lime 120deg,aqua 180deg,blue 240deg,magenta 300deg,red 360deg)",
        boxShadow: isCustom
          ? `0 0 0 2.5px white, 0 0 0 4.5px ${value}`
          : "0 0 0 1px rgba(0,0,0,0.12)",
      }}
    >
      {!isCustom && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.18)" }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      <input
        ref={ref}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ position: "absolute", inset: 0, opacity: 0, width: "100%", height: "100%", cursor: "pointer", border: "none", padding: 0 }}
      />
    </button>
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
  const [qrStyle,          setQrStyle]          = useState("minimal");

  const [cardColor,       setCardColor]       = useState("#18181B");
  const [accentColor,     setAccentColor]     = useState("#D4AF37");
  const [fontColor,       setFontColor]       = useState("#FFFFFF");
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);
  const [fontPage, setFontPage] = useState(0);

  // SVG background styles from product
  // selectedSvgStyleIndex: 'plain' = plain colour, number = SVG style
  const [selectedSvgStyleIndex, setSelectedSvgStyleIndex] = useState("plain");
  const [svgBgPlainColor, setSvgBgPlainColor] = useState("#18181B");
  const [svgColorMap, setSvgColorMap] = useState([]);
  const [svgContent, setSvgContent] = useState(null);
  const [svgLoading, setSvgLoading] = useState(false);
  const FONTS_PER_PAGE = 5;
  const totalFontPages = Math.ceil(FONT_OPTIONS.length / FONTS_PER_PAGE);

  useEffect(() => {
    if (!selectedFont.url) return;
    const id = `gfont-${selectedFont.id}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id   = id;
      link.rel  = "stylesheet";
      link.href = selectedFont.url;
      document.head.appendChild(link);
    }
  }, [selectedFont]);

  useEffect(() => {
    const styles = product.backgroundStyles ?? [];
    if (selectedSvgStyleIndex === "plain" || typeof selectedSvgStyleIndex !== "number" || !styles[selectedSvgStyleIndex]) {
      setSvgContent(null);
      setSvgColorMap([]);
      return;
    }
    const style = styles[selectedSvgStyleIndex];
    if (!style.svgUrl) { setSvgContent(null); return; }
    setSvgLoading(true);
    fetch(style.svgUrl)
      .then(r => r.text())
      .then(text => {
        setSvgContent(text);
        setSvgColorMap((style.extractedColors ?? []).map(ec => ({ original: ec.original, selected: ec.original })));
      })
      .catch(() => setSvgContent(null))
      .finally(() => setSvgLoading(false));
  }, [selectedSvgStyleIndex, product.backgroundStyles]);

  const [errors, setErrors] = useState({});

  const frontBg = DEFAULT_BG;
  const backBg  = DEFAULT_BG;

  const isBack = activeTab === "back";

  const activeSvgOverlay = typeof selectedSvgStyleIndex === "number" && svgContent
    ? replaceSvgColors(svgContent, svgColorMap)
    : null;

  // Plain colour override from new section
  const activeSvgBgColor = selectedSvgStyleIndex === "plain" ? svgBgPlainColor : null;

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

  async function handleBuyNow() {
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
        cardColor:       product.allowColorCustomization ? cardColor       : null,
        accentColor:     product.allowColorCustomization ? accentColor     : null,
        fontColor:       product.allowColorCustomization ? fontColor       : null,
        fontFamily: selectedFont.family,
        fontLabel:  selectedFont.label,
        qrStyle,
        selectedBackDesign, backContent, backBg,
        backLogoDataUrl:  backLogoDataUrl || null,
        backLogoPlacement, backLogoSize, qrFgColor,
        svgBackground: typeof selectedSvgStyleIndex === "number" && (product.backgroundStyles ?? [])[selectedSvgStyleIndex]
          ? {
              backgroundType:       "svg",
              backgroundStyleIndex: selectedSvgStyleIndex,
              backgroundStyleName:  (product.backgroundStyles ?? [])[selectedSvgStyleIndex]?.styleName || "",
              backgroundStyleFile:  (product.backgroundStyles ?? [])[selectedSvgStyleIndex]?.svgFile || "",
              selectedSvgColors:    svgColorMap,
              customizedSvgContent: svgContent ? replaceSvgColors(svgContent, svgColorMap) : null,
            }
          : { backgroundType: "plain", plainColor: svgBgPlainColor },
      } : null,
      uploaded_front_design: designMethod === "upload_own_design" ? (uploadedFrontDataUrl || null) : null,
      uploaded_back_design:  designMethod === "upload_own_design" ? (uploadedBackDataUrl  || null) : null,
      addedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("checkoutItem", JSON.stringify(checkoutItem));
    } catch { }

    const token = localStorage.getItem("customerToken");
    if (token) {
      try {
        const res = await orderService.getMyOrders();
        const orders = res.data?.orders ?? [];
        const hasActive = orders.some(
          (o) => ["pending", "paid"].includes(o.payment_status) && o.order_status !== "cancelled"
        );
        if (hasActive) {
          setErrors({ general: "You already have an active order. Please visit your dashboard to track it." });
          return;
        }
      } catch {
        // if check fails, allow through — backend will enforce as fallback
      }
      router.push("/checkout/shipping");
    } else {
      router.push("/register?redirect=checkout");
    }
  }

  /* ── card preview renderer ── */
  function renderCardPreview() {
    if (designMethod === "upload_own_design") {
      const src = isBack ? uploadedBackDataUrl : uploadedFrontDataUrl;
      if (src) {
        return (
          <div className="overflow-hidden rounded-xl" style={{ aspectRatio: "5/3", background: "#F3F4F6" }}>
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
            cardColor:        activeSvgBgColor ?? (product.allowColorCustomization ? cardColor : null),
            accentColor:      product.allowColorCustomization ? accentColor                     : null,
            fontColor:        product.allowColorCustomization ? fontColor                       : null,
            backgroundStyle:  activeSvgBgColor ? "plain" : null,
            skinSvgContent:   activeSvgOverlay,
            fontFamily: selectedFont.family,
            qrStyle,
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
              bg={activeSvgBgColor ? { type: "solid", color: activeSvgBgColor } : (product.allowColorCustomization ? { type: "solid", color: cardColor } : frontBg)}
              name={name} subTitle={subTitle}
              logoDataUrl={logoDataUrl} logoPlacement={logoPlacement} logoSize={logoSize}
              fontColor={product.allowColorCustomization ? fontColor : null}
              skinSvgContent={activeSvgOverlay}
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
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
      >
        {errors.general && (
          <div className="bg-[#FEF2F2] border-t border-[#FECACA] px-4 py-2 text-[12px] text-[#DC2626] flex items-center gap-2">
            <span>⚠</span>
            <span>{errors.general} <a href="/dashboard/my-cards" className="underline font-semibold">My Cards</a></span>
          </div>
        )}
      <div className="flex items-center gap-3 border-t border-[#F0F0F0] bg-white px-4 py-3">
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
          {/* Header: Live Preview + Front/Back tabs */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-2.5">
            <span className="text-[12px] font-semibold text-[#111827]">Live Preview</span>
            <div className="flex items-center">
              {["front", "back"].map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold transition-colors"
                    style={{ color: active ? "#28DC4F" : "#9CA3AF" }}
                  >
                    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                      <rect x="0.75" y="0.75" width="12.5" height="8" rx="1.25" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M4.5 9.75 H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <line x1="0.75" y1="6.25" x2="13.25" y2="6.25" stroke="currentColor" strokeWidth="1.3"/>
                    </svg>
                    {tab === "front" ? "Front" : "Back"}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#28DC4F]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-3">{renderCardPreview()}</div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:w-[460px] lg:shrink-0">

            {/* Card preview box — desktop only */}
            <div className="hidden overflow-hidden rounded-2xl lg:block" style={{ background: "#F3F4F6" }}>
              {/* Header: Live Preview + Front/Back tabs */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-white px-4 py-2.5">
                <span className="text-[13px] font-semibold text-[#111827]">Live Preview</span>
                <div className="flex items-center">
                  {["front", "back"].map((tab) => {
                    const active = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="relative flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold transition-colors"
                        style={{ color: active ? "#28DC4F" : "#9CA3AF" }}
                      >
                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                          <rect x="0.75" y="0.75" width="12.5" height="8" rx="1.25" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M4.5 9.75 H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                          <line x1="0.75" y1="6.25" x2="13.25" y2="6.25" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                        {tab === "front" ? "Front" : "Back"}
                        {active && (
                          <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#28DC4F]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="p-3">
                {renderCardPreview()}
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
                {
                  value: "customize_online",
                  label: "Customize Online",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  ),
                },
                {
                  value: "upload_own_design",
                  label: "Upload My Design",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                  ),
                },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => { setDesignMethod(value); setErrors({}); }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px] font-medium transition-all"
                  style={{
                    background: designMethod === value ? "#fff" : "transparent",
                    color:      designMethod === value ? "#111827" : "#9CA3AF",
                    boxShadow:  designMethod === value ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {icon}
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

                    {/* ── 1. Background ── */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-[#EBEBEB] bg-white p-4">
                        <p className="text-[14px] font-bold text-[#111827]">1. Background</p>

                        {/* Style thumbnails */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {/* Plain Color option */}
                          <button
                            type="button"
                            onClick={() => { setSelectedSvgStyleIndex("plain"); setSvgContent(null); setSvgColorMap([]); }}
                            className="flex shrink-0 flex-col items-center gap-1 overflow-hidden rounded-xl transition-all"
                            style={{
                              width: 80,
                              border: selectedSvgStyleIndex === "plain" ? "2px solid #28DC4F" : "2px solid #EBEBEB",
                              boxShadow: selectedSvgStyleIndex === "plain" ? "0 0 0 1px #28DC4F" : "none",
                            }}
                          >
                            <div className="relative h-12 w-full overflow-hidden" style={{ background: svgBgPlainColor }}>
                              {selectedSvgStyleIndex === "plain" && (
                                <div style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: "50%", background: "#28DC4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <svg width="8" height="8" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </div>
                              )}
                            </div>
                            <span className="py-1 text-[9px] font-semibold" style={{ color: selectedSvgStyleIndex === "plain" ? "#28DC4F" : "#6B7280" }}>Plain</span>
                          </button>

                          {(product.backgroundStyles ?? []).map((style, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedSvgStyleIndex(idx)}
                              className="flex shrink-0 flex-col items-center gap-1 overflow-hidden rounded-xl transition-all"
                              style={{
                                width: 80,
                                border: selectedSvgStyleIndex === idx ? "2px solid #28DC4F" : "2px solid #EBEBEB",
                                boxShadow: selectedSvgStyleIndex === idx ? "0 0 0 1px #28DC4F" : "none",
                                position: "relative",
                              }}
                            >
                              <div className="relative h-12 w-full overflow-hidden" style={{ background: "#111" }}>
                                {style.svgPreviewUrl && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={style.svgPreviewUrl} alt={style.styleName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                )}
                                {selectedSvgStyleIndex === idx && (
                                  <div style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: "50%", background: "#28DC4F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="8" height="8" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </div>
                                )}
                              </div>
                              <span className="py-1 text-center text-[9px] font-semibold leading-tight px-1" style={{ color: selectedSvgStyleIndex === idx ? "#28DC4F" : "#6B7280" }}>
                                {style.styleName || `Style ${idx + 1}`}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Plain colour picker */}
                        {selectedSvgStyleIndex === "plain" && (
                          <div className="flex flex-col gap-3">
                            <p className="text-[12px] text-[#6B7280]">Choose a background colour</p>
                            <div className="flex items-center gap-3">
                              <div
                                className="h-10 w-10 shrink-0 rounded-lg"
                                style={{ background: svgBgPlainColor, border: "1px solid rgba(0,0,0,0.12)" }}
                              />
                              <input
                                type="text"
                                value={svgBgPlainColor}
                                onChange={(e) => setSvgBgPlainColor(e.target.value)}
                                className="w-28 rounded-lg border border-[#E5E7EB] px-2 py-1.5 font-mono text-[13px] outline-none focus:border-[#28DC4F]"
                              />
                              <input
                                type="color"
                                value={svgBgPlainColor.match(/^#[0-9a-f]{6}$/i) ? svgBgPlainColor : "#000000"}
                                onChange={(e) => setSvgBgPlainColor(e.target.value)}
                                className="h-9 w-12 cursor-pointer rounded border border-[#E5E7EB] p-0.5"
                                title="Pick colour"
                              />
                            </div>
                          </div>
                        )}

                        {/* Color pickers for SVG style */}
                        {typeof selectedSvgStyleIndex === "number" && (
                          <div className="flex flex-col gap-3">
                            {svgLoading ? (
                              <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF]">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#28DC4F]" />
                                Loading colors…
                              </div>
                            ) : svgColorMap.length > 0 ? (
                              <>
                                <p className="text-[12px] text-[#6B7280]">We detected {svgColorMap.length} color{svgColorMap.length !== 1 ? "s" : ""} in this background</p>
                                {(product.backgroundStyles ?? [])[selectedSvgStyleIndex]?.hasEmbeddedImage && (
                                  <div className="rounded-lg px-3 py-2 text-[11px] text-amber-700" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                                    ⚠ This SVG contains embedded image content, colors may not be editable.
                                  </div>
                                )}
                                <div className="flex flex-col gap-2">
                                  {svgColorMap.map((entry, ci) => (
                                    <div key={ci} className="flex items-center gap-3">
                                      <span className="w-12 shrink-0 text-[11px] text-[#9CA3AF]">Color {ci + 1}</span>
                                      <div className="h-7 w-7 shrink-0 rounded" style={{ background: entry.selected, border: "1px solid rgba(0,0,0,0.1)" }} />
                                      <input
                                        type="text"
                                        value={entry.selected}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setSvgColorMap(prev => prev.map((c, i) => i === ci ? { ...c, selected: val } : c));
                                        }}
                                        className="w-24 rounded-lg border border-[#E5E7EB] px-2 py-1 font-mono text-[12px] outline-none focus:border-[#28DC4F]"
                                      />
                                      <input
                                        type="color"
                                        value={entry.selected.match(/^#[0-9a-f]{6}$/i) ? entry.selected : "#000000"}
                                        onChange={(e) => setSvgColorMap(prev => prev.map((c, i) => i === ci ? { ...c, selected: e.target.value } : c))}
                                        className="h-7 w-9 cursor-pointer rounded border border-[#E5E7EB] p-0.5"
                                        title="Pick color"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setSvgColorMap(prev => prev.map(c => ({ ...c, selected: c.original })))}
                                  className="self-start rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-[11px] font-medium text-[#374151] hover:bg-[#F9FAFB]"
                                >
                                  Reset All
                                </button>
                              </>
                            ) : (
                              <p className="text-[12px] text-[#9CA3AF]">No editable colors found in this background.</p>
                            )}
                          </div>
                        )}
                    </div>

                    {/* ── 2. Logo Upload & Position ── */}
                    <div className="flex flex-col gap-3 rounded-2xl border border-[#EBEBEB] bg-white p-4">
                      <p className="text-[14px] font-bold text-[#111827]">2. Logo Upload &amp; Position</p>
                      <div className="flex gap-3 items-center">
                        {/* Upload zone */}
                        <div className="flex-1">
                          <UploadZone file={logoFile} onChange={setLogoFile} />
                        </div>
                        {/* Position picker — always visible */}
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-[11px] font-medium text-[#9CA3AF]">Position</p>
                          <LogoPlacementPicker value={logoPlacement} onChange={setLogoPlacement} />
                        </div>
                      </div>
                      {logoDataUrl && (
                        <div className="flex items-center gap-3 pt-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={logoDataUrl} alt="Logo preview"
                            className="rounded-lg border border-[#F0F0F0]"
                            style={{ height: "40px", maxWidth: "64px", objectFit: "contain" }}
                          />
                          <div className="flex flex-1 items-center gap-2">
                            <input type="range" min={20} max={80} value={logoSize}
                              onChange={(e) => setLogoSize(Number(e.target.value))}
                              className="flex-1 accent-[#28DC4F]"
                            />
                            <span className="w-7 text-right text-[11px] text-[#9CA3AF]">{logoSize}</span>
                          </div>
                          <button onClick={() => setLogoFile(null)}
                            className="rounded-lg border border-[#F0F0F0] px-2.5 py-1 text-[11px] font-medium text-[#EF4444]">
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── 3. Font Style ── */}
                    <div className="flex flex-col gap-3 rounded-2xl border border-[#EBEBEB] bg-white p-4">
                      <p className="text-[14px] font-bold text-[#111827]">3. Font Style</p>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-end">
                          <p className="text-[11px] text-[#9CA3AF]">{fontPage + 1} / {totalFontPages}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setFontPage((p) => Math.max(0, p - 1))}
                            disabled={fontPage === 0}
                            style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "#F3F4F6", border: "1px solid #E5E7EB", color: fontPage === 0 ? "#D1D5DB" : "#374151", display: "flex", alignItems: "center", justifyContent: "center", cursor: fontPage === 0 ? "default" : "pointer" }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="15 18 9 12 15 6" />
                            </svg>
                          </button>

                          <div className="flex gap-2 flex-1">
                            {FONT_OPTIONS.slice(fontPage * FONTS_PER_PAGE, fontPage * FONTS_PER_PAGE + FONTS_PER_PAGE).map((f) => {
                              const active = selectedFont.id === f.id;
                              return (
                                <button
                                  key={f.id}
                                  type="button"
                                  onClick={() => setSelectedFont(f)}
                                  className="flex-1 rounded-lg py-1.5 text-[12px] transition-all truncate"
                                  style={{
                                    fontFamily: f.family,
                                    fontWeight: 600,
                                    background: active ? "#18181B" : "#F3F4F6",
                                    color:      active ? "#28DC4F" : "#374151",
                                    border:     active ? "1.5px solid #28DC4F" : "1.5px solid transparent",
                                  }}
                                >
                                  {f.label}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => setFontPage((p) => Math.min(totalFontPages - 1, p + 1))}
                            disabled={fontPage === totalFontPages - 1}
                            style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "#F3F4F6", border: "1px solid #E5E7EB", color: fontPage === totalFontPages - 1 ? "#D1D5DB" : "#374151", display: "flex", alignItems: "center", justifyContent: "center", cursor: fontPage === totalFontPages - 1 ? "default" : "pointer" }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ── 4. Text Color ── */}
                    {product.allowColorCustomization && (
                      <div className="flex flex-col gap-3 rounded-2xl border border-[#EBEBEB] bg-white p-4">
                        <p className="text-[14px] font-bold text-[#111827]">4. Text Color</p>
                        <div className="flex gap-3 flex-wrap px-0.5 py-1">
                          <CustomColorSwatch
                            value={fontColor}
                            onChange={setFontColor}
                            presets={FONT_COLORS.map((fc) => fc.color)}
                          />
                          {FONT_COLORS.map((fc) => {
                            const selected = fontColor.toLowerCase() === fc.color.toLowerCase();
                            return (
                              <button
                                key={fc.id}
                                type="button"
                                title={fc.label}
                                onClick={() => setFontColor(fc.color)}
                                className="shrink-0 rounded-full transition-all"
                                style={{
                                  width: 36, height: 36,
                                  background: fc.color,
                                  boxShadow: selected
                                    ? `0 0 0 2.5px white, 0 0 0 4.5px ${fc.color}`
                                    : "0 0 0 1px rgba(0,0,0,0.12)",
                                }}
                              />
                            );
                          })}
                        </div>
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
                          {/* Colour + Position side by side */}
                          <div className="flex gap-3 items-start">
                            <div className="flex flex-col gap-2 flex-1">
                              <p className="text-[12px] font-medium text-[#374151]">QR Colour</p>
                              <div className="flex gap-2 flex-wrap">
                                <CustomColorSwatch
                                  value={frontQrColor}
                                  onChange={setFrontQrColor}
                                  presets={QR_COLORS.map((c) => c.color)}
                                />
                                {QR_COLORS.map((c) => {
                                  const selected = frontQrColor.toLowerCase() === c.color.toLowerCase();
                                  return (
                                    <button
                                      key={c.id}
                                      type="button"
                                      title={c.label}
                                      onClick={() => setFrontQrColor(c.color)}
                                      className="shrink-0 rounded-full transition-all"
                                      style={{
                                        width: 28, height: 28,
                                        background: c.color,
                                        boxShadow: selected
                                          ? `0 0 0 2px white, 0 0 0 4px ${c.color}`
                                          : "0 0 0 1px rgba(0,0,0,0.1)",
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                              <p className="text-[11px] font-medium text-[#9CA3AF]">Position</p>
                              <LogoPlacementPicker value={frontQrPlacement} onChange={setFrontQrPlacement} />
                            </div>
                          </div>

                          {/* QR Style */}
                          <div className="flex flex-col gap-2">
                            <p className="text-[12px] font-medium text-[#374151]">QR Style</p>
                            <div className="grid grid-cols-5 gap-1.5">
                              {QR_STYLES.map((s) => {
                                const active = qrStyle === s.id;
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setQrStyle(s.id)}
                                    className="flex flex-col items-center gap-1.5 rounded-xl py-2 transition-all"
                                    style={{ background: active ? "#18181B" : "#F9FAFB", border: active ? "1.5px solid #28DC4F" : "1.5px solid #F0F0F0" }}
                                  >
                                    <div className="flex items-center justify-center rounded-md bg-white p-1.5" style={{ width: 36, height: 36 }}>
                                      <QrSvg color="#18181B" qrStyle={s.id} />
                                    </div>
                                    <span className="text-[10px] font-semibold" style={{ color: active ? "#28DC4F" : "#6B7280" }}>{s.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
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
                        <div className="flex flex-col gap-3">
                          {/* Colour + Position side by side */}
                          <div className="flex gap-3 items-start">
                            <div className="flex flex-col gap-2 flex-1">
                              <p className="text-[12px] font-medium text-[#374151]">QR Colour</p>
                              <div className="flex gap-2 flex-wrap">
                                <CustomColorSwatch
                                  value={qrFgColor}
                                  onChange={setQrFgColor}
                                  presets={QR_COLORS.map((c) => c.color)}
                                />
                                {QR_COLORS.map((c) => {
                                  const selected = qrFgColor.toLowerCase() === c.color.toLowerCase();
                                  return (
                                    <button
                                      key={c.id}
                                      title={c.label}
                                      onClick={() => setQrFgColor(c.color)}
                                      className="shrink-0 rounded-full transition-all"
                                      style={{
                                        width: 28, height: 28,
                                        background: c.color,
                                        boxShadow: selected
                                          ? `0 0 0 2px white, 0 0 0 4px ${c.color}`
                                          : "0 0 0 1px rgba(0,0,0,0.1)",
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 shrink-0">
                              <p className="text-[11px] font-medium text-[#9CA3AF]">Position</p>
                              <LogoPlacementPicker value={backLogoPlacement} onChange={setBackLogoPlacement} />
                            </div>
                          </div>

                          {/* QR Style */}
                          <div className="flex flex-col gap-2">
                            <p className="text-[12px] font-medium text-[#374151]">QR Style</p>
                            <div className="grid grid-cols-5 gap-1.5">
                              {QR_STYLES.map((s) => {
                                const active = qrStyle === s.id;
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setQrStyle(s.id)}
                                    className="flex flex-col items-center gap-1.5 rounded-xl py-2 transition-all"
                                    style={{ background: active ? "#18181B" : "#F9FAFB", border: active ? "1.5px solid #28DC4F" : "1.5px solid #F0F0F0" }}
                                  >
                                    <div className="flex items-center justify-center rounded-md bg-white p-1.5" style={{ width: 36, height: 36 }}>
                                      <QrSvg color="#18181B" qrStyle={s.id} />
                                    </div>
                                    <span className="text-[10px] font-semibold" style={{ color: active ? "#28DC4F" : "#6B7280" }}>{s.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* QR Size */}
                          <div className="flex items-center gap-3">
                            <span className="shrink-0 text-[12px] font-medium text-[#374151]">QR Size</span>
                            <input
                              type="range" min={20} max={80} value={backLogoSize}
                              onChange={(e) => setBackLogoSize(Number(e.target.value))}
                              className="flex-1 accent-[#28DC4F]"
                            />
                            <span className="w-8 text-right text-[12px] text-[#9CA3AF]">{backLogoSize}</span>
                          </div>
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
              {errors.general && (
                <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 text-[13px] text-[#DC2626] flex items-start gap-2">
                  <span>⚠</span>
                  <span>{errors.general} <a href="/dashboard/my-cards" className="underline font-semibold">My Cards</a></span>
                </div>
              )}
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
