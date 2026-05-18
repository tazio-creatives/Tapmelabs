"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sidebar, TopHeader } from "@/components/dashboard/shared";
import ProfilePreviewCard from "@/components/dashboard/ProfilePreviewCard";
import themeService from "@/services/themeService";
import profileService from "@/services/profileService";

/* ─── helpers ─────────────────────────────────────────────────────────── */

function normalizeTheme(t) {
  return {
    key:           t.key ?? t.theme_key ?? t.id ?? "",
    name:          t.name || t.theme_name || "Unnamed",
    // TODO: use theme.preview_image from API once backend serves hosted preview images;
    //       fall back to local static assets in the meantime.
    preview_image: t.preview_image || t.previewImage || t.image || null,
  };
}

/* ─── icons ───────────────────────────────────────────────────────────── */

function TuneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

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
          v ? (
            <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell + 0.5} height={cell + 0.5} fill="#111827" />
          ) : null
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
      alt="QR code for your digital profile"
      width={size}
      height={size}
      style={{ display: "block", borderRadius: "4px" }}
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}

/* ─── preview filename map (API key → local file key) ────────────────── */

const PREVIEW_KEY_MAP = { midnight: "midnight-dark" };

/* ─── theme card ──────────────────────────────────────────────────────── */

function ThemeCard({ theme, isSelected, onSelect, onEdit, disabled }) {
  const fileKey      = PREVIEW_KEY_MAP[theme.key] || theme.key;
  const localPreview = `/images/dashboard/themes/preview-${fileKey}.png`;
  const previewSrc   = theme.preview_image || localPreview;

  return (
    <div
      className="group relative cursor-pointer overflow-visible rounded-[16px] border border-[#E5E5E5] bg-white transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      onClick={() => !disabled && onSelect(theme.key)}
      style={{ opacity: disabled && !isSelected ? 0.6 : 1 }}
    >
      {/* Current Theme badge — centered, overlaps card top */}
      {isSelected && (
        <div
          className="absolute left-1/2 z-10 -translate-x-1/2 flex items-center justify-center rounded-full px-[10px]"
          style={{ top: "14px", height: "21px", background: "rgb(27,27,29)", minWidth: "84px" }}
        >
          <span className="whitespace-nowrap text-[10px] font-medium text-white">Current Theme</span>
        </div>
      )}

      {/* NFC preview — 315×505 */}
      <div className="mx-[24px] mt-[24px] overflow-hidden rounded-[12px]">
        <Image
          src={previewSrc}
          alt={`${theme.name} theme preview`}
          width={315}
          height={505}
          sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1280px) calc(50vw - 48px), 363px"
          style={{ width: "100%", height: "auto", display: "block" }}
          priority={isSelected}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Bottom: edit button + theme name */}
      <div className="mx-[24px] mt-[16px] pb-[24px]">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A9B8C2] bg-white text-[#6B7280] transition-colors hover:border-[#28DC4F] hover:bg-[#F0FDF4] hover:text-[#28DC4F]"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          title={`Edit ${theme.name} profile`}
        >
          <TuneIcon />
        </button>
        <p className="mt-[6px] text-[16px] font-semibold text-[#111827]">{theme.name}</p>
      </div>

      {/* Selected ring */}
      {isSelected && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px]"
          style={{ boxShadow: "0 0 0 2px #28DC4F" }}
        />
      )}
    </div>
  );
}

/* ─── actions section ─────────────────────────────────────────────────── */

function ActionsSection({ profileUrl, onViewProfile, onDownloadQR, onShare, onCopy, copied, actionError }) {
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
    <div className="rounded-[16px] border border-[#EBEBEB] bg-white p-5 flex flex-col gap-5">
      {/* QR section */}
      <div className="rounded-[12px] bg-[#F9FAFB] px-4 py-6">
        <div
          className="mx-auto mb-4 flex items-center justify-center rounded-[10px] bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          style={{ width: "fit-content" }}
        >
          <QRDisplay profileUrl={profileUrl} size={160} />
        </div>
        <p className="text-center text-[12px] leading-[1.6] text-[#6B7280]">
          Scan this QR code for instantly view and save your digital profile.
        </p>
      </div>

      {/* Error */}
      {actionError && (
        <p className="rounded-[8px] bg-[#FFF5F5] px-3 py-2 text-[12px] text-[#EF4444] border border-[#FEE2E2]">
          {actionError}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onViewProfile}
          className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
          style={{ background: "#28DC4F" }}
        >
          <ExternalLinkIcon />
          View Digital Profile
        </button>

        {actionBtns.map(({ label, icon, onClick, style, cls }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex h-[44px] w-full items-center justify-center gap-2 rounded-[8px] text-[13px] font-medium transition-colors hover:bg-[#F9FAFB] ${cls}`}
            style={style}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */

export default function ThemesPage() {
  const router = useRouter();

  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [initials,      setInitials]      = useState("U");
  const [profile,       setProfile]       = useState(null);
  const [themes,        setThemes]        = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [apiError,      setApiError]      = useState("");
  const [copied,        setCopied]        = useState(false);
  const [actionError,   setActionError]   = useState("");

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
      themeService.getActiveThemes(),
      profileService.getMyProfile(),
    ]).then(([themesRes, profileRes]) => {
      if (themesRes.status === "fulfilled") {
        const raw = themesRes.value;
        const list = Array.isArray(raw)
          ? raw
          : raw?.data?.themes ?? raw?.themes ?? [];
        setThemes(Array.isArray(list) ? list.map(normalizeTheme).filter((t) => t.key === "default") : []);
      } else {
        setApiError("Failed to load themes. Please refresh.");
      }

      if (profileRes.status === "fulfilled") {
        const p = profileRes.value;
        const prof = p?.data?.profile ?? p?.profile ?? p?.data ?? null;
        if (prof) {
          setProfile(prof);
          if (prof.theme_key) setSelectedTheme(prof.theme_key);
        }
      }
      /* 404 on profile = no profile yet → no theme pre-selected */
    }).finally(() => setLoading(false));
  }, [router]);

  const profileUrl = profile?.slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/u/${profile.slug}`
    : null;

  const handleSelect = async (themeKey) => {
    if (themeKey === selectedTheme || saving) return;

    const prev = selectedTheme;
    setSelectedTheme(themeKey); /* optimistic */
    setSaving(true);
    setApiError("");
    setSuccess(false);

    try {
      await profileService.updateTheme(themeKey);
      setSuccess(true);
    } catch (err) {
      setSelectedTheme(prev); /* revert on failure */
      setApiError(
        err.response?.data?.message || err.message || "Failed to apply theme. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  function handleViewProfile() {
    if (!profileUrl) {
      setActionError("Please complete your profile first.");
      return;
    }
    setActionError("");
    window.open(profileUrl, "_blank");
  }

  async function handleDownloadQR() {
    if (!profileUrl) {
      setActionError("Please complete your profile first.");
      return;
    }
    setActionError("");
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(profileUrl)}&bgcolor=ffffff&color=111827&margin=10`;
    try {
      const res = await fetch(qrApiUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `tapme-qr-${profile?.slug || "profile"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(qrApiUrl, "_blank");
    }
  }

  function handleShare() {
    if (!profileUrl) {
      setActionError("Please complete your profile first.");
      return;
    }
    setActionError("");
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "My TapMe Profile", text: "Check out my digital profile", url: profileUrl }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  function handleCopy() {
    if (!profileUrl) {
      setActionError("Please complete your profile first.");
      return;
    }
    setActionError("");
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const actionsProps = {
    profileUrl,
    onViewProfile: handleViewProfile,
    onDownloadQR:  handleDownloadQR,
    onShare:       handleShare,
    onCopy:        handleCopy,
    copied,
    actionError,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Themes" />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        <div className="flex flex-1 overflow-hidden">

          {/* Theme grid — scrollable */}
          <main className="flex-1 overflow-y-auto px-6 py-6">

            <div className="mb-6">
              <h1 className="text-[24px] font-bold text-[#111827]">Themes</h1>
              <p className="mt-1 text-[14px] text-[#6B7280]">
                Select a theme of your choice. You can change or customize it anytime.
              </p>
            </div>

            {/* Error banner */}
            {apiError && (
              <div className="mb-5 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                {apiError}
              </div>
            )}

            {/* Success banner */}
            {success && (
              <div className="mb-5 rounded-[8px] border border-[#D1FAE5] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#16A34A]">
                Theme applied successfully!
              </div>
            )}

            {/* Empty state */}
            {themes.length === 0 && !apiError && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[16px] font-semibold text-[#111827]">No themes available</p>
                <p className="mt-1 text-[14px] text-[#6B7280]">Check back later for new themes.</p>
              </div>
            )}

            {/* Theme grid */}
            {themes.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.key}
                    theme={theme}
                    isSelected={selectedTheme === theme.key}
                    onSelect={handleSelect}
                    onEdit={() => router.push("/dashboard/profile/basics")}
                    disabled={saving}
                  />
                ))}
              </div>
            )}

            {/* Actions — mobile only (below theme grid, hidden on xl, only when profile complete) */}
            {profileUrl && (
              <div className="mt-6 xl:hidden">
                <ActionsSection {...actionsProps} />
              </div>
            )}

          </main>

          {/* Live preview + Actions — desktop right panel */}
          <aside className="hidden w-[320px] shrink-0 overflow-y-auto border-l border-[#EBEBEB] bg-white p-5 xl:block">
            <p className="mb-1 text-[13px] font-semibold text-[#6B7280]">Live Preview</p>
            <p className="mb-4 text-[11px] text-[#9CA3AF]">Updates as you select a theme</p>
            <ProfilePreviewCard profile={profile} themeKey={selectedTheme || "default"} />

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
