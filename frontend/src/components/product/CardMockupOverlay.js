"use client";

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
function QrOverlay({ color = "#18181B", sizePct = 20, placement = "center" }) {
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
          padding: "8%",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <svg viewBox="0 0 22 22" fill="none" style={{ width: "100%", height: "100%" }}>
          <rect x="0.5"  y="0.5"  width="9" height="9" rx="1" stroke={color} strokeWidth="1" fill="none" />
          <rect x="2.5"  y="2.5"  width="5" height="5" fill={color} />
          <rect x="12.5" y="0.5"  width="9" height="9" rx="1" stroke={color} strokeWidth="1" fill="none" />
          <rect x="14.5" y="2.5"  width="5" height="5" fill={color} />
          <rect x="0.5"  y="12.5" width="9" height="9" rx="1" stroke={color} strokeWidth="1" fill="none" />
          <rect x="2.5"  y="14.5" width="5" height="5" fill={color} />
          <rect x="12.5" y="12.5" width="4" height="4" fill={color} />
          <rect x="18.5" y="12.5" width="3" height="3" fill={color} />
          <rect x="12.5" y="18.5" width="3" height="3" fill={color} />
          <rect x="17.5" y="17.5" width="4" height="4" fill={color} />
        </svg>
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
      }}
    >
      {/* Base mockup image — fills wrapper exactly */}
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
        }}
      />

      {/* Card colour tint — "color" blend applies hue+saturation while preserving metallic highlights */}
      {c.cardColor && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: c.cardColor,
            opacity: 0.88,
            mixBlendMode: "color",
            pointerEvents: "none",
          }}
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
                color={c.frontQrColor || "#18181B"}
                sizePct={13}
                placement={c.frontQrPlacement || "bottom-right"}
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
                      textShadow: "0 1px 4px rgba(0,0,0,0.7)",
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
                      textShadow: "0 1px 3px rgba(0,0,0,0.6)",
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
