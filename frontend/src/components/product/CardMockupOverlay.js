"use client";

import { useRef, useEffect } from "react";

// Map logoSize slider value (20–80) to % of card width (8–22%)
function pxToPct(size) {
  return Math.round(((size || 44) / 80) * 14) + 8;
}

// Placement → absolute CSS position object (percentage-based only)
function placementPos(placement) {
  switch (placement) {
    case "top-left":      return { top: "8%",    left: "6%"  };
    case "top-center":    return { top: "8%",    left: "50%", transform: "translateX(-50%)" };
    case "top-right":     return { top: "8%",    right: "6%" };
    case "center-left":   return { top: "50%",   left: "6%",  transform: "translateY(-50%)" };
    case "center":        return { top: "50%",   left: "50%", transform: "translate(-50%,-50%)" };
    case "center-right":  return { top: "50%",   right: "6%", transform: "translateY(-50%)" };
    case "bottom-left":   return { bottom: "22%", left: "6%" };
    case "bottom-center": return { bottom: "22%", left: "50%", transform: "translateX(-50%)" };
    case "bottom-right":  return { bottom: "18%", right: "10%" };
    default:              return { top: "8%",    left: "6%"  };
  }
}

// Background pattern overlay — rendered above card colour, below image & text
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
  if (style === "gold-flow") {
    const sw = (op) => ({ stroke: "#ffffff", strokeOpacity: op, strokeWidth: "2", fill: "none", strokeMiterlimit: 10 });
    return (
      <svg style={s} viewBox="0 0 1012 638" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id="gf-base" x1="0" y1="0" x2="1012" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0"   stopColor={ac} stopOpacity="0.65"/>
            <stop offset="0.5" stopColor="#ffffff"  stopOpacity="0.20"/>
            <stop offset="1"   stopColor={ac} stopOpacity="0.40"/>
          </linearGradient>
        </defs>
        {/* Metallic base sheen — the extra layer from the gold SVG */}
        <rect width="1012" height="638" fill="url(#gf-base)"/>
        {/* Diagonal overlay fills */}
        <path d="M856.07-142c0.41 4.48-2.63 10.88-3.64 14.93-5.2 20.63-12.6 41.11-19.18 61.35-52.9 162.76-188.26 293.51-361.07 318.04-89.39 12.68-180.15-2.91-270.43-2.89-52.9 0.01-107.01 6.29-156.6 25.54-48.45 18.8-85.36 52.51-123 86.78-1.97 1.78-4.59 2.79-5.15 5.58v-509.33z" fill={ac} fillOpacity="0.15" style={{ mixBlendMode: "overlay" }}/>
        <path d="M317.33 838.54c-0.41-4.48 2.63-10.88 3.65-14.93 5.2-20.63 12.6-41.11 19.18-61.35 52.89-162.76 188.25-293.51 361.07-318.04 89.39-12.68 180.14 2.91 270.42 2.89 52.9-0.01 107.02-6.29 156.61-25.54 48.45-18.8 85.36-52.51 123-86.78 1.96-1.78 4.59-2.79 5.15-5.58v509.33z" fill={ac} fillOpacity="0.15" style={{ mixBlendMode: "overlay" }}/>
        {/* Bottom fan — 7 flowing curves */}
        <path style={sw(0.50)} d="M200.24 683.17c-3.32-18.58 10.93-36.25 20.75-50.83 12.56-18.65 27-36.05 42.98-51.87 31.47-31.15 68.97-56.25 110-72.96 47.53-19.36 98.86-27.51 149.98-23.32 53.94 4.42 106.29 19.19 159.54 28.01 127.17 21.06 259.03 6.51 379.42-39.1 12.33-4.67 28.58-15.53 41.77-16.58"/>
        <path style={sw(0.43)} d="M243.79 680.61c-2.77-17.13 9.28-33.46 17.79-47.17 10.87-17.45 23.55-33.78 37.75-48.68 27.92-29.29 61.78-52.99 99.24-69.16 44.98-19.44 94.06-27.28 142.71-22.43 9.23 0.92 18.41 2.2 27.54 3.76 41.51 7.09 81.84 19.47 122.74 28.36q10.86 2.36 21.78 4.37c98.42 18.16 199.94 13.76 296.56-9.58 13.83-3.35 27.53-7.09 41.15-11.14 6.05-1.79 12.93-4.85 19.9-7.57 5.04-1.96 10.12-3.75 14.98-4.73q2.14-0.51 4.18-0.62 0.49 0.02 0.97 0.05"/>
        <path style={sw(0.36)} d="M287.33 678.04c-2.21-15.66 7.63-30.66 14.84-43.51 9.19-16.24 20.11-31.5 32.52-45.48 24.37-27.42 54.58-49.76 88.47-65.37 42.44-19.55 89.27-27.05 135.45-21.53 8.75 1.05 17.45 2.48 26.08 4.22 39.2 7.93 76.8 21.46 114.95 32.02q10.12 2.8 20.3 5.29c91.95 22.55 187.62 23.84 279.91 8.57 13.2-2.19 26.29-4.72 39.34-7.46 5.91-1.24 12.5-3.46 19.17-5.47 4.82-1.44 9.68-2.78 14.37-3.51q2.05-0.46 3.97-0.41 0.4 0.1 0.79 0.22"/>
        <path style={sw(0.29)} d="M330.88 675.48c-1.66-14.21 5.96-27.89 11.89-39.85 7.46-15.06 16.66-29.23 27.27-42.29 20.84-25.56 47.38-46.57 77.72-61.57 39.86-19.71 84.47-26.82 128.18-20.63q12.41 1.76 24.61 4.68c36.9 8.76 71.77 23.45 107.16 35.66q9.39 3.24 18.83 6.21c85.48 26.95 175.29 33.93 263.27 26.73 12.56-1.04 25.05-2.33 37.52-3.79 5.78-0.67 12.07-2.08 18.43-3.37 4.61-0.93 9.26-1.8 13.77-2.27q1.96-0.42 3.77-0.2 0.3 0.18 0.6 0.38"/>
        <path style={sw(0.22)} d="M374.43 672.92c-1.1-12.76 4.3-25.1 8.93-36.19 5.78-13.86 13.21-26.96 22.04-39.09 17.29-23.71 40.14-43.44 66.96-57.79 37.26-19.93 79.67-26.59 120.91-19.73q11.69 1.95 23.14 5.14c34.6 9.6 66.74 25.44 99.37 39.32q8.65 3.68 17.36 7.13c79.01 31.33 162.96 44.01 246.62 44.88q17.89 0.18 35.71-0.11c5.65-0.1 11.65-0.7 17.7-1.27 4.39-0.41 8.82-0.83 13.16-1.04q1.87-0.37 3.56 0 0.21 0.27 0.42 0.54"/>
        <path style={sw(0.16)} d="M417.98 670.35c-0.55-11.29 2.67-22.29 5.97-32.53 4.12-12.63 9.77-24.69 16.81-35.89 13.74-21.85 32.87-40.36 56.2-53.99 34.62-20.23 74.87-26.36 113.64-18.84q10.96 2.13 21.68 5.6c32.28 10.44 61.7 27.43 91.58 42.97q7.91 4.12 15.88 8.05c72.54 35.73 150.64 54.1 229.98 63.05 11.3 1.26 22.58 2.54 33.89 3.55 5.52 0.5 11.22 0.7 16.96 0.84 4.18 0.11 8.39 0.14 12.57 0.19q1.77-0.33 3.35 0.2 0.11 0.35 0.23 0.71"/>
        <path style={sw(0.10)} d="M461.53 667.79c0-45.15 21.53-86.87 60.03-111.77 37.9-24.51 84.65-27.66 126.58-11.88 35.27 13.28 65.99 36.04 98.2 55.6 66.08 40.12 138.31 64.18 213.33 81.2 16.02 3.63 32.06 7.69 48.3 10.17q5.96 0.96 11.97 1.41 1.68-0.27 3.14 0.41 0.02 0.44 0.04 0.88"/>
        {/* Diagonal fan — 7 sweeping curves */}
        <path style={sw(0.50)} d="M231-75.11c4.33 0.05 5.74-0.31 9.14 2.97 45.5 43.86 19.1 117.45 27.79 172.74 24.72 157.23 177.82 245.06 328.8 218.02 78.89-14.13 143.76-61.74 210.49-103.6 77.23-48.44 152.39-100.08 228.63-149.87 15.55-10.16 31.52-19.62 47.19-29.59 11.18-7.11 22.28-14.62 32.47-23.13"/>
        <path style={sw(0.43)} d="M264.01-68.95c3.58 0.43 4.82 0.5 7.72 3.64 4.56 4.95 8.45 10.3 11.58 15.83 6.47 11.44 9.49 24.17 11.11 37.4 2.97 24.32-0.38 50.62-2.11 75.45-0.48 6.93-0.76 13.81-0.83 20.45-0.05 5.22-0.05 10.23 0.49 15.25 2.2 20.4 6.32 39.51 12.32 57.43 4 11.88 9.04 23.23 14.62 34 4.9 9.43 10.41 18.4 16.74 26.99 7.42 10.04 15.36 19.46 24.31 28.16 6.72 6.49 14.11 12.62 21.77 18.18 16.16 11.82 34.03 21.26 52.98 28.71 11 4.33 22.33 7.58 33.95 10.28 6.65 1.54 13.35 2.71 20.15 3.67 9.8 1.38 19.71 2.38 29.7 2.66 12.64 0.36 25.18-0.38 37.82-1.97 8.94-1.12 17.93-2.55 26.86-4.49 17.67-3.88 34.17-9.9 50.23-17.06 16.1-7.2 31.7-15.43 46.68-24.77 16.85-10.46 33.31-21.83 49.63-33.43 14.24-10.12 28.47-20.35 42.82-30.29q16.35-11.33 32.59-22.84c33.35-23.66 66.39-47.77 99.99-71.47 24.92-17.59 50.06-34.88 75.54-51.77 14.57-9.67 29.58-18.56 44.37-27.8 10.5-6.58 20.96-13.45 30.65-21.16"/>
        <path style={sw(0.36)} d="M297.02-62.78c2.82 0.81 3.9 1.31 6.29 4.3 3.92 4.9 7.42 10.17 10.2 15.48 5.74 11.03 7.91 23.26 9.22 35.77 2.39 23.22-1.42 48-4.25 71.3-0.77 6.48-1.34 12.97-1.83 19.21-0.38 4.89-0.88 9.48-0.63 14.27 0.95 18.72 3.18 36.29 7.03 52.93 2.58 11 6.29 21.62 10.22 31.76 3.45 8.85 7.49 17.34 12.58 25.62 5.93 9.64 12.12 18.81 19.67 27.32 5.62 6.32 12.27 12.34 19.03 17.74 14.48 11.56 30.79 20.53 48.24 27.74 10.17 4.2 20.63 7 31.43 9.47 6.18 1.41 12.37 2.34 18.68 3.1 9.09 1.1 18.27 1.98 27.5 2.01 11.76 0.01 23.16-1.25 34.71-3.3 8.16-1.44 16.41-3.04 24.54-5.18 16.17-4.32 30.85-10.96 45.22-18.46 14.43-7.56 28.45-15.76 41.6-25.32 14.75-10.67 29.22-22.04 43.55-33.62 12.51-10.11 25.13-20.23 37.86-30.11 9.67-7.49 19.34-15.03 28.94-22.64 29.6-23.45 58.94-47.22 89.42-70.21 22.61-17.05 45.66-33.53 69.25-49.44 13.59-9.17 27.64-17.49 41.55-26.01 9.83-6.03 19.64-12.27 28.83-19.18"/>
        <path style={sw(0.29)} d="M330.03-56.61c2.06 1.18 2.97 2.13 4.87 4.96 3.26 4.86 6.39 10.03 8.8 15.14 5.01 10.61 6.34 22.34 7.34 34.14 1.82 22.12-2.47 45.36-6.38 67.14-1.07 6.03-1.92 12.14-2.84 17.97-0.72 4.56-1.7 8.73-1.76 13.29-0.23 17.03 0.01 33.07 1.74 48.43 1.14 10.13 3.54 20.01 5.82 29.51 2.02 8.29 4.58 16.29 8.43 24.26 4.46 9.23 8.9 18.14 15.04 26.47 4.53 6.15 10.4 12.09 16.28 17.32 12.76 11.32 27.54 19.8 43.5 26.75 9.34 4.08 18.94 6.43 28.91 8.66 5.71 1.28 11.38 1.98 17.21 2.55 8.38 0.81 16.83 1.58 25.31 1.34 10.87-0.33 21.12-2.12 31.59-4.62 7.39-1.76 14.89-3.53 22.22-5.88 14.68-4.76 27.53-12.01 40.21-19.86 12.76-7.91 25.2-16.09 36.51-25.86 12.67-10.87 25.14-22.26 37.48-33.81 10.78-10.1 21.78-20.11 32.9-29.92 8.45-7.45 16.91-14.91 25.29-22.44 25.85-23.25 51.49-46.68 78.85-68.95 20.3-16.53 41.25-32.19 62.96-47.11 12.61-8.68 25.7-16.43 38.73-24.23 9.16-5.49 18.32-11.08 27.02-17.2"/>
        <path style={sw(0.22)} d="M363.04-50.44c1.31 1.55 2.02 2.95 3.45 5.62 2.57 4.84 5.36 9.89 7.41 14.79 4.27 10.2 4.76 21.43 5.44 32.52 1.26 21.01-3.5 42.72-8.5 62.98-1.37 5.59-2.5 11.31-3.85 16.72-1.05 4.24-2.51 7.99-2.89 12.32-1.35 15.34-3.12 29.84-3.55 43.93-0.28 9.25 0.79 18.4 1.43 27.27 0.58 7.72 1.67 15.22 4.27 22.88 3 8.82 5.68 17.48 10.4 25.64 3.45 5.97 8.53 11.83 13.55 16.88 11.03 11.11 24.29 19.07 38.75 25.78 8.5 3.95 17.25 5.84 26.39 7.85 5.23 1.15 10.39 1.6 15.73 1.98 7.68 0.54 15.4 1.18 23.12 0.69 9.98-0.67 19.1-3 28.48-5.95 6.61-2.09 13.37-4.01 19.9-6.57 13.19-5.17 24.21-13.07 35.21-21.26 11.08-8.27 21.94-16.42 31.42-26.41 10.58-11.07 21.05-22.47 31.4-34 9.05-10.09 18.43-20 27.95-29.74 7.22-7.39 14.47-14.77 21.63-22.24 22.09-23.03 44.04-46.14 68.28-67.68 17.99-16 36.85-30.84 56.67-44.78 11.63-8.19 23.75-15.37 35.92-22.45 8.47-4.94 16.99-9.9 25.19-15.22"/>
        <path style={sw(0.16)} d="M396.05-44.27c0.55 1.93 1.06 3.79 2.02 6.29 1.87 4.82 4.33 9.75 6.03 14.44 3.53 9.78 3.17 20.51 3.55 30.88 0.69 19.91-4.54 40.09-10.64 58.83-1.66 5.14-3.08 10.48-4.85 15.48-1.39 3.9-3.29 7.24-4.01 11.34-2.41 13.66-6.23 26.62-8.85 39.43-1.67 8.37-1.95 16.78-2.96 25.03-0.86 7.15-1.23 14.15 0.11 21.51 1.54 8.41 2.48 16.79 5.76 24.79 2.38 5.79 6.67 11.59 10.81 16.45 9.3 10.91 21.04 18.34 34.01 24.81 7.67 3.82 15.56 5.26 23.87 7.04 4.76 1.02 9.4 1.23 14.26 1.41 6.98 0.26 13.96 0.79 20.92 0.03 9.1-1.01 17.08-3.87 25.36-7.28 5.84-2.4 11.85-4.5 17.59-7.25 11.69-5.65 20.88-14.13 30.2-22.66 9.4-8.62 18.69-16.75 26.34-26.96 8.49-11.27 16.96-22.68 25.32-34.19 7.32-10.08 15.09-19.88 22.99-29.55 5.99-7.34 12.04-14.65 17.98-22.04 18.34-22.83 36.59-45.6 57.71-66.43 15.69-15.46 32.45-29.49 50.38-42.44 10.64-7.7 21.81-14.31 33.1-20.67 7.8-4.4 15.67-8.71 23.37-13.25"/>
        <path style={sw(0.10)} d="M429.06-38.11c-0.62 7.09 3.25 14.41 5.24 21.05 2.8 9.36 1.59 19.6 1.66 29.26 0.12 18.8-5.59 37.46-12.77 54.67-1.96 4.69-3.66 9.65-5.86 14.23-1.72 3.58-4.05 6.51-5.14 10.36-3.39 12.02-9.37 23.41-14.13 34.94-3.1 7.5-4.71 15.17-7.37 22.79-2.29 6.57-4.11 13.08-4.03 20.14 0.09 7.99-0.72 16.11 1.12 23.95 1.31 5.6 4.78 11.34 8.06 16.02 7.54 10.71 17.8 17.61 29.28 23.82 6.83 3.7 13.85 4.69 21.35 6.24 4.28 0.89 8.41 0.86 12.78 0.84 6.27-0.02 12.52 0.39 18.72-0.63 8.22-1.34 15.05-4.73 22.25-8.6 5.07-2.72 10.33-4.99 15.27-7.94 10.19-6.09 17.56-15.19 25.2-24.06 7.72-8.98 15.43-17.09 21.25-27.52 6.39-11.47 12.87-22.89 19.24-34.37 9.82-17.7 21.4-34.21 32.36-51.21 14.59-22.62 29.15-45.05 47.14-65.16 13.38-14.94 28.04-28.15 44.09-40.12 16.28-12.13 34.09-20.95 51.84-30.15"/>
      </svg>
    );
  }
  if (style === "silver-flow") {
    const sw = (op) => ({ stroke: ac, strokeOpacity: op, strokeWidth: "2", fill: "none", strokeMiterlimit: 10 });
    return (
      <svg style={s} viewBox="0 0 1012 638" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* Diagonal overlay fills */}
        <path d="M856.07-142c0.41 4.48-2.63 10.88-3.64 14.93-5.2 20.63-12.6 41.11-19.18 61.35-52.9 162.76-188.26 293.51-361.07 318.04-89.39 12.68-180.15-2.91-270.43-2.89-52.9 0.01-107.01 6.29-156.6 25.54-48.45 18.8-85.36 52.51-123 86.78-1.97 1.78-4.59 2.79-5.15 5.58v-509.33z" fill={ac} fillOpacity="0.15" style={{ mixBlendMode: "overlay" }}/>
        <path d="M317.33 838.54c-0.41-4.48 2.63-10.88 3.65-14.93 5.2-20.63 12.6-41.11 19.18-61.35 52.89-162.76 188.25-293.51 361.07-318.04 89.39-12.68 180.14 2.91 270.42 2.89 52.9-0.01 107.02-6.29 156.61-25.54 48.45-18.8 85.36-52.51 123-86.78 1.96-1.78 4.59-2.79 5.15-5.58v509.33z" fill={ac} fillOpacity="0.15" style={{ mixBlendMode: "overlay" }}/>
        {/* Bottom fan — 7 flowing curves */}
        <path style={sw(0.50)} d="M200.24 683.17c-3.32-18.58 10.93-36.25 20.75-50.83 12.56-18.65 27-36.05 42.98-51.87 31.47-31.15 68.97-56.25 110-72.96 47.53-19.36 98.86-27.51 149.98-23.32 53.94 4.42 106.29 19.19 159.54 28.01 127.17 21.06 259.03 6.51 379.42-39.1 12.33-4.67 28.58-15.53 41.77-16.58"/>
        <path style={sw(0.43)} d="M243.79 680.61c-2.77-17.13 9.28-33.46 17.79-47.17 10.87-17.45 23.55-33.78 37.75-48.68 27.92-29.29 61.78-52.99 99.24-69.16 44.98-19.44 94.06-27.28 142.71-22.43 9.23 0.92 18.41 2.2 27.54 3.76 41.51 7.09 81.84 19.47 122.74 28.36q10.86 2.36 21.78 4.37c98.42 18.16 199.94 13.76 296.56-9.58 13.83-3.35 27.53-7.09 41.15-11.14 6.05-1.79 12.93-4.85 19.9-7.57 5.04-1.96 10.12-3.75 14.98-4.73q2.14-0.51 4.18-0.62 0.49 0.02 0.97 0.05"/>
        <path style={sw(0.36)} d="M287.33 678.04c-2.21-15.66 7.63-30.66 14.84-43.51 9.19-16.24 20.11-31.5 32.52-45.48 24.37-27.42 54.58-49.76 88.47-65.37 42.44-19.55 89.27-27.05 135.45-21.53 8.75 1.05 17.45 2.48 26.08 4.22 39.2 7.93 76.8 21.46 114.95 32.02q10.12 2.8 20.3 5.29c91.95 22.55 187.62 23.84 279.91 8.57 13.2-2.19 26.29-4.72 39.34-7.46 5.91-1.24 12.5-3.46 19.17-5.47 4.82-1.44 9.68-2.78 14.37-3.51q2.05-0.46 3.97-0.41 0.4 0.1 0.79 0.22"/>
        <path style={sw(0.29)} d="M330.88 675.48c-1.66-14.21 5.96-27.89 11.89-39.85 7.46-15.06 16.66-29.23 27.27-42.29 20.84-25.56 47.38-46.57 77.72-61.57 39.86-19.71 84.47-26.82 128.18-20.63q12.41 1.76 24.61 4.68c36.9 8.76 71.77 23.45 107.16 35.66q9.39 3.24 18.83 6.21c85.48 26.95 175.29 33.93 263.27 26.73 12.56-1.04 25.05-2.33 37.52-3.79 5.78-0.67 12.07-2.08 18.43-3.37 4.61-0.93 9.26-1.8 13.77-2.27q1.96-0.42 3.77-0.2 0.3 0.18 0.6 0.38"/>
        <path style={sw(0.22)} d="M374.43 672.92c-1.1-12.76 4.3-25.1 8.93-36.19 5.78-13.86 13.21-26.96 22.04-39.09 17.29-23.71 40.14-43.44 66.96-57.79 37.26-19.93 79.67-26.59 120.91-19.73q11.69 1.95 23.14 5.14c34.6 9.6 66.74 25.44 99.37 39.32q8.65 3.68 17.36 7.13c79.01 31.33 162.96 44.01 246.62 44.88q17.89 0.18 35.71-0.11c5.65-0.1 11.65-0.7 17.7-1.27 4.39-0.41 8.82-0.83 13.16-1.04q1.87-0.37 3.56 0 0.21 0.27 0.42 0.54"/>
        <path style={sw(0.16)} d="M417.98 670.35c-0.55-11.29 2.67-22.29 5.97-32.53 4.12-12.63 9.77-24.69 16.81-35.89 13.74-21.85 32.87-40.36 56.2-53.99 34.62-20.23 74.87-26.36 113.64-18.84q10.96 2.13 21.68 5.6c32.28 10.44 61.7 27.43 91.58 42.97q7.91 4.12 15.88 8.05c72.54 35.73 150.64 54.1 229.98 63.05 11.3 1.26 22.58 2.54 33.89 3.55 5.52 0.5 11.22 0.7 16.96 0.84 4.18 0.11 8.39 0.14 12.57 0.19q1.77-0.33 3.35 0.2 0.11 0.35 0.23 0.71"/>
        <path style={sw(0.10)} d="M461.53 667.79c0-45.15 21.53-86.87 60.03-111.77 37.9-24.51 84.65-27.66 126.58-11.88 35.27 13.28 65.99 36.04 98.2 55.6 66.08 40.12 138.31 64.18 213.33 81.2 16.02 3.63 32.06 7.69 48.3 10.17q5.96 0.96 11.97 1.41 1.68-0.27 3.14 0.41 0.02 0.44 0.04 0.88"/>
        {/* Diagonal fan — 7 sweeping curves */}
        <path style={sw(0.50)} d="M231-75.11c4.33 0.05 5.74-0.31 9.14 2.97 45.5 43.86 19.1 117.45 27.79 172.74 24.72 157.23 177.82 245.06 328.8 218.02 78.89-14.13 143.76-61.74 210.49-103.6 77.23-48.44 152.39-100.08 228.63-149.87 15.55-10.16 31.52-19.62 47.19-29.59 11.18-7.11 22.28-14.62 32.47-23.13"/>
        <path style={sw(0.43)} d="M264.01-68.95c3.58 0.43 4.82 0.5 7.72 3.64 4.56 4.95 8.45 10.3 11.58 15.83 6.47 11.44 9.49 24.17 11.11 37.4 2.97 24.32-0.38 50.62-2.11 75.45-0.48 6.93-0.76 13.81-0.83 20.45-0.05 5.22-0.05 10.23 0.49 15.25 2.2 20.4 6.32 39.51 12.32 57.43 4 11.88 9.04 23.23 14.62 34 4.9 9.43 10.41 18.4 16.74 26.99 7.42 10.04 15.36 19.46 24.31 28.16 6.72 6.49 14.11 12.62 21.77 18.18 16.16 11.82 34.03 21.26 52.98 28.71 11 4.33 22.33 7.58 33.95 10.28 6.65 1.54 13.35 2.71 20.15 3.67 9.8 1.38 19.71 2.38 29.7 2.66 12.64 0.36 25.18-0.38 37.82-1.97 8.94-1.12 17.93-2.55 26.86-4.49 17.67-3.88 34.17-9.9 50.23-17.06 16.1-7.2 31.7-15.43 46.68-24.77 16.85-10.46 33.31-21.83 49.63-33.43 14.24-10.12 28.47-20.35 42.82-30.29q16.35-11.33 32.59-22.84c33.35-23.66 66.39-47.77 99.99-71.47 24.92-17.59 50.06-34.88 75.54-51.77 14.57-9.67 29.58-18.56 44.37-27.8 10.5-6.58 20.96-13.45 30.65-21.16"/>
        <path style={sw(0.36)} d="M297.02-62.78c2.82 0.81 3.9 1.31 6.29 4.3 3.92 4.9 7.42 10.17 10.2 15.48 5.74 11.03 7.91 23.26 9.22 35.77 2.39 23.22-1.42 48-4.25 71.3-0.77 6.48-1.34 12.97-1.83 19.21-0.38 4.89-0.88 9.48-0.63 14.27 0.95 18.72 3.18 36.29 7.03 52.93 2.58 11 6.29 21.62 10.22 31.76 3.45 8.85 7.49 17.34 12.58 25.62 5.93 9.64 12.12 18.81 19.67 27.32 5.62 6.32 12.27 12.34 19.03 17.74 14.48 11.56 30.79 20.53 48.24 27.74 10.17 4.2 20.63 7 31.43 9.47 6.18 1.41 12.37 2.34 18.68 3.1 9.09 1.1 18.27 1.98 27.5 2.01 11.76 0.01 23.16-1.25 34.71-3.3 8.16-1.44 16.41-3.04 24.54-5.18 16.17-4.32 30.85-10.96 45.22-18.46 14.43-7.56 28.45-15.76 41.6-25.32 14.75-10.67 29.22-22.04 43.55-33.62 12.51-10.11 25.13-20.23 37.86-30.11 9.67-7.49 19.34-15.03 28.94-22.64 29.6-23.45 58.94-47.22 89.42-70.21 22.61-17.05 45.66-33.53 69.25-49.44 13.59-9.17 27.64-17.49 41.55-26.01 9.83-6.03 19.64-12.27 28.83-19.18"/>
        <path style={sw(0.29)} d="M330.03-56.61c2.06 1.18 2.97 2.13 4.87 4.96 3.26 4.86 6.39 10.03 8.8 15.14 5.01 10.61 6.34 22.34 7.34 34.14 1.82 22.12-2.47 45.36-6.38 67.14-1.07 6.03-1.92 12.14-2.84 17.97-0.72 4.56-1.7 8.73-1.76 13.29-0.23 17.03 0.01 33.07 1.74 48.43 1.14 10.13 3.54 20.01 5.82 29.51 2.02 8.29 4.58 16.29 8.43 24.26 4.46 9.23 8.9 18.14 15.04 26.47 4.53 6.15 10.4 12.09 16.28 17.32 12.76 11.32 27.54 19.8 43.5 26.75 9.34 4.08 18.94 6.43 28.91 8.66 5.71 1.28 11.38 1.98 17.21 2.55 8.38 0.81 16.83 1.58 25.31 1.34 10.87-0.33 21.12-2.12 31.59-4.62 7.39-1.76 14.89-3.53 22.22-5.88 14.68-4.76 27.53-12.01 40.21-19.86 12.76-7.91 25.2-16.09 36.51-25.86 12.67-10.87 25.14-22.26 37.48-33.81 10.78-10.1 21.78-20.11 32.9-29.92 8.45-7.45 16.91-14.91 25.29-22.44 25.85-23.25 51.49-46.68 78.85-68.95 20.3-16.53 41.25-32.19 62.96-47.11 12.61-8.68 25.7-16.43 38.73-24.23 9.16-5.49 18.32-11.08 27.02-17.2"/>
        <path style={sw(0.22)} d="M363.04-50.44c1.31 1.55 2.02 2.95 3.45 5.62 2.57 4.84 5.36 9.89 7.41 14.79 4.27 10.2 4.76 21.43 5.44 32.52 1.26 21.01-3.5 42.72-8.5 62.98-1.37 5.59-2.5 11.31-3.85 16.72-1.05 4.24-2.51 7.99-2.89 12.32-1.35 15.34-3.12 29.84-3.55 43.93-0.28 9.25 0.79 18.4 1.43 27.27 0.58 7.72 1.67 15.22 4.27 22.88 3 8.82 5.68 17.48 10.4 25.64 3.45 5.97 8.53 11.83 13.55 16.88 11.03 11.11 24.29 19.07 38.75 25.78 8.5 3.95 17.25 5.84 26.39 7.85 5.23 1.15 10.39 1.6 15.73 1.98 7.68 0.54 15.4 1.18 23.12 0.69 9.98-0.67 19.1-3 28.48-5.95 6.61-2.09 13.37-4.01 19.9-6.57 13.19-5.17 24.21-13.07 35.21-21.26 11.08-8.27 21.94-16.42 31.42-26.41 10.58-11.07 21.05-22.47 31.4-34 9.05-10.09 18.43-20 27.95-29.74 7.22-7.39 14.47-14.77 21.63-22.24 22.09-23.03 44.04-46.14 68.28-67.68 17.99-16 36.85-30.84 56.67-44.78 11.63-8.19 23.75-15.37 35.92-22.45 8.47-4.94 16.99-9.9 25.19-15.22"/>
        <path style={sw(0.16)} d="M396.05-44.27c0.55 1.93 1.06 3.79 2.02 6.29 1.87 4.82 4.33 9.75 6.03 14.44 3.53 9.78 3.17 20.51 3.55 30.88 0.69 19.91-4.54 40.09-10.64 58.83-1.66 5.14-3.08 10.48-4.85 15.48-1.39 3.9-3.29 7.24-4.01 11.34-2.41 13.66-6.23 26.62-8.85 39.43-1.67 8.37-1.95 16.78-2.96 25.03-0.86 7.15-1.23 14.15 0.11 21.51 1.54 8.41 2.48 16.79 5.76 24.79 2.38 5.79 6.67 11.59 10.81 16.45 9.3 10.91 21.04 18.34 34.01 24.81 7.67 3.82 15.56 5.26 23.87 7.04 4.76 1.02 9.4 1.23 14.26 1.41 6.98 0.26 13.96 0.79 20.92 0.03 9.1-1.01 17.08-3.87 25.36-7.28 5.84-2.4 11.85-4.5 17.59-7.25 11.69-5.65 20.88-14.13 30.2-22.66 9.4-8.62 18.69-16.75 26.34-26.96 8.49-11.27 16.96-22.68 25.32-34.19 7.32-10.08 15.09-19.88 22.99-29.55 5.99-7.34 12.04-14.65 17.98-22.04 18.34-22.83 36.59-45.6 57.71-66.43 15.69-15.46 32.45-29.49 50.38-42.44 10.64-7.7 21.81-14.31 33.1-20.67 7.8-4.4 15.67-8.71 23.37-13.25"/>
        <path style={sw(0.10)} d="M429.06-38.11c-0.62 7.09 3.25 14.41 5.24 21.05 2.8 9.36 1.59 19.6 1.66 29.26 0.12 18.8-5.59 37.46-12.77 54.67-1.96 4.69-3.66 9.65-5.86 14.23-1.72 3.58-4.05 6.51-5.14 10.36-3.39 12.02-9.37 23.41-14.13 34.94-3.1 7.5-4.71 15.17-7.37 22.79-2.29 6.57-4.11 13.08-4.03 20.14 0.09 7.99-0.72 16.11 1.12 23.95 1.31 5.6 4.78 11.34 8.06 16.02 7.54 10.71 17.8 17.61 29.28 23.82 6.83 3.7 13.85 4.69 21.35 6.24 4.28 0.89 8.41 0.86 12.78 0.84 6.27-0.02 12.52 0.39 18.72-0.63 8.22-1.34 15.05-4.73 22.25-8.6 5.07-2.72 10.33-4.99 15.27-7.94 10.19-6.09 17.56-15.19 25.2-24.06 7.72-8.98 15.43-17.09 21.25-27.52 6.39-11.47 12.87-22.89 19.24-34.37 9.82-17.7 21.4-34.21 32.36-51.21 14.59-22.62 29.15-45.05 47.14-65.16 13.38-14.94 28.04-28.15 44.09-40.12 16.28-12.13 34.09-20.95 51.84-30.15"/>
      </svg>
    );
  }
  return null;
}

// Logo overlay — percentage width, auto height, capped at 25% of card height
function OverlayLogo({ src, alt, placement, sizePct }) {
  const pos = placementPos(placement);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      style={{
        position: "absolute",
        ...pos,
        width: `${sizePct}%`,
        height: "auto",
        maxHeight: "25%",
        objectFit: "contain",
        pointerEvents: "none",
      }}
    />
  );
}

// QR code placeholder — square, percentage-based, stays inside card
export function QrSvg({ color = "#18181B", qrStyle = "minimal" }) {

  /* ── 1. Minimal Luxury ─────────────────────────────────────────────
     Circular finders · sparse circle data · centre logo ring          */
  if (qrStyle === "minimal") return (
    <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
      <rect x="0.5"  y="0.5"  width="9" height="9" rx="4.5" stroke={color} strokeWidth="0.7" fill="none" />
      <circle cx="5"  cy="5"  r="2.2" fill={color} />
      <rect x="12.5" y="0.5"  width="9" height="9" rx="4.5" stroke={color} strokeWidth="0.7" fill="none" />
      <circle cx="17" cy="5"  r="2.2" fill={color} />
      <rect x="0.5"  y="12.5" width="9" height="9" rx="4.5" stroke={color} strokeWidth="0.7" fill="none" />
      <circle cx="5"  cy="17" r="2.2" fill={color} />
      {/* centre logo ring */}
      <circle cx="11" cy="11" r="2"   stroke={color} strokeWidth="0.5" fill="none" />
      <circle cx="11" cy="11" r="0.8" fill={color} />
      {/* sparse column dots */}
      <circle cx="11.2" cy="1.5" r="0.5" fill={color} />
      <circle cx="11.2" cy="3.5" r="0.5" fill={color} />
      <circle cx="11.2" cy="5.5" r="0.5" fill={color} />
      <circle cx="11.2" cy="7.5" r="0.5" fill={color} />
      {/* sparse row dots */}
      <circle cx="1.5" cy="11.2" r="0.5" fill={color} />
      <circle cx="3.5" cy="11.2" r="0.5" fill={color} />
      <circle cx="5.5" cy="11.2" r="0.5" fill={color} />
      <circle cx="7.5" cy="11.2" r="0.5" fill={color} />
      {/* data area */}
      <circle cx="13.5" cy="13.5" r="0.7" fill={color} />
      <circle cx="16"   cy="13.5" r="0.7" fill={color} />
      <circle cx="18.5" cy="13.5" r="0.7" fill={color} />
      <circle cx="13.5" cy="16"   r="0.7" fill={color} />
      <circle cx="18.5" cy="16"   r="0.7" fill={color} />
      <circle cx="16"   cy="18.5" r="0.7" fill={color} />
      <circle cx="13.5" cy="18.5" r="0.7" fill={color} />
      <circle cx="18.5" cy="18.5" r="0.7" fill={color} />
      <circle cx="21"   cy="14.5" r="0.5" fill={color} />
      <circle cx="21"   cy="17"   r="0.5" fill={color} />
      <circle cx="14.5" cy="21"   r="0.5" fill={color} />
      <circle cx="17"   cy="21"   r="0.5" fill={color} />
      <circle cx="20"   cy="21"   r="0.5" fill={color} />
    </svg>
  );

  /* ── 2. Futuristic Tech ────────────────────────────────────────────
     L-bracket corner markers · precise grid data · circuit-board feel  */
  if (qrStyle === "futuristic") return (
    <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* TL finder: L-brackets */}
      <path d="M0.5 4.5 L0.5 0.5 L4.5 0.5"   stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M5.5 0.5 L9.5 0.5 L9.5 4.5"   stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M9.5 5.5 L9.5 9.5 L5.5 9.5"   stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M4.5 9.5 L0.5 9.5 L0.5 5.5"   stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <rect x="3"    y="3"    width="4" height="4" fill={color} />
      {/* TR finder: L-brackets */}
      <path d="M12.5 4.5 L12.5 0.5 L16.5 0.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M17.5 0.5 L21.5 0.5 L21.5 4.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M21.5 5.5 L21.5 9.5 L17.5 9.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M16.5 9.5 L12.5 9.5 L12.5 5.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <rect x="15"   y="3"    width="4" height="4" fill={color} />
      {/* BL finder: L-brackets */}
      <path d="M0.5 16.5 L0.5 12.5 L4.5 12.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M5.5 12.5 L9.5 12.5 L9.5 16.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M9.5 17.5 L9.5 21.5 L5.5 21.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <path d="M4.5 21.5 L0.5 21.5 L0.5 17.5" stroke={color} strokeWidth="1.2" strokeLinecap="square" />
      <rect x="3"    y="15"   width="4" height="4" fill={color} />
      {/* precise grid data */}
      <rect x="11" y="1"  width="1" height="1" fill={color} />
      <rect x="11" y="3"  width="1" height="1" fill={color} />
      <rect x="11" y="5"  width="1" height="1" fill={color} />
      <rect x="11" y="7"  width="1" height="1" fill={color} />
      <rect x="11" y="9"  width="1" height="1" fill={color} />
      <rect x="1"  y="11" width="1" height="1" fill={color} />
      <rect x="3"  y="11" width="1" height="1" fill={color} />
      <rect x="5"  y="11" width="1" height="1" fill={color} />
      <rect x="7"  y="11" width="1" height="1" fill={color} />
      <rect x="9"  y="11" width="1" height="1" fill={color} />
      <rect x="12" y="12" width="2" height="2" fill={color} />
      <rect x="15" y="12" width="1" height="1" fill={color} />
      <rect x="17" y="12" width="2" height="2" fill={color} />
      <rect x="20" y="12" width="1" height="1" fill={color} />
      <rect x="12" y="15" width="1" height="1" fill={color} />
      <rect x="14" y="15" width="2" height="1" fill={color} />
      <rect x="18" y="15" width="1" height="1" fill={color} />
      <rect x="20" y="15" width="1" height="2" fill={color} />
      <rect x="12" y="17" width="2" height="2" fill={color} />
      <rect x="15" y="17" width="1" height="1" fill={color} />
      <rect x="17" y="17" width="2" height="1" fill={color} />
      <rect x="12" y="20" width="1" height="1" fill={color} />
      <rect x="14" y="20" width="2" height="1" fill={color} />
      <rect x="17" y="20" width="1" height="1" fill={color} />
      <rect x="19" y="20" width="2" height="1" fill={color} />
    </svg>
  );

  /* ── 3. Glassmorphism ──────────────────────────────────────────────
     Double-ring finders · opacity-layered soft modules · depth feel    */
  if (qrStyle === "glass") return (
    <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* TL finder: double ring */}
      <rect x="0.5"  y="0.5"  width="9" height="9" rx="3"   stroke={color} strokeWidth="0.5" fill="none" opacity="0.35" />
      <rect x="1.5"  y="1.5"  width="7" height="7" rx="2.5" stroke={color} strokeWidth="0.7" fill="none" opacity="0.65" />
      <rect x="3.5"  y="3.5"  width="3" height="3" rx="1.5" fill={color} />
      {/* TR finder: double ring */}
      <rect x="12.5" y="0.5"  width="9" height="9" rx="3"   stroke={color} strokeWidth="0.5" fill="none" opacity="0.35" />
      <rect x="13.5" y="1.5"  width="7" height="7" rx="2.5" stroke={color} strokeWidth="0.7" fill="none" opacity="0.65" />
      <rect x="15.5" y="3.5"  width="3" height="3" rx="1.5" fill={color} />
      {/* BL finder: double ring */}
      <rect x="0.5"  y="12.5" width="9" height="9" rx="3"   stroke={color} strokeWidth="0.5" fill="none" opacity="0.35" />
      <rect x="1.5"  y="13.5" width="7" height="7" rx="2.5" stroke={color} strokeWidth="0.7" fill="none" opacity="0.65" />
      <rect x="3.5"  y="15.5" width="3" height="3" rx="1.5" fill={color} />
      {/* layered data modules */}
      <rect x="10.5" y="1"   width="1.2" height="1.2" rx="0.6" fill={color} opacity="0.9" />
      <rect x="10.5" y="3"   width="1.2" height="1.2" rx="0.6" fill={color} opacity="0.6" />
      <rect x="10.5" y="5"   width="1.2" height="1.2" rx="0.6" fill={color} opacity="0.9" />
      <rect x="10.5" y="7"   width="1.2" height="1.2" rx="0.6" fill={color} opacity="0.55" />
      <rect x="1"    y="10.5" width="1.2" height="1.2" rx="0.6" fill={color} opacity="0.9" />
      <rect x="3"    y="10.5" width="1.2" height="1.2" rx="0.6" fill={color} opacity="0.55" />
      <rect x="5"    y="10.5" width="1.2" height="1.2" rx="0.6" fill={color} opacity="0.9" />
      <rect x="7"    y="10.5" width="1.2" height="1.2" rx="0.6" fill={color} opacity="0.65" />
      {/* data area: layered soft blocks */}
      <rect x="12.5" y="12.5" width="3.5" height="3.5" rx="1.5" fill={color} opacity="0.9" />
      <rect x="17.5" y="12.5" width="3.5" height="3.5" rx="1.5" fill={color} opacity="0.65" />
      <rect x="12.5" y="17.5" width="3.5" height="3.5" rx="1.5" fill={color} opacity="0.65" />
      <rect x="17.5" y="17.5" width="3.5" height="3.5" rx="1.5" fill={color} opacity="0.9" />
      <rect x="15.5" y="12.5" width="1.5" height="1.5" rx="0.7" fill={color} opacity="0.45" />
      <rect x="12.5" y="15.5" width="1.5" height="1.5" rx="0.7" fill={color} opacity="0.45" />
      <rect x="17.5" y="15.5" width="1.5" height="1.5" rx="0.7" fill={color} opacity="0.55" />
      <rect x="15.5" y="17.5" width="1.5" height="1.5" rx="0.7" fill={color} opacity="0.55" />
      <rect x="15.5" y="15.5" width="1.5" height="1.5" rx="0.7" fill={color} opacity="0.35" />
      <rect x="21"   y="14.5" width="0.8" height="0.8" rx="0.4" fill={color} opacity="0.7" />
      <rect x="21"   y="17"   width="0.8" height="0.8" rx="0.4" fill={color} opacity="0.5" />
      <rect x="14.5" y="21"   width="0.8" height="0.8" rx="0.4" fill={color} opacity="0.7" />
      <rect x="17"   y="21"   width="0.8" height="0.8" rx="0.4" fill={color} opacity="0.8" />
    </svg>
  );

  /* ── 4. Editorial Luxury ───────────────────────────────────────────
     Double-border finders · fine-ruled grid · typographic precision   */
  if (qrStyle === "editorial") return (
    <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* TL finder: double-border */}
      <rect x="0.5"  y="0.5"  width="9" height="9" rx="1.5" stroke={color} strokeWidth="0.5" fill="none" />
      <rect x="2"    y="2"    width="6" height="6" rx="1"   stroke={color} strokeWidth="0.5" fill="none" />
      <rect x="3.5"  y="3.5"  width="3" height="3" rx="0.5" fill={color} />
      {/* TR finder: double-border */}
      <rect x="12.5" y="0.5"  width="9" height="9" rx="1.5" stroke={color} strokeWidth="0.5" fill="none" />
      <rect x="14"   y="2"    width="6" height="6" rx="1"   stroke={color} strokeWidth="0.5" fill="none" />
      <rect x="15.5" y="3.5"  width="3" height="3" rx="0.5" fill={color} />
      {/* BL finder: double-border */}
      <rect x="0.5"  y="12.5" width="9" height="9" rx="1.5" stroke={color} strokeWidth="0.5" fill="none" />
      <rect x="2"    y="14"   width="6" height="6" rx="1"   stroke={color} strokeWidth="0.5" fill="none" />
      <rect x="3.5"  y="15.5" width="3" height="3" rx="0.5" fill={color} />
      {/* inter-finder data: precise tiny squares */}
      <rect x="10.5" y="0.5"  width="1" height="1" rx="0.3" fill={color} />
      <rect x="10.5" y="2.5"  width="1" height="1" rx="0.3" fill={color} />
      <rect x="10.5" y="4.5"  width="1" height="1" rx="0.3" fill={color} />
      <rect x="10.5" y="6.5"  width="1" height="1" rx="0.3" fill={color} />
      <rect x="10.5" y="8.5"  width="1" height="1" rx="0.3" fill={color} />
      <rect x="0.5"  y="10.5" width="1" height="1" rx="0.3" fill={color} />
      <rect x="2.5"  y="10.5" width="1" height="1" rx="0.3" fill={color} />
      <rect x="4.5"  y="10.5" width="1" height="1" rx="0.3" fill={color} />
      <rect x="6.5"  y="10.5" width="1" height="1" rx="0.3" fill={color} />
      <rect x="8.5"  y="10.5" width="1" height="1" rx="0.3" fill={color} />
      {/* data area: elegant symmetrical grid */}
      <rect x="12.5" y="12.5" width="3" height="3" rx="0.7" fill={color} />
      <rect x="17.5" y="12.5" width="3" height="3" rx="0.7" fill={color} />
      <rect x="12.5" y="17.5" width="3" height="3" rx="0.7" fill={color} />
      <rect x="17.5" y="17.5" width="3" height="3" rx="0.7" fill={color} />
      <rect x="16"   y="12.5" width="1" height="1" rx="0.3" fill={color} />
      <rect x="12.5" y="16"   width="1" height="1" rx="0.3" fill={color} />
      <rect x="16"   y="16"   width="1" height="1" rx="0.3" fill={color} />
      <rect x="20.5" y="16"   width="1" height="1" rx="0.3" fill={color} />
      <rect x="16"   y="20.5" width="1" height="1" rx="0.3" fill={color} />
      <rect x="20.5" y="12.5" width="1" height="1" rx="0.3" fill={color} />
      <rect x="12.5" y="20.5" width="1" height="1" rx="0.3" fill={color} />
      <rect x="20.5" y="20.5" width="1" height="1" rx="0.3" fill={color} />
    </svg>
  );

  /* ── 5. Award-Winning Creative ─────────────────────────────────────
     5-dot dice finders · alternating circles & rects · bold & artistic */
  if (qrStyle === "creative") return (
    <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* TL finder: rounded outer + 5-dot dice */}
      <rect x="0.5"  y="0.5"  width="9" height="9" rx="3" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="3"  cy="3"  r="1"   fill={color} />
      <circle cx="7"  cy="3"  r="1"   fill={color} />
      <circle cx="5"  cy="5"  r="1.3" fill={color} />
      <circle cx="3"  cy="7"  r="1"   fill={color} />
      <circle cx="7"  cy="7"  r="1"   fill={color} />
      {/* TR finder: rounded outer + 5-dot dice */}
      <rect x="12.5" y="0.5"  width="9" height="9" rx="3" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="15.5" cy="3"  r="1"   fill={color} />
      <circle cx="19.5" cy="3"  r="1"   fill={color} />
      <circle cx="17.5" cy="5"  r="1.3" fill={color} />
      <circle cx="15.5" cy="7"  r="1"   fill={color} />
      <circle cx="19.5" cy="7"  r="1"   fill={color} />
      {/* BL finder: rounded outer + 5-dot dice */}
      <rect x="0.5"  y="12.5" width="9" height="9" rx="3" stroke={color} strokeWidth="1" fill="none" />
      <circle cx="3"  cy="15.5" r="1"   fill={color} />
      <circle cx="7"  cy="15.5" r="1"   fill={color} />
      <circle cx="5"  cy="17.5" r="1.3" fill={color} />
      <circle cx="3"  cy="19.5" r="1"   fill={color} />
      <circle cx="7"  cy="19.5" r="1"   fill={color} />
      {/* alternating circle + rect data strip */}
      <circle cx="11.5" cy="1.5" r="0.6" fill={color} />
      <rect   x="11"    y="3.5"  width="1" height="1" rx="0.2" fill={color} />
      <circle cx="11.5" cy="6"   r="0.6" fill={color} />
      <rect   x="11"    y="7.5"  width="1" height="1" rx="0.2" fill={color} />
      <circle cx="1.5"  cy="11.5" r="0.6" fill={color} />
      <rect   x="3.5"   y="11"   width="1" height="1" rx="0.2" fill={color} />
      <circle cx="6"    cy="11.5" r="0.6" fill={color} />
      <rect   x="7.5"   y="11"   width="1" height="1" rx="0.2" fill={color} />
      {/* data area: bold artistic mix */}
      <circle cx="13.5" cy="13.5" r="1.2" fill={color} />
      <circle cx="16.5" cy="13"   r="0.7" fill={color} />
      <circle cx="19"   cy="13.5" r="1.2" fill={color} />
      <rect   x="13"    y="16"   width="1.5" height="1.5" rx="0.4" fill={color} />
      <circle cx="17"   cy="16.8" r="1"   fill={color} />
      <rect   x="20"    y="16"   width="1.5" height="1.5" rx="0.4" fill={color} />
      <circle cx="13.5" cy="19.5" r="1.2" fill={color} />
      <rect   x="16"    y="19"   width="1.5" height="1.5" rx="0.4" fill={color} />
      <circle cx="19.5" cy="19.5" r="1.2" fill={color} />
      <circle cx="16.5" cy="21"   r="0.5" fill={color} />
      <circle cx="21"   cy="16.5" r="0.5" fill={color} />
    </svg>
  );

  // fallback → minimal
  return <QrSvg color={color} qrStyle="minimal" />;
}

// Maps our style IDs → qr-code-styling options
function getQrStyleOptions(qrStyle, color) {
  const map = {
    minimal:    { dotsOptions: { color, type: "dots"          }, cornersSquareOptions: { color, type: "extra-rounded" }, cornersDotOptions: { color, type: "dot"    } },
    futuristic: { dotsOptions: { color, type: "square"        }, cornersSquareOptions: { color, type: "square"        }, cornersDotOptions: { color, type: "square" } },
    glass:      { dotsOptions: { color, type: "rounded"       }, cornersSquareOptions: { color, type: "extra-rounded" }, cornersDotOptions: { color, type: "dot"    } },
    editorial:  { dotsOptions: { color, type: "classy-rounded"}, cornersSquareOptions: { color, type: "square"        }, cornersDotOptions: { color, type: "square" } },
    creative:   { dotsOptions: { color, type: "extra-rounded" }, cornersSquareOptions: { color, type: "extra-rounded" }, cornersDotOptions: { color, type: "dot"    } },
  };
  return map[qrStyle] || map.minimal;
}

// Real scannable QR — uses qr-code-styling (browser-only, dynamic import)
function RealQrCode({ color = "#18181B", qrStyle = "minimal", data = "https://tapmelabs.com" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !containerRef.current) return;

      const qr = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "svg",
        data,
        margin: 4,
        backgroundOptions: { color: "transparent" },
        ...getQrStyleOptions(qrStyle, color),
      });

      containerRef.current.innerHTML = "";
      qr.append(containerRef.current);

      // make the generated SVG fill the container
      const svg = containerRef.current.querySelector("svg");
      if (svg) { svg.style.width = "100%"; svg.style.height = "100%"; }
    });

    return () => { cancelled = true; };
  }, [color, qrStyle, data]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

function QrOverlay({ color = "#18181B", bgColor = "transparent", sizePct = 20, placement = "center", qrStyle = "minimal", data = "https://tapmelabs.com" }) {
  const pos = placementPos(placement);
  return (
    <div
      style={{
        position: "absolute",
        ...pos,
        width: `${sizePct}%`,
        aspectRatio: "1",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: bgColor,
          borderRadius: bgColor !== "transparent" ? "6px" : "0",
          padding: bgColor !== "transparent" ? "6%" : "0",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <RealQrCode color={color} qrStyle={qrStyle} data={data} />
      </div>
    </div>
  );
}

/**
 * CardMockupOverlay
 *
 * Renders a product mockup image locked to 5:3 aspect ratio with
 * fully responsive overlays (logo, name, subtitle, QR) using only
 * percentage-based positioning and cqw font units.
 *
 * Props:
 *   mockupSrc     – URL of product mockup image (front or back)
 *   alt           – img alt text
 *   side          – "front" | "back"
 *   customization – { name, subTitle, logoDataUrl, logoPlacement, logoSize,
 *                     backContent, backLogoDataUrl, backLogoPlacement,
 *                     backLogoSize, qrFgColor }
 *   className     – extra class names for the wrapper
 */
export default function CardMockupOverlay({
  mockupSrc,
  alt = "Card mockup",
  side = "front",
  customization,
  className = "",
}) {
  if (!mockupSrc) return null;

  const c = customization || {};
  const logoPct     = pxToPct(c.logoSize);
  const backLogoPct = pxToPct(c.backLogoSize);
  const isFront     = side === "front";

  return (
    /*
     * Wrapper locks the 5:3 card aspect ratio.
     * overflow:hidden prevents any overlay from bleeding outside.
     * container-type:inline-size enables cqw units for child text.
     */
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "5 / 3",
        overflow: "hidden",
        borderRadius: "12px",
        containerType: "inline-size",
        background: c.cardColor || "#18181B",
      }}
    >
      {/* Base mockup image — low opacity so selected card colour dominates */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mockupSrc}
        alt={alt}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: c.cardColor ? 0.18 : 1,
          mixBlendMode: "screen",
        }}
      />

      {/* Background pattern — sits above card colour, below text/QR overlays */}
      <BackgroundPattern style={c.backgroundStyle} accentColor={c.accentColor || "#FFFFFF"} />

      {/* Skin SVG overlay (for blue-card, gold-skin, etc.) */}
      {c.skinSvgContent && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(c.skinSvgContent)}`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
      )}

      {/* Overlay layer — same bounding box as wrapper */}
      <div style={{ position: "absolute", inset: 0 }}>

        {/* NFC icon — top-right, shown on both sides; matches font colour */}
        {(() => {
          const nfcColor = c.fontColor || "rgba(255,255,255,0.5)";
          return (
            <div style={{ position: "absolute", top: "8%", right: "4%", pointerEvents: "none", opacity: 0.8 }}>
              <svg style={{ width: "5cqw", height: "5cqw" }} viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="16" r="1.5" fill={nfcColor} />
                <path d="M7 13a4.2 4.2 0 0 1 6 0" stroke={nfcColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M4 10a8.5 8.5 0 0 1 12 0" stroke={nfcColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          );
        })()}

        {/* ── FRONT overlays ──────────────────────────────── */}
        {isFront && (
          <>
            {c.logoDataUrl && (
              <OverlayLogo
                src={c.logoDataUrl}
                alt="Customer logo"
                placement={c.logoPlacement || "top-left"}
                sizePct={logoPct}
              />
            )}

            {c.frontQrEnabled && (
              <QrOverlay
                color={c.frontQrColor || c.fontColor || "#FFFFFF"}
                bgColor="transparent"
                sizePct={13}
                placement={c.frontQrPlacement || "bottom-right"}
                qrStyle={c.qrStyle || "minimal"}
                data={c.qrData || "https://tapmelabs.com"}
              />
            )}

            {(c.name || c.subTitle) && (
              <div
                style={{
                  position: "absolute",
                  bottom: "14%",
                  left: "6%",
                  right: "8%",
                  pointerEvents: "none",
                  overflow: "hidden",
                }}
              >
                {c.name && (
                  <p
                    style={{
                      margin: 0,
                      color: c.fontColor || "white",
                      fontWeight: 600,
                      fontSize: "clamp(8px, 3.5cqw, 22px)",
                      lineHeight: 1.3,
                      fontFamily: c.fontFamily || "sans-serif",
                      textShadow: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.name}
                  </p>
                )}
                {c.subTitle && (
                  <p
                    style={{
                      margin: 0,
                      marginTop: "0.25em",
                      color: c.fontColor ? `${c.fontColor}CC` : "rgba(255,255,255,0.78)",
                      fontSize: "clamp(6px, 2.4cqw, 15px)",
                      lineHeight: 1.3,
                      fontFamily: c.fontFamily || "sans-serif",
                      textShadow: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.subTitle}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* ── BACK overlays ───────────────────────────────── */}
        {!isFront && (
          <>
            {c.backContent === "qr" ? (
              <QrOverlay
                color={c.qrFgColor || c.fontColor || "#FFFFFF"}
                bgColor="transparent"
                sizePct={backLogoPct}
                placement={c.backLogoPlacement || "center"}
                qrStyle={c.qrStyle || "minimal"}
                data={c.qrData || "https://tapmelabs.com"}
              />
            ) : c.backLogoDataUrl ? (
              <OverlayLogo
                src={c.backLogoDataUrl}
                alt="Back logo"
                placement={c.backLogoPlacement || "center"}
                sizePct={backLogoPct}
              />
            ) : null}
          </>
        )}

      </div>
    </div>
  );
}
