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

function RealQrCode({ color = "#18181B", qrStyle = "minimal", data = "https://tapmelabs.com", width = 200, height = 200 }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    import("qr-code-styling").then(({ default: QRCodeStyling }) => {
      if (cancelled || !containerRef.current) return;
      const qr = new QRCodeStyling({
        width, height, type: "svg", data,
        margin: 4, backgroundOptions: { color: "transparent" },
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

// ── NFC Card Front (exact replica of customer dashboard design) ───────────────

function FrontCardPreview({ bg, name, subTitle, logoDataUrl, logoPlacement, logoSize, cardRef, fontColor, fontFamily }) {
  const light = isLightBg(bg);
  const tc    = fontColor || (light ? "rgba(0,0,0,0.85)"  : "rgba(255,255,255,0.9)");
  const stc   = fontColor ? fontColor + "99" : (light ? "rgba(0,0,0,0.45)"  : "rgba(255,255,255,0.45)");
  const lMain = fontColor || (light ? "#000000"            : "#ffffff");
  const arc   = fontColor ? fontColor + "55" : (light ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.25)");
  const ring  = (o) => light ? `rgba(0,0,0,${o})` : `rgba(255,255,255,${o})`;
  const dm    = fontColor || (light ? "#000" : "#fff");

  return (
    <div ref={cardRef} style={{
      width: "100%", maxWidth: "460px", aspectRatio: "5 / 3",
      borderRadius: "14px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      position: "relative", overflow: "hidden", containerType: "inline-size",
      ...getBgStyle(bg),
    }}>
      {!light && (
        <div style={{ pointerEvents: "none", position: "absolute", inset: 0, background: "radial-gradient(ellipse at 75% 20%,rgba(40,220,79,0.09) 0%,transparent 55%)" }} />
      )}
      {["33%", "50%", "66%"].map((sz, i) => (
        <div key={i} style={{ pointerEvents: "none", position: "absolute", width: sz, height: sz, bottom: `calc(-${sz} / 2)`, right: `calc(-${sz} / 2)`, borderRadius: "50%", border: `1px solid ${ring(0.06 - i * 0.015)}` }} />
      ))}

      {/* Top-left: TapMe branding (hidden when custom logo is top-left) */}
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
        <p style={{ color: tc, fontSize: "clamp(7px,3.5cqw,18px)", fontWeight: 600, lineHeight: 1.3, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: fontFamily || "sans-serif" }}>
          {name || "Customer Name"}
        </p>
        <p style={{ color: stc, fontSize: "clamp(5px,2.4cqw,13px)", marginTop: "0.25em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: fontFamily || "sans-serif" }}>
          {subTitle || "Title · Company"}
        </p>
      </div>

      {/* Bottom-right: data-matrix placeholder */}
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

// ── NFC Card Back (exact replica of customer dashboard design) ────────────────

function BackCardPreview({ bg, backContent, backLogoDataUrl, backLogoPlacement, backLogoSize, qrFgColor, cardRef, profileUrl, qrStyle }) {
  const qr = qrFgColor || "#18181B";
  const bgStyle = getBgStyle(bg ?? { type: "solid", color: "#18181B" });

  return (
    <div ref={cardRef} style={{
      width: "100%", maxWidth: "460px", aspectRatio: "5 / 3",
      borderRadius: "14px", boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
      position: "relative", overflow: "hidden", containerType: "inline-size",
      ...bgStyle,
    }}>
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
            <div style={{ width: "28%", aspectRatio: "1", background: "white", borderRadius: "6px", padding: "4%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

  const frontRef = useRef(null);
  const backRef  = useRef(null);
  const qrRef    = useRef(null);

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
    const targetRef = face === "front" ? frontRef : backRef;
    if (!targetRef.current) {
      alert("Card not ready. Please wait a moment and try again.");
      return;
    }

    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(targetRef.current, {
        pixelRatio: 4,
        cacheBust: true,
      });
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
  const cardBg      = cust.cardColor ? { type: "solid", color: cust.cardColor } : (cust.frontBg || { type: "solid", color: "#18181B" });
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
            <FrontCardPreview bg={cardBg} name={cardName} subTitle={cardSub} logoDataUrl={logoUrl} logoPlacement={cust.logoPlacement || "top-left"} logoSize={cust.logoSize || 44} fontColor={cust.fontColor} fontFamily={cust.fontFamily} />
          </div>
        </div>
        <div className="print-card-slot">
          <p className="print-label">BACK SIDE</p>
          <div className="nfc-card-wrap">
            <BackCardPreview bg={backBg} backContent={cust.backContent || "logo"} backLogoDataUrl={cust.backLogoDataUrl} backLogoPlacement={cust.backLogoPlacement} backLogoSize={cust.backLogoSize} qrFgColor={cust.qrFgColor} profileUrl={profileUrl} qrStyle={cust.qrStyle} />
          </div>
        </div>
      </div>

      {/* Off-screen cards always in DOM — html-to-image captures these regardless of which face is visible */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, width: "460px", pointerEvents: "none", opacity: 0, zIndex: -1 }}>
        <div ref={frontRef}>
          <FrontCardPreview bg={cardBg} name={cardName} subTitle={cardSub} logoDataUrl={logoUrl} logoPlacement={cust.logoPlacement || "top-left"} logoSize={cust.logoSize || 44} fontColor={cust.fontColor} fontFamily={cust.fontFamily} />
        </div>
        <div ref={backRef} style={{ marginTop: "16px" }}>
          <BackCardPreview bg={backBg} backContent={cust.backContent || "logo"} backLogoDataUrl={cust.backLogoDataUrl} backLogoPlacement={cust.backLogoPlacement} backLogoSize={cust.backLogoSize} qrFgColor={cust.qrFgColor} profileUrl={profileUrl} qrStyle={cust.qrStyle} />
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
                      ? <FrontCardPreview bg={cardBg} name={cardName} subTitle={cardSub} logoDataUrl={logoUrl} logoPlacement={cust.logoPlacement || "top-left"} logoSize={cust.logoSize || 44} fontColor={cust.fontColor} fontFamily={cust.fontFamily} />
                      : <BackCardPreview  bg={backBg} backContent={cust.backContent || "logo"} backLogoDataUrl={cust.backLogoDataUrl} backLogoPlacement={cust.backLogoPlacement} backLogoSize={cust.backLogoSize} qrFgColor={cust.qrFgColor} profileUrl={profileUrl} qrStyle={cust.qrStyle} />
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
