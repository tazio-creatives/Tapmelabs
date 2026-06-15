"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Icon,
  Sidebar,
  TopHeader,
  ProfilePreviewCard,
  ProfileTabs,
} from "@/components/dashboard/shared";
import profileService from "@/services/profileService";

/* ─── social platform logos (inline SVG) ─────────────────────────────── */

function WhatsAppLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#25D366"/>
      <path fill="white" d="M16 7.5A8.5 8.5 0 0 0 9.1 20.1L7.5 24.5l4.5-1.6A8.5 8.5 0 1 0 16 7.5Zm0 15.5a7 7 0 0 1-3.8-1.1l-.3-.2-3 1 .9-2.9-.2-.3A7 7 0 1 1 16 23Zm3.7-5.2c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1-.2-.1-1-.4-1.8-1.2a7 7 0 0 1-1.4-1.6c-.1-.2 0-.3.1-.4l.4-.4.2-.4V14l-.7-1.7c-.2-.4-.4-.4-.4-.4H12a.9.9 0 0 0-.7.3 2.7 2.7 0 0 0-.8 2c0 1.5 1.1 3 1.2 3.2 1.4 2.1 3 2.7 4.7 3.4.4.1.7.1 1 .1.4 0 .7 0 1.1-.2.5-.2.8-.5 1-.8.2-.3.2-.6 0-.8l-.8-.7Z"/>
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0A66C2"/>
      <path fill="white" d="M11 14H8.5V24H11V14Zm-1.3-4.3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM24 18.5c0-2.6-1.3-4.5-3.8-4.5-1 0-2 .6-2.5 1.6V14h-2.5V24h2.8v-5.8c0-1.2.6-2.1 1.7-2.1 1.1 0 1.5.9 1.5 2.1V24H24V18.5Z"/>
    </svg>
  );
}

function MessengerLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#0084FF"/>
      <path fill="white" d="M16 8C11.6 8 8 11.3 8 15.5c0 2.2 1 4.1 2.7 5.5V24l2.7-1.5c.7.2 1.5.3 2.6.3 4.4 0 8-3.3 8-7.5S20.4 8 16 8Zm.8 10-2.3-2.5-4.3 2.5 4.6-4.9 2.3 2.9 4.3-2.9-4.6 4.9Z"/>
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFC107"/>
          <stop offset="40%" stopColor="#E91E63"/>
          <stop offset="100%" stopColor="#9C27B0"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="16" fill="url(#ig)"/>
      <rect x="10" y="10" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="3" fill="none" stroke="white" strokeWidth="1.5"/>
      <circle cx="20.2" cy="11.8" r="0.9" fill="white"/>
    </svg>
  );
}

function TwitterLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#000000"/>
      <path fill="white" d="M17.8 14.9 22.5 9h-1.1l-4.1 4.8L14 9H9.5l5 7.1L9.5 23H10.6l4.4-5.1 3.5 5.1H23l-5.2-8.1Zm-1.5 1.8-.5-.7-4-5.7H13l3.2 4.6.5.7 4.2 5.9H19.7l-3.4-4.8Z"/>
    </svg>
  );
}

function SnapchatLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#FFFC00"/>
      <path fill="#1a1a1a" d="M16 8c-2.4 0-4.4 2-4.4 4.4V13c-.6.1-1.3-.2-1.3-.2s-.3.7.5 1.2c-.3.5-.8 1.5-2 1.9s.2 1 .8 1c.5 0 .6.3.4.7-.3.4-1 .9-1.3 1.2.5.7 2 1.4 4.4 1.6.3.6.8 1.6 1.6 1.6h.2c.8 0 1.4-.9 1.6-1.6 2.4-.2 3.9-.9 4.4-1.6-.3-.3-1-.8-1.3-1.2-.2-.4-.1-.7.4-.7.6 0 1.3-.4.8-1-1.2-.5-1.7-1.4-2-1.9.8-.5.5-1.2.5-1.2s-.8.3-1.3.2v-.6C20.4 10 18.4 8 16 8Z"/>
    </svg>
  );
}

/* ─── icons ───────────────────────────────────────────────────────────── */

function CheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#28DC4F" fillOpacity="0.15"/>
      <path d="M6.5 10.5l2.5 2.5 4.5-4.5" stroke="#28DC4F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlusCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" fill="none" stroke="#1C1B1F" strokeOpacity="0.35"/>
      <path d="M8 5v6M5 8h6" stroke="#1C1B1F" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid #E5E7EB", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "#9CA3AF", fontSize: 14, lineHeight: 1 }}
    >
      ×
    </button>
  );
}

function CustomUrlIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B61FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

/* ─── platform config ─────────────────────────────────────────────────── */

const PLATFORMS = [
  { key: "whatsapp",  label: "WhatsApp",  Logo: WhatsAppLogo  },
  { key: "linkedin",  label: "LinkedIn",  Logo: LinkedInLogo  },
  { key: "messenger", label: "Messenger", Logo: MessengerLogo },
  { key: "instagram", label: "Instagram", Logo: InstagramLogo },
  { key: "twitter",   label: "Twitter",   Logo: TwitterLogo   },
  { key: "snapchat",  label: "Snapchat",  Logo: SnapchatLogo  },
];

const PLATFORM_KEYS = PLATFORMS.map((p) => p.key);

/* ─── helpers ─────────────────────────────────────────────────────────── */

function generateSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function initPlatforms(socialLinks) {
  const links = socialLinks || {};
  return PLATFORM_KEYS.reduce((acc, key) => {
    acc[key] = { connected: !!links[key], url: links[key] || "", editing: false };
    return acc;
  }, {});
}

/* ─── page ────────────────────────────────────────────────────────────── */

export default function SocialPage() {
  const router = useRouter();

  const [sidebarOpen,        setSidebarOpen]        = useState(false);
  const [initials,           setInitials]           = useState("U");
  const [platforms,          setPlatforms]          = useState(() => initPlatforms(null));
  const [customUrls,         setCustomUrls]         = useState([{ url: "", icon: "" }]);
  const [uploadingIdx,       setUploadingIdx]       = useState(null);
  const pendingIdxRef                               = useRef(null);
  const fileInputRef                                = useRef(null);
  const [hasProfile,         setHasProfile]         = useState(false);
  const [loading,            setLoading]            = useState(true);
  const [saving,             setSaving]             = useState(false);
  const [success,            setSuccess]            = useState(false);
  const [apiError,           setApiError]           = useState("");
  const [previewName,        setPreviewName]        = useState("");
  const [previewDesignation, setPreviewDesignation] = useState("");
  const [previewCompany,     setPreviewCompany]     = useState("");
  const [previewCity,        setPreviewCity]        = useState("");
  const [previewPhone,       setPreviewPhone]       = useState("");
  const [previewEmail,       setPreviewEmail]       = useState("");
  const [previewWebsite,     setPreviewWebsite]     = useState("");
  const [previewProfileImg,  setPreviewProfileImg]  = useState("");
  const [previewCompanyLogo, setPreviewCompanyLogo] = useState("");
  const [previewBizPhone,    setPreviewBizPhone]    = useState("");
  const [previewBizEmail,    setPreviewBizEmail]    = useState("");
  const [previewThemeKey,    setPreviewThemeKey]    = useState("default");
  const [preservedLinks,     setPreservedLinks]     = useState({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("customerToken");
    if (!token) { router.push("/login"); return; }

    const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
    const displayName = stored.full_name || stored.name || "";
    setInitials(
      displayName.split(" ").map((w) => w[0] || "").join("").toUpperCase().slice(0, 2) || "U"
    );

    profileService
      .getMyProfile()
      .then((data) => {
        const p = data?.data?.profile ?? data?.profile ?? data?.data ?? data ?? null;
        if (p) {
          setHasProfile(true);
          setPlatforms(initPlatforms(p.social_links));
          const sl = p.social_links || {};
          const existingUrls = Array.isArray(sl.custom_urls) && sl.custom_urls.length > 0
            ? sl.custom_urls
            : [{ url: "", icon: "" }];
          setCustomUrls(existingUrls);
          setPreviewName(p.name || "");
          setPreviewDesignation(p.designation || "");
          setPreviewCompany(p.company_name || "");
          setPreviewCity(p.city || sl.city || "");
          const raw = p.phone || "";
          setPreviewPhone(raw.startsWith("+91 ") ? `+91 ${raw.slice(4)}` : raw.startsWith("+91") ? raw : raw ? `+91 ${raw}` : "");
          setPreviewEmail(p.email || "");
          setPreviewWebsite(p.website || "");
          setPreviewProfileImg(p.profile_image || "");
          setPreviewCompanyLogo(p.company_logo || "");
          setPreviewBizPhone(sl.work_phone || "");
          setPreviewBizEmail(sl.work_email || "");
          setPreviewThemeKey(p.theme_key || "default");
          setPreservedLinks({
            ...(sl.work_phone  ? { work_phone:  sl.work_phone  } : {}),
            ...(sl.work_email  ? { work_email:  sl.work_email  } : {}),
            ...(sl.city        ? { city:        sl.city        } : {}),
            ...(sl.category    ? { category:    sl.category    } : {}),
          });
        }
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          setApiError("Failed to load profile. Please refresh.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  /* platform helpers */
  function toggleEdit(key) {
    setPlatforms((prev) => ({ ...prev, [key]: { ...prev[key], editing: !prev[key].editing } }));
  }
  function setUrl(key, url) {
    setPlatforms((prev) => ({ ...prev, [key]: { ...prev[key], url } }));
  }
  function savePlatform(key) {
    const url = platforms[key].url.trim();
    if (!url) return;
    setPlatforms((prev) => ({ ...prev, [key]: { connected: true, url, editing: false } }));
  }
  function editConnected(key) {
    setPlatforms((prev) => ({ ...prev, [key]: { ...prev[key], editing: true } }));
  }
  function removePlatform(key) {
    setPlatforms((prev) => ({ ...prev, [key]: { connected: false, url: "", editing: false } }));
  }

  /* custom url helpers */
  function updateCustomUrl(idx, field, value) {
    setCustomUrls((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }
  function addCustomUrl() {
    setCustomUrls((prev) => [...prev, { url: "", icon: "" }]);
  }
  function removeCustomUrl(idx) {
    setCustomUrls((prev) => prev.length === 1 ? [{ url: "", icon: "" }] : prev.filter((_, i) => i !== idx));
  }

  /* icon upload */
  function triggerIconUpload(idx) {
    pendingIdxRef.current = idx;
    fileInputRef.current?.click();
  }

  async function handleIconFile(e) {
    const file = e.target.files?.[0];
    const idx  = pendingIdxRef.current;
    e.target.value = "";
    if (!file || idx === null) return;

    setUploadingIdx(idx);
    try {
      const token = localStorage.getItem("customerToken");
      const fd    = new FormData();
      fd.append("file", file);
      const res  = await fetch("http://localhost:5000/api/uploads/company-logo", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const json = await res.json();
      const url  = json?.url || json?.data?.url || json?.file?.url || "";
      if (url) updateCustomUrl(idx, "icon", url);
    } catch {
      // upload failed silently
    } finally {
      setUploadingIdx(null);
      pendingIdxRef.current = null;
    }
  }

  const handleSave = async () => {
    setApiError("");
    setSuccess(false);
    setSaving(true);

    try {
      const social_links = { ...preservedLinks };
      Object.entries(platforms).forEach(([key, val]) => {
        if (val.connected && val.url.trim()) social_links[key] = val.url.trim();
        else delete social_links[key];
      });
      const filteredUrls = customUrls.filter((item) => item.url.trim());
      if (filteredUrls.length > 0) {
        social_links.custom_urls = filteredUrls.map((item) => ({ url: item.url.trim(), icon: item.icon || null }));
      }

      if (!hasProfile) {
        const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
        const nameFb = stored.full_name || stored.name || "user";
        const slug   = generateSlug(nameFb) || `user-${Date.now()}`;
        await profileService.createProfile({ name: nameFb, slug, social_links });
        setHasProfile(true);
      } else {
        await profileService.updateMyProfile({ social_links });
      }

      router.push("/dashboard/themes");
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const liveProfile = {
    name: previewName,
    email: previewEmail,
    phone: previewPhone,
    profile_image: previewProfileImg || null,
    designation: previewDesignation,
    company_name: previewCompany,
    company_logo: previewCompanyLogo || null,
    website: previewWebsite,
    social_links: {
      ...Object.fromEntries(Object.entries(platforms).filter(([, v]) => v.connected && v.url).map(([k, v]) => [k, v.url])),
      city: previewCity,
      work_phone: previewBizPhone,
      work_email: previewBizEmail,
      custom_urls: customUrls.filter((item) => item.url),
    },
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
        <Sidebar open={false} onClose={() => {}} activeNav="Dashboard" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopHeader onMenuClick={() => {}} initials={initials} />
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#28DC4F] border-t-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Dashboard" />

      {/* hidden file input for icon upload */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleIconFile} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        <div className="flex flex-1 overflow-hidden">
          {/* ── Scrollable main ── */}
          <main className="flex-1 overflow-y-auto px-6 py-6">

            <div className="mb-5">
              <h1 className="text-[24px] font-bold text-[#111827]">Edit Profile</h1>
              <p className="mt-1 text-[14px] text-[#6B7280]">Update your digital card details</p>
            </div>

            <ProfileTabs active="social" />

            <div className="rounded-[16px] border border-[#EBEBEB] bg-white p-8">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-[24px] font-bold text-[#111827]">Social</h2>
                    <p className="mt-2 max-w-[410px] text-[14px] text-[#6B7280]">
                      Add your available social media links. You can add it anytime later too.
                    </p>
                  </div>

                  {apiError && (
                    <div className="rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                      {apiError}
                    </div>
                  )}

                  {/* Platform cards */}
                  <div className="flex flex-col gap-4">
                    {PLATFORMS.map(({ key, label, Logo }) => {
                      const pData = platforms[key];

                      if (pData.connected && !pData.editing) {
                        return (
                          <div key={key} className="flex items-center justify-between rounded-[12px] border border-[#E5E7EB] px-4 py-[16px]">
                            <div className="flex items-center gap-3">
                              <Logo />
                              <span className="text-[16px] font-medium text-black">{label}</span>
                              <CheckCircle />
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={() => editConnected(key)} className="text-[14px] text-[#7B91A3] transition-colors hover:text-[#111827]">
                                Edit
                              </button>
                              <RemoveBtn onClick={() => removePlatform(key)} />
                            </div>
                          </div>
                        );
                      }

                      if (pData.editing) {
                        return (
                          <div key={key} className="rounded-[12px] border border-[#E5E7EB] px-4 py-[16px]">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Logo />
                                <span className="text-[16px] font-medium text-black">{label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => savePlatform(key)}
                                  className="rounded-[8px] px-4 py-[6px] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                                  style={{ background: "#28DC4F" }}
                                >
                                  Save
                                </button>
                                <RemoveBtn onClick={() => removePlatform(key)} />
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3 border-b border-[#E5E7EB] pb-2">
                              <input
                                type="url"
                                className="flex-1 bg-transparent text-[15px] text-black outline-none placeholder:text-[#9CA3AF]"
                                placeholder={`https://${key}.com/yourprofile`}
                                value={pData.url}
                                onChange={(e) => setUrl(key, e.target.value)}
                                autoFocus
                              />
                              <Icon k="mic" size={16} color="#1C1B1F" strokeWidth={1.5} />
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={key} className="flex items-center justify-between rounded-[12px] border border-[#E5E7EB] px-4 py-[16px]">
                          <div className="flex items-center gap-3">
                            <Logo />
                            <span className="text-[16px] font-medium text-black">{label}</span>
                          </div>
                          <button
                            onClick={() => toggleEdit(key)}
                            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#F5F5F5]"
                            aria-label={`Add ${label}`}
                          >
                            <PlusCircle />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Custom URLs */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[15px] font-semibold text-[#111827]">Custom Links</p>
                    {customUrls.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: "10px 14px" }}>
                        {/* Icon upload circle */}
                        <button
                          type="button"
                          onClick={() => triggerIconUpload(idx)}
                          style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px dashed #D1D5DB", background: item.icon ? "transparent" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, overflow: "hidden", position: "relative" }}
                        >
                          {uploadingIdx === idx ? (
                            <svg style={{ animation: "spin 0.75s linear infinite" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="12" cy="12" r="9" strokeOpacity="0.3"/><path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round"/></svg>
                          ) : item.icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.icon} alt="icon" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                          ) : (
                            <CustomUrlIcon />
                          )}
                        </button>

                        {/* URL input */}
                        <input
                          type="url"
                          placeholder="https://yourlink.com"
                          value={item.url}
                          onChange={(e) => updateCustomUrl(idx, "url", e.target.value)}
                          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "#111827" }}
                        />

                        {/* Remove */}
                        <RemoveBtn onClick={() => removeCustomUrl(idx)} />
                      </div>
                    ))}

                    {/* Add More URL */}
                    <button
                      type="button"
                      onClick={addCustomUrl}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "1.5px dashed #28DC4F", borderRadius: 12, padding: "10px 0", background: "transparent", cursor: "pointer", color: "#16A34A", fontSize: 14, fontWeight: 500 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add More URL
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[12px] text-[20px] font-medium text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: "#28DC4F" }}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin" style={{ animationDuration: "0.75s" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
                        <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="16 30" />
                      </svg>
                      Saving...
                    </>
                  ) : "Save Changes"}
                </button>
              </div>
            </div>

            <div className="mt-6 xl:hidden">
              <p className="mb-3 text-[15px] font-semibold text-[#111827]">Profile Preview</p>
              <ProfilePreviewCard profile={liveProfile} themeKey={previewThemeKey} />
            </div>
          </main>

          {/* ── Right preview panel ── */}
          <aside className="hidden w-[400px] shrink-0 overflow-y-auto border-l border-[#EBEBEB] bg-white p-5 xl:block">
            <p className="mb-4 text-[13px] font-semibold text-[#6B7280]">Profile Preview</p>
            <ProfilePreviewCard profile={liveProfile} />
          </aside>
        </div>
      </div>
    </div>
  );
}
