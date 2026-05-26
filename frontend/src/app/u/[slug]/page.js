"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import profileService from "@/services/profileService";
import analyticsService from "@/services/analyticsService";

// ---------------------------------------------------------------------------
// Theme registry
// Only "default" is implemented. Other entries are null placeholders —
// swap in the real component once the backend + admin panel are ready.
// ---------------------------------------------------------------------------
const THEMES = {
  default:      DefaultThemeProfile,
  midnight:     null,
  professional: null,
  modern:       null,
  vibrant:      null,
  minimal:      null,
};

// ---------------------------------------------------------------------------
// Normalize public API response → component profile shape
// Handles all known backend response wrappers.
// ---------------------------------------------------------------------------
function normalizeProfile(raw) {
  const p      = raw?.data?.profile ?? raw?.profile ?? raw?.data ?? raw ?? {};
  const social = p.social_links || {};
  const city   = p.city || social.city || "";
  const location = city
    ? city.toLowerCase().includes("india") ? city : `${city}, India`
    : "";
  return {
    id:           p.id || p._id || "",
    name:         p.name || "",
    jobTitle:     p.designation || "",
    company:      p.company_name || "",
    location,
    phone:        p.phone || "",
    email:        p.email || "",
    website:      p.website || "",
    workPhone:    social.work_phone || "",
    workEmail:    social.work_email || "",
    social,
    profileImage: p.profile_image || null,
    companyLogo:  p.company_logo || null,
    bio:          p.bio || "",
    theme_key:    p.theme_key || "default",
    slug:         p.slug || "",
  };
}

// ---------------------------------------------------------------------------
// Shared icon components
// ---------------------------------------------------------------------------
function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 5l-7 7 7 7" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------
function LoadingState() {
  return (
    <div
      style={{
        background: "#292D3E",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="animate-spin rounded-full border-2 border-white border-t-transparent"
        style={{ width: "36px", height: "36px" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profile not found state
// ---------------------------------------------------------------------------
function NotFoundState() {
  return (
    <div
      style={{
        background: "#292D3E",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-figtree), sans-serif",
          fontSize: "20px",
          fontWeight: 600,
          color: "#FFFFFF",
        }}
      >
        Profile not found
      </p>
      <p
        style={{
          fontFamily: "var(--font-figtree), sans-serif",
          fontSize: "14px",
          color: "#9CA3AF",
        }}
      >
        This card link may be invalid or deactivated.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "8px",
          fontSize: "13px",
          color: "#28DC4F",
          fontFamily: "var(--font-figtree), sans-serif",
        }}
      >
        Go to homepage
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Social platform icons (inline SVG — no PNG dependency)
// ---------------------------------------------------------------------------
const ALL_SOCIAL_KEYS = ["whatsapp", "linkedin", "messenger", "instagram", "twitter", "snapchat"];

const SOCIAL_LABELS = { whatsapp: "WhatsApp", linkedin: "LinkedIn", messenger: "Messenger", instagram: "Instagram", twitter: "Twitter / X", snapchat: "Snapchat" };

function SocialPlatformIcon({ platform, size = 32 }) {
  const s = size;
  if (platform === "whatsapp") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#25D366"/>
      <path fill="white" d="M16 7.5A8.5 8.5 0 0 0 9.1 20.1L7.5 24.5l4.5-1.6A8.5 8.5 0 1 0 16 7.5Zm0 15.5a7 7 0 0 1-3.8-1.1l-.3-.2-3 1 .9-2.9-.2-.3A7 7 0 1 1 16 23Zm3.7-5.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1-.2-.1-1-.4-1.8-1.2a7 7 0 0 1-1.4-1.6c-.1-.2 0-.3.1-.4l.4-.4.2-.4V14l-.7-1.7c-.2-.4-.4-.4-.4-.4H12a.9.9 0 0 0-.7.3 2.7 2.7 0 0 0-.8 2c0 1.5 1.1 3 1.2 3.2 1.4 2.1 3 2.7 4.7 3.4.4.1.7.1 1 .1.4 0 .7 0 1.1-.2.5-.2.8-.5 1-.8.2-.3.2-.6 0-.8l-.8-.7Z"/>
    </svg>
  );
  if (platform === "linkedin") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0A66C2"/>
      <path fill="white" d="M11 14H8.5V24H11V14Zm-1.3-4.3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM24 18.5c0-2.6-1.3-4.5-3.8-4.5-1 0-2 .6-2.5 1.6V14h-2.5V24h2.8v-5.8c0-1.2.6-2.1 1.7-2.1 1.1 0 1.5.9 1.5 2.1V24H24V18.5Z"/>
    </svg>
  );
  if (platform === "messenger") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0084FF"/>
      <path fill="white" d="M16 8C11.6 8 8 11.3 8 15.5c0 2.2 1 4.1 2.7 5.5V24l2.7-1.5c.7.2 1.5.3 2.6.3 4.4 0 8-3.3 8-7.5S20.4 8 16 8Zm.8 10-2.3-2.5-4.3 2.5 4.6-4.9 2.3 2.9 4.3-2.9-4.6 4.9Z"/>
    </svg>
  );
  if (platform === "instagram") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#C13584"/>
      <rect x="10" y="10" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="3" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="20.2" cy="11.8" r="0.9" fill="white"/>
    </svg>
  );
  if (platform === "twitter") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#000000"/>
      <path fill="white" d="M17.8 14.9 22.5 9h-1.1l-4.1 4.8L14 9H9.5l5 7.1L9.5 23H10.6l4.4-5.1 3.5 5.1H23l-5.2-8.1Zm-1.5 1.8-.5-.7-4-5.7H13l3.2 4.6.5.7 4.2 5.9H19.7l-3.4-4.8Z"/>
    </svg>
  );
  if (platform === "snapchat") return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#FFFC00"/>
      <path fill="#1a1a1a" d="M16 8c-2.4 0-4.4 2-4.4 4.4V13c-.6.1-1.3-.2-1.3-.2s-.3.7.5 1.2c-.3.5-.8 1.5-2 1.9s.2 1 .8 1c.5 0 .6.3.4.7-.3.4-1 .9-1.3 1.2.5.7 2 1.4 4.4 1.6.3.6.8 1.6 1.6 1.6h.2c.8 0 1.4-.9 1.6-1.6 2.4-.2 3.9-.9 4.4-1.6-.3-.3-1-.8-1.3-1.2-.2-.4-.1-.7.4-.7.6 0 1.3-.4.8-1-1.2-.5-1.7-1.4-2-1.9.8-.5.5-1.2.5-1.2s-.8.3-1.3.2v-.6C20.4 10 18.4 8 16 8Z"/>
    </svg>
  );
  return null;
}

function WebsiteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z"/>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Default theme profile component
// Pixel-accurate to Figma "Android Compact - 25" (node 524:3274)
// ---------------------------------------------------------------------------
function DefaultThemeProfile({ profile, onSaveContact, onShare }) {
  const activeSocials = ALL_SOCIAL_KEYS.filter((key) => !!profile.social?.[key]);

  return (
    <div className="relative min-h-screen w-full" style={{ background: "#292D3E" }}>

      {/* Full-bleed background — darkened overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/profile/bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top", opacity: 0.4 }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
      </div>

      {/* Mobile column — max 412 px, centered */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[412px] flex-col">

        {/* ── Nav bar (relY=44 in Figma) ────────────────────────────────── */}
        <div className="flex items-center justify-between px-[22px] pb-2 pt-[44px]">

          {/* Left: back-arrow circle + "sign in" label */}
          <Link href="/sign-in" className="flex items-center gap-[8px]">
            <span
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full"
              style={{ background: "#000000" }}
            >
              <ArrowLeftIcon />
            </span>
            <span
              className="text-[14px] leading-[16px]"
              style={{ fontFamily: "var(--font-figtree), sans-serif", color: "#000000" }}
            >
              sign in
            </span>
          </Link>

          {/* Right: share button */}
          <button
            onClick={onShare}
            aria-label="Share profile"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full"
            style={{ background: "#000000" }}
          >
            <ShareIcon />
          </button>
        </div>

        {/* ── White card (relY=120 in Figma, mx=22px) ──────────────────── */}
        <div
          className="mx-[22px] overflow-hidden"
          style={{ borderRadius: "16px", background: "#FFFFFF", marginTop: "4px" }}
        >

          {/* Profile photo section — 312 px tall, fills card width */}
          <div className="relative" style={{ height: "312px" }}>
            {profile.profileImage ? (
              /* Plain <img> avoids next/image remotePatterns requirement for backend URLs */
              <img
                src={profile.profileImage}
                alt={profile.name}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "center top",
                }}
              />
            ) : (
              <Image
                src="/images/profile/bg.png"
                alt={profile.name}
                fill
                priority
                sizes="368px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            )}

            {/* Dark gradient at bottom of photo for name readability */}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "160px",
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
              }}
            />

            {/* NFC waves dot pattern (OBJECTS frame, 358×139, bottom of photo) */}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{ height: "139px", opacity: 0.65 }}
            >
              <Image
                src="/images/profile/nfc-waves.png"
                alt=""
                fill
                sizes="368px"
                style={{ objectFit: "cover", objectPosition: "center bottom" }}
              />
            </div>

            {/* Name text — Figtree SemiBold 27px, white, bottom-left */}
            <div className="absolute bottom-[36px] left-[28px]">
              <p
                style={{
                  fontFamily: "var(--font-figtree), sans-serif",
                  fontWeight: 600,
                  fontSize: "27px",
                  lineHeight: "28px",
                  color: "#FFFFFF",
                }}
              >
                {profile.name}
              </p>
            </div>
          </div>

          {/* ── Info section ─────────────────────────────────────────────── */}
          <div className="px-[28px]" style={{ paddingTop: "28px", paddingBottom: "36px" }}>

            {/* Bio row: logo left + left-aligned text */}
            <div className="flex items-start" style={{ gap: "12px" }}>
              {/* Company logo or fallback avatar */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{ width: "40px", height: "40px", borderRadius: "4px" }}
              >
                {profile.companyLogo ? (
                  <img
                    src={profile.companyLogo}
                    alt={profile.company}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <Image
                    src="/images/profile/avatar.png"
                    alt={profile.company}
                    fill
                    sizes="40px"
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>

              <div className="flex-1">
                {profile.jobTitle && (
                  <p style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#21283F" }}>
                    {profile.jobTitle}
                  </p>
                )}
                {profile.company && (
                  <p style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#21283F" }}>
                    at {profile.company}
                  </p>
                )}
                {profile.location && (
                  <p style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "#21283F" }}>
                    in {profile.location}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p style={{ marginTop: "16px", fontFamily: "var(--font-figtree), sans-serif", fontSize: "12px", lineHeight: "18px", color: "#6B7280" }}>
                {profile.bio}
              </p>
            )}

            {/* Divider */}
            <div style={{ marginTop: "20px", height: "1px", background: "#E5E7EB" }} />

            {/* Phone row */}
            {profile.phone && (
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="flex items-center"
                style={{ marginTop: "20px", gap: "10px", color: "#21283F", textDecoration: "none" }}
              >
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{ width: "20px", height: "20px", color: "#1C1B1F" }}
                >
                  <PhoneIcon />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-figtree), sans-serif",
                    fontWeight: 600,
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: "#21283F",
                  }}
                >
                  {profile.phone}
                </span>
              </a>
            )}

            {/* Email row */}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center"
                style={{ marginTop: "24px", gap: "10px", color: "#21283F", textDecoration: "none" }}
              >
                <span className="flex items-center justify-center" style={{ width: "20px", height: "20px", color: "#1C1B1F" }}>
                  <EmailIcon />
                </span>
                <span style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: "#21283F" }}>
                  {profile.email}
                </span>
              </a>
            )}

            {/* Website row */}
            {profile.website && (
              <a
                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
                style={{ marginTop: "24px", gap: "10px", color: "#21283F", textDecoration: "none" }}
              >
                <span className="flex items-center justify-center" style={{ width: "20px", height: "20px", color: "#1C1B1F" }}>
                  <WebsiteIcon />
                </span>
                <span style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: "#21283F" }}>
                  {profile.website.replace(/^https?:\/\//, "")}
                </span>
              </a>
            )}

            {/* Work phone row */}
            {profile.workPhone && (
              <a
                href={`tel:${profile.workPhone.replace(/\s/g, "")}`}
                className="flex items-center"
                style={{ marginTop: "24px", gap: "10px", color: "#21283F", textDecoration: "none" }}
              >
                <span className="flex items-center justify-center rounded-full" style={{ width: "20px", height: "20px", color: "#1C1B1F" }}>
                  <PhoneIcon />
                </span>
                <span style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: "#21283F" }}>
                  {profile.workPhone}
                  <span style={{ fontWeight: 400, color: "#9CA3AF", marginLeft: "4px" }}>(work)</span>
                </span>
              </a>
            )}

            {/* Work email row */}
            {profile.workEmail && (
              <a
                href={`mailto:${profile.workEmail}`}
                className="flex items-center"
                style={{ marginTop: "24px", gap: "10px", color: "#21283F", textDecoration: "none" }}
              >
                <span className="flex items-center justify-center" style={{ width: "20px", height: "20px", color: "#1C1B1F" }}>
                  <EmailIcon />
                </span>
                <span style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: "#21283F" }}>
                  {profile.workEmail}
                  <span style={{ fontWeight: 400, color: "#9CA3AF", marginLeft: "4px" }}>(work)</span>
                </span>
              </a>
            )}

            {/* Social section — only render if at least one link exists */}
            {activeSocials.length > 0 && (
              <>
                {/* Divider */}
                <div style={{ marginTop: "24px", height: "1px", background: "#E5E7EB" }} />

                {/* Social icons */}
                <div className="flex flex-wrap items-center" style={{ marginTop: "20px", gap: "16px" }}>
                  {activeSocials.map((key) => (
                    <a
                      key={key}
                      href={profile.social[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[key]}
                    >
                      <SocialPlatformIcon platform={key} size={32} />
                    </a>
                  ))}
                </div>
              </>
            )}

            {/* Save Contact button */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
              <button
                onClick={onSaveContact}
                className="flex items-center"
                style={{
                  gap: "6px",
                  height: "32px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  borderRadius: "20px",
                  border: "1px solid #A4B6C4",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "var(--font-figtree), sans-serif",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#1C1B1F",
                }}
              >
                <DownloadIcon />
                Save Contact
              </button>
            </div>

            {/* TapMe branding */}
            <p
              style={{
                marginTop: "32px",
                textAlign: "center",
                fontSize: "11px",
                color: "#9CA3AF",
                fontFamily: "var(--font-figtree), sans-serif",
              }}
            >
              Powered by{" "}
              <a
                href="https://tapmelabs.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#9CA3AF", fontWeight: 600 }}
              >
                TapMe Labs
              </a>
            </p>
          </div>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: "32px" }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page entry point
// ---------------------------------------------------------------------------
export default function PublicProfilePage() {
  const params = useParams();
  const slug   = params?.slug ?? "";

  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* Fetch public profile — no auth required */
  useEffect(() => {
    if (!slug) { setLoading(false); setNotFound(true); return; }

    profileService
      .getPublicProfile(slug)
      .then((data) => {
        const normalized = normalizeProfile(data);
        if (!normalized.name && !normalized.id) {
          setNotFound(true);
        } else {
          setProfile(normalized);
        }
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  /* Track page view in background — fire-and-forget, never blocks render */
  useEffect(() => {
    if (!profile?.id) return;
    /* analyticsService.recordVisit already uses sendBeacon when available,
       falling back to axios. Call is non-blocking — errors are silently ignored. */
    analyticsService.recordVisit(profile.id, "view").catch(() => {});
  }, [profile?.id]);

  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${slug}`
      : `/u/${slug}`;

  function handleSaveContact() {
    if (!profile) return;

    /* Build vCard 3.0 from real profile data */
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name}`,
      profile.jobTitle  && `TITLE:${profile.jobTitle}`,
      profile.company   && `ORG:${profile.company}`,
      profile.phone     && `TEL;TYPE=CELL:${profile.phone}`,
      profile.email     && `EMAIL:${profile.email}`,
      profile.website   && `URL:${profile.website}`,
      "END:VCARD",
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([lines], { type: "text/vcard" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${slug || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);

    /* Track contact_saved event non-blocking */
    analyticsService.recordVisit(profile.id, "contact_saved").catch(() => {});
  }

  function handleShare() {
    const data = {
      title: profile?.name ?? "TapMe Profile",
      text:  profile?.jobTitle && profile?.company
        ? `${profile.jobTitle} at ${profile.company}`
        : "Check out my digital business card",
      url: profileUrl,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(data).catch(() => {});
    } else if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(profileUrl).catch(() => {});
    }
  }

  if (loading)            return <LoadingState />;
  if (notFound || !profile) return <NotFoundState />;

  /* TODO: Implement other themes (midnight, professional, modern, vibrant, minimal)
     once their designs are approved. Until then, all theme_key values fall back
     to the Default theme. */
  const ThemeComponent = THEMES[profile.theme_key] ?? THEMES.default;

  return (
    <ThemeComponent
      profile={profile}
      onSaveContact={handleSaveContact}
      onShare={handleShare}
    />
  );
}
