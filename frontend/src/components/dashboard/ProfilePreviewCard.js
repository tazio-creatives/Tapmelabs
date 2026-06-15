"use client";

import Link from "next/link";

/* ─── theme styles ───────────────────────────────────────────────────────
   Each entry defines skin (colors/gradients) + structural hints:
     layout           → "A" | "B" | "C"
     imageAspectRatio → "3:4" (portrait) | "1:1" (square)
   ─────────────────────────────────────────────────────────────────────── */

export const THEME_STYLES = {
  default: {
    layout: "A", imageAspectRatio: "3:4",
    headerGradient: "linear-gradient(135deg,#28DC4F 0%,#1aad3f 100%)",
    bodyBg: "#ffffff", textPrimary: "#111827", textSecondary: "#6B7280",
    dividerColor: "#E5E5E5", pillBg: "#1aad3f", pillText: "#ffffff",
    accentColor: "#28DC4F", borderColor: "#E5E5E5", avatarBg: "#F0FDF4", iconColor: "#1C1B1F",
  },
  aurora: {
    layout: "aurora",
    headerGradient: "linear-gradient(135deg,#06b6d4 0%,#3b82f6 35%,#8b5cf6 65%,#ec4899 100%)",
    bodyBg: "#ffffff", textPrimary: "#0f172a", textSecondary: "#64748b",
    dividerColor: "#f1f5f9", pillBg: "#6366f1", pillText: "#ffffff",
    accentColor: "#6366f1", borderColor: "#e2e8f0", avatarBg: "linear-gradient(135deg,#dbeafe,#ede9fe)", iconColor: "#6366f1",
  },
  obsidian: {
    layout: "obsidian",
    headerGradient: "linear-gradient(160deg,#141414 0%,#0a0a0a 100%)",
    bodyBg: "#080808", textPrimary: "#f8fafc", textSecondary: "#6b7280",
    dividerColor: "#111111", pillBg: "#28DC4F", pillText: "#000000",
    accentColor: "#28DC4F", borderColor: "#1f1f1f", avatarBg: "#111111", iconColor: "#28DC4F",
  },
  frosted: {
    layout: "frosted",
    headerGradient: "linear-gradient(135deg,#e0e7ff 0%,#ede9fe 50%,#fce7f3 100%)",
    bodyBg: "#f8faff", textPrimary: "#1e1b4b", textSecondary: "#94a3b8",
    dividerColor: "rgba(99,102,241,0.1)", pillBg: "#6366f1", pillText: "#ffffff",
    accentColor: "#6366f1", borderColor: "rgba(99,102,241,0.12)", avatarBg: "#ede9fe", iconColor: "#6366f1",
  },
  "neon-edge": {
    layout: "neon-edge",
    headerGradient: "linear-gradient(180deg,#0a0a14 0%,#0a0a14 100%)",
    bodyBg: "#0a0a14", textPrimary: "#f0fdf4", textSecondary: "#334155",
    dividerColor: "rgba(0,255,136,0.1)", pillBg: "#00ff88", pillText: "#000000",
    accentColor: "#00ff88", borderColor: "rgba(0,255,136,0.08)", avatarBg: "#0f0f20", iconColor: "#00ff88",
    neonSecondary: "#00aaff",
  },
  ember: {
    layout: "ember",
    headerGradient: "linear-gradient(135deg,#1f2937 0%,#111827 100%)",
    bodyBg: "#161b22", textPrimary: "#f1f5f9", textSecondary: "#4b5563",
    dividerColor: "#21262d", pillBg: "#f59e0b", pillText: "#000000",
    accentColor: "#f59e0b", borderColor: "#21262d", avatarBg: "#1f2937", iconColor: "#f59e0b",
    accentColor2: "#ef4444",
  },
  classic: {
    layout: "classic",
    headerGradient: "linear-gradient(135deg,#d1e8f0 0%,#b8d4e8 100%)",
    bodyBg: "#ffffff", textPrimary: "#000000", textSecondary: "#888888",
    dividerColor: "#E5E5E5", pillBg: "#28DC4F", pillText: "#ffffff",
    accentColor: "#28DC4F", borderColor: "#E5E5E5", avatarBg: "#f0f0f0", iconColor: "#1C1B1F",
  },
  professional: {
    layout: "professional",
    headerGradient: "linear-gradient(135deg,#f3f4f6 0%,#e5e7eb 100%)",
    bodyBg: "#ffffff", textPrimary: "#111827", textSecondary: "#4B5563",
    dividerColor: "#F3F4F6", pillBg: "#111827", pillText: "#ffffff",
    accentColor: "#111827", borderColor: "#F3F4F6", avatarBg: "#F9FAFB", iconColor: "#374151",
  },
  violet: {
    layout: "violet",
    headerGradient: "linear-gradient(160deg,#0d0d2e 0%,#1a1a4e 100%)",
    bodyBg: "#0d0d2e", contentBg: "#ffffff", textPrimary: "#FFFFFF", textSecondary: "#C4C4C4",
    dividerColor: "#E5E7EB", pillBg: "#6D28D9", pillText: "#ffffff",
    accentColor: "#7B61FF", borderColor: "#EDE9FE", avatarBg: "#1a1030", iconColor: "#7B61FF",
  },
  midnight: {
    layout: "midnight",
    headerGradient: "linear-gradient(160deg,#0d0d14 0%,#1a1030 100%)",
    bodyBg: "#0d0d14", contentBg: "#ffffff", textPrimary: "#FFFFFF", textSecondary: "#C4C4C4",
    dividerColor: "#2a2a3a", pillBg: "transparent", pillText: "#F5A623",
    accentColor: "#F5A623", borderColor: "#F5A623", avatarBg: "#1a1030", iconColor: "#F5A623",
  },
  royal: {
    layout: "royal",
    headerGradient: "linear-gradient(160deg,#0e1155 0%,#1a237e 100%)",
    bodyBg: "#0e1155", contentBg: "#ffffff", textPrimary: "#0d1340", textSecondary: "#4B5563",
    dividerColor: "#E5E7EB", pillBg: "#3730a3", pillText: "#ffffff",
    accentColor: "#F5A623", borderColor: "#E5E7EB", avatarBg: "#EEF2FF", iconColor: "#4F46E5",
  },
};

/* ─── social platform SVG icons ──────────────────────────────────────── */

function SocialSVG({ platform, size = 22, iconUrl = null }) {
  if (iconUrl) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={iconUrl} alt="link" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />
  );
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
  if (platform.startsWith("custom_url")) return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#6366F1"/>
      <path stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
        d="M13 19l6-6M14.5 12.5l1.5-1.5a4 4 0 0 1 5.5 5.5l-1.5 1.5M10.5 17l-1.5 1.5a4 4 0 0 0 5.5 5.5l1.5-1.5" />
    </svg>
  );
  return null;
}

const ALL_SOCIAL_KEYS = ["whatsapp", "linkedin", "messenger", "instagram", "twitter", "snapchat"];

/* ─── shared data extractor ──────────────────────────────────────────── */

function buildProfileData(profile) {
  const fullName = profile?.name || "Your Name";
  const social   = profile?.social_links || {};
  return {
    fullName,
    firstName:    fullName.split(" ")[0],
    lastName:     fullName.split(" ").slice(1).join(" "),
    designation:  profile?.designation  || "",
    company:      profile?.company_name || "",
    city:         profile?.city || social?.city || "",
    phone:        profile?.phone        || "",
    email:        profile?.email        || "",
    website:      profile?.website      || (profile?.slug ? `tapmelabs.com/${profile.slug}` : ""),
    profileImage: profile?.profile_image || null,
    companyLogo:  profile?.company_logo  || null,
    workPhone:    social?.work_phone || "",
    workEmail:    social?.work_email || "",
    social,
    activeSocials: (() => {
      const customItems = Array.isArray(social?.custom_urls)
        ? social.custom_urls.filter(item => typeof item === "object" ? item.url : item)
        : social?.custom_url ? [{ url: social.custom_url, icon: null }] : [];
      return [
        ...ALL_SOCIAL_KEYS.filter((key) => !!social[key]),
        ...customItems.map((_, i) => `custom_url_${i}`),
      ];
    })(),
    socialIconMap: (() => {
      const map = {};
      const items = Array.isArray(social?.custom_urls)
        ? social.custom_urls.filter(item => typeof item === "object" ? item.url : item)
        : social?.custom_url ? [{ url: social.custom_url, icon: null }] : [];
      items.forEach((item, i) => {
        const icon = typeof item === "object" ? item.icon : null;
        if (icon) map[`custom_url_${i}`] = icon;
      });
      return map;
    })(),
  };
}

/* ─── small icons ────────────────────────────────────────────────────── */

function PhoneIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3h4l2 4-2.5 1.5A12 12 0 0 0 14.5 16L16 13.5l4 2v4c-8.5 1-16.5-7-17-15.5Z" />
    </svg>
  );
}

function MailIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function GlobeIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a14 14 0 0 0 0 20M12 2a14 14 0 0 1 0 20" />
    </svg>
  );
}

function LocationIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}


function ChevronRightIcon({ color }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function UserPlaceholderIcon({ color, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function BuildingIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="1" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

/* ─── Layout A (Default) ─────────────────────────────────────────────────
   Square photo with gradient + name overlay → company logo + multi-line
   description → separator → contact rows → separator → social icons →
   centered Save Contact pill. Matches Figma node 572-25932.
   ─────────────────────────────────────────────────────────────────────── */

function LayoutA({ profile, t }) {
  const d   = buildProfileData(profile);
  const bio = profile?.bio || "";

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${t.borderColor}`, background: t.bodyBg, overflow: "hidden" }}>

      {/* Square profile photo + gradient + name bottom-left */}
      <div style={{ position: "relative", height: 260, background: t.headerGradient, overflow: "hidden" }}>
        {d.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <UserPlaceholderIcon color="rgba(255,255,255,0.6)" size={52} />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: 14, left: 18 }}>
          <p style={{ color: "white", fontSize: 22, fontWeight: 600, lineHeight: 1.1, margin: 0, fontFamily: "'Figtree', sans-serif" }}>
            {d.firstName}
            {d.lastName && <><br />{d.lastName}</>}
          </p>
        </div>
      </div>

      {/* Company logo + description (designation / company / city) */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px" }}>
        <div style={{ width: 38, height: 38, borderRadius: 4, background: t.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {d.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.companyLogo} alt={d.company || "Logo"} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }} />
          ) : (
            <BuildingIcon color={t.accentColor} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 9.5, color: t.fontColor || "#21283F", margin: 0, lineHeight: 1.4 }}>
            {d.designation || "—"}
            {d.company && <><br />at {d.company}</>}
            {d.city && <><br />in {d.city}, India.</>}
          </p>
        </div>
      </div>

      {/* Bio card */}
      {bio && (
        <div style={{ margin: "0 12px 8px", background: "#f8fafc", borderRadius: 7, borderLeft: "3px solid #A4B6C4", padding: "5px 9px" }}>
          <p style={{ margin: 0, fontSize: 9, color: "#6B7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {bio}
          </p>
        </div>
      )}

      {/* Separator */}
      <div style={{ height: 1, background: "#000", opacity: 0.1, margin: "0 18px" }} />

      {/* Contact rows */}
      <div style={{ padding: "8px 18px", display: "flex", flexDirection: "column", gap: 2 }}>
        {d.phone && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PhoneIcon color={t.iconColor} />
            <span style={{ fontSize: 9.5, fontWeight: 600, color: t.fontColor || "#21283F" }}>{d.phone}</span>
          </div>
        )}
        {d.workPhone && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PhoneIcon color={t.iconColor} />
            <span style={{ fontSize: 9.5, color: t.fontColor || "#21283F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.workPhone}</span>
          </div>
        )}
        {d.email && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MailIcon color={t.iconColor} />
            <span style={{ fontSize: 9.5, color: t.fontColor || "#21283F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.email}</span>
          </div>
        )}
        {d.workEmail && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MailIcon color={t.iconColor} />
            <span style={{ fontSize: 9.5, color: t.fontColor || "#21283F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.workEmail}</span>
          </div>
        )}
        {d.website && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GlobeIcon color={t.iconColor} />
            <span style={{ fontSize: 9.5, color: t.fontColor || "#21283F", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.website}</span>
          </div>
        )}
        {!d.phone && !d.workPhone && !d.email && !d.workEmail && !d.website && (
          <p style={{ fontSize: 9.5, color: t.textSecondary, margin: 0 }}>No contact details added yet.</p>
        )}
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: "#000", opacity: 0.1, margin: "0 18px" }} />

      {/* Social icons — all platforms, spread out */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", padding: "10px 18px" }}>
        {d.activeSocials.map((key) => (
          <SocialSVG key={key} platform={key} size={19} iconUrl={d.socialIconMap?.[key]} />
        ))}
      </div>

      {/* Save Contact — centered pill */}
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, background: t.pillBg, borderRadius: 16, padding: "6px 10px", minWidth: 98 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={t.pillText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
          <span style={{ fontSize: 9.5, color: t.pillText }}>Save Contact</span>
        </div>
      </div>

    </div>
  );
}

/* ─── Layout B ───────────────────────────────────────────────────────────
   Used by: modern
   Structure: square photo with overlapping company logo → name/title →
              full-width save button → 4-icon action grid →
              "Connect with me" vertical social list
   ─────────────────────────────────────────────────────────────────────── */

function LayoutB({ profile, t }) {
  const d = buildProfileData(profile);

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${t.borderColor}`, background: t.bodyBg }}>

      {/* Photo section — overflow visible so logo can overlap */}
      <div style={{ position: "relative" }}>
        <div style={{ height: 185, borderRadius: "16px 16px 0 0", overflow: "hidden", background: t.headerGradient }}>
          {d.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={d.profileImage}
              alt={d.fullName}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <UserPlaceholderIcon color="rgba(255,255,255,0.7)" size={48} />
            </div>
          )}
        </div>

        {/* Company logo — overlapping bottom-left of photo */}
        <div style={{ position: "absolute", bottom: -22, left: 16, width: 46, height: 46, borderRadius: "50%", border: `3px solid ${t.bodyBg}`, background: t.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          {d.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.companyLogo} alt={d.company || "Logo"} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2 }} />
          ) : (
            <BuildingIcon color={t.accentColor} />
          )}
        </div>
      </div>

      {/* Name + designation + company — padded top to clear logo */}
      <div style={{ paddingTop: 30, paddingLeft: 18, paddingRight: 18, paddingBottom: 12 }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary, margin: 0, lineHeight: 1.2 }}>{d.fullName}</p>
        {d.designation && <p style={{ fontSize: 12, color: t.textSecondary, margin: "3px 0 0" }}>{d.designation}</p>}
        {d.company && <p style={{ fontSize: 11, color: t.textSecondary, margin: "2px 0 0" }}>{d.company}</p>}
      </div>

      {/* 4-icon action grid — outlined circles with labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: `1px solid ${t.dividerColor}`, borderBottom: `1px solid ${t.dividerColor}` }}>
        {[
          { label: "Call",     icon: <PhoneIcon color={t.accentColor} />    },
          { label: "Email",    icon: <MailIcon color={t.accentColor} />     },
          { label: "Website",  icon: <GlobeIcon color={t.accentColor} />    },
          { label: "Location", icon: <LocationIcon color={t.accentColor} /> },
        ].map(({ label, icon }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 4px" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "transparent", border: `1.5px solid ${t.dividerColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {icon}
            </div>
            <span style={{ fontSize: 10, color: t.textSecondary }}>{label}</span>
          </div>
        ))}
      </div>

      {/* "Connect with me" vertical social list */}
      <div style={{ padding: "12px 18px" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: t.textSecondary, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Connect with me
        </p>
        {d.activeSocials.length === 0 ? (
          <p style={{ fontSize: 12, color: t.textSecondary, margin: 0 }}>No social links added yet.</p>
        ) : d.activeSocials.map((key, idx, arr) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: idx < arr.length - 1 ? `1px solid ${t.dividerColor}` : "none",
            }}
          >
            <SocialSVG platform={key} size={26} iconUrl={d.socialIconMap?.[key]} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, margin: 0, textTransform: "capitalize" }}>{key}</p>
              {d.social[key] && (
                <p style={{ fontSize: 11, color: t.textSecondary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.social[key]}
                </p>
              )}
            </div>
            <ChevronRightIcon color={t.textSecondary} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Layout C ───────────────────────────────────────────────────────────
   Used by: professional
   Structure: full-width photo (clean, no overlay) →
              company logo circle + name/designation/city row →
              outline save button → 3 small outlined action circles →
              social platform icons in a bordered row container
   ─────────────────────────────────────────────────────────────────────── */

function LayoutC({ profile, t }) {
  const d        = buildProfileData(profile);
  const location = d.social?.city || "";

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${t.borderColor}`, background: t.bodyBg, overflow: "hidden" }}>

      {/* Full-width photo — clean, no gradient overlay */}
      <div style={{ height: 220, background: t.headerGradient, overflow: "hidden" }}>
        {d.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={d.profileImage}
            alt={d.fullName}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <UserPlaceholderIcon color="rgba(255,255,255,0.7)" size={48} />
          </div>
        )}
      </div>

      {/* Company logo (left) + name / designation / city (right) */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderBottom: `1px solid ${t.dividerColor}` }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: t.avatarBg, border: `1px solid ${t.dividerColor}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {d.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.companyLogo} alt={d.company || "Logo"} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 3 }} />
          ) : (
            <BuildingIcon color={t.accentColor} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d.fullName}
          </p>
          {d.designation && (
            <p style={{ fontSize: 12, color: t.textSecondary, margin: "2px 0 0" }}>{d.designation}</p>
          )}
          {(d.company || location) && (
            <p style={{ fontSize: 11, color: t.textSecondary, margin: "1px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {[d.company, location].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Action circles row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "10px 18px", borderBottom: `1px solid ${t.dividerColor}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[
            { key: "phone",   icon: <PhoneIcon color={d.phone   ? t.accentColor : t.dividerColor} />, active: !!d.phone   },
            { key: "email",   icon: <MailIcon  color={d.email   ? t.accentColor : t.dividerColor} />, active: !!d.email   },
            { key: "website", icon: <GlobeIcon color={d.website ? t.accentColor : t.dividerColor} />, active: !!d.website },
          ].map(({ key, icon, active }) => (
            <div
              key={key}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: active ? t.avatarBg : "transparent",
                border: `1.5px solid ${active ? t.accentColor : t.dividerColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      {/* Social icons — platform images in a bordered container */}
      <div style={{ padding: "10px 18px 16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: 12, border: `1px solid ${t.dividerColor}` }}>
          {d.activeSocials.length === 0
            ? <span style={{ fontSize: 11, color: t.textSecondary }}>No social links added yet.</span>
            : d.activeSocials.map((key) => <SocialSVG key={key} platform={key} size={28} iconUrl={d.socialIconMap?.[key]} />)
          }
        </div>
      </div>
    </div>
  );
}

/* ─── Layout Aurora ─────────────────────────────────────────────────────
   Light white background · cyan→blue→purple→pink gradient banner ·
   floating centered avatar with white border · action chips ·
   italic bio quote · social icons · Save Contact button
   ─────────────────────────────────────────────────────────────────────── */

function LayoutAurora({ profile, t }) {
  const d = buildProfileData(profile);
  const bio = profile?.bio || "";
  return (
    <div style={{ borderRadius: 24, overflow: "hidden", background: t.bodyBg, border: `1px solid ${t.borderColor}` }}>
      {/* Gradient banner with decorative blobs */}
      <div style={{ height: 150, background: t.headerGradient, position: "relative" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -10, left: 20, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        {/* Floating centered avatar */}
        <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)" }}>
          <div style={{ padding: 3, borderRadius: "50%", background: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: t.avatarBg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {d.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              ) : (
                <UserPlaceholderIcon color="rgba(99,102,241,0.5)" size={30} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Name block */}
      <div style={{ textAlign: "center", paddingTop: 46, paddingBottom: 12, paddingLeft: 20, paddingRight: 20 }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 20, color: t.textPrimary, letterSpacing: "-0.02em" }}>{d.fullName}</p>
        {d.designation && <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 500, color: t.accentColor }}>{d.designation}</p>}
        {(d.company || d.city) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}>
            <LocationIcon color="#94a3b8" />
            <span style={{ fontSize: 11, color: t.textSecondary }}>{[d.company, d.city].filter(Boolean).join(" · ")}</span>
          </div>
        )}
        {bio && (
          <p style={{ margin: "10px auto 0", fontSize: 12, color: "#64748b", lineHeight: 1.6, maxWidth: 220, fontStyle: "italic" }}>"{bio}"</p>
        )}
      </div>

      {/* Action chips */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "0 16px 14px", flexWrap: "wrap" }}>
        {d.phone && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#bae6fd", padding: "7px 14px", borderRadius: 99 }}>
            <PhoneIcon color="#0ea5e9" /><span style={{ fontSize: 12, fontWeight: 600, color: "#0ea5e9" }}>Call</span>
          </div>
        )}
        {d.email && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#ede9fe", padding: "7px 14px", borderRadius: 99 }}>
            <MailIcon color="#8b5cf6" /><span style={{ fontSize: 12, fontWeight: 600, color: "#8b5cf6" }}>Email</span>
          </div>
        )}
        {d.website && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#cffafe", padding: "7px 14px", borderRadius: 99 }}>
            <GlobeIcon color="#06b6d4" /><span style={{ fontSize: 12, fontWeight: 600, color: "#06b6d4" }}>Web</span>
          </div>
        )}
        {!d.phone && !d.email && !d.website && (
          <p style={{ fontSize: 12, color: t.textSecondary, margin: 0 }}>No contact info yet.</p>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: t.dividerColor, margin: "0 16px" }} />

      {/* Social icons */}
      {d.activeSocials.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, padding: "14px 16px" }}>
          {d.activeSocials.map((key) => <SocialSVG key={key} platform={key} size={30} iconUrl={d.socialIconMap?.[key]} />)}
        </div>
      )}

      {/* Save Contact */}
      <div style={{ padding: d.activeSocials.length > 0 ? "0 16px 18px" : "14px 16px 18px" }}>
        <div style={{ background: "linear-gradient(90deg,#3b82f6,#8b5cf6)", color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 14, padding: "13px", borderRadius: 14 }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ─── Layout Obsidian ────────────────────────────────────────────────────
   Pure black #080808 · neon green #28DC4F accent strip · name LEFT /
   avatar RIGHT · "Available" glowing dot · bio block · contact list
   with rounded icon boxes + chevrons · social in dark squares ·
   outlined Save Contact button
   ─────────────────────────────────────────────────────────────────────── */

function LayoutObsidian({ profile, t }) {
  const d = buildProfileData(profile);
  const bio = profile?.bio || "";
  return (
    <div style={{ borderRadius: 24, overflow: "hidden", background: t.bodyBg, boxShadow: `0 0 0 1px ${t.borderColor}` }}>
      {/* Neon accent strip */}
      <div style={{ height: 3, background: `linear-gradient(90deg,${t.accentColor},#28DC4F,${t.accentColor})` }} />

      {/* Header: name LEFT, avatar RIGHT */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 20px 16px" }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.accentColor, boxShadow: `0 0 8px ${t.accentColor}` }} />
            <span style={{ fontSize: 10, color: t.accentColor, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Available</span>
          </div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 21, color: t.textPrimary, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {d.firstName}<br />{d.lastName}
          </p>
          {d.designation && <p style={{ margin: "6px 0 0", fontSize: 12, color: t.textSecondary, fontWeight: 500 }}>{d.designation}</p>}
          {(d.company || d.city) && (
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#374151" }}>{[d.company, d.city].filter(Boolean).join(" · ")}</p>
          )}
        </div>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: t.avatarBg, border: `1.5px solid ${t.borderColor}`, boxShadow: `0 0 20px ${t.accentColor}44, 0 0 0 1px ${t.accentColor}22`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {d.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            ) : (
              <UserPlaceholderIcon color={`${t.accentColor}66`} size={26} />
            )}
          </div>
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: t.accentColor, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${t.bodyBg}` }}>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </div>

      {/* Bio block */}
      {bio && (
        <div style={{ margin: "0 20px 16px", padding: "10px 14px", borderRadius: 10, background: "#0f0f0f", border: `1px solid ${t.dividerColor}` }}>
          <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.6, fontStyle: "italic" }}>"{bio}"</p>
        </div>
      )}

      {/* Contact list */}
      <div style={{ padding: "0 20px" }}>
        {[
          { icon: <PhoneIcon color={t.iconColor} />, val: d.phone },
          { icon: <PhoneIcon color={t.iconColor} />, val: d.workPhone },
          { icon: <MailIcon color={t.iconColor} />, val: d.email },
          { icon: <MailIcon color={t.iconColor} />, val: d.workEmail },
          { icon: <GlobeIcon color={t.iconColor} />, val: d.website },
        ].filter(({ val }) => !!val).map(({ icon, val }, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < arr.length - 1 ? `1px solid ${t.dividerColor}` : "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "#0f0f0f", border: `1px solid ${t.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
            <span style={{ fontSize: 12, color: "#cbd5e1", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
            <ChevronRightIcon color="#2d2d2d" />
          </div>
        ))}
        {!d.phone && !d.workPhone && !d.email && !d.workEmail && !d.website && (
          <p style={{ fontSize: 12, color: t.textSecondary, margin: "8px 0" }}>No contact details yet.</p>
        )}
      </div>

      {/* Social icons in dark boxes */}
      {d.activeSocials.length > 0 && (
        <div style={{ display: "flex", gap: 10, padding: "14px 20px", borderTop: `1px solid ${t.dividerColor}`, marginTop: 10 }}>
          {d.activeSocials.map((key) => (
            <div key={key} style={{ width: 38, height: 38, borderRadius: 10, background: "#0f0f0f", border: `1px solid ${t.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SocialSVG platform={key} size={22} iconUrl={d.socialIconMap?.[key]} />
            </div>
          ))}
        </div>
      )}

      {/* Save Contact — outlined */}
      <div style={{ padding: `${d.activeSocials.length > 0 ? "0" : "14px"} 20px 20px` }}>
        <div style={{ border: `1.5px solid ${t.accentColor}`, color: t.accentColor, textAlign: "center", fontWeight: 700, fontSize: 13, padding: "12px", borderRadius: 12, letterSpacing: "0.02em" }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ─── Layout Frosted ─────────────────────────────────────────────────────
   Light gradient background #f8faff · pastel header with orbs ·
   avatar overlapping left with indigo gradient ring · company/city chips ·
   frosted glass contact cards · frosted social row ·
   indigo gradient Save Contact button
   ─────────────────────────────────────────────────────────────────────── */

function LayoutFrosted({ profile, t }) {
  const d = buildProfileData(profile);
  return (
    <div style={{ borderRadius: 24, overflow: "hidden", background: t.bodyBg, boxShadow: "0 20px 60px rgba(99,102,241,0.15), 0 1px 3px rgba(99,102,241,0.1)" }}>
      {/* Pastel header with orbs */}
      <div style={{ height: 110, background: t.headerGradient, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(99,102,241,0.15)" }} />
        <div style={{ position: "absolute", bottom: -20, left: 30, width: 70, height: 70, borderRadius: "50%", background: "rgba(236,72,153,0.1)" }} />
        <div style={{ position: "absolute", top: 10, left: "40%", width: 40, height: 40, borderRadius: "50%", background: "rgba(167,139,250,0.2)" }} />
      </div>

      {/* Avatar + identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px 12px", borderBottom: `1px solid ${t.dividerColor}` }}>
        <div style={{ position: "relative", marginTop: -28, flexShrink: 0 }}>
          <div style={{ padding: 3, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#a78bfa)", boxShadow: "0 6px 20px rgba(99,102,241,0.3)" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: t.avatarBg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {d.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              ) : (
                <UserPlaceholderIcon color="rgba(99,102,241,0.5)" size={26} />
              )}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: t.textPrimary, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.fullName}</p>
          {d.designation && <p style={{ margin: "2px 0 0", fontSize: 12, color: t.accentColor, fontWeight: 600 }}>{d.designation}</p>}
          <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
            {d.company && <span style={{ fontSize: 10, color: "#fff", background: t.accentColor, padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>{d.company}</span>}
            {d.city && <span style={{ fontSize: 10, color: t.accentColor, background: "#ede9fe", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>{d.city}</span>}
          </div>
        </div>
      </div>

      {/* Frosted glass contact cards */}
      <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          { icon: <PhoneIcon color={t.iconColor} />, val: d.phone,     lbl: "Call"       },
          { icon: <PhoneIcon color={t.iconColor} />, val: d.workPhone, lbl: "Work Phone"  },
          { icon: <MailIcon color={t.iconColor} />,  val: d.email,     lbl: "Email"       },
          { icon: <MailIcon color={t.iconColor} />,  val: d.workEmail, lbl: "Work Email"  },
          { icon: <GlobeIcon color={t.iconColor} />, val: d.website,   lbl: "Website"     },
        ].filter(({ val }) => !!val).map(({ icon, val, lbl }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 12, background: "rgba(255,255,255,0.7)", border: `1px solid ${t.borderColor}` }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</p>
              <p style={{ margin: 0, fontSize: 12, color: t.textPrimary, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</p>
            </div>
            <ChevronRightIcon color="#c7d2fe" />
          </div>
        ))}
        {!d.phone && !d.workPhone && !d.email && !d.workEmail && !d.website && (
          <p style={{ fontSize: 12, color: t.textSecondary, margin: 0, textAlign: "center" }}>No contact details yet.</p>
        )}
      </div>

      {/* Frosted social row */}
      {d.activeSocials.length > 0 && (
        <div style={{ margin: "0 18px", padding: "10px 14px", borderRadius: 14, background: "rgba(255,255,255,0.6)", border: `1px solid ${t.borderColor}`, display: "flex", justifyContent: "center", gap: 14 }}>
          {d.activeSocials.map((key) => <SocialSVG key={key} platform={key} size={28} iconUrl={d.socialIconMap?.[key]} />)}
        </div>
      )}

      {/* Save button */}
      <div style={{ padding: "12px 18px 18px" }}>
        <div style={{ background: "linear-gradient(90deg,#6366f1,#a78bfa)", color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 13, padding: "13px", borderRadius: 13, boxShadow: "0 6px 18px rgba(99,102,241,0.35)" }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ─── Layout NeonEdge ────────────────────────────────────────────────────
   Dark #0a0a14 · SVG mesh grid header · conic gradient avatar ring
   (lime green #00ff88 → cyan #00aaff) · gradient text designation ·
   action column chips · 2-column social card grid ·
   lime-cyan gradient Save Contact button
   ─────────────────────────────────────────────────────────────────────── */

function LayoutNeonEdge({ profile, t }) {
  const d = buildProfileData(profile);
  const ac2 = t.neonSecondary || "#00aaff";
  return (
    <div style={{ borderRadius: 24, overflow: "hidden", background: t.bodyBg, boxShadow: `0 20px 60px rgba(0,255,136,0.12), 0 0 0 1px ${t.borderColor}` }}>
      {/* Mesh grid header */}
      <div style={{ height: 120, position: "relative", background: t.bodyBg, overflow: "hidden" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 340 120" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="120" stroke={t.accentColor} strokeWidth="0.4" opacity="0.15" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 20} x2="340" y2={i * 20} stroke={t.accentColor} strokeWidth="0.4" opacity="0.15" />
          ))}
        </svg>
        <div style={{ position: "absolute", top: -40, left: "20%", width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle,${t.accentColor}18,transparent 65%)` }} />
        <div style={{ position: "absolute", top: -30, right: "15%", width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle,${ac2}14,transparent 60%)` }} />
        {/* Conic glow ring avatar */}
        <div style={{ position: "absolute", bottom: -34, left: "50%", transform: "translateX(-50%)" }}>
          <div style={{ padding: 3, borderRadius: "50%", background: `conic-gradient(${t.accentColor},${ac2},${t.accentColor})`, boxShadow: `0 0 0 4px ${t.bodyBg}, 0 0 28px ${t.accentColor}66` }}>
            <div style={{ width: 66, height: 66, borderRadius: "50%", background: t.avatarBg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {d.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              ) : (
                <UserPlaceholderIcon color={`${t.accentColor}88`} size={28} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Name block */}
      <div style={{ textAlign: "center", paddingTop: 44, paddingBottom: 14, paddingLeft: 18, paddingRight: 18 }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 20, color: t.textPrimary, letterSpacing: "-0.02em" }}>{d.fullName}</p>
        {d.designation && (
          <p style={{ margin: "4px 0 0", fontSize: 12, fontWeight: 600, background: `linear-gradient(90deg,${t.accentColor},${ac2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{d.designation}</p>
        )}
        {(d.company || d.city) && (
          <p style={{ margin: "3px 0 0", fontSize: 11, color: t.textSecondary }}>{[d.company, d.city].filter(Boolean).join(" · ")}</p>
        )}
      </div>

      {/* Action columns */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "0 16px 14px" }}>
        {d.phone && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 16px", borderRadius: 14, border: `1px solid ${t.accentColor}33`, background: `${t.accentColor}0d` }}>
            <PhoneIcon color={t.accentColor} />
            <span style={{ fontSize: 10, color: t.accentColor, fontWeight: 700, letterSpacing: "0.05em" }}>Call</span>
          </div>
        )}
        {d.email && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 16px", borderRadius: 14, border: `1px solid ${ac2}33`, background: `${ac2}0d` }}>
            <MailIcon color={ac2} />
            <span style={{ fontSize: 10, color: ac2, fontWeight: 700, letterSpacing: "0.05em" }}>Email</span>
          </div>
        )}
        {d.website && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 16px", borderRadius: 14, border: "1px solid #a78bfa33", background: "#a78bfa0d" }}>
            <GlobeIcon color="#a78bfa" />
            <span style={{ fontSize: 10, color: "#a78bfa", fontWeight: 700, letterSpacing: "0.05em" }}>Web</span>
          </div>
        )}
        {!d.phone && !d.email && !d.website && (
          <p style={{ fontSize: 12, color: t.textSecondary, margin: "8px 0" }}>No contact info yet.</p>
        )}
      </div>

      {/* Social 2-column grid */}
      {d.activeSocials.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 16px 16px" }}>
          {d.activeSocials.map((key) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, border: `1px solid ${t.dividerColor}`, background: "#0f0f20" }}>
              <SocialSVG platform={key} size={24} iconUrl={d.socialIconMap?.[key]} />
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 12, color: "#e2e8f0", fontWeight: 600, textTransform: "capitalize" }}>{key}</p>
                <p style={{ margin: 0, fontSize: 10, color: t.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>@{d.firstName.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save button */}
      <div style={{ padding: `${d.activeSocials.length > 0 ? "0" : "4px"} 16px 18px` }}>
        <div style={{ background: `linear-gradient(90deg,${t.accentColor},${ac2})`, color: "#000", textAlign: "center", fontWeight: 800, fontSize: 13, padding: "13px", borderRadius: 13, letterSpacing: "0.02em" }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ─── Layout Ember ───────────────────────────────────────────────────────
   Dark slate #161b22 · amber #f59e0b + red #ef4444 · gradient strip +
   dark header · avatar overlapping BOTTOM-LEFT with gradient ring ·
   name row with city badge + "Open to connect" tag ·
   contact list with rounded icon boxes + chevrons ·
   social in dark squares · amber-red gradient Save Contact button
   ─────────────────────────────────────────────────────────────────────── */

function LayoutEmber({ profile, t }) {
  const d = buildProfileData(profile);
  const ac2 = t.accentColor2 || "#ef4444";
  return (
    <div style={{ borderRadius: 24, overflow: "hidden", background: t.bodyBg, boxShadow: `0 0 0 1px ${t.borderColor}` }}>
      {/* Gradient strip + header */}
      <div style={{ position: "relative" }}>
        <div style={{ height: 5, background: `linear-gradient(90deg,${t.accentColor},${ac2})` }} />
        <div style={{ height: 100, background: t.headerGradient, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -10, width: 90, height: 90, borderRadius: "50%", background: `radial-gradient(circle,${t.accentColor}18,transparent 65%)` }} />
          <div style={{ position: "absolute", bottom: -15, left: 20, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle,${ac2}12,transparent 60%)` }} />
        </div>
        {/* Avatar overlapping — bottom left */}
        <div style={{ position: "absolute", bottom: -28, left: 20 }}>
          <div style={{ padding: 3, borderRadius: "50%", background: `linear-gradient(135deg,${t.accentColor},${ac2})`, boxShadow: `0 4px 18px ${t.accentColor}55` }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: t.avatarBg, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {d.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              ) : (
                <UserPlaceholderIcon color={`${t.accentColor}88`} size={24} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Name row with badge tags */}
      <div style={{ paddingTop: 36, paddingLeft: 20, paddingRight: 20, paddingBottom: 12, borderBottom: `1px solid ${t.dividerColor}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 19, color: t.textPrimary, letterSpacing: "-0.015em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.fullName}</p>
            {d.designation && <p style={{ margin: "3px 0 0", fontSize: 12, color: t.accentColor, fontWeight: 600 }}>{d.designation}</p>}
            {d.company && <p style={{ margin: "3px 0 0", fontSize: 11, color: t.textSecondary }}>{d.company}</p>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
            {d.city && (
              <span style={{ fontSize: 10, color: t.accentColor, background: `${t.accentColor}15`, border: `1px solid ${t.accentColor}33`, padding: "3px 8px", borderRadius: 99, fontWeight: 600 }}>{d.city}</span>
            )}
            <span style={{ fontSize: 10, color: "#6b7280", background: "#0d1117", border: `1px solid ${t.borderColor}`, padding: "3px 8px", borderRadius: 99 }}>Open to connect</span>
          </div>
        </div>
      </div>

      {/* Contact list */}
      <div style={{ padding: "10px 20px" }}>
        {[
          { icon: <PhoneIcon color={t.iconColor} />, val: d.phone },
          { icon: <PhoneIcon color={t.iconColor} />, val: d.workPhone },
          { icon: <MailIcon color={t.iconColor} />, val: d.email },
          { icon: <MailIcon color={t.iconColor} />, val: d.workEmail },
          { icon: <GlobeIcon color={t.iconColor} />, val: d.website },
        ].filter(({ val }) => !!val).map(({ icon, val }, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < arr.length - 1 ? `1px solid ${t.dividerColor}` : "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "#0d1117", border: `1px solid ${t.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
            <span style={{ fontSize: 12, color: "#d1d5db", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
            <ChevronRightIcon color="#374151" />
          </div>
        ))}
        {!d.phone && !d.workPhone && !d.email && !d.workEmail && !d.website && (
          <p style={{ fontSize: 12, color: t.textSecondary, margin: "8px 0" }}>No contact details yet.</p>
        )}
      </div>

      {/* Social row in dark boxes */}
      {d.activeSocials.length > 0 && (
        <div style={{ display: "flex", gap: 8, padding: "10px 20px", borderTop: `1px solid ${t.dividerColor}` }}>
          {d.activeSocials.map((key) => (
            <div key={key} style={{ width: 36, height: 36, borderRadius: 10, background: "#0d1117", border: `1px solid ${t.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SocialSVG platform={key} size={21} iconUrl={d.socialIconMap?.[key]} />
            </div>
          ))}
        </div>
      )}

      {/* Save button */}
      <div style={{ padding: `${d.activeSocials.length > 0 ? "4px" : "14px"} 20px 20px` }}>
        <div style={{ background: `linear-gradient(90deg,${t.accentColor},${ac2})`, color: "#000", textAlign: "center", fontWeight: 800, fontSize: 13, padding: "13px", borderRadius: 13, boxShadow: `0 6px 20px ${t.accentColor}44` }}>
          + Save Contact
        </div>
      </div>
    </div>
  );
}

/* ─── empty / no-profile state ───────────────────────────────────────── */

function EmptyState({ t }) {
  return (
    <div
      style={{ borderRadius: 16, border: `1px solid ${t.borderColor}`, background: t.bodyBg, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "32px 24px", textAlign: "center" }}
    >
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: t.pillBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <UserPlaceholderIcon color={t.pillText} size={28} />
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, margin: 0 }}>No profile yet</p>
        <p style={{ fontSize: 13, color: t.textSecondary, marginTop: 4, lineHeight: 1.5 }}>
          Create your NFC profile to start sharing your contact details.
        </p>
      </div>
      <Link
        href="/dashboard/profile/setup"
        style={{ borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, background: t.pillBg, color: t.pillText, textDecoration: "none" }}
      >
        Create Profile
      </Link>
    </div>
  );
}

/* ─── Layout Classic ─────────────────────────────────────────────────────
   Clean white card with large cover banner, small inline avatar, bordered
   action buttons, and social icon row — from Figma node 634-16219.
   ─────────────────────────────────────────────────────────────────────── */

function LayoutClassic({ profile, t }) {
  const d   = buildProfileData(profile);
  const bio = profile?.bio || "";

  return (
    <div style={{ background: t.bodyBg, border: `1px solid ${t.borderColor}`, borderRadius: 16, overflow: "hidden" }}>

      {/* Cover banner */}
      <div style={{ height: 260, overflow: "hidden", background: t.headerGradient, position: "relative" }}>
        {d.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserPlaceholderIcon color="rgba(255,255,255,0.55)" size={56} />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 14, left: 18 }}>
          <p style={{ color: "white", fontSize: 22, fontWeight: 600, lineHeight: 1.1, margin: 0 }}>
            {d.firstName}{d.lastName && <><br />{d.lastName}</>}
          </p>
        </div>
      </div>

      {/* Profile info row — company logo + name/title/city */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 24px 10px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {d.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.companyLogo} alt={d.company} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 2, display: "block" }} />
          ) : (
            <BuildingIcon color="#bbb" />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: t.fontColor || "#000000", lineHeight: "1.25em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d.fullName}
          </p>
          {d.designation && (
            <p style={{ margin: 0, fontSize: 10, color: t.fontColor || "#000000", lineHeight: "1.3em" }}>
              {d.designation}
            </p>
          )}
          {d.city && (
            <p style={{ margin: 0, fontSize: 9, color: t.fontColor || "#000000", lineHeight: "1.333em" }}>
              {d.city}, India.
            </p>
          )}
        </div>
      </div>

      {/* Bio card */}
      {bio && (
        <div style={{ margin: "0 14px 10px", background: "#f8fafc", borderRadius: 8, borderLeft: "3px solid #A4B6C4", padding: "6px 10px" }}>
          <p style={{ margin: 0, fontSize: 9, color: "#6B7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {bio}
          </p>
        </div>
      )}

      {/* Action buttons — Save Contact (fill) + Phone / Email / Link */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px 16px" }}>
        <div style={{ flex: 1, height: 36, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: t.pillBg, borderRadius: 18 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.pillText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 600, color: t.pillText }}>Save Contact</span>
        </div>
        {/* Phone */}
        <div style={{ width: 26, height: 26, border: "1px solid #D1D5DB", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h4l2 4-2.5 1.5A12 12 0 0 0 14.5 16L16 13.5l4 2v4c-8.5 1-16.5-7-17-15.5Z"/>
          </svg>
        </div>
        {/* Email */}
        <div style={{ width: 26, height: 26, border: "1px solid #D1D5DB", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
          </svg>
        </div>
        {/* Link */}
        <div style={{ width: 26, height: 26, border: "1px solid #D1D5DB", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
      </div>

      {/* Social icons — wrapped row */}
      {d.activeSocials.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, padding: "12px 20px" }}>
          {d.activeSocials.map((key) => (
            <SocialSVG key={key} platform={key} size={32} iconUrl={d.socialIconMap?.[key]} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Layout Violet ──────────────────────────────────────────────────────
   Dark navy top · purple avatar ring · white+purple name split ·
   wave separator · white card with purple icon rows · social icons ·
   About Me · solid purple Save Contact.
   ─────────────────────────────────────────────────────────────────────── */

function LayoutViolet({ profile, t }) {
  const d         = buildProfileData(profile);
  const bio       = profile?.bio || "";
  const firstName = d.fullName.split(" ")[0];
  const lastName  = d.fullName.split(" ").slice(1).join(" ");

  const contactRows = [
    { icon: <MailIcon color="#7B61FF" />,     value: d.email     },
    { icon: <MailIcon color="#7B61FF" />,     value: d.workEmail },
    { icon: <PhoneIcon color="#7B61FF" />,    value: d.phone     },
    { icon: <PhoneIcon color="#7B61FF" />,    value: d.workPhone },
    { icon: <LocationIcon color="#7B61FF" />, value: d.city ? `${d.city}, India` : "" },
    { icon: <GlobeIcon color="#7B61FF" />,    value: d.website   },
  ].filter(r => r.value);

  return (
    <div style={{ borderRadius: 16, overflow: "hidden" }}>

      {/* Dark navy top */}
      <div style={{ background: "linear-gradient(160deg,#0d0d2e 0%,#1a1a4e 100%)", padding: "22px 18px 0", textAlign: "center", position: "relative" }}>
        {/* Dot grid */}
        <div style={{ position: "absolute", left: 10, top: 14, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(123,97,255,0.3)" }} />
          ))}
        </div>

        {/* Circular avatar with purple ring */}
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: "#7B61FF", padding: 3, margin: "0 auto 12px", boxSizing: "border-box" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#1a1030" }}>
            {d.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <UserPlaceholderIcon color="rgba(123,97,255,0.45)" size={38} />
              </div>
            )}
          </div>
        </div>

        {/* Name — first white, last violet */}
        <p style={{ margin: "0 0 3px", fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
          <span style={{ color: "#ffffff" }}>{firstName}</span>
          {lastName && <span style={{ color: "#9B7BFF" }}> {lastName}</span>}
        </p>
        {/* Designation */}
        {d.designation && (
          <p style={{ margin: "0 0 6px", fontSize: 10, color: "#C4C4C4" }}>{d.designation}</p>
        )}
        {/* Purple underline */}
        <div style={{ width: 32, height: 2, background: "#7B61FF", borderRadius: 1, margin: "0 auto 16px" }} />

        {/* Wave to content */}
        <svg viewBox="0 0 280 24" style={{ display: "block", width: "100%", marginBottom: -1 }}>
          <path d="M0,12 C70,24 210,0 280,12 L280,24 L0,24 Z" fill={t.contentBg || "#ffffff"}/>
        </svg>
      </div>

      {/* Content area */}
      <div style={{ background: t.contentBg || "#ffffff", padding: "10px 14px 14px" }}>

        {/* Contact card */}
        {contactRows.length > 0 && (
          <div style={{ border: "1px solid #EDE9FE", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
            {contactRows.slice(0, 4).map(({ icon, value }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderBottom: i < contactRows.length - 1 ? "1px solid #F5F3FF" : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {icon}
                </div>
                <span style={{ flex: 1, fontSize: 8.5, color: t.fontColor || "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
                <div style={{ width: 1, height: 14, background: "#E5E7EB", marginRight: 6 }} />
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {d.activeSocials.length > 0 && (
          <>
            <p style={{ margin: "0 0 7px", fontSize: 9, fontWeight: 700, color: "#111827" }}>Social Links</p>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
              {d.activeSocials.map((key) => (
                <SocialSVG key={key} platform={key} size={22} iconUrl={d.socialIconMap?.[key]} />
              ))}
            </div>
          </>
        )}

        {/* About Me */}
        {bio && (
          <>
            <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, color: t.fontColor || "#111827" }}>About Me</p>
            <p style={{ margin: "0 0 10px", fontSize: 8, color: t.fontColor || "#4B5563", lineHeight: 1.5 }}>{bio}</p>
          </>
        )}

        {/* Save Contact */}
        <div style={{ background: t.pillBg, borderRadius: 10, padding: "9px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={t.pillText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
          <span style={{ fontSize: 9.5, fontWeight: 600, color: t.pillText }}>Save Contact</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Layout Midnight ────────────────────────────────────────────────────
   Dark bg · gold circular avatar ring · white/gold name split ·
   gold designation + underline · white card bottom with amber icon rows ·
   social icons · outlined gold Save Contact.
   ─────────────────────────────────────────────────────────────────────── */

function LayoutMidnight({ profile, t }) {
  const d         = buildProfileData(profile);
  const bio       = profile?.bio || "";
  const firstName = d.fullName.split(" ")[0];
  const lastName  = d.fullName.split(" ").slice(1).join(" ");

  const contactRows = [
    { icon: <MailIcon color="white" />,     value: d.email     },
    { icon: <MailIcon color="white" />,     value: d.workEmail },
    { icon: <PhoneIcon color="white" />,    value: d.phone     },
    { icon: <PhoneIcon color="white" />,    value: d.workPhone },
    { icon: <LocationIcon color="white" />, value: d.city ? `${d.city}, India` : "" },
    { icon: <GlobeIcon color="white" />,    value: d.website   },
  ].filter(r => r.value);

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: t.bodyBg }}>

      {/* Dark top — avatar + name + designation + bio */}
      <div style={{ padding: "22px 18px 18px", textAlign: "center", position: "relative" }}>
        {/* Dot grid */}
        <div style={{ position: "absolute", right: 10, top: 10, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
          ))}
        </div>

        {/* Circular avatar with gold ring */}
        <div style={{ width: 86, height: 86, borderRadius: "50%", background: "#F5A623", padding: 3, margin: "0 auto 12px", boxSizing: "border-box" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#1a1030" }}>
            {d.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <UserPlaceholderIcon color="rgba(245,166,35,0.45)" size={38} />
              </div>
            )}
          </div>
        </div>

        {/* Name — first white, last gold */}
        <p style={{ margin: "0 0 3px", fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
          <span style={{ color: "#ffffff" }}>{firstName}</span>
          {lastName && <span style={{ color: "#F5A623" }}> {lastName}</span>}
        </p>

        {/* Designation */}
        {d.designation && (
          <p style={{ margin: "0 0 5px", fontSize: 10, fontWeight: 500, color: "#F5A623" }}>{d.designation}</p>
        )}

        {/* Gold underline */}
        <div style={{ width: 28, height: 2, background: "#F5A623", borderRadius: 1, margin: "0 auto 9px" }} />

      </div>

      {/* Content card bottom */}
      <div style={{ background: t.contentBg || "#ffffff", borderRadius: "14px 14px 0 0", padding: "12px 14px 14px" }}>

        {/* Contact rows — amber square icon + value + copy icon */}
        {contactRows.map(({ icon, value }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 8, borderBottom: i < contactRows.length - 1 ? "1px solid #F3F4F6" : "none", marginBottom: i < contactRows.length - 1 ? 8 : 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {icon}
            </div>
            <span style={{ fontSize: 8.5, color: t.fontColor || "#1a1a1a", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </div>
        ))}

        {/* Social Links */}
        {d.activeSocials.length > 0 && (
          <>
            <p style={{ margin: "0 0 7px", fontSize: 9, fontWeight: 700, color: t.fontColor || "#111827" }}>Social Links</p>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
              {d.activeSocials.map((key) => (
                <SocialSVG key={key} platform={key} size={22} iconUrl={d.socialIconMap?.[key]} />
              ))}
            </div>
          </>
        )}

        {/* About Me */}
        {bio && (
          <>
            <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, color: t.fontColor || "#111827" }}>About Me</p>
            <p style={{ margin: "0 0 10px", fontSize: 8, color: t.fontColor || "#4B5563", lineHeight: 1.5 }}>{bio}</p>
          </>
        )}

        {/* Save Contact */}
        {(() => {
          const solidBtn = t.pillBg !== "transparent";
          const btnBorder = solidBtn ? t.pillBg : t.accentColor;
          const btnText   = solidBtn ? t.pillText : t.accentColor;
          return (
            <div style={{ border: `1.5px solid ${btnBorder}`, background: solidBtn ? t.pillBg : "transparent", borderRadius: 10, padding: "8px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={btnText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
              </svg>
              <span style={{ fontSize: 9.5, fontWeight: 600, color: btnText }}>Save Contact</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

/* ─── Layout Royal ────────────────────────────────────────────────────────
   Dark navy top with dot pattern + wave SVG → gold ring avatar + star badge
   → name + gold underline + job|company|city row → white card with bio,
   Contact / Work Contact / Connect sections → purple Save Contact.
   ─────────────────────────────────────────────────────────────────────── */

function LayoutRoyal({ profile, t }) {
  const d   = buildProfileData(profile);
  const bio = profile?.bio || "";

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${t.borderColor}` }}>

      {/* Dark navy header */}
      <div style={{ background: "linear-gradient(160deg,#0e1155 0%,#1a237e 100%)", padding: "20px 16px 0", textAlign: "center", position: "relative", minHeight: 140 }}>
        {/* Dot grid */}
        <div style={{ position: "absolute", right: 8, top: 8, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }}>
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }} />
          ))}
        </div>

        {/* Avatar with gold ring + star badge */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
          <div style={{ width: 78, height: 78, borderRadius: "50%", background: "#F5A623", padding: 3, boxSizing: "border-box" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#1a237e" }}>
              {d.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <UserPlaceholderIcon color="rgba(245,166,35,0.5)" size={34} />
                </div>
              )}
            </div>
          </div>
          {/* Gold star badge */}
          <div style={{ position: "absolute", bottom: 0, right: -2, width: 20, height: 20, borderRadius: "50%", background: "#F5A623", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #1a237e" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>

        {/* Name */}
        <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#ffffff" }}>{d.fullName}</p>
        {/* Gold underline */}
        <div style={{ width: 26, height: 2, background: "#F5A623", borderRadius: 1, margin: "0 auto 8px" }} />

        {/* Wave separator to content */}
        <svg viewBox="0 0 280 24" style={{ display: "block", width: "100%", marginBottom: -1 }}>
          <path d="M0,12 C70,24 210,0 280,12 L280,24 L0,24 Z" fill={t.contentBg || "#ffffff"}/>
        </svg>
      </div>

      {/* Content area */}
      <div style={{ background: t.contentBg || "#ffffff", padding: "4px 14px 14px" }}>

        {/* Job | Company | City row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {d.designation && (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <BuildingIcon color="#4F46E5" />
              <span style={{ fontSize: 7.5, color: "#4B5563" }}>{d.designation}</span>
            </div>
          )}
          {d.designation && d.company && <div style={{ width: 1, height: 10, background: "#D1D5DB" }} />}
          {d.company && (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <BuildingIcon color="#4F46E5" />
              <span style={{ fontSize: 7.5, color: "#4B5563" }}>{d.company}</span>
            </div>
          )}
          {d.company && d.city && <div style={{ width: 1, height: 10, background: "#D1D5DB" }} />}
          {d.city && (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <LocationIcon color="#22C55E" />
              <span style={{ fontSize: 7.5, color: "#4B5563" }}>{d.city}, India</span>
            </div>
          )}
        </div>

        {/* Bio card */}
        {bio && (
          <div style={{ background: "#F5F3FF", borderRadius: 8, padding: "8px 8px 8px 10px", display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#EDE9FE", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
            </div>
            <p style={{ margin: 0, fontSize: 8, color: "#374151", lineHeight: 1.5 }}>{bio}</p>
          </div>
        )}

        {/* Contact section */}
        {(d.phone || d.workPhone || d.email || d.workEmail || d.website) && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <p style={{ margin: 0, fontSize: 8.5, fontWeight: 700, color: t.fontColor || "#111827" }}>Contact</p>
              <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            </div>
            <div style={{ background: "#F9FAFB", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
              {[
                { label: "Phone",      value: d.phone,     icon: <PhoneIcon color="white" />, bg: "#7C3AED" },
                { label: "Work Phone", value: d.workPhone, icon: <PhoneIcon color="white" />, bg: "#7C3AED" },
                { label: "Email",      value: d.email,     icon: <MailIcon color="white" />,  bg: "#3B82F6" },
                { label: "Work Email", value: d.workEmail, icon: <MailIcon color="white" />,  bg: "#3B82F6" },
                { label: "Website",    value: d.website,   icon: <GlobeIcon color="white" />, bg: "#0EA5E9" },
              ].filter(r => r.value).map(({ label, value, icon, bg }, i, arr) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {icon}
                  </div>
                  <span style={{ fontSize: 7.5, color: t.fontColor || "#374151", width: 36 }}>{label}</span>
                  <span style={{ fontSize: 7.5, color: t.fontColor || "#111827", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Social section */}
        {d.activeSocials.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
              <p style={{ margin: 0, fontSize: 8.5, fontWeight: 700, color: t.fontColor || "#111827" }}>Connect</p>
              <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
              {d.activeSocials.map((key) => (
                <SocialSVG key={key} platform={key} size={22} iconUrl={d.socialIconMap?.[key]} />
              ))}
            </div>
          </>
        )}

        {/* Save Contact */}
        <div style={{ background: t.pillBg, borderRadius: 10, padding: "9px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={t.pillText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
          <span style={{ fontSize: 9.5, fontWeight: 600, color: t.pillText }}>Save Contact</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Layout Professional ────────────────────────────────────────────────
   Cover photo → absolute avatar+name block → dark Save Contact →
   4 circular action icons (Call/Email/Website/Location) →
   divider → "Connect with me" social link cards.
   Matches Figma node 634-16273.
   ─────────────────────────────────────────────────────────────────────── */

const SOCIAL_NAMES = {
  whatsapp: "WhatsApp", linkedin: "LinkedIn", messenger: "Messenger",
  instagram: "Instagram", twitter: "Twitter / X", snapchat: "Snapchat",
};

function LayoutProfessional({ profile, t }) {
  const d   = buildProfileData(profile);
  const bio = profile?.bio || "";

  const socialHandle = (key) => {
    const v = d.social[key] || "";
    if (!v) return "";
    if (v.startsWith("http")) return "@" + v.split("/").filter(Boolean).pop();
    return v;
  };

  return (
    <div style={{ background: t.bodyBg, borderRadius: 16, overflow: "hidden", boxShadow: "0px 15.625px 31.25px -7.5px rgba(0,0,0,0.25)" }}>

      {/* Cover photo */}
      <div style={{ height: 260, overflow: "hidden", background: t.headerGradient, position: "relative" }}>
        {d.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserPlaceholderIcon color="rgba(100,100,100,0.3)" size={56} />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 14, left: 18 }}>
          <p style={{ color: "white", fontSize: 22, fontWeight: 600, lineHeight: 1.1, margin: 0 }}>
            {d.firstName}{d.lastName && <><br />{d.lastName}</>}
          </p>
        </div>
      </div>

      {/* Content area */}
      <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Profile info — absolute layout within fixed 84px height */}
        <div style={{ position: "relative", height: 84 }}>
          {/* Circular avatar */}
          <div style={{ position: "absolute", left: 15, top: 24, width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {d.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.profileImage} alt={d.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            ) : (
              <UserPlaceholderIcon color="#9CA3AF" size={18} />
            )}
          </div>
          {/* Name */}
          <p style={{ position: "absolute", left: 60, top: 24, margin: 0, fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 700, color: t.fontColor || "#111827", lineHeight: "17px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {d.fullName}
          </p>
          {/* Designation */}
          {d.designation && (
            <p style={{ position: "absolute", left: 60, top: 43, margin: 0, fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 500, color: t.fontColor || "#4B5563", lineHeight: "13px" }}>
              {d.designation}
            </p>
          )}
          {/* Company */}
          {d.company && (
            <p style={{ position: "absolute", left: 60, top: 60, margin: 0, fontFamily: "Inter, sans-serif", fontSize: 8, fontWeight: 400, color: t.fontColor || "#6B7280", lineHeight: "10px" }}>
              {d.company}
            </p>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p style={{ margin: "-4px 0 0", fontSize: 9, color: "#6B7280", lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}>
            {bio}
          </p>
        )}

        {/* Save Contact — full-width button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: t.pillBg, borderRadius: 10, padding: "10px 0", boxShadow: "0px 2.5px 3.75px -0.625px rgba(17,24,39,0.2)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.pillText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 9.5, fontWeight: 600, color: t.pillText }}>Save Contact</span>
        </div>

        {/* 3 circular action icon buttons with labels */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {[
            { label: "Call",    icon: <PhoneIcon color="#374151" /> },
            { label: "Email",   icon: <MailIcon color="#374151" />  },
            { label: "Website", icon: <GlobeIcon color="#374151" /> },
          ].map(({ label, icon }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 55 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#F9FAFB", border: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0px 0.5px 1px rgba(0,0,0,0.05)" }}>
                {icon}
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 6.4, fontWeight: 500, color: "#4B5563" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#F3F4F6" }} />

        {/* Social link cards */}
        {d.activeSocials.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <p style={{ margin: 0, paddingLeft: 2, fontFamily: "Inter, sans-serif", fontSize: 7, fontWeight: 700, color: "#9CA3AF" }}>
              Connect with me
            </p>
            {d.activeSocials.map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#F9FAFB", border: "1px solid #F3F4F6", borderRadius: 10 }}>
                <div style={{ width: 25, height: 25, borderRadius: "50%", background: "#ffffff", boxShadow: "0px 0.625px 1.25px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <SocialSVG platform={key} size={18} iconUrl={d.socialIconMap?.[key]} />
                </div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 8, fontWeight: 600, color: "#111827" }}>
                    {SOCIAL_NAMES[key] || key}
                  </p>
                  {socialHandle(key) && (
                    <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 7, fontWeight: 400, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {socialHandle(key)}
                    </p>
                  )}
                </div>
                <ChevronRightIcon color="#9CA3AF" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ProfilePreviewCard ─────────────────────────────────────────────── */

export default function ProfilePreviewCard({ profile, themeKey = "default", customization = null }) {
  const base = THEME_STYLES[themeKey] ?? THEME_STYLES.default;

  // Merge customization overrides on top of theme defaults
  const t = customization ? {
    ...base,
    ...(customization.bgColor   && { bodyBg: customization.bgColor, contentBg: customization.bgColor }),
    ...(customization.btnColor  && { pillBg: customization.btnColor, pillText: "#ffffff" }),
    ...(customization.fontColor && { fontColor: customization.fontColor }),
  } : base;

  const fontStyle = customization?.fontFamily
    ? { fontFamily: `'${customization.fontFamily}', sans-serif` }
    : {};

  if (!profile) return <EmptyState t={t} />;

  const layoutProps = { profile, t };
  let card;
  if (t.layout === "B")            card = <LayoutB        {...layoutProps} />;
  else if (t.layout === "C")       card = <LayoutC        {...layoutProps} />;
  else if (t.layout === "aurora")  card = <LayoutAurora   {...layoutProps} />;
  else if (t.layout === "obsidian")card = <LayoutObsidian {...layoutProps} />;
  else if (t.layout === "frosted") card = <LayoutFrosted  {...layoutProps} />;
  else if (t.layout === "neon-edge") card = <LayoutNeonEdge {...layoutProps} />;
  else if (t.layout === "ember")   card = <LayoutEmber    {...layoutProps} />;
  else if (t.layout === "classic")       card = <LayoutClassic      {...layoutProps} />;
  else if (t.layout === "professional")  card = <LayoutProfessional {...layoutProps} />;
  else if (t.layout === "violet")        card = <LayoutViolet       {...layoutProps} />;
  else if (t.layout === "midnight")      card = <LayoutMidnight     {...layoutProps} />;
  else if (t.layout === "royal")         card = <LayoutRoyal        {...layoutProps} />;
  else card = <LayoutA {...layoutProps} />;

  return <div style={fontStyle}>{card}</div>;
}
