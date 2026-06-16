"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import profileService from "@/services/profileService";
import analyticsService from "@/services/analyticsService";

// ---------------------------------------------------------------------------
// Theme registry — add new theme components here as they are implemented
// ---------------------------------------------------------------------------
const THEMES = {
  default:      DefaultThemeProfile,
  classic:      ClassicThemeProfile,
  professional: ProfessionalThemeProfile,
  midnight:     MidnightThemeProfile,
  royal:        RoyalThemeProfile,
  violet:       VioletThemeProfile,
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
    bio:                p.bio || "",
    theme_key:          p.theme_key || "default",
    theme_customization: p.theme_customization || null,
    slug:               p.slug || "",
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

function LocationPubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Default theme profile component
// Pixel-accurate to Figma "Android Compact - 25" (node 524:3274)
// ---------------------------------------------------------------------------
function DefaultThemeProfile({ profile, onSaveContact, onShare, customization }) {
  const bgColor   = customization?.bgColor   || null;
  const btnColor  = customization?.btnColor  || null;
  const fontColor = customization?.fontColor || null;
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
                  <p style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: fontColor || "#21283F" }}>
                    {profile.jobTitle}
                  </p>
                )}
                {profile.company && (
                  <p style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: fontColor || "#21283F" }}>
                    at {profile.company}
                  </p>
                )}
                {profile.location && (
                  <p style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: fontColor || "#21283F" }}>
                    in {profile.location}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p style={{ marginTop: "16px", fontFamily: "var(--font-figtree), sans-serif", fontSize: "12px", lineHeight: "18px", color: fontColor || "#6B7280" }}>
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
                style={{ marginTop: "20px", gap: "10px", color: fontColor || "#21283F", textDecoration: "none" }}
              >
                <span className="flex items-center justify-center rounded-full" style={{ width: "20px", height: "20px" }}>
                  <PhoneIcon />
                </span>
                <span style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: fontColor || "#21283F" }}>
                  {profile.phone}
                </span>
              </a>
            )}

            {/* Email row */}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center"
                style={{ marginTop: "24px", gap: "10px", color: fontColor || "#21283F", textDecoration: "none" }}
              >
                <span className="flex items-center justify-center" style={{ width: "20px", height: "20px" }}>
                  <EmailIcon />
                </span>
                <span style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: fontColor || "#21283F" }}>
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
                style={{ marginTop: "24px", gap: "10px", color: fontColor || "#21283F", textDecoration: "none" }}
              >
                <span className="flex items-center justify-center" style={{ width: "20px", height: "20px" }}>
                  <WebsiteIcon />
                </span>
                <span style={{ fontFamily: "var(--font-figtree), sans-serif", fontWeight: 600, fontSize: "12px", lineHeight: "16px", color: fontColor || "#21283F" }}>
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
                  {activeSocials.map((key) => {
                    const raw = profile.social[key] || "";
                    const url = raw.startsWith("http") ? raw : `https://${raw}`;
                    return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[key]}
                    >
                      <SocialPlatformIcon platform={key} size={32} />
                    </a>
                    );
                  })}
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
                  border: btnColor ? "none" : "1px solid #A4B6C4",
                  background: btnColor || "transparent",
                  cursor: "pointer",
                  fontFamily: "var(--font-figtree), sans-serif",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: btnColor ? "#ffffff" : "#1C1B1F",
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
// Classic theme — full-page interactive profile (matches LayoutClassic preview)
// ---------------------------------------------------------------------------
function ClassicThemeProfile({ profile, onSaveContact, onShare, customization }) {
  const bgColor   = customization?.bgColor   || null;
  const btnColor  = customization?.btnColor  || null;
  const fontColor = customization?.fontColor || null;
  const activeSocials = ALL_SOCIAL_KEYS.filter((key) => !!profile.social?.[key]);

  return (
    <div style={{ minHeight: "100vh", background: "#e8ecf0", fontFamily: "var(--font-figtree), sans-serif" }}>
      {/* Mobile column — max 412px centered */}
      <div style={{ maxWidth: "412px", margin: "0 auto", minHeight: "100vh", background: bgColor || "#ffffff" }}>

      {/* Cover photo with nav bar overlaid */}
      <div style={{ position: "relative", height: "280px", background: "linear-gradient(135deg,#d1e8f0 0%,#b8d4e8 100%)" }}>
        {profile.profileImage && (
          <img
            src={profile.profileImage}
            alt={profile.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        )}

        {/* Subtle gradient at bottom so nav text stays readable */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%)" }} />

        {/* Nav bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "44px 22px 0" }}>
          <Link href="/sign-in" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowLeftIcon />
            </span>
          </Link>
          <button onClick={onShare} aria-label="Share profile" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShareIcon />
          </button>
        </div>
      </div>

      {/* Content card below photo */}
      <div style={{ maxWidth: "412px", margin: "0 auto", padding: "20px 22px 32px" }}>

        {/* Profile info row: avatar + name / title / city */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", overflow: "hidden", background: "#e8f0f5", flexShrink: 0 }}>
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#d1e8f0" }} />
            )}
          </div>
          <div>
            <p style={{ fontSize: "18px", fontWeight: 600, color: fontColor || "#000000", lineHeight: "22px" }}>{profile.name}</p>
            {profile.jobTitle && <p style={{ fontSize: "13px", color: fontColor || "#000000", lineHeight: "18px" }}>{profile.jobTitle}</p>}
            {profile.location && <p style={{ fontSize: "12px", color: fontColor || "#000000", lineHeight: "16px" }}>{profile.location}.</p>}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p style={{ marginTop: "12px", fontSize: "12px", lineHeight: "18px", color: fontColor || "#6B7280" }}>
            {profile.bio}
          </p>
        )}

        {/* Divider */}
        <div style={{ height: "1px", background: "#E5E5E5", margin: "16px 0" }} />

        {/* Action buttons row */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onSaveContact}
            style={{ flex: 1, border: btnColor ? "none" : "1px solid #A4B6C4", borderRadius: "20px", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", background: btnColor || "white", cursor: "pointer", fontSize: "13px", color: btnColor ? "#ffffff" : "#1C1B1F" }}
          >
            <DownloadIcon />
            Save Contact
          </button>
          {profile.phone && (
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              style={{ border: "1px solid #A4B6C4", borderRadius: "20px", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", color: "#1C1B1F", textDecoration: "none" }}
              aria-label="Call"
            >
              <PhoneIcon />
            </a>
          )}
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              style={{ border: "1px solid #A4B6C4", borderRadius: "20px", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", color: "#1C1B1F", textDecoration: "none" }}
              aria-label="Email"
            >
              <EmailIcon />
            </a>
          )}
          {profile.website && (
            <a
              href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ border: "1px solid #A4B6C4", borderRadius: "20px", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", color: "#1C1B1F", textDecoration: "none" }}
              aria-label="Website"
            >
              <WebsiteIcon />
            </a>
          )}
        </div>

        {/* Business details — only work phone / work email (personal phone/email/website are in icon buttons above) */}
        {(profile.workPhone || profile.workEmail) && (
          <>
            <div style={{ height: "1px", background: "#E5E5E5", margin: "16px 0" }} />
            {profile.workPhone && (
              <a href={`tel:${profile.workPhone.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#21283F", textDecoration: "none" }}>
                <span style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1B1F" }}><PhoneIcon /></span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#21283F" }}>{profile.workPhone} <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(work)</span></span>
              </a>
            )}
            {profile.workEmail && (
              <a href={`mailto:${profile.workEmail}`} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#21283F", textDecoration: "none" }}>
                <span style={{ width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#1C1B1F" }}><EmailIcon /></span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#21283F" }}>{profile.workEmail} <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(work)</span></span>
              </a>
            )}
          </>
        )}

        {/* Social icons */}
        {activeSocials.length > 0 && (
          <>
            <div style={{ height: "1px", background: "#E5E5E5", margin: "16px 0" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {activeSocials.map((key) => (
                <a key={key} href={profile.social[key]?.startsWith("http") ? profile.social[key] : `https://${profile.social[key]}`} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LABELS[key]}>
                  <SocialPlatformIcon platform={key} size={36} />
                </a>
              ))}
            </div>
          </>
        )}

        {/* TapMe branding */}
        <p style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
          Powered by{" "}
          <a href="https://tapmelabs.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9CA3AF", fontWeight: 600 }}>
            TapMe Labs
          </a>
        </p>
      </div>
      </div>{/* end mobile column */}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Violet theme — dark navy + purple full-page profile
// ---------------------------------------------------------------------------
function VioletThemeProfile({ profile, onSaveContact, onShare, customization }) {
  const bgColor   = customization?.bgColor   || null;
  const btnColor  = customization?.btnColor  || null;
  const fontColor = customization?.fontColor || null;
  const activeSocials = ALL_SOCIAL_KEYS.filter((key) => !!profile.social?.[key]);
  const firstName = profile.name?.split(" ")[0] || "";
  const lastName  = profile.name?.split(" ").slice(1).join(" ") || "";

  const contactRows = [
    { label: profile.email,    href: profile.email    ? `mailto:${profile.email}` : null,                                                                          icon: <EmailIcon />   },
    { label: profile.phone,    href: profile.phone    ? `tel:${profile.phone.replace(/\s/g,"")}` : null,                                                           icon: <PhoneIcon />   },
    { label: profile.location, href: profile.location ? `https://maps.google.com/?q=${encodeURIComponent(profile.location)}` : null, target: "_blank",             icon: <LocationPubIcon /> },
    { label: profile.website   ? profile.website.replace(/^https?:\/\//, "") : "", href: profile.website ? (profile.website.startsWith("http") ? profile.website : `https://${profile.website}`) : null, target: "_blank", icon: <WebsiteIcon /> },
  ].filter(r => r.label);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f3ff", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "412px", margin: "0 auto", minHeight: "100vh" }}>

        {/* Dark navy header */}
        <div style={{ background: "linear-gradient(160deg,#0d0d2e 0%,#1a1a4e 100%)", position: "relative" }}>
          {/* Nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "44px 22px 0" }}>
            <Link href="/sign-in" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(123,97,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <ArrowLeftIcon />
            </Link>
            <button onClick={onShare} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(123,97,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShareIcon />
            </button>
          </div>

          {/* Dot grid */}
          <div style={{ position: "absolute", left: 22, top: "35%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(123,97,255,0.3)" }} />
            ))}
          </div>

          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", padding: "24px 0 0" }}>
            <div style={{ width: "140px", height: "140px", borderRadius: "50%", background: "#7B61FF", padding: "4px", boxSizing: "border-box" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#1a1030" }}>
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(123,97,255,0.4)" strokeWidth="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Name + designation + underline */}
          <div style={{ textAlign: "center", padding: "18px 22px 0" }}>
            <p style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: 700, lineHeight: 1.2 }}>
              <span style={{ color: "#ffffff" }}>{firstName}</span>
              {lastName && <span style={{ color: "#9B7BFF" }}> {lastName}</span>}
            </p>
            {profile.jobTitle && <p style={{ margin: "0 0 10px", fontSize: "15px", color: "#C4C4C4" }}>{profile.jobTitle}</p>}
            <div style={{ width: "44px", height: "3px", background: "#7B61FF", borderRadius: "2px", margin: "0 auto 20px" }} />
          </div>

          {/* Wave */}
          <svg viewBox="0 0 412 36" style={{ display: "block", width: "100%", marginBottom: -1 }}>
            <path d="M0,16 C100,36 312,0 412,16 L412,36 L0,36 Z" fill={bgColor || "#ffffff"}/>
          </svg>
        </div>

        {/* Content area */}
        <div style={{ background: bgColor || "#ffffff", padding: "16px 22px 40px" }}>

          {/* Contact card */}
          {contactRows.length > 0 && (
            <div style={{ border: "1px solid #EDE9FE", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
              {contactRows.map(({ label, href, target, icon }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 16px", borderBottom: i < contactRows.length - 1 ? "1px solid #F5F3FF" : "none" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#7B61FF" }}>
                    {icon}
                  </div>
                  {href ? (
                    <a href={href} target={target} rel="noopener noreferrer" style={{ flex: 1, fontSize: "14px", color: fontColor || "#111827", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</a>
                  ) : (
                    <span style={{ flex: 1, fontSize: "14px", color: fontColor || "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
                  )}
                  <div style={{ width: "1px", height: "20px", background: "#E5E7EB" }} />
                  <button onClick={() => navigator.clipboard?.writeText(label)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#9CA3AF" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Work contact */}
          {(profile.workPhone || profile.workEmail) && (
            <div style={{ border: "1px solid #EDE9FE", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
              {[
                { label: profile.workPhone, suffix: "(work)", href: profile.workPhone ? `tel:${profile.workPhone.replace(/\s/g,"")}` : null, icon: <PhoneIcon /> },
                { label: profile.workEmail, suffix: "(work)", href: profile.workEmail ? `mailto:${profile.workEmail}` : null,                  icon: <EmailIcon /> },
              ].filter(r => r.label).map(({ label, suffix, href, icon }, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid #F5F3FF" : "none" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#7B61FF" }}>{icon}</div>
                  <a href={href} style={{ flex: 1, fontSize: "14px", color: "#111827", textDecoration: "none" }}>{label} <span style={{ color: "#9CA3AF" }}>{suffix}</span></a>
                  <div style={{ width: "1px", height: "20px", background: "#E5E7EB" }} />
                  <button onClick={() => navigator.clipboard?.writeText(label)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#9CA3AF" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Social Links */}
          {activeSocials.length > 0 && (
            <>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>Social Links</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
                {activeSocials.map((key) => (
                  <a key={key} href={profile.social[key]?.startsWith("http") ? profile.social[key] : `https://${profile.social[key]}`} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LABELS[key]}>
                    <SocialPlatformIcon platform={key} size={44} />
                  </a>
                ))}
              </div>
            </>
          )}

          {/* About Me */}
          {profile.bio && (
            <>
              <p style={{ fontSize: "16px", fontWeight: 700, color: fontColor || "#111827", marginBottom: "8px" }}>About Me</p>
              <p style={{ fontSize: "13px", color: fontColor || "#4B5563", lineHeight: "1.6", marginBottom: "24px" }}>{profile.bio}</p>
            </>
          )}

          {/* Save Contact */}
          <button onClick={onSaveContact} style={{ width: "100%", background: btnColor || "#6D28D9", borderRadius: "14px", padding: "16px 0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <DownloadIcon />
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff" }}>Save Contact</span>
          </button>

          <p style={{ marginTop: "24px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
            Powered by <a href="https://tapmelabs.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9CA3AF", fontWeight: 600 }}>TapMe Labs</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Midnight theme — dark/gold full-page profile
// ---------------------------------------------------------------------------
function MidnightThemeProfile({ profile, onSaveContact, onShare, customization }) {
  const bgColor   = customization?.bgColor   || null;
  const btnColor  = customization?.btnColor  || null;
  const fontColor = customization?.fontColor || null;
  const activeSocials = ALL_SOCIAL_KEYS.filter((key) => !!profile.social?.[key]);
  const firstName = profile.name?.split(" ")[0] || "";
  const lastName  = profile.name?.split(" ").slice(1).join(" ") || "";

  const contactRows = [
    { icon: <EmailIcon />,    label: profile.email,    href: profile.email   ? `mailto:${profile.email}` : null },
    { icon: <PhoneIcon />,    label: profile.phone,    href: profile.phone   ? `tel:${profile.phone.replace(/\s/g,"")}` : null },
    { icon: <LocationPubIcon />, label: profile.location, href: profile.location ? `https://maps.google.com/?q=${encodeURIComponent(profile.location)}` : null, target: "_blank" },
    { icon: <WebsiteIcon />,  label: profile.website ? profile.website.replace(/^https?:\/\//, "") : "", href: profile.website ? (profile.website.startsWith("http") ? profile.website : `https://${profile.website}`) : null, target: "_blank" },
  ].filter(r => r.label);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "412px", margin: "0 auto", minHeight: "100vh" }}>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "44px 22px 0" }}>
          <Link href="/sign-in" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <ArrowLeftIcon />
          </Link>
          <button onClick={onShare} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShareIcon />
          </button>
        </div>

        {/* Dark header — avatar + name + designation + bio */}
        <div style={{ padding: "28px 24px 24px", textAlign: "center", position: "relative" }}>
          {/* Dot grid decoration */}
          <div style={{ position: "absolute", right: 20, top: 20, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
            ))}
          </div>

          {/* Avatar with gold ring */}
          <div style={{ width: "140px", height: "140px", borderRadius: "50%", background: "#F5A623", padding: "4px", margin: "0 auto 20px", boxSizing: "border-box" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#1a1030" }}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#1a1030", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(245,166,35,0.4)" strokeWidth="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </div>
              )}
            </div>
          </div>

          <p style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 700, lineHeight: 1.2 }}>
            <span style={{ color: "#ffffff" }}>{firstName}</span>
            {lastName && <span style={{ color: "#F5A623" }}> {lastName}</span>}
          </p>
          {profile.jobTitle && <p style={{ margin: "0 0 8px", fontSize: "15px", fontWeight: 500, color: "#F5A623" }}>{profile.jobTitle}</p>}
          <div style={{ width: "40px", height: "3px", background: "#F5A623", borderRadius: "2px", margin: "0 auto 14px" }} />
          {profile.bio && <p style={{ margin: 0, fontSize: "13px", color: "#C4C4C4", lineHeight: 1.6 }}>{profile.bio}</p>}
        </div>

        {/* Content card section */}
        <div style={{ background: bgColor || "#ffffff", borderRadius: "24px 24px 0 0", padding: "24px 22px 40px", minHeight: "50vh" }}>

          {/* Contact rows */}
          {contactRows.map(({ icon, label, href, target }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", paddingBottom: "16px", borderBottom: i < contactRows.length - 1 ? "1px solid #F3F4F6" : "none", marginBottom: i < contactRows.length - 1 ? "16px" : "20px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icon}
              </div>
              {href ? (
                <a href={href} target={target} rel="noopener noreferrer" style={{ flex: 1, fontSize: "14px", color: fontColor || "#1a1a1a", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</a>
              ) : (
                <span style={{ flex: 1, fontSize: "14px", color: fontColor || "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
              )}
              <button onClick={() => navigator.clipboard?.writeText(label)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#9CA3AF" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          ))}

          {/* Work contact */}
          {(profile.workPhone || profile.workEmail) && (
            <div style={{ marginBottom: "20px" }}>
              {profile.workPhone && (
                <a href={`tel:${profile.workPhone.replace(/\s/g,"")}`} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px", textDecoration: "none" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center" }}><PhoneIcon /></div>
                  <span style={{ fontSize: "14px", color: "#1a1a1a" }}>{profile.workPhone} <span style={{ color: "#9CA3AF" }}>(work)</span></span>
                </a>
              )}
              {profile.workEmail && (
                <a href={`mailto:${profile.workEmail}`} style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center" }}><EmailIcon /></div>
                  <span style={{ fontSize: "14px", color: "#1a1a1a" }}>{profile.workEmail} <span style={{ color: "#9CA3AF" }}>(work)</span></span>
                </a>
              )}
            </div>
          )}

          {/* Social Links */}
          {activeSocials.length > 0 && (
            <>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>Social Links</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
                {activeSocials.map((key) => (
                  <a key={key} href={profile.social[key]?.startsWith("http") ? profile.social[key] : `https://${profile.social[key]}`} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LABELS[key]}>
                    <SocialPlatformIcon platform={key} size={40} />
                  </a>
                ))}
              </div>
            </>
          )}

          {/* About Me */}
          {profile.bio && (
            <>
              <p style={{ fontSize: "16px", fontWeight: 700, color: fontColor || "#111827", marginBottom: "8px" }}>About Me</p>
              <p style={{ fontSize: "13px", color: fontColor || "#4B5563", lineHeight: "1.6", marginBottom: "24px" }}>{profile.bio}</p>
            </>
          )}

          {/* Save Contact */}
          <button onClick={onSaveContact} style={{ width: "100%", border: btnColor ? "none" : "2px solid #F5A623", borderRadius: "14px", padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: btnColor || "transparent", cursor: "pointer" }}>
            <DownloadIcon />
            <span style={{ fontSize: "15px", fontWeight: 600, color: btnColor ? "#ffffff" : "#F5A623" }}>Save Contact</span>
          </button>

          <p style={{ marginTop: "24px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
            Powered by <a href="https://tapmelabs.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9CA3AF", fontWeight: 600 }}>TapMe Labs</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Royal theme — navy/gold full-page profile
// ---------------------------------------------------------------------------
function RoyalThemeProfile({ profile, onSaveContact, onShare, customization }) {
  const bgColor   = customization?.bgColor   || null;
  const btnColor  = customization?.btnColor  || null;
  const fontColor = customization?.fontColor || null;
  const activeSocials = ALL_SOCIAL_KEYS.filter((key) => !!profile.social?.[key]);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2ff", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "412px", margin: "0 auto", minHeight: "100vh", background: "#f0f2ff" }}>

        {/* Dark navy header */}
        <div style={{ background: "linear-gradient(160deg,#0e1155 0%,#1a237e 100%)", position: "relative", paddingBottom: 0 }}>
          {/* Nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "44px 22px 0" }}>
            <Link href="/sign-in" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <ArrowLeftIcon />
            </Link>
            <button onClick={onShare} style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShareIcon />
            </button>
          </div>

          {/* Dot grid */}
          <div style={{ position: "absolute", right: 22, top: "50%", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 7 }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            ))}
          </div>

          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", padding: "24px 0 0" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "140px", height: "140px", borderRadius: "50%", background: "#F5A623", padding: "4px", boxSizing: "border-box" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#1a237e" }}>
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(245,166,35,0.4)" strokeWidth="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    </div>
                  )}
                </div>
              </div>
              {/* Star badge */}
              <div style={{ position: "absolute", bottom: "4px", right: "0", width: "32px", height: "32px", borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #1a237e" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
            </div>
          </div>

          {/* Wave */}
          <svg viewBox="0 0 412 40" style={{ display: "block", width: "100%", marginTop: "20px", marginBottom: -1 }}>
            <path d="M0,15 C100,40 312,0 412,15 L412,40 L0,40 Z" fill={bgColor || "#ffffff"}/>
          </svg>
        </div>

        {/* Content area */}
        <div style={{ background: bgColor || "#ffffff", padding: "4px 22px 40px" }}>

          {/* Name + gold underline */}
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <p style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 700, color: fontColor || "#0d1340" }}>{profile.name}</p>
            <div style={{ width: "40px", height: "3px", background: "#F5A623", borderRadius: "2px", margin: "0 auto 14px" }} />

            {/* Job | Company | City row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              {profile.jobTitle && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8"><rect x="2" y="7" width="20" height="15" rx="1"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  <span style={{ fontSize: "12px", color: "#4B5563" }}>{profile.jobTitle}</span>
                </div>
              )}
              {profile.jobTitle && profile.company && <div style={{ width: "1px", height: "14px", background: "#D1D5DB" }} />}
              {profile.company && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8"><rect x="2" y="7" width="20" height="15" rx="1"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  <span style={{ fontSize: "12px", color: "#4B5563" }}>{profile.company}</span>
                </div>
              )}
              {profile.company && profile.location && <div style={{ width: "1px", height: "14px", background: "#D1D5DB" }} />}
              {profile.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <LocationPubIcon />
                  <span style={{ fontSize: "12px", color: "#4B5563" }}>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio card */}
          {profile.bio && (
            <div style={{ background: "#F5F3FF", borderRadius: "12px", padding: "16px", display: "flex", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#EDE9FE", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>{profile.bio}</p>
            </div>
          )}

          {/* Contact section */}
          {(profile.phone || profile.email || profile.website) && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Contact</p>
                <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              </div>
              <div style={{ background: "#F9FAFB", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                {[
                  { label: "Phone",   value: profile.phone,   href: profile.phone ? `tel:${profile.phone.replace(/\s/g,"")}` : null,   icon: <PhoneIcon />,   iconBg: "#7C3AED", actionIcon: <PhoneIcon /> },
                  { label: "Email",   value: profile.email,   href: profile.email ? `mailto:${profile.email}` : null,                   icon: <EmailIcon />,   iconBg: "#3B82F6", actionIcon: <EmailIcon /> },
                  { label: "Website", value: profile.website ? profile.website.replace(/^https?:\/\//, "") : "", href: profile.website ? (profile.website.startsWith("http") ? profile.website : `https://${profile.website}`) : null, target: "_blank", icon: <WebsiteIcon />, iconBg: "#0EA5E9", actionIcon: <WebsiteIcon /> },
                ].filter(r => r.value).map(({ label, value, href, target, icon, iconBg, actionIcon }, i, arr) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF" }}>{label}</p>
                      <p style={{ margin: 0, fontSize: "13px", color: fontColor || "#111827", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
                    </div>
                    {href && (
                      <a href={href} target={target} rel="noopener noreferrer" style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#4B5563", textDecoration: "none" }}>
                        {actionIcon}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Work Contact section */}
          {(profile.workPhone || profile.workEmail) && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2"><rect x="2" y="7" width="20" height="15" rx="1"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#4F46E5" }}>Work Contact</p>
                <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              </div>
              <div style={{ background: "#F9FAFB", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                {[
                  { label: "Work Phone", value: profile.workPhone, href: profile.workPhone ? `tel:${profile.workPhone.replace(/\s/g,"")}` : null, icon: <PhoneIcon />, iconBg: "#22C55E" },
                  { label: "Work Email", value: profile.workEmail, href: profile.workEmail ? `mailto:${profile.workEmail}` : null,                   icon: <EmailIcon />, iconBg: "#22C55E" },
                ].filter(r => r.value).map(({ label, value, href, icon, iconBg }, i, arr) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF" }}>{label}</p>
                      <p style={{ margin: 0, fontSize: "13px", color: "#111827", fontWeight: 600 }}>{value}</p>
                    </div>
                    {href && (
                      <a href={href} rel="noopener noreferrer" style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#4B5563", textDecoration: "none" }}>
                        {icon}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Connect section */}
          {activeSocials.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#111827" }}>Connect</p>
                <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
                {activeSocials.map((key) => (
                  <a key={key} href={profile.social[key]?.startsWith("http") ? profile.social[key] : `https://${profile.social[key]}`} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_LABELS[key]}>
                    <SocialPlatformIcon platform={key} size={44} />
                  </a>
                ))}
              </div>
            </>
          )}

          {/* Save Contact */}
          <button onClick={onSaveContact} style={{ width: "100%", background: btnColor || "#3730a3", borderRadius: "14px", padding: "16px 0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <DownloadIcon />
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff" }}>Save Contact</span>
          </button>

          <p style={{ marginTop: "24px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
            Powered by <a href="https://tapmelabs.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9CA3AF", fontWeight: 600 }}>TapMe Labs</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Professional theme — full-page interactive profile (matches Figma 634-16273)
// Cover photo → avatar+name block → dark Save Contact → 4 icon buttons →
// divider → "Connect with me" social link cards
// ---------------------------------------------------------------------------
const PROF_SOCIAL_NAMES = {
  whatsapp: "WhatsApp", linkedin: "LinkedIn", messenger: "Messenger",
  instagram: "Instagram", twitter: "Twitter / X", snapchat: "Snapchat",
};

function ProfessionalThemeProfile({ profile, onSaveContact, onShare, customization }) {
  const bgColor   = customization?.bgColor   || null;
  const btnColor  = customization?.btnColor  || null;
  const fontColor = customization?.fontColor || null;
  const activeSocials = ALL_SOCIAL_KEYS.filter((key) => !!profile.social?.[key]);

  const socialHandle = (key) => {
    const v = profile.social?.[key] || "";
    if (!v) return "";
    if (v.startsWith("http")) return "@" + v.split("/").filter(Boolean).pop();
    return v;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "412px", margin: "0 auto", minHeight: "100vh", background: bgColor || "#ffffff" }}>

        {/* Cover photo with nav overlaid */}
        <div style={{ position: "relative", height: "280px", background: "linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%)" }}>
          {profile.profileImage && (
            <img src={profile.profileImage} alt={profile.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 35%)" }} />
          {/* Nav bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "44px 22px 0" }}>
            <Link href="/sign-in" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
              <ArrowLeftIcon />
            </Link>
            <button onClick={onShare} aria-label="Share" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(0,0,0,0.35)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* White content area */}
        <div style={{ padding: "0 22px 36px" }}>

          {/* Profile info row — avatar + name/title/company */}
          <div style={{ position: "relative", height: "92px" }}>
            <div style={{ position: "absolute", left: 0, top: 24, width: 48, height: 48, borderRadius: "50%", overflow: "hidden", background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />
              )}
            </div>
            <p style={{ position: "absolute", left: 64, top: 26, margin: 0, fontSize: "18px", fontWeight: 700, color: fontColor || "#111827", lineHeight: "22px" }}>{profile.name}</p>
            {profile.jobTitle && (
              <p style={{ position: "absolute", left: 64, top: 50, margin: 0, fontSize: "13px", fontWeight: 500, color: fontColor || "#4B5563", lineHeight: "16px" }}>{profile.jobTitle}</p>
            )}
            {profile.company && (
              <p style={{ position: "absolute", left: 64, top: 68, margin: 0, fontSize: "11px", fontWeight: 400, color: fontColor || "#6B7280", lineHeight: "14px" }}>{profile.company}</p>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p style={{ margin: "0 0 16px", fontSize: "13px", lineHeight: "18px", color: fontColor || "#6B7280" }}>{profile.bio}</p>
          )}

          {/* Save Contact — full-width button */}
          <button
            onClick={onSaveContact}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: btnColor || "#111827", borderRadius: "12px", padding: "14px 0", border: "none", cursor: "pointer", boxShadow: "0px 4px 8px rgba(17,24,39,0.2)", marginBottom: "16px" }}
          >
            <DownloadIcon />
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff" }}>Save Contact</span>
          </button>

          {/* 4 circular action icon buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            {[
              { label: "Call",     href: profile.phone   ? `tel:${profile.phone.replace(/\s/g, "")}` : null,                                                                   icon: <PhoneIcon />   },
              { label: "Email",    href: profile.email   ? `mailto:${profile.email}` : null,                                                                                   icon: <EmailIcon />   },
              { label: "Website",  href: profile.website ? (profile.website.startsWith("http") ? profile.website : `https://${profile.website}`) : null, target: "_blank",      icon: <WebsiteIcon /> },
              { label: "Location", href: profile.location ? `https://maps.google.com/?q=${encodeURIComponent(profile.location)}` : null, target: "_blank",                     icon: <LocationPubIcon /> },
            ].map(({ label, href, target, icon }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "70px" }}>
                {href ? (
                  <a href={href} target={target} rel="noopener noreferrer" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#F9FAFB", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", textDecoration: "none", boxShadow: "0px 1px 2px rgba(0,0,0,0.05)" }}>
                    {icon}
                  </a>
                ) : (
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#F9FAFB", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#D1D5DB", boxShadow: "0px 1px 2px rgba(0,0,0,0.05)", opacity: 0.5 }}>
                    {icon}
                  </div>
                )}
                <span style={{ fontSize: "11px", fontWeight: 500, color: "#4B5563" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "#F3F4F6", marginBottom: "16px" }} />

          {/* Business details (work phone / work email) */}
          {(profile.workPhone || profile.workEmail) && (
            <>
              {profile.workPhone && (
                <a href={`tel:${profile.workPhone.replace(/\s/g, "")}`} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#374151", textDecoration: "none" }}>
                  <PhoneIcon />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{profile.workPhone} <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(work)</span></span>
                </a>
              )}
              {profile.workEmail && (
                <a href={`mailto:${profile.workEmail}`} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: "#374151", textDecoration: "none" }}>
                  <EmailIcon />
                  <span style={{ fontSize: "13px", fontWeight: 600 }}>{profile.workEmail} <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(work)</span></span>
                </a>
              )}
              <div style={{ height: "1px", background: "#F3F4F6", marginBottom: "16px" }} />
            </>
          )}

          {/* "Connect with me" social link cards */}
          {activeSocials.length > 0 && (
            <>
              <p style={{ margin: "0 0 10px 2px", fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Connect with me
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {activeSocials.map((key) => (
                  <a
                    key={key}
                    href={profile.social[key]?.startsWith("http") ? profile.social[key] : `https://${profile.social[key]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: "12px", textDecoration: "none" }}
                  >
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#ffffff", boxShadow: "0px 1px 2px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <SocialPlatformIcon platform={key} size={26} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#111827" }}>{PROF_SOCIAL_NAMES[key] || key}</p>
                      {socialHandle(key) && (
                        <p style={{ margin: 0, fontSize: "11px", color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{socialHandle(key)}</p>
                      )}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* TapMe branding */}
          <p style={{ marginTop: "32px", textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>
            Powered by{" "}
            <a href="https://tapmelabs.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9CA3AF", fontWeight: 600 }}>
              TapMe Labs
            </a>
          </p>
        </div>
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

  /* Load custom Google Font when profile has a fontFamily customization */
  useEffect(() => {
    const font = profile?.theme_customization?.fontFamily;
    if (!font || font === "Figtree" || font === "Inter" || font === "Roboto" || font === "Georgia") return;
    const id = `gfont-${font.replace(/\s+/g, "-")}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id   = id;
      link.rel  = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  }, [profile?.theme_customization?.fontFamily]);

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
  const ThemeComponent  = THEMES[profile.theme_key] ?? THEMES.default;
  const cust            = profile.theme_customization;
  const fontOverride    = cust?.fontFamily ? { fontFamily: `'${cust.fontFamily}', sans-serif` } : {};

  return (
    <div style={fontOverride}>
      <ThemeComponent
        profile={profile}
        onSaveContact={handleSaveContact}
        onShare={handleShare}
        customization={cust}
      />
    </div>
  );
}
