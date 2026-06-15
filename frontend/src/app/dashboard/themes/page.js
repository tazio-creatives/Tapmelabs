"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, TopHeader } from "@/components/dashboard/shared";
import ProfilePreviewCard from "@/components/dashboard/ProfilePreviewCard";
import themeService from "@/services/themeService";
import profileService from "@/services/profileService";

/* ─── theme list & meta ───────────────────────────────────────────────── */

const FRONTEND_THEMES = [
  { key: "default",      name: "Default"      },
  { key: "classic",      name: "Classic"      },
  { key: "professional", name: "Professional" },
  { key: "midnight",     name: "Midnight"     },
  { key: "royal",        name: "Royal"        },
  { key: "violet",       name: "Violet"       },
];

const THEME_META = {
  default:     { label: "Light", color: "#28DC4F", bg: "#ffffff" },
  classic:      { label: "Light", color: "#28DC4F", bg: "#ffffff" },
  professional: { label: "Light",  color: "#111827", bg: "#ffffff" },
  midnight:     { label: "Dark",   color: "#F5A623", bg: "#0d0d14" },
  violet:       { label: "Dark",   color: "#7B61FF", bg: "#0d0d2e" },
  royal:        { label: "Dark",   color: "#F5A623", bg: "#0e1155" },
  aurora:      { label: "Light", color: "#8b5cf6", bg: "#ffffff" },
  obsidian:    { label: "Dark",  color: "#28DC4F", bg: "#080808" },
  frosted:     { label: "Light", color: "#6366f1", bg: "#f8faff" },
  "neon-edge": { label: "Dark",  color: "#00ff88", bg: "#0a0a14" },
  ember:       { label: "Dark",  color: "#f59e0b", bg: "#161b22" },
};

const SAMPLE_PROFILE = {
  name: "Alex Johnson",
  designation: "Product Designer",
  company_name: "Tapme Labs",
  city: "Mumbai",
  phone: "+91 98765 43210",
  email: "alex@tapmelabs.com",
  website: "tapmelabs.com/alex",
  profile_image: null,
  company_logo: null,
  social_links: { whatsapp: "1", linkedin: "1" },
};

/* ─── icons ───────────────────────────────────────────────────────────── */

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

function GridViewIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" fill={active ? "#111827" : "#9CA3AF"} />
      <rect x="9" y="1" width="6" height="6" rx="1.5" fill={active ? "#111827" : "#9CA3AF"} />
      <rect x="1" y="9" width="6" height="6" rx="1.5" fill={active ? "#111827" : "#9CA3AF"} />
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill={active ? "#111827" : "#9CA3AF"} />
    </svg>
  );
}

function ListViewIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="2" width="14" height="3" rx="1.5" fill={active ? "#111827" : "#9CA3AF"} />
      <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill={active ? "#111827" : "#9CA3AF"} />
      <rect x="1" y="11" width="14" height="3" rx="1.5" fill={active ? "#111827" : "#9CA3AF"} />
    </svg>
  );
}

/* ─── QR components ───────────────────────────────────────────────────── */

function QRCodeSVG({ size = 160 }) {
  const G = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,1,0,0,1,0,1,1,0,1,0,0,1,1,1,0,1,1,0,0,1],
    [0,1,1,0,0,1,0,0,1,0,1,1,0,0,0,1,0,1,0,1,0],
    [1,0,0,1,1,0,1,0,0,0,1,0,0,1,1,0,1,0,0,0,1],
    [0,1,0,1,0,1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0],
    [1,1,1,0,0,0,1,0,0,0,1,1,0,0,0,0,1,0,1,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,0,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,1,1,0,0,1,0,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,0,1,0,0,0,1,1,0],
    [1,0,1,1,1,0,1,0,1,1,0,1,1,0,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,0,1,1,0,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,0,1,1,0,1,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,1,0,1,1,0],
  ];
  const cell = size / 21;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {G.flatMap((row, y) =>
        row.map((v, x) =>
          v ? <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell + 0.5} height={cell + 0.5} fill="#111827" /> : null
        )
      )}
    </svg>
  );
}

function QRDisplay({ profileUrl, size = 160 }) {
  if (!profileUrl) return <QRCodeSVG size={size} />;
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(profileUrl)}&bgcolor=ffffff&color=111827&margin=0`}
      alt="QR code"
      width={size}
      height={size}
      style={{ display: "block", borderRadius: 4 }}
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}

/* ─── Apply badge ─────────────────────────────────────────────────────── */

function ApplyBadge({ isSelected, onSelect }) {
  if (isSelected) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 20, padding: "5px 10px", whiteSpace: "nowrap" }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="6" fill="#22C55E"/>
          <path d="M3.5 6l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#16A34A" }}>Applied</span>
      </div>
    );
  }
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      style={{ background: "#111827", color: "#fff", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 500, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
    >
      Apply
    </button>
  );
}

/* ─── theme card (live preview) ───────────────────────────────────────── */

function ThemeCard({ theme, isSelected, onSelect, onEdit, disabled, profile }) {
  const meta = THEME_META[theme.key] || { label: "Light", color: "#28DC4F", bg: "#ffffff" };

  return (
    <div
      className="relative cursor-pointer transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      style={{
        background: "#fff",
        border: isSelected ? "2px solid #28DC4F" : "1px solid #E5E5E5",
        borderRadius: 12,
        padding: 24,
        opacity: disabled && !isSelected ? 0.6 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
      onClick={() => !disabled && onSelect(theme.key)}
    >
      {/* Light/Dark tag — top-left */}
      <div style={{ position: "absolute", top: 14, left: 14, zIndex: 10, display: "flex", alignItems: "center", gap: 4, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 20, padding: "3px 8px" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 500, color: "#6B7280" }}>{meta.label}</span>
      </div>

      {/* Current Theme badge — absolute, top-center */}
      {isSelected && (
        <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", zIndex: 10, background: "#1B1B1D", color: "#fff", borderRadius: 96, padding: "4px 10px", fontSize: 10, fontWeight: 500, whiteSpace: "nowrap" }}>
          Current Theme
        </div>
      )}

      {/* Inner bordered preview — no phone chrome */}
      <div style={{ border: "1px solid #A9B8C2", borderRadius: 12, overflow: "hidden", background: meta.bg }}>
        <div style={{ height: 300, overflow: "hidden", position: "relative" }}>
          <div style={{ width: "200%", transformOrigin: "top left", transform: "scale(0.5)", pointerEvents: "none" }}>
            <ProfilePreviewCard profile={profile || SAMPLE_PROFILE} themeKey={theme.key} />
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 48, background: `linear-gradient(to bottom, transparent, ${meta.bg})`, pointerEvents: "none" }} />
        </div>
      </div>

      {/* Footer — theme name, then buttons below */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827", fontFamily: "'Inter', sans-serif" }}>{theme.name}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(theme.key); }}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 20, border: "1px solid #E5E7EB", background: "#F9FAFB", fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
          <ApplyBadge isSelected={isSelected} onSelect={() => !disabled && onSelect(theme.key)} />
        </div>
      </div>
    </div>
  );
}

/* ─── theme list item (list view) ─────────────────────────────────────── */

function ThemeListItem({ theme, isSelected, onSelect, onEdit, disabled, profile }) {
  const meta = THEME_META[theme.key] || { label: "Light", color: "#28DC4F", bg: "#ffffff" };

  return (
    <div
      className="flex cursor-pointer items-center gap-4 rounded-[14px] p-3 transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
      style={{ border: isSelected ? "1.5px solid #28DC4F" : "1.5px solid #E5E5E5", background: "#fff", opacity: disabled && !isSelected ? 0.6 : 1 }}
      onClick={() => !disabled && onSelect(theme.key)}
    >
      {/* Mini preview — bordered container, no phone chrome */}
      <div style={{ width: 72, flexShrink: 0, border: "1px solid #A9B8C2", borderRadius: 8, overflow: "hidden", background: meta.bg }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ zoom: 0.25, width: 288, pointerEvents: "none" }}>
            <ProfilePreviewCard profile={profile || SAMPLE_PROFILE} themeKey={theme.key} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[#111827]">{theme.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color }} />
          <span className="text-[11px] text-[#9CA3AF]">{meta.label}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(theme.key); }}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: "1px solid #E5E7EB", background: "#F9FAFB", fontSize: 12, fontWeight: 500, color: "#374151", cursor: "pointer" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
        <ApplyBadge isSelected={isSelected} onSelect={() => !disabled && onSelect(theme.key)} />
      </div>
    </div>
  );
}

/* ─── actions section ─────────────────────────────────────────────────── */

function ActionsSection({ profileUrl, onViewProfile, onDownloadQR, onShare, onCopy, copied, actionError }) {
  const actionBtns = [
    { label: "Download QR Code", icon: <DownloadIcon />, onClick: onDownloadQR, style: { background: "#fff", color: "#374151" }, cls: "border border-[#E5E7EB]" },
    { label: "Share Profile",    icon: <ShareIcon />,    onClick: onShare,       style: { background: "#fff", color: "#374151" }, cls: "border border-[#E5E7EB]" },
    { label: copied ? "Copied!" : "Copy Profile", icon: <LinkIcon />, onClick: onCopy,
      style: { background: "#fff", color: copied ? "#28DC4F" : "#374151" },
      cls: `border ${copied ? "border-[#28DC4F]" : "border-[#E5E7EB]"}` },
  ];

  return (
    <div className="rounded-[16px] border border-[#EBEBEB] bg-white p-5 flex flex-col gap-5">
      <div className="rounded-[12px] bg-[#F9FAFB] px-4 py-6">
        <div className="mx-auto mb-4 flex items-center justify-center rounded-[10px] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]" style={{ width: "fit-content" }}>
          <QRDisplay profileUrl={profileUrl} size={160} />
        </div>
        <p className="text-center text-[12px] leading-[1.6] text-[#6B7280]">
          Scan this QR code to instantly view and save your digital profile.
        </p>
      </div>

      {actionError && (
        <p className="rounded-[8px] bg-[#FFF5F5] px-3 py-2 text-[12px] text-[#EF4444] border border-[#FEE2E2]">{actionError}</p>
      )}

      <div className="flex flex-col gap-2">
        <button onClick={onViewProfile} className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80" style={{ background: "#28DC4F" }}>
          <ExternalLinkIcon />
          View Digital Profile
        </button>
        {actionBtns.map(({ label, icon, onClick, style, cls }) => (
          <button key={label} onClick={onClick} className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] ${cls}`} style={style}>
            {icon}{label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */

export default function ThemesPage() {
  const router = useRouter();

  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [initials,        setInitials]        = useState("U");
  const [profile,         setProfile]         = useState(null);
  const [selectedTheme,   setSelectedTheme]   = useState("classic");
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [success,         setSuccess]         = useState(false);
  const [apiError,        setApiError]        = useState("");
  const [copied,          setCopied]          = useState(false);
  const [actionError,     setActionError]     = useState("");
  const [viewMode,        setViewMode]        = useState("grid");
  const [customization,   setCustomization]   = useState({ bgColor: "", fontFamily: "", btnColor: "", fontColor: "" });
  const [custSaving,      setCustSaving]      = useState(false);
  const [custSuccess,     setCustSuccess]     = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("customerToken");
    if (!token) { router.push("/login"); return; }

    const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
    const displayName = stored.full_name || stored.name || "";
    setInitials(
      displayName.split(" ").map((w) => w[0] || "").join("").toUpperCase().slice(0, 2) || "U"
    );

    profileService.getMyProfile().then((p) => {
      const prof = p?.data?.profile ?? p?.profile ?? p?.data ?? null;
      if (prof) {
        setProfile(prof);
        if (prof.theme_key) setSelectedTheme(prof.theme_key);
        if (prof.theme_customization) setCustomization(prev => ({ ...prev, ...prof.theme_customization }));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [router]);

  // Dynamically load Google Font when fontFamily customization changes
  useEffect(() => {
    const font = customization?.fontFamily;
    if (!font || font === "Figtree" || font === "Inter" || font === "Roboto" || font === "Georgia") return;
    const id = `gfont-${font.replace(/\s+/g, "-")}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id   = id;
      link.rel  = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  }, [customization?.fontFamily]);

  const profileUrl = profile?.slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/u/${profile.slug}`
    : null;

  const handleSelect = async (themeKey) => {
    if (themeKey === selectedTheme || saving) return;
    const prev = selectedTheme;
    setSelectedTheme(themeKey);
    setSaving(true);
    setApiError("");
    setSuccess(false);
    try {
      await profileService.updateTheme(themeKey);
      setSuccess(true);
    } catch (err) {
      setSelectedTheme(prev);
      setApiError(err.response?.data?.message || err.message || "Failed to apply theme.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditTheme = (themeKey) => {
    if (themeKey !== selectedTheme) handleSelect(themeKey);
    router.push("/dashboard/profile/basics");
  };

  function handleViewProfile() {
    if (!profileUrl) { setActionError("Please complete your profile first."); return; }
    setActionError("");
    window.open(profileUrl, "_blank");
  }

  async function handleDownloadQR() {
    if (!profileUrl) { setActionError("Please complete your profile first."); return; }
    setActionError("");
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(profileUrl)}&bgcolor=ffffff&color=111827&margin=10`;
    try {
      const res = await fetch(qrApiUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl; a.download = `tapme-qr-${profile?.slug || "profile"}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch { window.open(qrApiUrl, "_blank"); }
  }

  function handleShare() {
    if (!profileUrl) { setActionError("Please complete your profile first."); return; }
    setActionError("");
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "My TapMe Profile", url: profileUrl }).catch(() => {});
    } else { handleCopy(); }
  }

  async function handleSaveCustomization() {
    setCustSaving(true);
    setCustSuccess(false);
    try {
      const toSave = {
        bgColor:    customization.bgColor    || null,
        fontFamily: customization.fontFamily || null,
        btnColor:   customization.btnColor   || null,
        fontColor:  customization.fontColor  || null,
      };
      await profileService.updateThemeCustomization(toSave);
      setCustSuccess(true);
      setTimeout(() => setCustSuccess(false), 2500);
    } catch { /* silent */ }
    finally { setCustSaving(false); }
  }

  function handleCopy() {
    if (!profileUrl) { setActionError("Please complete your profile first."); return; }
    setActionError("");
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
        <Sidebar open={false} onClose={() => {}} activeNav="Themes" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopHeader onMenuClick={() => {}} initials={initials} />
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#28DC4F] border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  const actionsProps = { profileUrl, onViewProfile: handleViewProfile, onDownloadQR: handleDownloadQR, onShare: handleShare, onCopy: handleCopy, copied, actionError };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Themes" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        <div className="flex flex-1 overflow-hidden">

          {/* Theme grid — scrollable */}
          <main className="flex-1 overflow-y-auto px-6 py-6">

            {/* Header + view toggle */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[24px] font-bold text-[#111827]">Themes</h1>
                <p className="mt-1 text-[14px] text-[#6B7280]">Select a theme of your choice. You can change it anytime.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 2, background: "#F4F4F5", borderRadius: 10, padding: 4, flexShrink: 0, marginTop: 4 }}>
                <button
                  onClick={() => setViewMode("grid")}
                  style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 7, background: viewMode === "grid" ? "#fff" : "transparent", border: "none", cursor: "pointer", boxShadow: viewMode === "grid" ? "0 1px 4px rgba(0,0,0,0.10)" : "none", transition: "all .15s" }}
                >
                  <GridViewIcon active={viewMode === "grid"} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 7, background: viewMode === "list" ? "#fff" : "transparent", border: "none", cursor: "pointer", boxShadow: viewMode === "list" ? "0 1px 4px rgba(0,0,0,0.10)" : "none", transition: "all .15s" }}
                >
                  <ListViewIcon active={viewMode === "list"} />
                </button>
              </div>
            </div>

            {/* Error / success banners */}
            {apiError && (
              <div className="mb-5 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">{apiError}</div>
            )}
            {success && (
              <div className="mb-5 rounded-[8px] border border-[#D1FAE5] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#16A34A]">Theme applied successfully!</div>
            )}

            {/* Grid view */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {FRONTEND_THEMES.map((theme) => (
                  <ThemeCard key={theme.key} theme={theme} isSelected={selectedTheme === theme.key} onSelect={handleSelect} onEdit={handleEditTheme} disabled={saving} profile={profile} />
                ))}
              </div>
            )}

            {/* List view */}
            {viewMode === "list" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {FRONTEND_THEMES.map((theme) => (
                  <ThemeListItem key={theme.key} theme={theme} isSelected={selectedTheme === theme.key} onSelect={handleSelect} onEdit={handleEditTheme} disabled={saving} profile={profile} />
                ))}
              </div>
            )}

            {/* Mobile actions */}
            {profileUrl && (
              <div className="mt-6 xl:hidden">
                <ActionsSection {...actionsProps} />
              </div>
            )}
          </main>

          {/* Live preview + customization — desktop right panel */}
          <aside className="hidden w-[420px] shrink-0 overflow-y-auto border-l border-[#EBEBEB] bg-[#F7F8F9] p-6 xl:block">
            <p className="mb-1 text-[13px] font-semibold text-[#374151]">Live Preview</p>
            <p className="mb-5 text-[11px] text-[#9CA3AF]">Updates as you select a theme</p>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E5E7EB", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <ProfilePreviewCard profile={profile} themeKey={selectedTheme || "classic"} customization={customization} />
            </div>

            {/* ── Customization Panel ─────────────────────────────── */}
            <div id="customization-panel" style={{ marginTop: 20, background: "#ffffff", borderRadius: 14, border: "1px solid #EBEBEB", padding: "18px 16px" }}>
              <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#111827" }}>Customise Theme</p>

              {/* Font Style */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>Font Style</label>
                <select
                  value={customization.fontFamily || ""}
                  onChange={(e) => setCustomization(c => ({ ...c, fontFamily: e.target.value }))}
                  style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", cursor: "pointer" }}
                >
                  <option value="">Default (theme font)</option>
                  <option value="Inter">Inter</option>
                  <option value="Figtree">Figtree</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>

              {/* Background Colour */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>Background Colour</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {["#ffffff","#F0FDF4","#EFF6FF","#FFF7ED","#FDF2F8","#0d0d14","#0e1155"].map(c => (
                    <button key={c} onClick={() => setCustomization(x => ({ ...x, bgColor: c }))}
                      style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: customization.bgColor === c ? "2.5px solid #111827" : "1.5px solid #E5E7EB", cursor: "pointer", flexShrink: 0 }} />
                  ))}
                  <input type="color" value={customization.bgColor || "#ffffff"}
                    onChange={(e) => setCustomization(x => ({ ...x, bgColor: e.target.value }))}
                    style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #E5E7EB", padding: 0, cursor: "pointer", background: "none" }}
                    title="Custom colour" />
                </div>
              </div>

              {/* Button Colour */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>Button Colour</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {["#28DC4F","#111827","#6D28D9","#3730a3","#F5A623","#EF4444","#0EA5E9"].map(c => (
                    <button key={c} onClick={() => setCustomization(x => ({ ...x, btnColor: c }))}
                      style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: customization.btnColor === c ? "2.5px solid #111827" : "1.5px solid #E5E7EB", cursor: "pointer", flexShrink: 0 }} />
                  ))}
                  <input type="color" value={customization.btnColor || "#28DC4F"}
                    onChange={(e) => setCustomization(x => ({ ...x, btnColor: e.target.value }))}
                    style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #E5E7EB", padding: 0, cursor: "pointer", background: "none" }}
                    title="Custom colour" />
                </div>
              </div>

              {/* Font Colour */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#6B7280", marginBottom: 6 }}>Font Colour</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {["#111827","#000000","#ffffff","#374151","#1E40AF","#7C3AED","#B45309"].map(c => (
                    <button key={c} onClick={() => setCustomization(x => ({ ...x, fontColor: c }))}
                      style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: customization.fontColor === c ? "2.5px solid #6B7280" : "1.5px solid #E5E7EB", cursor: "pointer", flexShrink: 0 }} />
                  ))}
                  <input type="color" value={customization.fontColor || "#111827"}
                    onChange={(e) => setCustomization(x => ({ ...x, fontColor: e.target.value }))}
                    style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #E5E7EB", padding: 0, cursor: "pointer", background: "none" }}
                    title="Custom colour" />
                </div>
              </div>

              {/* Reset + Save */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setCustomization({ bgColor: "", fontFamily: "", btnColor: "", fontColor: "" })}
                  style={{ flex: 1, border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 0", fontSize: 12, color: "#6B7280", background: "#fff", cursor: "pointer" }}
                >
                  Reset
                </button>
                <button
                  onClick={handleSaveCustomization}
                  disabled={custSaving}
                  style={{ flex: 2, border: "none", borderRadius: 8, padding: "8px 0", fontSize: 12, fontWeight: 600, color: "#fff", background: custSuccess ? "#16A34A" : "#111827", cursor: "pointer", transition: "background .2s" }}
                >
                  {custSaving ? "Saving…" : custSuccess ? "Saved!" : "Save Customisation"}
                </button>
              </div>
            </div>

            {profileUrl && (
              <div className="mt-5">
                <ActionsSection {...actionsProps} />
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}
