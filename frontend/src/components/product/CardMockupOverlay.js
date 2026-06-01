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

function QrOverlay({ color = "#18181B", sizePct = 20, placement = "center", qrStyle = "minimal", data = "https://tapmelabs.com" }) {
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
          background: "white",
          borderRadius: "6px",
          padding: "6%",
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
                color={c.frontQrColor || "#18181B"}
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
                color={c.qrFgColor || "#18181B"}
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
