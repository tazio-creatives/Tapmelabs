"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CropImageModal from "@/components/dashboard/CropImageModal";
import api from "@/services/api";
import profileService from "@/services/profileService";
import themeService from "@/services/themeService";
import orderService from "@/services/orderService";
import ProfilePreviewCard, { THEME_STYLES } from "@/components/dashboard/ProfilePreviewCard";

/* ─── theme normalizer ────────────────────────────────────────────────── */

function normalizeTheme(t) {
  return {
    key:           t.key ?? t.theme_key ?? t.id ?? "",
    name:          t.name || t.theme_name || "Unnamed",
    preview_image: t.preview_image || t.previewImage || t.image || null,
  };
}

/* ─── slug generator ──────────────────────────────────────────────────── */

function generateSlug(name) {
  const base = (name || "user").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base || "user"}-${rand}`;
}

/* ─── shared input style ──────────────────────────────────────────────── */

const inputCls =
  "w-full rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-[12px] text-[14px] text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#28DC4F] focus:ring-2 focus:ring-[#28DC4F]/15";

/* ─── icons ───────────────────────────────────────────────────────────── */

const BackArrow = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4L6 9l5 5" />
  </svg>
);

const CameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 5H15l-2-2H9L7 5H6A3 3 0 0 0 3 8v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z" />
    <circle cx="11" cy="12" r="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5" />
  </svg>
);

const SpinnerIcon = ({ size = 18, color = "white" }) => (
  <svg className="animate-spin" style={{ animationDuration: "0.75s" }} width={size} height={size} viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke={color === "white" ? "rgba(255,255,255,0.35)" : "rgba(40,220,79,0.25)"} strokeWidth="2.5" />
    <circle cx="9" cy="9" r="7" stroke={color === "white" ? "white" : "#28DC4F"} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 29" />
  </svg>
);

/* ─── social platform icons ───────────────────────────────────────────── */

function WhatsAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#25D366" />
      <path fill="white" d="M14 6.5A7.5 7.5 0 0 0 7.9 17.6L6.5 21.5l4-1.4A7.5 7.5 0 1 0 14 6.5Zm0 13.5a6 6 0 0 1-3.3-1l-.3-.2-2.6.9.8-2.5-.2-.3A6 6 0 1 1 14 20Zm3.2-4.5c-.2-.1-1-.5-1.2-.6-.2-.1-.3-.1-.4.1l-.5.6c-.1.1-.2.2-.4.1-.2-.1-.9-.3-1.6-1a6 6 0 0 1-1.2-1.4c-.1-.2 0-.3.1-.4l.3-.4.2-.3V12l-.6-1.5c-.2-.3-.4-.4-.4-.4H10c-.2 0-.6.1-.9.4a2.4 2.4 0 0 0-.7 1.8c0 1.3 1 2.6 1.1 2.8 1.2 1.8 2.6 2.4 4.1 3 .3.1.6.1.9.1.3 0 .6 0 1-.2.4-.2.7-.5.9-.8.2-.3.2-.5.1-.7l-.7-.6Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#0A66C2" />
      <path fill="white" d="M9.5 12H7v9h2.5V12Zm-1.2-3.7a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM21 16.3c0-2.4-1.2-4.3-3.5-4.3-1 0-2 .6-2.4 1.5V12h-2.3v9h2.6v-5.2c0-1.2.5-2 1.6-2 1 0 1.5.8 1.5 2V21H21v-4.7Z" />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#0084FF" />
      <path fill="white" d="M14 7C9.9 7 7 10 7 13.7c0 2 .9 3.7 2.4 5v3.3l2.4-1.3c.6.2 1.3.3 2.2.3 4.1 0 7-3 7-6.7S18.1 7 14 7Zm.7 9L12.6 13.8 8.7 16l4.1-4.4 2.1 2.6 3.9-2.6-4.1 4.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="igSetup" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="40%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#9C27B0" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill="url(#igSetup)" />
      <rect x="8.5" y="8.5" width="11" height="11" rx="3.2" fill="none" stroke="white" strokeWidth="1.4" />
      <circle cx="14" cy="14" r="2.8" fill="none" stroke="white" strokeWidth="1.4" />
      <circle cx="18" cy="10" r="0.8" fill="white" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#000" />
      <path fill="white" d="M15.5 12.9 19.5 8h-1l-3.5 4.1L12.3 8H8.5l4.3 6.3L8.5 20h1l3.8-4.5 3 4.5H20l-4.5-7.1Zm-1.3 1.6-.5-.6-3.4-4.9h1.6l2.7 3.9.5.6 3.7 5.2H17l-2.8-4.2Z" />
    </svg>
  );
}

function SnapchatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#FFFC00" />
      <path fill="#1a1a1a" d="M14 7c-2.1 0-3.8 1.7-3.8 3.8V12c-.5 0-1.1-.2-1.1-.2s-.3.6.4 1.1c-.3.4-.7 1.3-1.7 1.6s.2.9.7.9c.4 0 .5.3.4.6-.2.4-.9.8-1.1 1.1.5.6 1.8 1.2 3.8 1.4.2.5.7 1.4 1.4 1.4h.2c.7 0 1.2-.8 1.4-1.4 2-.2 3.3-.8 3.8-1.4-.3-.3-.9-.7-1.1-1.1-.2-.3-.1-.6.4-.6.5 0 1.1-.3.7-.9-1-.3-1.4-1.2-1.7-1.6.7-.5.4-1.1.4-1.1s-.6.2-1.1.2v-.2C17.8 8.7 16.1 7 14 7Z" />
    </svg>
  );
}

/* ─── blurred dashboard background ───────────────────────────────────── */

function DashboardBg() {
  const navItems = ["Dashboard", "Themes", "My Cards", "Orders", "Settings"];
  const iconPaths = [
    "M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z",
    "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z",
    "M2 7h20v12H2zM2 11h20M7 7V3M17 7V3",
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8",
    "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM12 9v3M12 15h.01",
  ];

  return (
    <div className="fixed inset-0 select-none overflow-hidden" aria-hidden="true">
      <div className="absolute left-0 top-0 h-full w-[220px] border-r border-[#EBEBEB] bg-white">
        <div className="flex h-[60px] items-center gap-[10px] border-b border-[#EBEBEB] px-5">
          <div className="h-8 w-8 rounded-full bg-[#28DC4F]" />
          <div className="h-3 w-24 rounded-full bg-[#EBEBEB]" />
        </div>
        <div className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-[8px] px-3 py-[10px]"
              style={{ background: i === 0 ? "#28DC4F" : "transparent" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? "#fff" : "#9CA3AF"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={iconPaths[i]} />
              </svg>
              <div className="h-2.5 rounded-full" style={{ width: `${50 + i * 10}px`, background: i === 0 ? "rgba(255,255,255,0.7)" : "#E5E7EB" }} />
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-3 right-3">
          <div className="flex items-center gap-3 rounded-[8px] px-3 py-[10px]">
            <div className="h-4 w-4 rounded-sm bg-[#E5E7EB]" />
            <div className="h-2.5 w-14 rounded-full bg-[#E5E7EB]" />
          </div>
        </div>
      </div>
      <div className="absolute left-[220px] top-0 right-0 h-full bg-[#F5F6FA]">
        <div className="flex h-[60px] items-center justify-between border-b border-[#EBEBEB] bg-white px-6">
          <div className="h-3 w-40 rounded-full bg-[#E5E7EB]" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#E5E7EB]" />
            <div className="h-8 w-8 rounded-full bg-[#28DC4F]" />
          </div>
        </div>
        <div className="p-6">
          <div className="mb-5 grid grid-cols-4 gap-4">
            {[["Total Taps", "#28DC4F"], ["Profile Views", "#6366F1"], ["Connections", "#F59E0B"], ["Cards", "#EF4444"]].map(([label, clr]) => (
              <div key={label} className="rounded-[14px] bg-white p-4 shadow-sm">
                <div className="mb-3 h-8 w-8 rounded-full" style={{ background: `${clr}20` }} />
                <div className="mb-2 h-5 w-16 rounded-full bg-[#F0F0F0]" />
                <div className="h-3 w-20 rounded-full bg-[#F0F0F0]" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 rounded-[14px] bg-white p-5 shadow-sm">
              <div className="mb-4 h-3 w-32 rounded-full bg-[#F0F0F0]" />
              <div className="flex h-32 items-end gap-2">
                {[60, 80, 50, 90, 70, 85, 65].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-[4px]" style={{ height: `${h}%`, background: i === 4 ? "#28DC4F" : "#F0F0F0" }} />
                ))}
              </div>
            </div>
            <div className="rounded-[14px] bg-white p-5 shadow-sm">
              <div className="mb-4 h-3 w-24 rounded-full bg-[#F0F0F0]" />
              <div className="flex flex-col gap-3">
                {[70, 45, 30, 25].map((w, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: ["#28DC4F", "#6366F1", "#F59E0B", "#EF4444"][i] }} />
                    <div className="h-2 flex-1 rounded-full bg-[#F0F0F0]">
                      <div className="h-full rounded-full" style={{ width: `${w}%`, background: ["#28DC4F", "#6366F1", "#F59E0B", "#EF4444"][i] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── preview filename map (API key → local file key) ────────────────── */

const PREVIEW_KEY_MAP = { midnight: "midnight-dark" };

/* ─── Theme card (matches Themes page design) ─────────────────────────── */

function ThemeCard({ theme, isSelected, onSelect }) {
  const fileKey      = PREVIEW_KEY_MAP[theme.key] || theme.key;
  const localPreview = `/images/dashboard/themes/preview-${fileKey}.png`;
  const previewSrc   = theme.preview_image || localPreview;

  return (
    <div
      className="group relative cursor-pointer overflow-visible rounded-[16px] border border-[#E5E5E5] bg-white transition-all duration-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      onClick={() => onSelect(theme.key)}
    >
      {isSelected && (
        <div
          className="absolute left-1/2 z-10 -translate-x-1/2 flex items-center justify-center rounded-full px-[10px]"
          style={{ top: "10px", height: "21px", background: "rgb(27,27,29)", minWidth: "80px" }}
        >
          <span className="whitespace-nowrap text-[10px] font-medium text-white">Selected</span>
        </div>
      )}

      <div className="mx-[16px] mt-[16px] overflow-hidden rounded-[10px]">
        <Image
          src={previewSrc}
          alt={`${theme.name} theme preview`}
          width={315}
          height={505}
          sizes="(max-width: 580px) calc(50vw - 56px), 220px"
          style={{ width: "100%", height: "auto", display: "block" }}
          priority={isSelected}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      <div className="mx-[16px] mt-[10px] pb-[16px]">
        <p className="text-[14px] font-semibold text-[#111827]">{theme.name}</p>
      </div>

      {isSelected && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px]"
          style={{ boxShadow: "0 0 0 2px #28DC4F" }}
        />
      )}
    </div>
  );
}

/* ─── Step 1 — Theme selection ────────────────────────────────────────── */

function ThemeStep({ themes, loading, error, onRetry, selected, onSelect }) {
  if (loading) {
    return (
      <div className="flex h-[220px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#28DC4F] border-t-transparent" />
          <p className="text-[13px] text-[#9CA3AF]">Loading themes…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[220px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-[14px] text-[#EF4444]">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-[10px] border border-[#E5E7EB] px-5 py-2.5 text-[13px] font-medium text-[#374151] transition-colors hover:border-[#28DC4F] hover:text-[#28DC4F]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (themes.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center">
        <p className="text-[14px] text-[#9CA3AF]">No themes available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-0.5" style={{ maxHeight: "380px" }}>
      {themes.map((theme) => (
        <ThemeCard
          key={theme.key}
          theme={theme}
          isSelected={selected === theme.key}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

/* ─── Step 2 — Basic profile ──────────────────────────────────────────── */

function BasicStep({ data, onChange, selectedTheme, onOpenCrop }) {
  const fileInputRef = useRef(null);
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");

  const themeConfig  = THEME_STYLES[selectedTheme] ?? THEME_STYLES.default;
  const aspectRatio  = themeConfig.imageAspectRatio ?? "3:4";
  const [rw, rh]     = aspectRatio.split(":").map(Number);
  const aspectNumber = rw / rh;
  const aspectHint   = aspectRatio === "1:1" ? "square (1:1)" : "portrait (3:4)";

  function set(field, val) { onChange((prev) => ({ ...prev, [field]: val })); }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";

    const imageSrc = URL.createObjectURL(file);

    onOpenCrop({
      imageSrc,
      aspect: aspectNumber,
      title: "Crop Profile Photo",
      filename: "photo.jpg",
      onComplete: async (croppedFile) => {
        setUploading(true);
        setUploadError("");
        try {
          const formData = new FormData();
          formData.append("image", croppedFile);
          const res = await api.post("/uploads/profile-image", formData, {
            headers: { "Content-Type": undefined },
          });
          const url = res.data?.data?.url;
          if (url) set("profile_image", url);
        } catch (err) {
          setUploadError(err.response?.data?.message || "Upload failed. Please try again.");
        } finally {
          setUploading(false);
        }
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Profile photo upload */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex h-[88px] w-[88px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#E5E7EB] bg-[#F9F9F9] transition-colors hover:border-[#28DC4F] hover:bg-[#F0FDF4]"
          onClick={() => !uploading && fileInputRef.current?.click()}
          title="Click to upload profile photo"
        >
          {uploading ? (
            <SpinnerIcon size={24} color="green" />
          ) : data.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.profile_image} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <>
              <CameraIcon />
              <span className="absolute bottom-1 text-[9px] font-medium text-[#9CA3AF]">Photo</span>
            </>
          )}
        </div>

        {/* Aspect ratio hint */}
        <p className="text-[11px] text-[#9CA3AF]">
          This theme works best with a <strong className="font-semibold text-[#6B7280]">{aspectHint}</strong> photo
        </p>

        {data.profile_image && !uploading && (
          <button
            type="button"
            className="text-[11px] text-[#6B7280] underline underline-offset-2 hover:text-[#28DC4F]"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            Change photo
          </button>
        )}
        {uploadError && <p className="text-[12px] text-[#EF4444]">{uploadError}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[13px] font-medium text-[#374151]">Full Name</label>
        <input className={inputCls} type="text" placeholder="Jane Smith" value={data.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
      </div>
      <div className="flex flex-col gap-[6px]">
        <label className="text-[13px] font-medium text-[#374151]">Email Address</label>
        <input className={inputCls} type="email" placeholder="jane@example.com" value={data.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
      </div>
      <div className="flex flex-col gap-[6px]">
        <label className="text-[13px] font-medium text-[#374151]">Phone Number</label>
        <input className={inputCls} type="tel" placeholder="+91 98765 43210" value={data.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
      </div>
    </div>
  );
}

/* ─── Step 3 — Business details ───────────────────────────────────────── */

const BUSINESS_CATEGORIES = [
  "Technology", "Finance", "Healthcare", "Education", "Marketing",
  "Design", "Consulting", "Real Estate", "Retail", "Manufacturing",
  "Legal", "Media & Entertainment", "Hospitality", "Other",
];

function BusinessStep({ data, onChange, onOpenCrop }) {
  const fileInputRef = useRef(null);
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");

  function set(field, val) { onChange((prev) => ({ ...prev, [field]: val })); }

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";

    const imageSrc = URL.createObjectURL(file);

    onOpenCrop({
      imageSrc,
      aspect: 3 / 1,
      title: "Crop Business Logo",
      filename: "logo.jpg",
      onComplete: async (croppedFile) => {
        setUploading(true);
        setUploadError("");
        try {
          const formData = new FormData();
          formData.append("image", croppedFile);
          const res = await api.post("/uploads/company-logo", formData, {
            headers: { "Content-Type": undefined },
          });
          const url = res.data?.data?.url;
          if (url) set("company_logo", url);
        } catch (err) {
          setUploadError(err.response?.data?.message || "Upload failed. Please try again.");
        } finally {
          setUploading(false);
        }
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Business logo upload */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex h-[72px] w-[72px] cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-2 border-dashed border-[#E5E7EB] bg-[#F9F9F9] transition-colors hover:border-[#28DC4F] hover:bg-[#F0FDF4]"
          onClick={() => !uploading && fileInputRef.current?.click()}
          title="Click to upload business logo"
        >
          {uploading ? (
            <SpinnerIcon size={22} color="green" />
          ) : data.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.company_logo} alt="Company logo preview" className="h-full w-full object-contain p-1" />
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="18" height="13" rx="2" />
                <path d="M7 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="absolute bottom-1 text-[9px] font-medium text-[#9CA3AF]">Logo</span>
            </>
          )}
        </div>
        <p className="text-[11px] text-[#9CA3AF]">Square crop — all logos are cropped 1:1</p>
        {data.company_logo && !uploading && (
          <button
            type="button"
            className="text-[11px] text-[#6B7280] underline underline-offset-2 hover:text-[#28DC4F]"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            Change logo
          </button>
        )}
        {uploadError && <p className="text-[12px] text-[#EF4444]">{uploadError}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-[#374151]">Designation</label>
          <input className={inputCls} type="text" placeholder="Marketing Director" value={data.designation} onChange={(e) => set("designation", e.target.value)} />
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-[#374151]">Company Name</label>
          <input className={inputCls} type="text" placeholder="Acme Inc." value={data.company} onChange={(e) => set("company", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-[#374151]">City</label>
          <input className={inputCls} type="text" placeholder="Mumbai" value={data.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-[#374151]">Website</label>
          <input className={inputCls} type="url" placeholder="https://yoursite.com" value={data.website} onChange={(e) => set("website", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-[#374151]">Work Phone</label>
          <input className={inputCls} type="tel" placeholder="+91 98765 43210" value={data.biz_phone} onChange={(e) => set("biz_phone", e.target.value)} />
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-[#374151]">Work Email</label>
          <input className={inputCls} type="email" placeholder="work@company.com" value={data.biz_email} onChange={(e) => set("biz_email", e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[13px] font-medium text-[#374151]">Business Category</label>
        <select
          className={inputCls}
          value={data.category}
          onChange={(e) => set("category", e.target.value)}
          style={{ appearance: "none" }}
        >
          <option value="">Select a category</option>
          {BUSINESS_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ─── Step 4 — Social media ───────────────────────────────────────────── */

const PLATFORMS = [
  { key: "whatsapp",  label: "WhatsApp",  Icon: WhatsAppIcon,  placeholder: "+91 98765 43210"         },
  { key: "linkedin",  label: "LinkedIn",  Icon: LinkedInIcon,  placeholder: "linkedin.com/in/username" },
  { key: "messenger", label: "Messenger", Icon: MessengerIcon, placeholder: "facebook.com/username"    },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon, placeholder: "@username"                },
  { key: "twitter",   label: "Twitter/X", Icon: TwitterIcon,   placeholder: "@username"                },
  { key: "snapchat",  label: "Snapchat",  Icon: SnapchatIcon,  placeholder: "@username"                },
];

function SocialStep({ data, onChange }) {
  function set(field, val) { onChange((prev) => ({ ...prev, [field]: val })); }

  return (
    <div className="flex flex-col gap-3">
      {PLATFORMS.map(({ key, label, Icon, placeholder }) => (
        <div key={key} className="flex items-center gap-3 rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2 transition-all focus-within:border-[#28DC4F] focus-within:ring-2 focus-within:ring-[#28DC4F]/15">
          <Icon />
          <div className="flex flex-1 flex-col">
            <span className="text-[11px] font-medium text-[#9CA3AF]">{label}</span>
            <input
              type="text"
              placeholder={placeholder}
              value={data[key]}
              onChange={(e) => set(key, e.target.value)}
              className="bg-transparent text-[13px] text-[#111827] outline-none placeholder:text-[#D1D5DB]"
            />
          </div>
          {data[key] && (
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#28DC4F]">
              <CheckIcon />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */

const STEP_TITLES    = ["Choose Your Theme", "Basic Information", "Business Details", "Social Media"];
const STEP_SUBTITLES = [
  "Pick a look for your digital profile card.",
  "Let people know who you are.",
  "Add your professional details.",
  "Connect your social accounts.",
];
const TOTAL_STEPS = 4;

export default function ProfileSetupPage() {
  const router = useRouter();

  const [step,             setStep]             = useState(0);
  const [themes,           setThemes]           = useState([]);
  const [loadingThemes,    setLoadingThemes]    = useState(true);
  const [themeError,       setThemeError]       = useState("");
  const [selectedTheme,    setSelectedTheme]    = useState("default");
  const [basic,            setBasic]            = useState({ name: "", email: "", phone: "", profile_image: "" });
  const [business,         setBusiness]         = useState({ designation: "", company: "", city: "", website: "", category: "", company_logo: "", biz_phone: "", biz_email: "" });
  const [social,           setSocial]           = useState({ whatsapp: "", linkedin: "", messenger: "", instagram: "", twitter: "", snapchat: "" });
  const [saving,           setSaving]           = useState(false);
  const [error,            setError]            = useState("");
  const [checkingProfile,  setCheckingProfile]  = useState(true);
  const [paymentRequired,  setPaymentRequired]  = useState(false);

  /* cropState: { imageSrc, aspect, onComplete } | null */
  const [cropState, setCropState] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("customerToken")) { router.replace("/login"); return; }

    const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
    setBasic((prev) => ({
      ...prev,
      name:  stored.full_name || stored.name  || prev.name,
      email: stored.email                     || prev.email,
      phone: stored.phone                     || prev.phone,
    }));

    /* Guard: redirect existing-profile customers to dashboard */
    profileService.getMyProfile()
      .then(async (data) => {
        const prof = data?.data?.profile ?? data?.profile ?? data?.data ?? data ?? null;
        if (prof?.id || prof?.slug) {
          router.replace("/dashboard");
          return;
        }
        /* No profile yet — verify a paid order exists before allowing setup */
        try {
          const ordersRes = await orderService.getMyOrders();
          const orders = Array.isArray(ordersRes?.data?.orders) ? ordersRes.data.orders : [];
          const hasPaid = orders.some((o) => o.payment_status === "paid");
          if (!hasPaid) {
            setPaymentRequired(true);
            setCheckingProfile(false);
            return;
          }
        } catch {
          /* If order fetch fails, let backend enforce the rule */
        }
        setCheckingProfile(false);
        fetchThemes();
      })
      .catch(() => {
        /* 404 = no profile yet → allow setup. Any other error → fail open. */
        setCheckingProfile(false);
        fetchThemes();
      });
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  function fetchThemes() {
    setLoadingThemes(true);
    setThemeError("");
    themeService.getActiveThemes()
      .then((response) => {
        const themeList = response?.data?.themes || response?.data?.data?.themes || [];
        setThemes(Array.isArray(themeList) ? themeList.map(normalizeTheme).filter((t) => t.key === "default") : []);
      })
      .catch(() => {
        setThemeError("Unable to load themes. Please try again.");
      })
      .finally(() => {
        setLoadingThemes(false);
      });
  }

  function openCrop(state) {
    setCropState(state);
  }

  function closeCrop() {
    if (cropState?.imageSrc) URL.revokeObjectURL(cropState.imageSrc);
    setCropState(null);
  }

  async function handleCropApply(croppedFile) {
    const onComplete = cropState?.onComplete;
    closeCrop();
    if (onComplete) await onComplete(croppedFile);
  }

  async function handleComplete() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        slug:          generateSlug(basic.name),
        name:          basic.name           || null,
        email:         basic.email          || null,
        phone:         basic.phone          || null,
        profile_image: basic.profile_image  || null,
        designation:   business.designation || null,
        company_name:  business.company     || null,
        company_logo:  business.company_logo || null,
        website:       business.website     || null,
        theme_key:     selectedTheme,
        social_links: {
          ...(social.whatsapp        ? { whatsapp:    social.whatsapp        } : {}),
          ...(social.linkedin        ? { linkedin:    social.linkedin        } : {}),
          ...(social.messenger       ? { messenger:   social.messenger       } : {}),
          ...(social.instagram       ? { instagram:   social.instagram       } : {}),
          ...(social.twitter         ? { twitter:     social.twitter         } : {}),
          ...(social.snapchat        ? { snapchat:    social.snapchat        } : {}),
          ...(business.city          ? { city:        business.city          } : {}),
          ...(business.category      ? { category:    business.category      } : {}),
          ...(business.biz_phone     ? { work_phone:  business.biz_phone     } : {}),
          ...(business.biz_email     ? { work_email:  business.biz_email     } : {}),
        },
        is_public: true,
      };

      try {
        await profileService.createProfile(payload);
      } catch (err) {
        if (err.response?.status === 409) {
          /* Profile already exists — update everything except the slug
             so the customer's existing public URL is never broken. */
          const { slug, ...updatePayload } = payload;
          await profileService.updateMyProfile(updatePayload);
        } else {
          throw err;
        }
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleNext() {
    setError("");
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else handleComplete();
  }

  function handleBack() {
    setError("");
    if (step > 0) setStep((s) => s - 1);
  }

  function handleSkip() {
    setError("");
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
    else handleComplete();
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const isLast   = step === TOTAL_STEPS - 1;

  const liveProfile = {
    name:          basic.name            || null,
    email:         basic.email           || null,
    phone:         basic.phone           || null,
    profile_image: basic.profile_image   || null,
    designation:   business.designation  || null,
    company_name:  business.company      || null,
    company_logo:  business.company_logo || null,
    website:       business.website      || null,
    social_links: {
      whatsapp:   social.whatsapp      || null,
      linkedin:   social.linkedin      || null,
      messenger:  social.messenger     || null,
      instagram:  social.instagram     || null,
      twitter:    social.twitter       || null,
      snapchat:   social.snapchat      || null,
      city:       business.city        || null,
      work_phone: business.biz_phone   || null,
      work_email: business.biz_email   || null,
    },
  };

  if (checkingProfile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (paymentRequired) {
    return (
      <>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <DashboardBg />
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div className="relative z-10 flex min-h-full items-center justify-center px-4 py-10">
            <div className="w-full max-w-[420px] rounded-[24px] bg-white p-8 shadow-[0_32px_80px_rgba(0,0,0,0.22)] text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF5F5]">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="#EF4444" strokeWidth="2" />
                  <path d="M16 9v8M16 22v1" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-[20px] font-bold text-[#111827]">Payment Required</h2>
              <p className="mt-2 text-[14px] leading-[1.65] text-[#6D6D6D]">
                You need to complete a purchase before setting up your digital profile. Please buy a TapMe card to continue.
              </p>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#28DC4F" }}
              >
                Browse Products
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/orders")}
                className="mt-3 flex w-full items-center justify-center rounded-[12px] border border-[#E5E7EB] py-[14px] text-[15px] font-medium text-[#374151] transition-opacity hover:opacity-80"
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Blurred dashboard background */}
        <DashboardBg />

        {/* Dark overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />

        {/* Centered modal */}
        <div className="relative z-10 flex min-h-full items-center justify-center px-4 py-10">
          <div className="w-full max-w-[900px] overflow-hidden rounded-[24px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.22)]">

            {/* Progress bar */}
            <div className="h-[5px] w-full bg-[#F0F0F0]">
              <div
                className="h-full bg-[#28DC4F] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex">

              {/* ── Form side ─────────────────────────────────── */}
              <div className="min-w-0 flex-1 px-8 pb-8 pt-6">

                {/* Back | Step X/4 | Skip */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EBEBEB] text-[#111827] transition-colors hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-25"
                    aria-label="Go back"
                  >
                    <BackArrow />
                  </button>

                  <span className="text-[13px] font-medium text-[#9CA3AF]">
                    {step + 1} / {TOTAL_STEPS}
                  </span>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-[13px] font-medium text-[#9CA3AF] transition-colors hover:text-[#111827]"
                  >
                    Skip
                  </button>
                </div>

                {/* Step heading */}
                <div className="mt-5">
                  <h2 className="text-[22px] font-bold leading-tight text-[#111827]">
                    {STEP_TITLES[step]}
                  </h2>
                  <p className="mt-1 text-[14px] text-[#6D6D6D]">{STEP_SUBTITLES[step]}</p>
                </div>

                {/* Step content */}
                <div className="mt-6">
                  {step === 0 && (
                    <ThemeStep
                      themes={themes}
                      loading={loadingThemes}
                      error={themeError}
                      onRetry={fetchThemes}
                      selected={selectedTheme}
                      onSelect={setSelectedTheme}
                    />
                  )}
                  {step === 1 && (
                    <BasicStep
                      data={basic}
                      onChange={setBasic}
                      selectedTheme={selectedTheme}
                      onOpenCrop={openCrop}
                    />
                  )}
                  {step === 2 && (
                    <BusinessStep
                      data={business}
                      onChange={setBusiness}
                      onOpenCrop={openCrop}
                    />
                  )}
                  {step === 3 && (
                    <SocialStep data={social} onChange={setSocial} />
                  )}
                </div>

                {/* Error message */}
                {error && (
                  <div className="mt-4 rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                    {error}
                  </div>
                )}

                {/* CTA button */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={saving}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] py-[14px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "#28DC4F" }}
                >
                  {saving ? (
                    <><SpinnerIcon />Saving…</>
                  ) : isLast ? (
                    <>Complete Profile <ArrowRight /></>
                  ) : (
                    <>Continue <ArrowRight /></>
                  )}
                </button>
              </div>

              {/* ── Live preview panel — visible on md+ screens ── */}
              <div className="hidden md:flex w-[280px] shrink-0 flex-col overflow-y-auto border-l border-[#EBEBEB] bg-[#F7F8F9] p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Live Preview
                </p>
                {step === 0 ? (
                  <div className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
                    <Image
                      src={`/images/dashboard/themes/preview-${PREVIEW_KEY_MAP[selectedTheme] || selectedTheme || "default"}.png`}
                      alt="Theme preview"
                      width={260}
                      height={416}
                      style={{ width: "100%", height: "auto", display: "block" }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
                ) : (
                  <ProfilePreviewCard profile={liveProfile} themeKey={selectedTheme} />
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Crop modal — rendered as sibling so it stacks above z-50 overlay */}
      {cropState && (
        <CropImageModal
          imageSrc={cropState.imageSrc}
          aspect={cropState.aspect}
          title={cropState.title}
          filename={cropState.filename}
          onCancel={closeCrop}
          onApply={handleCropApply}
        />
      )}
    </>
  );
}
