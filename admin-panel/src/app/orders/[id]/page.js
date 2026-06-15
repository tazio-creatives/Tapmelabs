"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import orderService from "@/services/orderService";

// ── Config ────────────────────────────────────────────────────────────────────

const PROFILE_BASE  = process.env.NEXT_PUBLIC_FRONTEND_URL  || "https://tapmelabs.com";
const API_ASSET_BASE = (process.env.NEXT_PUBLIC_API_URL     || "http://localhost:5000/api").replace("/api", "");

function assetUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ASSET_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ── Status maps ───────────────────────────────────────────────────────────────

const ORDER_STATUS = {
  pending:    { bg: "#FEF3C7", text: "#D97706", label: "Pending"    },
  processing: { bg: "#DBEAFE", text: "#1D4ED8", label: "Processing" },
  shipped:    { bg: "#FEF9C3", text: "#A16207", label: "Shipped"    },
  delivered:  { bg: "#DCFCE7", text: "#16A34A", label: "Delivered"  },
  cancelled:  { bg: "#FEE2E2", text: "#DC2626", label: "Cancelled"  },
};

const PAYMENT_STATUS = {
  pending:  { bg: "#FEF3C7", text: "#D97706", label: "Pending"  },
  paid:     { bg: "#DCFCE7", text: "#16A34A", label: "Paid"     },
  failed:   { bg: "#FEE2E2", text: "#DC2626", label: "Failed"   },
  refunded: { bg: "#F3E8FF", text: "#7C3AED", label: "Refunded" },
};

const TIMELINE_STEPS = ["pending", "processing", "shipped", "delivered"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Card helpers (mirrors frontend my-cards page exactly) ─────────────────────

function getBgStyle(bg) {
  if (!bg) return { background: "#18181B" };
  if (bg.type === "solid")    return { background: bg.color };
  if (bg.type === "gradient") return { background: bg.css };
  if (bg.type === "pattern")  return bg.style ?? { background: "#18181B" };
  return { background: "#18181B" };
}

function getLogoStyle(placement, size = 44) {
  const pct = Math.round((size / 80) * 14) + 8;
  const base = { position: "absolute", pointerEvents: "none", width: `${pct}%`, height: "auto", maxHeight: "25%", objectFit: "contain" };
  switch (placement) {
    case "top-left":      return { ...base, top: "6%",    left: "5%" };
    case "top-center":    return { ...base, top: "6%",    left: "50%", transform: "translateX(-50%)" };
    case "top-right":     return { ...base, top: "6%",    right: "5%" };
    case "center-left":   return { ...base, top: "50%",   left: "5%",  transform: "translateY(-50%)" };
    case "center":        return { ...base, top: "50%",   left: "50%", transform: "translate(-50%,-50%)" };
    case "center-right":  return { ...base, top: "50%",   right: "5%", transform: "translateY(-50%)" };
    case "bottom-left":   return { ...base, bottom: "22%", left: "5%" };
    case "bottom-center": return { ...base, bottom: "22%", left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":  return { ...base, bottom: "18%", right: "5%" };
    default:              return { ...base, top: "6%",    left: "5%" };
  }
}

function isLightBg(bg) {
  if (!bg || bg.type !== "solid" || !bg.color?.startsWith("#")) return false;
  const r = parseInt(bg.color.slice(1, 3), 16);
  const g = parseInt(bg.color.slice(3, 5), 16);
  const b = parseInt(bg.color.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

function isLightHex(hex) {
  if (!hex?.startsWith("#")) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

// ── QR styling helpers ────────────────────────────────────────────────────────

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

function RealQrCode({ color = "#18181B", qrStyle = "minimal", data = "https://tapmelabs.com", width = 200, height = 200, bgColor }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    const qrBg = bgColor !== undefined ? bgColor : (isLightHex(color) ? "#1a1a1a" : "#ffffff");
    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !containerRef.current) return;
      const qr = new QRCodeStyling({
        width, height, type: "svg", data,
        margin: 4, backgroundOptions: { color: qrBg },
        ...getQrStyleOptions(qrStyle, color),
      });
      containerRef.current.innerHTML = "";
      qr.append(containerRef.current);
      const svg = containerRef.current.querySelector("svg");
      if (svg) { svg.style.width = "100%"; svg.style.height = "100%"; }
    });
    return () => { cancelled = true; };
  }, [color, qrStyle, data, width, height]);
  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

// ── Background pattern overlay (mirrors CardMockupOverlay.js) ─────────────────

function BackgroundPattern({ style, accentColor = "#FFFFFF" }) {
  if (!style || style === "plain") return null;
  const s = { position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" };
  const ac = accentColor;
  if (style === "abstract-wave") return (
    <svg style={s} viewBox="0 0 500 300" preserveAspectRatio="xMidYMid slice" fill="none">
      <path d="M-50 280 Q 80 240 180 270 T 380 260 T 560 280" stroke={ac} strokeOpacity="0.50" strokeWidth="2.5"/>
      <path d="M-50 230 Q 100 190 200 220 T 400 210 T 580 230" stroke={ac} strokeOpacity="0.38" strokeWidth="2.5"/>
      <path d="M-50 180 Q 80 140 180 170 T 380 160 T 560 180" stroke={ac} strokeOpacity="0.26" strokeWidth="2"/>
      <path d="M-50 130 Q 100 90  200 120 T 400 110 T 580 130" stroke={ac} strokeOpacity="0.16" strokeWidth="2"/>
      <path d="M-50 80  Q 80 40  180 70  T 380 60  T 560 80"  stroke={ac} strokeOpacity="0.10" strokeWidth="1.5"/>
      <path d="M-50 30  Q 100 -10 200 20 T 400 10  T 580 30"  stroke={ac} strokeOpacity="0.06" strokeWidth="1.5"/>
    </svg>
  );
  const sw = (op, col) => ({ stroke: col || ac, strokeOpacity: op, strokeWidth: "2", fill: "none", strokeMiterlimit: 10 });
  if (style === "silver-flow") return (
    <svg style={s} viewBox="0 0 1012 638" preserveAspectRatio="xMidYMid slice" fill="none">
      <path d="M856.07-142c0.41 4.48-2.63 10.88-3.64 14.93-5.2 20.63-12.6 41.11-19.18 61.35-52.9 162.76-188.26 293.51-361.07 318.04-89.39 12.68-180.15-2.91-270.43-2.89-52.9 0.01-107.01 6.29-156.6 25.54-48.45 18.8-85.36 52.51-123 86.78-1.97 1.78-4.59 2.79-5.15 5.58v-509.33z" fill={ac} fillOpacity="0.15" style={{ mixBlendMode: "overlay" }}/>
      <path d="M317.33 838.54c-0.41-4.48 2.63-10.88 3.65-14.93 5.2-20.63 12.6-41.11 19.18-61.35 52.89-162.76 188.25-293.51 361.07-318.04 89.39-12.68 180.14 2.91 270.42 2.89 52.9-0.01 107.02-6.29 156.61-25.54 48.45-18.8 85.36-52.51 123-86.78 1.96-1.78 4.59-2.79 5.15-5.58v509.33z" fill={ac} fillOpacity="0.15" style={{ mixBlendMode: "overlay" }}/>
      <path style={sw(0.50)} d="M200.24 683.17c-3.32-18.58 10.93-36.25 20.75-50.83 12.56-18.65 27-36.05 42.98-51.87 31.47-31.15 68.97-56.25 110-72.96 47.53-19.36 98.86-27.51 149.98-23.32 53.94 4.42 106.29 19.19 159.54 28.01 127.17 21.06 259.03 6.51 379.42-39.1 12.33-4.67 28.58-15.53 41.77-16.58"/>
      <path style={sw(0.43)} d="M243.79 680.61c-2.77-17.13 9.28-33.46 17.79-47.17 10.87-17.45 23.55-33.78 37.75-48.68 27.92-29.29 61.78-52.99 99.24-69.16 44.98-19.44 94.06-27.28 142.71-22.43 9.23 0.92 18.41 2.2 27.54 3.76 41.51 7.09 81.84 19.47 122.74 28.36q10.86 2.36 21.78 4.37c98.42 18.16 199.94 13.76 296.56-9.58 13.83-3.35 27.53-7.09 41.15-11.14 6.05-1.79 12.93-4.85 19.9-7.57 5.04-1.96 10.12-3.75 14.98-4.73q2.14-0.51 4.18-0.62 0.49 0.02 0.97 0.05"/>
      <path style={sw(0.36)} d="M287.33 678.04c-2.21-15.66 7.63-30.66 14.84-43.51 9.19-16.24 20.11-31.5 32.52-45.48 24.37-27.42 54.58-49.76 88.47-65.37 42.44-19.55 89.27-27.05 135.45-21.53 8.75 1.05 17.45 2.48 26.08 4.22 39.2 7.93 76.8 21.46 114.95 32.02q10.12 2.8 20.3 5.29c91.95 22.55 187.62 23.84 279.91 8.57 13.2-2.19 26.29-4.72 39.34-7.46 5.91-1.24 12.5-3.46 19.17-5.47 4.82-1.44 9.68-2.78 14.37-3.51q2.05-0.46 3.97-0.41 0.4 0.1 0.79 0.22"/>
      <path style={sw(0.29)} d="M330.88 675.48c-1.66-14.21 5.96-27.89 11.89-39.85 7.46-15.06 16.66-29.23 27.27-42.29 20.84-25.56 47.38-46.57 77.72-61.57 39.86-19.71 84.47-26.82 128.18-20.63q12.41 1.76 24.61 4.68c36.9 8.76 71.77 23.45 107.16 35.66q9.39 3.24 18.83 6.21c85.48 26.95 175.29 33.93 263.27 26.73 12.56-1.04 25.05-2.33 37.52-3.79 5.78-0.67 12.07-2.08 18.43-3.37 4.61-0.93 9.26-1.8 13.77-2.27q1.96-0.42 3.77-0.2 0.3 0.18 0.6 0.38"/>
      <path style={sw(0.22)} d="M374.43 672.92c-1.1-12.76 4.3-25.1 8.93-36.19 5.78-13.86 13.21-26.96 22.04-39.09 17.29-23.71 40.14-43.44 66.96-57.79 37.26-19.93 79.67-26.59 120.91-19.73q11.69 1.95 23.14 5.14c34.6 9.6 66.74 25.44 99.37 39.32q8.65 3.68 17.36 7.13c79.01 31.33 162.96 44.01 246.62 44.88q17.89 0.18 35.71-0.11c5.65-0.1 11.65-0.7 17.7-1.27 4.39-0.41 8.82-0.83 13.16-1.04q1.87-0.37 3.56 0 0.21 0.27 0.42 0.54"/>
      <path style={sw(0.16)} d="M417.98 670.35c-0.55-11.29 2.67-22.29 5.97-32.53 4.12-12.63 9.77-24.69 16.81-35.89 13.74-21.85 32.87-40.36 56.2-53.99 34.62-20.23 74.87-26.36 113.64-18.84q10.96 2.13 21.68 5.6c32.28 10.44 61.7 27.43 91.58 42.97q7.91 4.12 15.88 8.05c72.54 35.73 150.64 54.1 229.98 63.05 11.3 1.26 22.58 2.54 33.89 3.55 5.52 0.5 11.22 0.7 16.96 0.84 4.18 0.11 8.39 0.14 12.57 0.19q1.77-0.33 3.35 0.2 0.11 0.35 0.23 0.71"/>
      <path style={sw(0.10)} d="M461.53 667.79c0-45.15 21.53-86.87 60.03-111.77 37.9-24.51 84.65-27.66 126.58-11.88 35.27 13.28 65.99 36.04 98.2 55.6 66.08 40.12 138.31 64.18 213.33 81.2 16.02 3.63 32.06 7.69 48.3 10.17q5.96 0.96 11.97 1.41 1.68-0.27 3.14 0.41 0.02 0.44 0.04 0.88"/>
      <path style={sw(0.50)} d="M231-75.11c4.33 0.05 5.74-0.31 9.14 2.97 45.5 43.86 19.1 117.45 27.79 172.74 24.72 157.23 177.82 245.06 328.8 218.02 78.89-14.13 143.76-61.74 210.49-103.6 77.23-48.44 152.39-100.08 228.63-149.87 15.55-10.16 31.52-19.62 47.19-29.59 11.18-7.11 22.28-14.62 32.47-23.13"/>
      <path style={sw(0.43)} d="M264.01-68.95c3.58 0.43 4.82 0.5 7.72 3.64 4.56 4.95 8.45 10.3 11.58 15.83 6.47 11.44 9.49 24.17 11.11 37.4 2.97 24.32-0.38 50.62-2.11 75.45-0.48 6.93-0.76 13.81-0.83 20.45-0.05 5.22-0.05 10.23 0.49 15.25 2.2 20.4 6.32 39.51 12.32 57.43 4 11.88 9.04 23.23 14.62 34 4.9 9.43 10.41 18.4 16.74 26.99 7.42 10.04 15.36 19.46 24.31 28.16 6.72 6.49 14.11 12.62 21.77 18.18 16.16 11.82 34.03 21.26 52.98 28.71 11 4.33 22.33 7.58 33.95 10.28 6.65 1.54 13.35 2.71 20.15 3.67 9.8 1.38 19.71 2.38 29.7 2.66 12.64 0.36 25.18-0.38 37.82-1.97 8.94-1.12 17.93-2.55 26.86-4.49 17.67-3.88 34.17-9.9 50.23-17.06 16.1-7.2 31.7-15.43 46.68-24.77 16.85-10.46 33.31-21.83 49.63-33.43 14.24-10.12 28.47-20.35 42.82-30.29q16.35-11.33 32.59-22.84c33.35-23.66 66.39-47.77 99.99-71.47 24.92-17.59 50.06-34.88 75.54-51.77 14.57-9.67 29.58-18.56 44.37-27.8 10.5-6.58 20.96-13.45 30.65-21.16"/>
      <path style={sw(0.36)} d="M297.02-62.78c2.82 0.81 3.9 1.31 6.29 4.3 3.92 4.9 7.42 10.17 10.2 15.48 5.74 11.03 7.91 23.26 9.22 35.77 2.39 23.22-1.42 48-4.25 71.3-0.77 6.48-1.34 12.97-1.83 19.21-0.38 4.89-0.88 9.48-0.63 14.27 0.95 18.72 3.18 36.29 7.03 52.93 2.58 11 6.29 21.62 10.22 31.76 3.45 8.85 7.49 17.34 12.58 25.62 5.93 9.64 12.12 18.81 19.67 27.32 5.62 6.32 12.27 12.34 19.03 17.74 14.48 11.56 30.79 20.53 48.24 27.74 10.17 4.2 20.63 7 31.43 9.47 6.18 1.41 12.37 2.34 18.68 3.1 9.09 1.1 18.27 1.98 27.5 2.01 11.76 0.01 23.16-1.25 34.71-3.3 8.16-1.44 16.41-3.04 24.54-5.18 16.17-4.32 30.85-10.96 45.22-18.46 14.43-7.56 28.45-15.76 41.6-25.32 14.75-10.67 29.22-22.04 43.55-33.62 12.51-10.11 25.13-20.23 37.86-30.11 9.67-7.49 19.34-15.03 28.94-22.64 29.6-23.45 58.94-47.22 89.42-70.21 22.61-17.05 45.66-33.53 69.25-49.44 13.59-9.17 27.64-17.49 41.55-26.01 9.83-6.03 19.64-12.27 28.83-19.18"/>
      <path style={sw(0.29)} d="M330.03-56.61c2.06 1.18 2.97 2.13 4.87 4.96 3.26 4.86 6.39 10.03 8.8 15.14 5.01 10.61 6.34 22.34 7.34 34.14 1.82 22.12-2.47 45.36-6.38 67.14-1.07 6.03-1.92 12.14-2.84 17.97-0.72 4.56-1.7 8.73-1.76 13.29-0.23 17.03 0.01 33.07 1.74 48.43 1.14 10.13 3.54 20.01 5.82 29.51 2.02 8.29 4.58 16.29 8.43 24.26 4.46 9.23 8.9 18.14 15.04 26.47 4.53 6.15 10.4 12.09 16.28 17.32 12.76 11.32 27.54 19.8 43.5 26.75 9.34 4.08 18.94 6.43 28.91 8.66 5.71 1.28 11.38 1.98 17.21 2.55 8.38 0.81 16.83 1.58 25.31 1.34 10.87-0.33 21.12-2.12 31.59-4.62 7.39-1.76 14.89-3.53 22.22-5.88 14.68-4.76 27.53-12.01 40.21-19.86 12.76-7.91 25.2-16.09 36.51-25.86 12.67-10.87 25.14-22.26 37.48-33.81 10.78-10.1 21.78-20.11 32.9-29.92 8.45-7.45 16.91-14.91 25.29-22.44 25.85-23.25 51.49-46.68 78.85-68.95 20.3-16.53 41.25-32.19 62.96-47.11 12.61-8.68 25.7-16.43 38.73-24.23 9.16-5.49 18.32-11.08 27.02-17.2"/>
      <path style={sw(0.22)} d="M363.04-50.44c1.31 1.55 2.02 2.95 3.45 5.62 2.57 4.84 5.36 9.89 7.41 14.79 4.27 10.2 4.76 21.43 5.44 32.52 1.26 21.01-3.5 42.72-8.5 62.98-1.37 5.59-2.5 11.31-3.85 16.72-1.05 4.24-2.51 7.99-2.89 12.32-1.35 15.34-3.12 29.84-3.55 43.93-0.28 9.25 0.79 18.4 1.43 27.27 0.58 7.72 1.67 15.22 4.27 22.88 3 8.82 5.68 17.48 10.4 25.64 3.45 5.97 8.53 11.83 13.55 16.88 11.03 11.11 24.29 19.07 38.75 25.78 8.5 3.95 17.25 5.84 26.39 7.85 5.23 1.15 10.39 1.6 15.73 1.98 7.68 0.54 15.4 1.18 23.12 0.69 9.98-0.67 19.1-3 28.48-5.95 6.61-2.09 13.37-4.01 19.9-6.57 13.19-5.17 24.21-13.07 35.21-21.26 11.08-8.27 21.94-16.42 31.42-26.41 10.58-11.07 21.05-22.47 31.4-34 9.05-10.09 18.43-20 27.95-29.74 7.22-7.39 14.47-14.77 21.63-22.24 22.09-23.03 44.04-46.14 68.28-67.68 17.99-16 36.85-30.84 56.67-44.78 11.63-8.19 23.75-15.37 35.92-22.45 8.47-4.94 16.99-9.9 25.19-15.22"/>
      <path style={sw(0.16)} d="M396.05-44.27c0.55 1.93 1.06 3.79 2.02 6.29 1.87 4.82 4.33 9.75 6.03 14.44 3.53 9.78 3.17 20.51 3.55 30.88 0.69 19.91-4.54 40.09-10.64 58.83-1.66 5.14-3.08 10.48-4.85 15.48-1.39 3.9-3.29 7.24-4.01 11.34-2.41 13.66-6.23 26.62-8.85 39.43-1.67 8.37-1.95 16.78-2.96 25.03-0.86 7.15-1.23 14.15 0.11 21.51 1.54 8.41 2.48 16.79 5.76 24.79 2.38 5.79 6.67 11.59 10.81 16.45 9.3 10.91 21.04 18.34 34.01 24.81 7.67 3.82 15.56 5.26 23.87 7.04 4.76 1.02 9.4 1.23 14.26 1.41 6.98 0.26 13.96 0.79 20.92 0.03 9.1-1.01 17.08-3.87 25.36-7.28 5.84-2.4 11.85-4.5 17.59-7.25 11.69-5.65 20.88-14.13 30.2-22.66 9.4-8.62 18.69-16.75 26.34-26.96 8.49-11.27 16.96-22.68 25.32-34.19 7.32-10.08 15.09-19.88 22.99-29.55 5.99-7.34 12.04-14.65 17.98-22.04 18.34-22.83 36.59-45.6 57.71-66.43 15.69-15.46 32.45-29.49 50.38-42.44 10.64-7.7 21.81-14.31 33.1-20.67 7.8-4.4 15.67-8.71 23.37-13.25"/>
      <path style={sw(0.10)} d="M429.06-38.11c-0.62 7.09 3.25 14.41 5.24 21.05 2.8 9.36 1.59 19.6 1.66 29.26 0.12 18.8-5.59 37.46-12.77 54.67-1.96 4.69-3.66 9.65-5.86 14.23-1.72 3.58-4.05 6.51-5.14 10.36-3.39 12.02-9.37 23.41-14.13 34.94-3.1 7.5-4.71 15.17-7.37 22.79-2.29 6.57-4.11 13.08-4.03 20.14 0.09 7.99-0.72 16.11 1.12 23.95 1.31 5.6 4.78 11.34 8.06 16.02 7.54 10.71 17.8 17.61 29.28 23.82 6.83 3.7 13.85 4.69 21.35 6.24 4.28 0.89 8.41 0.86 12.78 0.84 6.27-0.02 12.52 0.39 18.72-0.63 8.22-1.34 15.05-4.73 22.25-8.6 5.07-2.72 10.33-4.99 15.27-7.94 10.19-6.09 17.56-15.19 25.2-24.06 7.72-8.98 15.43-17.09 21.25-27.52 6.39-11.47 12.87-22.89 19.24-34.37 9.82-17.7 21.4-34.21 32.36-51.21 14.59-22.62 29.15-45.05 47.14-65.16 13.38-14.94 28.04-28.15 44.09-40.12 16.28-12.13 34.09-20.95 51.84-30.15"/>
    </svg>
  );
  if (style === "gold-flow") {
    return (
      <svg style={s} viewBox="0 0 1012 638" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id="gf-base-admin" x1="0" y1="0" x2="1012" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0"   stopColor={ac} stopOpacity="0.65"/>
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.20"/>
            <stop offset="1"   stopColor={ac} stopOpacity="0.40"/>
          </linearGradient>
        </defs>
        <rect width="1012" height="638" fill="url(#gf-base-admin)"/>
        <path d="M856.07-142c0.41 4.48-2.63 10.88-3.64 14.93-5.2 20.63-12.6 41.11-19.18 61.35-52.9 162.76-188.26 293.51-361.07 318.04-89.39 12.68-180.15-2.91-270.43-2.89-52.9 0.01-107.01 6.29-156.6 25.54-48.45 18.8-85.36 52.51-123 86.78-1.97 1.78-4.59 2.79-5.15 5.58v-509.33z" fill={ac} fillOpacity="0.15" style={{ mixBlendMode: "overlay" }}/>
        <path d="M317.33 838.54c-0.41-4.48 2.63-10.88 3.65-14.93 5.2-20.63 12.6-41.11 19.18-61.35 52.89-162.76 188.25-293.51 361.07-318.04 89.39-12.68 180.14 2.91 270.42 2.89 52.9-0.01 107.02-6.29 156.61-25.54 48.45-18.8 85.36-52.51 123-86.78 1.96-1.78 4.59-2.79 5.15-5.58v509.33z" fill={ac} fillOpacity="0.15" style={{ mixBlendMode: "overlay" }}/>
        <path style={sw(0.50,"#fff")} d="M200.24 683.17c-3.32-18.58 10.93-36.25 20.75-50.83 12.56-18.65 27-36.05 42.98-51.87 31.47-31.15 68.97-56.25 110-72.96 47.53-19.36 98.86-27.51 149.98-23.32 53.94 4.42 106.29 19.19 159.54 28.01 127.17 21.06 259.03 6.51 379.42-39.1 12.33-4.67 28.58-15.53 41.77-16.58"/>
        <path style={sw(0.43,"#fff")} d="M243.79 680.61c-2.77-17.13 9.28-33.46 17.79-47.17 10.87-17.45 23.55-33.78 37.75-48.68 27.92-29.29 61.78-52.99 99.24-69.16 44.98-19.44 94.06-27.28 142.71-22.43 9.23 0.92 18.41 2.2 27.54 3.76 41.51 7.09 81.84 19.47 122.74 28.36q10.86 2.36 21.78 4.37c98.42 18.16 199.94 13.76 296.56-9.58 13.83-3.35 27.53-7.09 41.15-11.14 6.05-1.79 12.93-4.85 19.9-7.57 5.04-1.96 10.12-3.75 14.98-4.73q2.14-0.51 4.18-0.62 0.49 0.02 0.97 0.05"/>
        <path style={sw(0.36,"#fff")} d="M287.33 678.04c-2.21-15.66 7.63-30.66 14.84-43.51 9.19-16.24 20.11-31.5 32.52-45.48 24.37-27.42 54.58-49.76 88.47-65.37 42.44-19.55 89.27-27.05 135.45-21.53 8.75 1.05 17.45 2.48 26.08 4.22 39.2 7.93 76.8 21.46 114.95 32.02q10.12 2.8 20.3 5.29c91.95 22.55 187.62 23.84 279.91 8.57 13.2-2.19 26.29-4.72 39.34-7.46 5.91-1.24 12.5-3.46 19.17-5.47 4.82-1.44 9.68-2.78 14.37-3.51q2.05-0.46 3.97-0.41 0.4 0.1 0.79 0.22"/>
        <path style={sw(0.29,"#fff")} d="M330.88 675.48c-1.66-14.21 5.96-27.89 11.89-39.85 7.46-15.06 16.66-29.23 27.27-42.29 20.84-25.56 47.38-46.57 77.72-61.57 39.86-19.71 84.47-26.82 128.18-20.63q12.41 1.76 24.61 4.68c36.9 8.76 71.77 23.45 107.16 35.66q9.39 3.24 18.83 6.21c85.48 26.95 175.29 33.93 263.27 26.73 12.56-1.04 25.05-2.33 37.52-3.79 5.78-0.67 12.07-2.08 18.43-3.37 4.61-0.93 9.26-1.8 13.77-2.27q1.96-0.42 3.77-0.2 0.3 0.18 0.6 0.38"/>
        <path style={sw(0.22,"#fff")} d="M374.43 672.92c-1.1-12.76 4.3-25.1 8.93-36.19 5.78-13.86 13.21-26.96 22.04-39.09 17.29-23.71 40.14-43.44 66.96-57.79 37.26-19.93 79.67-26.59 120.91-19.73q11.69 1.95 23.14 5.14c34.6 9.6 66.74 25.44 99.37 39.32q8.65 3.68 17.36 7.13c79.01 31.33 162.96 44.01 246.62 44.88q17.89 0.18 35.71-0.11c5.65-0.1 11.65-0.7 17.7-1.27 4.39-0.41 8.82-0.83 13.16-1.04q1.87-0.37 3.56 0 0.21 0.27 0.42 0.54"/>
        <path style={sw(0.16,"#fff")} d="M417.98 670.35c-0.55-11.29 2.67-22.29 5.97-32.53 4.12-12.63 9.77-24.69 16.81-35.89 13.74-21.85 32.87-40.36 56.2-53.99 34.62-20.23 74.87-26.36 113.64-18.84q10.96 2.13 21.68 5.6c32.28 10.44 61.7 27.43 91.58 42.97q7.91 4.12 15.88 8.05c72.54 35.73 150.64 54.1 229.98 63.05 11.3 1.26 22.58 2.54 33.89 3.55 5.52 0.5 11.22 0.7 16.96 0.84 4.18 0.11 8.39 0.14 12.57 0.19q1.77-0.33 3.35 0.2 0.11 0.35 0.23 0.71"/>
        <path style={sw(0.10,"#fff")} d="M461.53 667.79c0-45.15 21.53-86.87 60.03-111.77 37.9-24.51 84.65-27.66 126.58-11.88 35.27 13.28 65.99 36.04 98.2 55.6 66.08 40.12 138.31 64.18 213.33 81.2 16.02 3.63 32.06 7.69 48.3 10.17q5.96 0.96 11.97 1.41 1.68-0.27 3.14 0.41 0.02 0.44 0.04 0.88"/>
        <path style={sw(0.50,"#fff")} d="M231-75.11c4.33 0.05 5.74-0.31 9.14 2.97 45.5 43.86 19.1 117.45 27.79 172.74 24.72 157.23 177.82 245.06 328.8 218.02 78.89-14.13 143.76-61.74 210.49-103.6 77.23-48.44 152.39-100.08 228.63-149.87 15.55-10.16 31.52-19.62 47.19-29.59 11.18-7.11 22.28-14.62 32.47-23.13"/>
        <path style={sw(0.43,"#fff")} d="M264.01-68.95c3.58 0.43 4.82 0.5 7.72 3.64 4.56 4.95 8.45 10.3 11.58 15.83 6.47 11.44 9.49 24.17 11.11 37.4 2.97 24.32-0.38 50.62-2.11 75.45-0.48 6.93-0.76 13.81-0.83 20.45-0.05 5.22-0.05 10.23 0.49 15.25 2.2 20.4 6.32 39.51 12.32 57.43 4 11.88 9.04 23.23 14.62 34 4.9 9.43 10.41 18.4 16.74 26.99 7.42 10.04 15.36 19.46 24.31 28.16 6.72 6.49 14.11 12.62 21.77 18.18 16.16 11.82 34.03 21.26 52.98 28.71 11 4.33 22.33 7.58 33.95 10.28 6.65 1.54 13.35 2.71 20.15 3.67 9.8 1.38 19.71 2.38 29.7 2.66 12.64 0.36 25.18-0.38 37.82-1.97 8.94-1.12 17.93-2.55 26.86-4.49 17.67-3.88 34.17-9.9 50.23-17.06 16.1-7.2 31.7-15.43 46.68-24.77 16.85-10.46 33.31-21.83 49.63-33.43 14.24-10.12 28.47-20.35 42.82-30.29q16.35-11.33 32.59-22.84c33.35-23.66 66.39-47.77 99.99-71.47 24.92-17.59 50.06-34.88 75.54-51.77 14.57-9.67 29.58-18.56 44.37-27.8 10.5-6.58 20.96-13.45 30.65-21.16"/>
        <path style={sw(0.36,"#fff")} d="M297.02-62.78c2.82 0.81 3.9 1.31 6.29 4.3 3.92 4.9 7.42 10.17 10.2 15.48 5.74 11.03 7.91 23.26 9.22 35.77 2.39 23.22-1.42 48-4.25 71.3-0.77 6.48-1.34 12.97-1.83 19.21-0.38 4.89-0.88 9.48-0.63 14.27 0.95 18.72 3.18 36.29 7.03 52.93 2.58 11 6.29 21.62 10.22 31.76 3.45 8.85 7.49 17.34 12.58 25.62 5.93 9.64 12.12 18.81 19.67 27.32 5.62 6.32 12.27 12.34 19.03 17.74 14.48 11.56 30.79 20.53 48.24 27.74 10.17 4.2 20.63 7 31.43 9.47 6.18 1.41 12.37 2.34 18.68 3.1 9.09 1.1 18.27 1.98 27.5 2.01 11.76 0.01 23.16-1.25 34.71-3.3 8.16-1.44 16.41-3.04 24.54-5.18 16.17-4.32 30.85-10.96 45.22-18.46 14.43-7.56 28.45-15.76 41.6-25.32 14.75-10.67 29.22-22.04 43.55-33.62 12.51-10.11 25.13-20.23 37.86-30.11 9.67-7.49 19.34-15.03 28.94-22.64 29.6-23.45 58.94-47.22 89.42-70.21 22.61-17.05 45.66-33.53 69.25-49.44 13.59-9.17 27.64-17.49 41.55-26.01 9.83-6.03 19.64-12.27 28.83-19.18"/>
        <path style={sw(0.29,"#fff")} d="M330.03-56.61c2.06 1.18 2.97 2.13 4.87 4.96 3.26 4.86 6.39 10.03 8.8 15.14 5.01 10.61 6.34 22.34 7.34 34.14 1.82 22.12-2.47 45.36-6.38 67.14-1.07 6.03-1.92 12.14-2.84 17.97-0.72 4.56-1.7 8.73-1.76 13.29-0.23 17.03 0.01 33.07 1.74 48.43 1.14 10.13 3.54 20.01 5.82 29.51 2.02 8.29 4.58 16.29 8.43 24.26 4.46 9.23 8.9 18.14 15.04 26.47 4.53 6.15 10.4 12.09 16.28 17.32 12.76 11.32 27.54 19.8 43.5 26.75 9.34 4.08 18.94 6.43 28.91 8.66 5.71 1.28 11.38 1.98 17.21 2.55 8.38 0.81 16.83 1.58 25.31 1.34 10.87-0.33 21.12-2.12 31.59-4.62 7.39-1.76 14.89-3.53 22.22-5.88 14.68-4.76 27.53-12.01 40.21-19.86 12.76-7.91 25.2-16.09 36.51-25.86 12.67-10.87 25.14-22.26 37.48-33.81 10.78-10.1 21.78-20.11 32.9-29.92 8.45-7.45 16.91-14.91 25.29-22.44 25.85-23.25 51.49-46.68 78.85-68.95 20.3-16.53 41.25-32.19 62.96-47.11 12.61-8.68 25.7-16.43 38.73-24.23 9.16-5.49 18.32-11.08 27.02-17.2"/>
        <path style={sw(0.22,"#fff")} d="M363.04-50.44c1.31 1.55 2.02 2.95 3.45 5.62 2.57 4.84 5.36 9.89 7.41 14.79 4.27 10.2 4.76 21.43 5.44 32.52 1.26 21.01-3.5 42.72-8.5 62.98-1.37 5.59-2.5 11.31-3.85 16.72-1.05 4.24-2.51 7.99-2.89 12.32-1.35 15.34-3.12 29.84-3.55 43.93-0.28 9.25 0.79 18.4 1.43 27.27 0.58 7.72 1.67 15.22 4.27 22.88 3 8.82 5.68 17.48 10.4 25.64 3.45 5.97 8.53 11.83 13.55 16.88 11.03 11.11 24.29 19.07 38.75 25.78 8.5 3.95 17.25 5.84 26.39 7.85 5.23 1.15 10.39 1.6 15.73 1.98 7.68 0.54 15.4 1.18 23.12 0.69 9.98-0.67 19.1-3 28.48-5.95 6.61-2.09 13.37-4.01 19.9-6.57 13.19-5.17 24.21-13.07 35.21-21.26 11.08-8.27 21.94-16.42 31.42-26.41 10.58-11.07 21.05-22.47 31.4-34 9.05-10.09 18.43-20 27.95-29.74 7.22-7.39 14.47-14.77 21.63-22.24 22.09-23.03 44.04-46.14 68.28-67.68 17.99-16 36.85-30.84 56.67-44.78 11.63-8.19 23.75-15.37 35.92-22.45 8.47-4.94 16.99-9.9 25.19-15.22"/>
        <path style={sw(0.16,"#fff")} d="M396.05-44.27c0.55 1.93 1.06 3.79 2.02 6.29 1.87 4.82 4.33 9.75 6.03 14.44 3.53 9.78 3.17 20.51 3.55 30.88 0.69 19.91-4.54 40.09-10.64 58.83-1.66 5.14-3.08 10.48-4.85 15.48-1.39 3.9-3.29 7.24-4.01 11.34-2.41 13.66-6.23 26.62-8.85 39.43-1.67 8.37-1.95 16.78-2.96 25.03-0.86 7.15-1.23 14.15 0.11 21.51 1.54 8.41 2.48 16.79 5.76 24.79 2.38 5.79 6.67 11.59 10.81 16.45 9.3 10.91 21.04 18.34 34.01 24.81 7.67 3.82 15.56 5.26 23.87 7.04 4.76 1.02 9.4 1.23 14.26 1.41 6.98 0.26 13.96 0.79 20.92 0.03 9.1-1.01 17.08-3.87 25.36-7.28 5.84-2.4 11.85-4.5 17.59-7.25 11.69-5.65 20.88-14.13 30.2-22.66 9.4-8.62 18.69-16.75 26.34-26.96 8.49-11.27 16.96-22.68 25.32-34.19 7.32-10.08 15.09-19.88 22.99-29.55 5.99-7.34 12.04-14.65 17.98-22.04 18.34-22.83 36.59-45.6 57.71-66.43 15.69-15.46 32.45-29.49 50.38-42.44 10.64-7.7 21.81-14.31 33.1-20.67 7.8-4.4 15.67-8.71 23.37-13.25"/>
        <path style={sw(0.10,"#fff")} d="M429.06-38.11c-0.62 7.09 3.25 14.41 5.24 21.05 2.8 9.36 1.59 19.6 1.66 29.26 0.12 18.8-5.59 37.46-12.77 54.67-1.96 4.69-3.66 9.65-5.86 14.23-1.72 3.58-4.05 6.51-5.14 10.36-3.39 12.02-9.37 23.41-14.13 34.94-3.1 7.5-4.71 15.17-7.37 22.79-2.29 6.57-4.11 13.08-4.03 20.14 0.09 7.99-0.72 16.11 1.12 23.95 1.31 5.6 4.78 11.34 8.06 16.02 7.54 10.71 17.8 17.61 29.28 23.82 6.83 3.7 13.85 4.69 21.35 6.24 4.28 0.89 8.41 0.86 12.78 0.84 6.27-0.02 12.52 0.39 18.72-0.63 8.22-1.34 15.05-4.73 22.25-8.6 5.07-2.72 10.33-4.99 15.27-7.94 10.19-6.09 17.56-15.19 25.2-24.06 7.72-8.98 15.43-17.09 21.25-27.52 6.39-11.47 12.87-22.89 19.24-34.37 9.82-17.7 21.4-34.21 32.36-51.21 14.59-22.62 29.15-45.05 47.14-65.16 13.38-14.94 28.04-28.15 44.09-40.12 16.28-12.13 34.09-20.95 51.84-30.15"/>
      </svg>
    );
  }
  return null;
}

// ── NFC Card Front (exact replica of customer dashboard design) ───────────────

function FrontCardPreview({ bg, name, subTitle, logoDataUrl, logoPlacement, logoSize, cardRef, fontColor, fontFamily, backgroundStyle, accentColor, frontQrEnabled, frontQrPlacement, frontQrColor, qrStyle, profileUrl, skinSvgContent = null }) {
  const light = isLightBg(bg);
  const tc    = fontColor || (light ? "rgba(0,0,0,0.85)"  : "rgba(255,255,255,0.9)");
  const stc   = fontColor ? fontColor + "99" : (light ? "rgba(0,0,0,0.45)"  : "rgba(255,255,255,0.45)");
  const lMain = fontColor || (light ? "#000000" : "#ffffff");
  const nfc   = fontColor ? fontColor + "88" : (light ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.5)");

  return (
    <div ref={cardRef} style={{
      width: "100%", maxWidth: "460px", aspectRatio: "5 / 3",
      borderRadius: "14px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      position: "relative", overflow: "hidden", containerType: "inline-size",
      ...getBgStyle(bg),
    }}>
      {/* Background style pattern */}
      <BackgroundPattern style={backgroundStyle} accentColor={accentColor || "#FFFFFF"} />
      {skinSvgContent && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(skinSvgContent)}`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
      )}

      {/* TapMe Labs branding — hidden when customer logo placed top-left */}
      {!(logoDataUrl && logoPlacement === "top-left") && (
        <div style={{ position: "absolute", left: "4%", top: "8%", display: "flex", alignItems: "center", gap: "3%" }}>
          <svg style={{ width: "5.5cqw", height: "5.5cqw" }} viewBox="0 0 40 40" fill="none">
            <path d="M1.875 30.199C1.875 25.3665 5.79251 21.449 10.625 21.449H23.4375C25.6812 21.449 27.5 19.6301 27.5 17.3865C27.5 15.1428 25.6812 13.324 23.4375 13.324H4.0625V8.94897H23.4375C28.0974 8.94897 31.875 12.7266 31.875 17.3865C31.875 22.0464 28.0974 25.824 23.4375 25.824H10.625C8.20875 25.824 6.25 27.7827 6.25 30.199V31.449H1.875V30.199Z" fill={lMain} />
            <path d="M34.2477 8.75089C36.6257 10.8686 38.1256 13.9518 38.1256 17.3866C38.1256 21.028 36.4401 24.2741 33.8092 26.3935L30.192 24.3046C32.6785 22.9974 34.3756 20.3908 34.3756 17.3866C34.3756 14.605 32.9203 12.1644 30.7311 10.7802L34.2477 8.75089Z" fill="#28DC4F" />
            <circle cx="23.125" cy="17.5" r="1.875" fill="#28DC4F" />
          </svg>
          <span style={{ fontSize: "2cqw", fontWeight: 700, letterSpacing: "0.08em", color: lMain, opacity: 0.85 }}>TAPME LABS</span>
        </div>
      )}

      {/* Customer logo */}
      {logoDataUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoDataUrl} alt="Logo" style={getLogoStyle(logoPlacement ?? "top-left", logoSize ?? 44)} crossOrigin="anonymous" />
      )}

      {/* NFC icon — top-right */}
      <div style={{ position: "absolute", right: "4%", top: "8%", pointerEvents: "none" }}>
        <svg style={{ width: "5cqw", height: "5cqw" }} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="16" r="1.5" fill={nfc} />
          <path d="M7 13a4.2 4.2 0 0 1 6 0" stroke={nfc} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M4 10a8.5 8.5 0 0 1 12 0" stroke={nfc} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Name + subtitle — bottom-left */}
      <div style={{ position: "absolute", bottom: "12%", left: "5%", right: "30%", overflow: "hidden" }}>
        <p style={{ color: tc, fontSize: "clamp(7px,3.5cqw,18px)", fontWeight: 600, lineHeight: 1.3, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: fontFamily || "sans-serif" }}>
          {name || "Customer Name"}
        </p>
        <p style={{ color: stc, fontSize: "clamp(5px,2.4cqw,13px)", marginTop: "0.25em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: fontFamily || "sans-serif" }}>
          {subTitle || "Title · Company"}
        </p>
      </div>

      {/* Front QR — only if customer enabled it */}
      {frontQrEnabled && (
        <div style={{ ...getLogoStyle(frontQrPlacement || "bottom-right", 44), width: "13%" }}>
          <RealQrCode color={frontQrColor || "#FFFFFF"} qrStyle={qrStyle || "minimal"} data={profileUrl || "https://tapmelabs.com"} bgColor="transparent" />
        </div>
      )}
    </div>
  );
}

// ── NFC Card Back (exact replica of customer dashboard design) ────────────────

function BackCardPreview({ bg, backContent, backLogoDataUrl, backLogoPlacement, backLogoSize, qrFgColor, cardRef, profileUrl, qrStyle, backgroundStyle, accentColor, skinSvgContent = null }) {
  const qr = qrFgColor || "#18181B";
  const bgStyle = getBgStyle(bg ?? { type: "solid", color: "#18181B" });

  return (
    <div ref={cardRef} style={{
      width: "100%", maxWidth: "460px", aspectRatio: "5 / 3",
      borderRadius: "14px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      position: "relative", overflow: "hidden", containerType: "inline-size",
      ...bgStyle,
    }}>
      <BackgroundPattern style={backgroundStyle} accentColor={accentColor || "#FFFFFF"} />
      {skinSvgContent && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(skinSvgContent)}`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
      )}

      {/* NFC icon — top-right */}
      <div style={{ position: "absolute", right: "4%", top: "8%", pointerEvents: "none" }}>
        <svg style={{ width: "5cqw", height: "5cqw" }} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="16" r="1.5" fill="rgba(255,255,255,0.5)" />
          <path d="M7 13a4.2 4.2 0 0 1 6 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M4 10a8.5 8.5 0 0 1 12 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3%" }}>
        {backContent === "qr" ? (
          <>
            <div style={{ width: "28%", aspectRatio: "1", background: isLightHex(qr) ? "#1a1a1a" : "#ffffff", borderRadius: "6px", padding: "4%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RealQrCode color={qr} qrStyle={qrStyle || "minimal"} data={profileUrl || "https://tapmelabs.com"} />
            </div>
            <span style={{ fontSize: "clamp(5px,2.2cqw,11px)", fontWeight: 500, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)" }}>SCAN TO CONNECT</span>
          </>
        ) : backLogoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={backLogoDataUrl} alt="Logo" style={getLogoStyle(backLogoPlacement ?? "center", backLogoSize ?? 44)} crossOrigin="anonymous" />
        ) : (
          <>
            <svg style={{ width: "13cqw", height: "13cqw" }} viewBox="0 0 40 40" fill="none">
              <path d="M1.875 30.199C1.875 25.3665 5.79251 21.449 10.625 21.449H23.4375C25.6812 21.449 27.5 19.6301 27.5 17.3865C27.5 15.1428 25.6812 13.324 23.4375 13.324H4.0625V8.94897H23.4375C28.0974 8.94897 31.875 12.7266 31.875 17.3865C31.875 22.0464 28.0974 25.824 23.4375 25.824H10.625C8.20875 25.824 6.25 27.7827 6.25 30.199V31.449H1.875V30.199Z" fill="white" />
              <path d="M34.2477 8.75089C36.6257 10.8686 38.1256 13.9518 38.1256 17.3866C38.1256 21.028 36.4401 24.2741 33.8092 26.3935L30.192 24.3046C32.6785 22.9974 34.3756 20.3908 34.3756 17.3866C34.3756 14.605 32.9203 12.1644 30.7311 10.7802L34.2477 8.75089Z" fill="#28DC4F" />
              <circle cx="23.125" cy="17.5" r="1.875" fill="#28DC4F" />
            </svg>
            <span style={{ fontSize: "2.8cqw", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.9)" }}>TAPME LABS</span>
          </>
        )}
      </div>
    </div>
  );
}

// ── Small sub-components ──────────────────────────────────────────────────────

function StatusBadge({ map, value }) {
  const s = map[value] ?? { bg: "#F1F5F9", text: "#64748B", label: value ?? "—" };
  return (
    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

function SectionCard({ title, children, action }) {
  return (
    <div className="rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <h3 className="text-[13px] font-semibold text-slate-700">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2" style={{ borderBottom: "1px solid #F8FAFC" }}>
      <span className="text-[12px] text-slate-400 shrink-0 w-32">{label}</span>
      <span className={`text-[13px] text-slate-800 text-right break-all ${mono ? "font-mono" : ""}`}>{value || "—"}</span>
    </div>
  );
}

// ── Order Timeline ─────────────────────────────────────────────────────────────

function OrderTimeline({ orderStatus }) {
  const cancelled = orderStatus === "cancelled";
  const currentIdx = cancelled ? -1 : TIMELINE_STEPS.indexOf(orderStatus);

  return (
    <div className="flex items-start gap-0 pt-2">
      {TIMELINE_STEPS.map((step, i) => {
        const done    = !cancelled && currentIdx >= i;
        const current = !cancelled && currentIdx === i;

        return (
          <div key={step} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div className="h-0.5 flex-1" style={{ background: i === 0 ? "transparent" : (done ? "#28DC4F" : "#E2E8F0") }} />
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{ background: done ? "#28DC4F" : "#F1F5F9", color: done ? "#fff" : "#CBD5E1", border: current ? "2px solid #28DC4F" : "none", boxShadow: current ? "0 0 0 3px rgba(40,220,79,0.15)" : "none" }}>
                {done
                  ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3.5 3.5 5.5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : i + 1}
              </div>
              <div className="h-0.5 flex-1" style={{ background: i === TIMELINE_STEPS.length - 1 ? "transparent" : (currentIdx > i && !cancelled ? "#28DC4F" : "#E2E8F0") }} />
            </div>
            <p className="mt-1.5 text-center text-[11px] font-medium" style={{ color: done ? "#28DC4F" : "#94A3B8" }}>
              {ORDER_STATUS[step]?.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id;

  const [order,       setOrder]       = useState(null);
  const [profile,     setProfile]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [cardFace,    setCardFace]    = useState("front");
  const [notes,       setNotes]       = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved,  setNotesSaved]  = useState(false);
  const [updating,    setUpdating]    = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [copied,      setCopied]      = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [qrDownloading, setQrDownloading] = useState(false);

  const frontRef       = useRef(null);
  const backRef        = useRef(null);
  const screenFrontRef = useRef(null);
  const screenBackRef  = useRef(null);
  const qrRef          = useRef(null);

  useEffect(() => { fetchOrder(); }, [id]);

  async function fetchOrder() {
    setLoading(true);
    setError("");
    try {
      const res = await orderService.getOrderById(id);
      setOrder(res.data?.order ?? null);
      setProfile(res.data?.profile ?? null);
      setNotes(res.data?.order?.admin_notes ?? "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateOrderStatus(status) {
    setUpdating(true); setUpdateError("");
    try { await orderService.updateOrderStatus(id, status); await fetchOrder(); }
    catch (err) { setUpdateError(err.response?.data?.message || "Update failed."); }
    finally { setUpdating(false); }
  }

  async function handleUpdatePaymentStatus(status) {
    setUpdating(true); setUpdateError("");
    try { await orderService.updatePaymentStatus(id, status); await fetchOrder(); }
    catch (err) { setUpdateError(err.response?.data?.message || "Update failed."); }
    finally { setUpdating(false); }
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    try {
      await orderService.updateOrderNotes(id, notes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch {}
    finally { setSavingNotes(false); }
  }

  async function handleDownload(face) {
    const originalFace = cardFace;
    const needsSwitch  = originalFace !== face;

    // Switch the visible card to the requested face so we capture exactly what renders on screen
    if (needsSwitch) setCardFace(face);

    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      // Wait one frame for React to commit the face switch (if any) and for SVG patterns to paint
      await new Promise((r) => setTimeout(r, needsSwitch ? 200 : 80));

      const targetRef = face === "front" ? screenFrontRef : screenBackRef;
      if (!targetRef.current) throw new Error("Card element not found");

      const dataUrl = await toPng(targetRef.current, { pixelRatio: 4, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${order?.order_number ?? "nfc-card"}-${face}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
      alert("Download failed. Try the Print option instead.");
    } finally {
      setDownloading(false);
      if (needsSwitch) setCardFace(originalFace);
    }
  }

  function handlePrint() { window.print(); }

  function handleCopyUrl() {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadLogo() {
    const src = cust.logoDataUrl || assetUrl(profile?.company_logo);
    if (!src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = `${order?.order_number ?? "order"}-logo.png`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function handleDownloadQR() {
    if (!qrRef.current) return;
    setQrDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(qrRef.current, { pixelRatio: 4, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${order?.order_number ?? "order"}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("QR download error:", err);
    } finally {
      setQrDownloading(false);
    }
  }

  // ── Derived values ──────────────────────────────────────────────────────────

  const profileUrl  = profile?.slug ? `${PROFILE_BASE}/u/${profile.slug}` : null;
  const cust        = order?.card_customization ?? {};
  const skinSvgContent = cust.svgBackground?.backgroundType === "svg" ? (cust.svgBackground.customizedSvgContent || null) : null;
  const cardBg      = cust.svgBackground?.backgroundType === "plain"
    ? { type: "solid", color: cust.svgBackground.plainColor }
    : cust.cardColor
      ? { type: "solid", color: cust.cardColor }
      : (cust.frontBg || { type: "solid", color: "#18181B" });
  const backBg      = cust.cardColor ? { type: "solid", color: cust.cardColor } : (cust.backBg  || { type: "solid", color: "#18181B" });
  const cardName    = cust.name    || profile?.name    || order?.user?.full_name || "";
  const cardSub     = cust.subTitle || profile?.designation || "";
  // Logo priority: checkout-time base64 > profile server URL
  const logoUrl     = cust.logoDataUrl || assetUrl(profile?.company_logo) || null;

  const shipAddr = typeof order?.shipping_address === "string" ? null : (order?.shipping_address ?? null);
  const addr = typeof order?.shipping_address === "string" ? order.shipping_address : null;

  // ── Loading / error states ──────────────────────────────────────────────────

  if (loading) {
    return (
      <AdminLayout title="Order Detail">
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-400" />
            <p className="text-[13px] text-slate-400">Loading order…</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout title="Order Detail">
        <div className="flex flex-col items-center gap-4 py-24">
          <p className="text-[14px] text-red-500">{error || "Order not found."}</p>
          <Link href="/orders" className="text-[13px] text-green-500 hover:underline">← Back to Orders</Link>
        </div>
      </AdminLayout>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title={`Order ${order.order_number}`}>

      {/* Print-only CSS: shows front + back cards at exact credit-card size */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body > * { display: none !important; }
          #print-cards-area { display: flex !important; flex-direction: column; align-items: center; gap: 12mm; padding: 10mm; }
          .print-card-slot { page-break-inside: avoid; }
          .print-card-slot .nfc-card-wrap { width: 85.6mm !important; }
          .print-card-slot .nfc-card-wrap > div { width: 85.6mm !important; max-width: 85.6mm !important; height: 54mm !important; border-radius: 4mm !important; }
          .print-label { font-family: Arial; font-size: 8pt; color: #64748B; text-align: center; margin-bottom: 3mm; letter-spacing: 0.08em; }
        }
        @media screen { #print-cards-area { display: none; } }
      `}} />

      {/* Hidden print area */}
      <div id="print-cards-area">
        <div className="print-card-slot">
          <p className="print-label">FRONT SIDE</p>
          <div className="nfc-card-wrap">
            <FrontCardPreview bg={cardBg} name={cardName} subTitle={cardSub} logoDataUrl={logoUrl} logoPlacement={cust.logoPlacement || "top-left"} logoSize={cust.logoSize || 44} fontColor={cust.fontColor} fontFamily={cust.fontFamily} backgroundStyle={cust.backgroundStyle} accentColor={cust.accentColor} frontQrEnabled={cust.frontQrEnabled} frontQrPlacement={cust.frontQrPlacement} frontQrColor={cust.frontQrColor} qrStyle={cust.qrStyle} profileUrl={profileUrl} skinSvgContent={skinSvgContent} />
          </div>
        </div>
        <div className="print-card-slot">
          <p className="print-label">BACK SIDE</p>
          <div className="nfc-card-wrap">
            <BackCardPreview bg={backBg} backContent={cust.backContent || "logo"} backLogoDataUrl={cust.backLogoDataUrl} backLogoPlacement={cust.backLogoPlacement} backLogoSize={cust.backLogoSize} qrFgColor={cust.qrFgColor} profileUrl={profileUrl} qrStyle={cust.qrStyle} backgroundStyle={cust.backgroundStyle} accentColor={cust.accentColor} skinSvgContent={skinSvgContent} />
          </div>
        </div>
      </div>

      {/* Off-screen cards always in DOM — html-to-image captures these regardless of which face is visible */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, width: "460px", pointerEvents: "none", opacity: 0, zIndex: -1 }}>
        <div ref={frontRef}>
          <FrontCardPreview bg={cardBg} name={cardName} subTitle={cardSub} logoDataUrl={logoUrl} logoPlacement={cust.logoPlacement || "top-left"} logoSize={cust.logoSize || 44} fontColor={cust.fontColor} fontFamily={cust.fontFamily} backgroundStyle={cust.backgroundStyle} accentColor={cust.accentColor} frontQrEnabled={cust.frontQrEnabled} frontQrPlacement={cust.frontQrPlacement} frontQrColor={cust.frontQrColor} qrStyle={cust.qrStyle} profileUrl={profileUrl} skinSvgContent={skinSvgContent} />
        </div>
        <div ref={backRef} style={{ marginTop: "16px" }}>
          <BackCardPreview bg={backBg} backContent={cust.backContent || "logo"} backLogoDataUrl={cust.backLogoDataUrl} backLogoPlacement={cust.backLogoPlacement} backLogoSize={cust.backLogoSize} qrFgColor={cust.qrFgColor} profileUrl={profileUrl} qrStyle={cust.qrStyle} backgroundStyle={cust.backgroundStyle} accentColor={cust.accentColor} skinSvgContent={skinSvgContent} />
        </div>
      </div>

      <div className="flex flex-col gap-5">

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/orders"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              style={{ border: "1px solid #E2E8F0" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Link>
            <div>
              <h1 className="text-[17px] font-bold text-slate-800">{order.order_number}</h1>
              <p className="text-[12px] text-slate-400">{formatDateTime(order.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge map={PAYMENT_STATUS} value={order.payment_status} />
            <StatusBadge map={ORDER_STATUS}   value={order.order_status}   />
            <button onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#28DC4F", color: "#000" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
              </svg>
              Print Card
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-5 lg:col-span-2">

            {/* Delivery Timeline */}
            <SectionCard title="Delivery Timeline">
              <OrderTimeline orderStatus={order.order_status} />
              {order.order_status === "cancelled" && (
                <div className="mt-4 flex justify-center">
                  <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: "#FEE2E2", color: "#DC2626" }}>
                    Order Cancelled
                  </span>
                </div>
              )}
            </SectionCard>

            {/* Order Information */}
            <SectionCard title="Order Information">
              <InfoRow label="Order Number"  value={order.order_number} mono />
              <InfoRow label="Order Date"    value={formatDateTime(order.created_at)} />
              <InfoRow label="Payment ID"    value={order.payment_id} mono />
              <InfoRow label="Amount Paid"   value={`₹${Number(order.total_amount).toLocaleString("en-IN")}`} />
              <InfoRow label="Payment"       value={<StatusBadge map={PAYMENT_STATUS} value={order.payment_status} />} />
              <InfoRow label="Order Status"  value={<StatusBadge map={ORDER_STATUS}   value={order.order_status}   />} />
            </SectionCard>

            {/* Customer Information */}
            <SectionCard title="Customer Information">
              <InfoRow label="Full Name"   value={order.user?.full_name} />
              <InfoRow label="Email"       value={order.user?.email} />
              <InfoRow label="Phone"       value={order.user?.phone} />
              {profile && (
                <>
                  <InfoRow label="Designation"  value={profile.designation} />
                  <InfoRow label="Company"       value={profile.company_name} />
                  <InfoRow label="Profile Email" value={profile.email} />
                  <InfoRow label="Profile Phone" value={profile.phone} />
                  {profile.website && <InfoRow label="Website" value={profile.website} />}
                </>
              )}
            </SectionCard>

            {/* Product */}
            <SectionCard title="Product">
              <InfoRow label="Name"        value={order.product?.name} />
              <InfoRow label="List Price"  value={order.product?.price ? `₹${Number(order.product.price).toLocaleString("en-IN")}` : null} />
              <InfoRow label="Amount Paid" value={`₹${Number(order.total_amount).toLocaleString("en-IN")}`} />
            </SectionCard>

            {/* Shipping Address */}
            {(shipAddr || addr) && (
              <SectionCard title="Shipping Address">
                {addr ? (
                  <p className="text-[13px] text-slate-700 leading-relaxed">{addr}</p>
                ) : (
                  <>
                    {shipAddr.full_name && <InfoRow label="Name"     value={shipAddr.full_name} />}
                    {shipAddr.phone     && <InfoRow label="Phone"    value={shipAddr.phone} />}
                    {shipAddr.email     && <InfoRow label="Email"    value={shipAddr.email} />}
                    {shipAddr.street    && <InfoRow label="Street"   value={shipAddr.street} />}
                    {shipAddr.landmark  && <InfoRow label="Landmark" value={shipAddr.landmark} />}
                    {(shipAddr.city || shipAddr.state) && (
                      <InfoRow label="City / State" value={[shipAddr.city, shipAddr.state].filter(Boolean).join(", ")} />
                    )}
                    {shipAddr.pincode   && <InfoRow label="Pincode"  value={shipAddr.pincode} />}
                  </>
                )}
              </SectionCard>
            )}

            {/* Admin Notes */}
            <SectionCard
              title="Admin Notes"
              action={
                <button onClick={handleSaveNotes} disabled={savingNotes}
                  className="rounded-lg px-3 py-1 text-[12px] font-semibold transition-colors disabled:opacity-50"
                  style={{ background: notesSaved ? "#DCFCE7" : "#28DC4F", color: notesSaved ? "#16a34a" : "#000" }}>
                  {savingNotes ? "Saving…" : notesSaved ? "Saved ✓" : "Save"}
                </button>
              }>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes: shipping instructions, customer requests, follow-up actions…"
                rows={4}
                className="w-full resize-none rounded-lg p-3 text-[13px] text-slate-700 outline-none focus:ring-2 focus:ring-green-200"
                style={{ border: "1px solid #E2E8F0", lineHeight: "1.6" }}
              />
            </SectionCard>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-5">

            {/* Physical NFC Card Preview */}
            <div className="rounded-xl bg-white" style={{ border: "1px solid #E2E8F0" }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold text-slate-700">Physical NFC Card</h3>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(40,220,79,0.12)", color: "#16A34A" }}>Active</span>
                  {cust.design_method === "upload_own_design" && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "#EFF6FF", color: "#3B82F6" }}>Custom Upload</span>
                  )}
                </div>
                {/* Front / Back Side toggle */}
                <div className="flex overflow-hidden rounded-lg" style={{ border: "1px solid #E2E8F0" }}>
                  {[["front", "Front Side"], ["back", "Back Side"]].map(([face, label]) => (
                    <button key={face} onClick={() => setCardFace(face)}
                      className="px-3 py-1 text-[11px] font-medium transition-colors"
                      style={{ background: cardFace === face ? "#18181B" : "#fff", color: cardFace === face ? "#fff" : "#6B7280" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                {/* Card preview */}
                <div className="overflow-hidden rounded-[12px] bg-[#F5F5F5] p-4">
                  {cust.design_method === "upload_own_design" ? (
                    (() => {
                      const src = cardFace === "front" ? cust.uploaded_front_design : cust.uploaded_back_design;
                      if (src) {
                        return (
                          <div style={{ aspectRatio: "5/3", background: "#111", borderRadius: "10px", overflow: "hidden" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`${cardFace} design`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                          </div>
                        );
                      }
                      return (
                        <div style={{ aspectRatio: "5/3", background: "#F1F5F9", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #CBD5E1" }}>
                          <p className="text-[12px] text-slate-400">
                            {cardFace === "front" ? "Front design not available" : "Back design not uploaded"}
                          </p>
                        </div>
                      );
                    })()
                  ) : (
                    cardFace === "front"
                      ? <FrontCardPreview cardRef={screenFrontRef} bg={cardBg} name={cardName} subTitle={cardSub} logoDataUrl={logoUrl} logoPlacement={cust.logoPlacement || "top-left"} logoSize={cust.logoSize || 44} fontColor={cust.fontColor} fontFamily={cust.fontFamily} backgroundStyle={cust.backgroundStyle} accentColor={cust.accentColor} frontQrEnabled={cust.frontQrEnabled} frontQrPlacement={cust.frontQrPlacement} frontQrColor={cust.frontQrColor} qrStyle={cust.qrStyle} profileUrl={profileUrl} skinSvgContent={skinSvgContent} />
                      : <BackCardPreview  cardRef={screenBackRef}  bg={backBg} backContent={cust.backContent || "logo"} backLogoDataUrl={cust.backLogoDataUrl} backLogoPlacement={cust.backLogoPlacement} backLogoSize={cust.backLogoSize} qrFgColor={cust.qrFgColor} profileUrl={profileUrl} qrStyle={cust.qrStyle} backgroundStyle={cust.backgroundStyle} accentColor={cust.accentColor} skinSvgContent={skinSvgContent} />
                  )}
                </div>

                {!profile && (
                  <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-[11px] text-amber-600" style={{ border: "1px solid #FDE68A" }}>
                    Customer hasn&apos;t completed profile setup. Card shows placeholder data.
                  </p>
                )}

                {/* Action buttons */}
                {cust.design_method === "upload_own_design" ? (
                  <div className="mt-3 flex flex-col gap-2">
                    {[
                      { label: "Front Design", src: cust.uploaded_front_design, face: "front" },
                      { label: "Back Design",  src: cust.uploaded_back_design,  face: "back"  },
                    ].map(({ label, src, face }) => src ? (
                      <div key={face} className="flex gap-2">
                        <a
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[12px] font-semibold transition-opacity hover:opacity-90"
                          style={{ background: "#F1F5F9", color: "#374151", border: "1px solid #E2E8F0" }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          Open {label}
                        </a>
                        <a
                          href={src}
                          download={`${order?.order_number ?? "order"}-${face}-design`}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[12px] font-semibold transition-opacity hover:opacity-90"
                          style={{ background: "#18181B", color: "#fff" }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                          Download
                        </a>
                      </div>
                    ) : (
                      <div
                        key={face}
                        className="flex items-center justify-center rounded-lg py-2.5 text-[12px] text-slate-400"
                        style={{ background: "#F8FAFC", border: "1px dashed #CBD5E1" }}
                      >
                        {face === "front" ? "Front design not available" : "Back design not uploaded"}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleDownload(cardFace)}
                        disabled={downloading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: "#F1F5F9", color: "#374151", border: "1px solid #E2E8F0" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        {downloading ? "Saving…" : `Download ${cardFace === "front" ? "Front" : "Back"}`}
                      </button>
                      <button
                        onClick={handlePrint}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-[12px] font-semibold transition-opacity hover:opacity-90"
                        style={{ background: "#0F172A", color: "#fff" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                        </svg>
                        Print Both
                      </button>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => handleDownload("front")} disabled={downloading}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
                        style={{ background: "#F8FAFC", color: "#64748B", border: "1px dashed #CBD5E1" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Front PNG
                      </button>
                      <button onClick={() => handleDownload("back")} disabled={downloading}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
                        style={{ background: "#F8FAFC", color: "#64748B", border: "1px dashed #CBD5E1" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Back PNG
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* NFC Card URL */}
            <SectionCard title="NFC Card URL">
              {profileUrl ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-600 overflow-hidden"
                      style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                      {profileUrl}
                    </div>
                    <button onClick={handleCopyUrl}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-slate-100"
                      style={{ border: "1px solid #E2E8F0" }} title="Copy URL">
                      {copied
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28DC4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      }
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-4" style={{ border: "1px solid #E2E8F0" }}>
                    <div ref={qrRef} className="bg-white p-2 rounded-lg" style={{ width: 136, height: 136 }}>
                      <RealQrCode color={cust.qrFgColor || "#18181B"} qrStyle={cust.qrStyle || "minimal"} data={profileUrl} width={120} height={120} />
                    </div>
                    <p className="text-[10px] text-slate-400">Scan to verify profile</p>
                    <button
                      onClick={handleDownloadQR}
                      disabled={qrDownloading}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ background: "#F1F5F9", color: "#374151", border: "1px solid #E2E8F0" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      {qrDownloading ? "Saving…" : "Download QR"}
                    </button>
                  </div>

                  <div className="rounded-lg bg-green-50 px-3 py-2.5" style={{ border: "1px solid #BBFFD6" }}>
                    <p className="text-[11px] font-semibold text-green-700 mb-1">Write to NFC Chip</p>
                    <p className="text-[10px] text-green-600 leading-relaxed">
                      Use NFC Tools or TagWriter app. Select &quot;Write&quot; → &quot;URL&quot; and paste the URL above before shipping the card.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  <p className="text-[12px] text-slate-400">No profile URL yet</p>
                  <p className="text-[11px] text-slate-300">Customer must complete profile setup first.</p>
                </div>
              )}
            </SectionCard>

            {/* Card Design */}
            {(cust.design_method || cust.cardColor || cust.fontColor || logoUrl) && (
              <SectionCard title="Card Design">
                {cust.design_method && (
                  <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <span className="text-[12px] text-slate-400 shrink-0 w-28">Design Method</span>
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={cust.design_method === "upload_own_design"
                        ? { background: "#EFF6FF", color: "#3B82F6" }
                        : { background: "#F0FFF4", color: "#16A34A" }}
                    >
                      {cust.design_method === "upload_own_design" ? "Custom Upload" : "Customized Online"}
                    </span>
                  </div>
                )}
                {cust.cardColor && (
                  <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <span className="text-[12px] text-slate-400 shrink-0 w-28">Card Color</span>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 18, height: 18, borderRadius: 4, background: cust.cardColor, border: "1px solid #E2E8F0", flexShrink: 0 }} />
                      <span className="font-mono text-[13px] text-slate-800">{cust.cardColor.toUpperCase()}</span>
                    </div>
                  </div>
                )}
                {cust.fontColor && (
                  <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <span className="text-[12px] text-slate-400 shrink-0 w-28">Font Color</span>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 18, height: 18, borderRadius: 4, background: cust.fontColor, border: "1px solid #E2E8F0", flexShrink: 0 }} />
                      <span className="font-mono text-[13px] text-slate-800">{cust.fontColor.toUpperCase()}</span>
                    </div>
                  </div>
                )}
                {cust.fontLabel && cust.fontLabel !== "Default" && (
                  <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <span className="text-[12px] text-slate-400 shrink-0 w-28">Font Style</span>
                    <span className="text-[13px] text-slate-800" style={{ fontFamily: cust.fontFamily || "sans-serif", fontWeight: 600 }}>
                      {cust.fontLabel}
                    </span>
                  </div>
                )}
                {logoUrl && (
                  <div className="flex items-center justify-between gap-4 py-2">
                    <span className="text-[12px] text-slate-400 shrink-0 w-28">Logo</span>
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Logo" style={{ height: 32, maxWidth: 80, objectFit: "contain", borderRadius: 6, background: "#F1F5F9", padding: "3px 5px", border: "1px solid #E2E8F0" }} crossOrigin="anonymous" />
                      <button
                        onClick={handleDownloadLogo}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-opacity hover:opacity-80"
                        style={{ background: "#F1F5F9", color: "#374151", border: "1px solid #E2E8F0" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* SVG Background */}
            {cust.svgBackground && (
              <SectionCard title="SVG Background Style">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <span className="text-[12px] text-slate-400 shrink-0 w-28">Style Name</span>
                    <span className="text-[13px] font-semibold text-slate-800">{cust.svgBackground.backgroundStyleName || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <span className="text-[12px] text-slate-400 shrink-0 w-28">SVG File</span>
                    <span className="font-mono text-[11px] text-slate-600 truncate">{cust.svgBackground.backgroundStyleFile || "—"}</span>
                  </div>
                  {cust.svgBackground.selectedSvgColors?.length > 0 && (
                    <div className="flex flex-col gap-2 py-2">
                      <span className="text-[12px] text-slate-400">Customized Colors ({cust.svgBackground.selectedSvgColors.length})</span>
                      <div className="flex flex-wrap gap-2">
                        {cust.svgBackground.selectedSvgColors.map((c, i) => (
                          <div key={i} className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: c.original, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                            <span className="font-mono text-[10px] text-slate-400">{c.original}</span>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 5h4M5 3l2 2-2 2" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: c.selected, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                            <span className="font-mono text-[10px] text-slate-800">{c.selected}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Status Controls */}
            <SectionCard title="Update Status">
              {updateError && (
                <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-600" style={{ border: "1px solid #FECACA" }}>{updateError}</div>
              )}
              <div className="mb-4">
                <p className="mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Order Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(ORDER_STATUS).map(([value, style]) => (
                    <button key={value} disabled={updating || order.order_status === value}
                      onClick={() => handleUpdateOrderStatus(value)}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ background: style.bg, color: style.text }}>
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Payment Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(PAYMENT_STATUS).map(([value, style]) => (
                    <button key={value} disabled={updating || order.payment_status === value}
                      onClick={() => handleUpdatePaymentStatus(value)}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ background: style.bg, color: style.text }}>
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
              {updating && <p className="mt-3 text-center text-[12px] text-slate-400">Updating…</p>}
            </SectionCard>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
