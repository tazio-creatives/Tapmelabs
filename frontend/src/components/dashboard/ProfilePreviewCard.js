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
  midnight: {
    layout: "A", imageAspectRatio: "3:4",
    headerGradient: "linear-gradient(135deg,#0f172a 0%,#312e81 100%)",
    bodyBg: "#0f172a", textPrimary: "#f1f5f9", textSecondary: "#94a3b8",
    dividerColor: "#1e293b", pillBg: "#4f46e5", pillText: "#ffffff",
    accentColor: "#6366F1", borderColor: "#1e293b", avatarBg: "#1e293b", iconColor: "#94a3b8",
  },
  "midnight-dark": {
    layout: "A", imageAspectRatio: "3:4",
    headerGradient: "linear-gradient(135deg,#0f172a 0%,#312e81 100%)",
    bodyBg: "#0f172a", textPrimary: "#f1f5f9", textSecondary: "#94a3b8",
    dividerColor: "#1e293b", pillBg: "#4f46e5", pillText: "#ffffff",
    accentColor: "#6366F1", borderColor: "#1e293b", avatarBg: "#1e293b", iconColor: "#94a3b8",
  },
  professional: {
    layout: "C", imageAspectRatio: "1:1",
    headerGradient: "linear-gradient(135deg,#1e3a5f 0%,#2563EB 100%)",
    bodyBg: "#ffffff", textPrimary: "#111827", textSecondary: "#6B7280",
    dividerColor: "#E5E5E5", pillBg: "#2563EB", pillText: "#ffffff",
    accentColor: "#3B82F6", borderColor: "#E5E5E5", avatarBg: "#EFF6FF", iconColor: "#1C1B1F",
  },
  modern: {
    layout: "B", imageAspectRatio: "1:1",
    headerGradient: "linear-gradient(135deg,#7C3AED 0%,#A78BFA 100%)",
    bodyBg: "#ffffff", textPrimary: "#111827", textSecondary: "#6B7280",
    dividerColor: "#E5E5E5", pillBg: "#111827", pillText: "#ffffff",
    accentColor: "#8B5CF6", borderColor: "#E5E5E5", avatarBg: "#F5F3FF", iconColor: "#1C1B1F",
  },
  vibrant: {
    layout: "A", imageAspectRatio: "3:4",
    headerGradient: "linear-gradient(135deg,#EC4899 0%,#F472B6 100%)",
    bodyBg: "#ffffff", textPrimary: "#111827", textSecondary: "#6B7280",
    dividerColor: "#E5E5E5", pillBg: "#EC4899", pillText: "#ffffff",
    accentColor: "#EC4899", borderColor: "#E5E5E5", avatarBg: "#FDF2F8", iconColor: "#1C1B1F",
  },
  minimal: {
    layout: "A", imageAspectRatio: "3:4",
    headerGradient: "linear-gradient(135deg,#6B7280 0%,#9CA3AF 100%)",
    bodyBg: "#ffffff", textPrimary: "#111827", textSecondary: "#6B7280",
    dividerColor: "#E5E5E5", pillBg: "#6B7280", pillText: "#ffffff",
    accentColor: "#9CA3AF", borderColor: "#E5E5E5", avatarBg: "#F9FAFB", iconColor: "#1C1B1F",
  },
};

/* ─── social platform SVG icons ──────────────────────────────────────── */

function SocialSVG({ platform, size = 22 }) {
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
    activeSocials: ALL_SOCIAL_KEYS.filter((key) => !!social[key]),
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

/* ─── Layout A ───────────────────────────────────────────────────────────
   Used by: default, minimal, vibrant, midnight, midnight-dark
   Structure: portrait photo with name overlay → company row → contact
              rows → social icons → save contact button
   ─────────────────────────────────────────────────────────────────────── */

function LayoutA({ profile, t }) {
  const d = buildProfileData(profile);

  return (
    <div style={{ borderRadius: 16, border: `1px solid ${t.borderColor}`, background: t.bodyBg, overflow: "hidden" }}>

      {/* Portrait photo + name overlay */}
      <div style={{ position: "relative", height: 220, background: t.headerGradient }}>
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
        {/* Dark gradient so name is readable */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
        {/* Name bottom-left */}
        <div style={{ position: "absolute", bottom: 14, left: 18 }}>
          <p style={{ color: "white", fontSize: 19, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
            {d.firstName}
            {d.lastName && <><br />{d.lastName}</>}
          </p>
        </div>
      </div>

      {/* Company logo + designation row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderBottom: `1px solid ${t.dividerColor}` }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {d.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.companyLogo} alt={d.company || "Logo"} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 3 }} />
          ) : (
            <BuildingIcon color={t.accentColor} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
            {d.designation || "—"}
          </p>
          {d.company && (
            <p style={{ fontSize: 11, color: t.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
              at {d.company}
            </p>
          )}
          {d.city && (
            <p style={{ fontSize: 11, color: t.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
              in {d.city}, India.
            </p>
          )}
        </div>
      </div>

      {/* Contact rows */}
      <div style={{ padding: "10px 18px", borderBottom: `1px solid ${t.dividerColor}` }}>
        {d.phone && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 5 }}>
            <PhoneIcon color={t.iconColor} />
            <span style={{ fontSize: 12, fontWeight: 500, color: t.textPrimary }}>{d.phone}</span>
          </div>
        )}
        {d.email && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 5 }}>
            <MailIcon color={t.iconColor} />
            <span style={{ fontSize: 12, color: t.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.email}</span>
          </div>
        )}
        {d.website && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <GlobeIcon color={t.iconColor} />
            <span style={{ fontSize: 12, color: t.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.website}</span>
          </div>
        )}
        {d.workPhone && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 5 }}>
            <PhoneIcon color={t.iconColor} />
            <span style={{ fontSize: 12, fontWeight: 500, color: t.textPrimary }}>{d.workPhone} <span style={{ color: t.textSecondary, fontSize: 10 }}>(work)</span></span>
          </div>
        )}
        {d.workEmail && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 5 }}>
            <MailIcon color={t.iconColor} />
            <span style={{ fontSize: 12, color: t.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.workEmail} <span style={{ color: t.textSecondary, fontSize: 10 }}>(work)</span></span>
          </div>
        )}
        {!d.phone && !d.email && !d.website && !d.workPhone && !d.workEmail && (
          <p style={{ fontSize: 12, color: t.textSecondary, margin: 0 }}>No contact details added yet.</p>
        )}
      </div>

      {/* Social icons row — only connected platforms */}
      {d.activeSocials.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 14, padding: "12px 18px", borderBottom: `1px solid ${t.dividerColor}` }}>
          {d.activeSocials.map((key) => (
            <SocialSVG key={key} platform={key} size={24} />
          ))}
        </div>
      )}

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
            <SocialSVG platform={key} size={26} />
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
            : d.activeSocials.map((key) => <SocialSVG key={key} platform={key} size={28} />)
          }
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

/* ─── ProfilePreviewCard ─────────────────────────────────────────────── */

export default function ProfilePreviewCard({ profile, themeKey = "default" }) {
  const t = THEME_STYLES[themeKey] ?? THEME_STYLES.default;

  if (!profile) return <EmptyState t={t} />;

  if (t.layout === "B") return <LayoutB profile={profile} t={t} />;
  if (t.layout === "C") return <LayoutC profile={profile} t={t} />;
  return <LayoutA profile={profile} t={t} />;
}
