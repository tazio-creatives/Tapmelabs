"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CropImageModal from "@/components/dashboard/CropImageModal";
import {
  Icon,
  Sidebar,
  TopHeader,
  ProfilePreviewCard,
  ProfileTabs,
  FormField,
  inputClass,
} from "@/components/dashboard/shared";
import profileService from "@/services/profileService";
import api from "@/services/api";

const CATEGORIES = [
  "Holidays", "Technology", "Finance", "Healthcare", "Education",
  "Real Estate", "Retail", "Hospitality", "Marketing", "Consulting",
];

function generateSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default function BusinessPage() {
  const router = useRouter();

  const [sidebarOpen,       setSidebarOpen]       = useState(false);
  const [initials,          setInitials]          = useState("U");
  const [designation,       setDesignation]       = useState("");
  const [company,           setCompany]           = useState("");
  const [city,              setCity]              = useState("");
  const [website,           setWebsite]           = useState("");
  const [workPhone,         setWorkPhone]         = useState("");
  const [workEmail,         setWorkEmail]         = useState("");
  const [category,          setCategory]          = useState("Holidays");
  const [companyLogo,       setCompanyLogo]       = useState("");
  const [hasProfile,        setHasProfile]        = useState(false);
  const [loading,           setLoading]           = useState(true);
  const [saving,            setSaving]            = useState(false);
  const [apiError,          setApiError]          = useState("");
  const [uploading,         setUploading]         = useState(false);
  const [uploadError,       setUploadError]       = useState("");
  const [cropState,         setCropState]         = useState(null);
  const [socialLinks,       setSocialLinks]       = useState({});
  /* preview-only — from Basics step */
  const [previewName,       setPreviewName]       = useState("");
  const [previewPhone,      setPreviewPhone]      = useState("");
  const [previewEmail,      setPreviewEmail]      = useState("");
  const [previewProfileImg, setPreviewProfileImg] = useState("");

  const fileInputRef = useRef(null);

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
          setDesignation(p.designation || "");
          setCompany(p.company_name || "");
          setCity(p.city || p.social_links?.city || "");
          setWebsite(p.website || "");
          setCompanyLogo(p.company_logo || "");
          if (p.category && CATEGORIES.includes(p.category)) setCategory(p.category);

          const sl = p.social_links || {};
          setSocialLinks(sl);
          setWorkPhone(sl.work_phone || "");
          setWorkEmail(sl.work_email || "");

          setPreviewName(p.name || "");
          const raw = p.phone || "";
          setPreviewPhone(raw.startsWith("+91 ") ? `+91 ${raw.slice(4)}` : raw.startsWith("+91") ? raw : raw ? `+91 ${raw}` : "");
          setPreviewEmail(p.email || "");
          setPreviewProfileImg(p.profile_image || "");
        }
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          setApiError("Failed to load profile. Please refresh.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    const imageSrc = URL.createObjectURL(file);
    setCropState({
      imageSrc,
      aspect: 3 / 1,
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
          if (url) setCompanyLogo(url);
        } catch (err) {
          setUploadError(err.response?.data?.message || "Upload failed. Please try again.");
        } finally {
          setUploading(false);
        }
      },
    });
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

  const handleNext = async () => {
    setApiError("");
    setSaving(true);

    try {
      const mergedSocialLinks = {
        ...socialLinks,
        city:       city.trim()      || null,
        work_phone: workPhone.trim() || null,
        work_email: workEmail.trim() || null,
      };

      const payload = {
        designation:  designation.trim(),
        company_name: company.trim(),
        city:         city.trim(),
        website:      website.trim(),
        company_logo: companyLogo || null,
        social_links: mergedSocialLinks,
      };

      if (!hasProfile) {
        const stored = JSON.parse(localStorage.getItem("customerUser") || "{}");
        const nameFb = stored.full_name || stored.name || "user";
        const slug   = generateSlug(nameFb) || `user-${Date.now()}`;
        await profileService.createProfile({ name: nameFb, slug, ...payload });
        setHasProfile(true);
      } else {
        await profileService.updateMyProfile(payload);
      }

      router.push("/dashboard/profile/social");
    } catch (err) {
      setApiError(
        err.response?.data?.message || err.message || "Failed to save. Please try again."
      );
      setSaving(false);
    }
  };

  const previewSocials = ["whatsapp", "linkedin", "messenger", "instagram", "twitter", "snapchat"]
    .filter((k) => !!socialLinks[k]);

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
    <>
      <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Dashboard" />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

          <div className="flex flex-1 overflow-hidden">
            {/* ── Scrollable main ── */}
            <main className="flex-1 overflow-y-auto px-6 py-6">

              <div className="mb-5">
                <h1 className="text-[24px] font-bold text-[#111827]">Edit Profile</h1>
                <p className="mt-1 text-[14px] text-[#6B7280]">Update your digital card details</p>
              </div>

              <ProfileTabs active="business" />

              <div className="rounded-[16px] border border-[#EBEBEB] bg-white p-8">
                <div className="flex flex-col gap-8">

                  <div className="flex flex-col gap-6">
                    <div>
                      <h2 className="text-[24px] font-bold text-[#111827]">Business</h2>
                      <p className="mt-2 max-w-[410px] text-[14px] text-[#6B7280]">
                        Your company, designation and all other relevant details to show up in your card.
                      </p>
                    </div>

                    {apiError && (
                      <div className="rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                        {apiError}
                      </div>
                    )}

                    {/* Logo upload */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-[16px] bg-[#F9FAFB] transition-colors hover:bg-[#F0FDF4]"
                        style={{ width: "125px", height: "125px", border: "1px solid #E5E7EB" }}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        title="Click to upload business logo"
                      >
                        {uploading ? (
                          <svg className="animate-spin" style={{ animationDuration: "0.75s" }} width="28" height="28" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="7" stroke="rgba(40,220,79,0.25)" strokeWidth="2.5" />
                            <circle cx="9" cy="9" r="7" stroke="#28DC4F" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 29" />
                          </svg>
                        ) : companyLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={companyLogo} alt="Company logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
                        ) : (
                          <Icon k="building" size={36} color="#9CA3AF" strokeWidth={1.4} />
                        )}
                      </div>

                      <button
                        type="button"
                        className="text-[16px] font-medium text-[#28DC4F] transition-opacity hover:opacity-80"
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {companyLogo ? "Change Logo" : "+ Business Logo / Icon"}
                      </button>

                      {uploadError && <p className="text-[12px] text-[#EF4444]">{uploadError}</p>}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col gap-[10px]">
                      <FormField label="Designation">
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Digital Transformation VP"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                        />
                      </FormField>

                      <FormField label="Company Name">
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Maxview Holidays"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                      </FormField>

                      <FormField label="City">
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Mumbai, India."
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </FormField>

                      <FormField label="Website">
                        <input
                          type="url"
                          className={inputClass}
                          placeholder="www.company.in"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      </FormField>

                      <FormField label="Work Phone">
                        <input
                          type="tel"
                          className={inputClass}
                          placeholder="+91 98765 43210"
                          value={workPhone}
                          onChange={(e) => setWorkPhone(e.target.value)}
                        />
                      </FormField>

                      <FormField label="Work Email">
                        <input
                          type="email"
                          className={inputClass}
                          placeholder="work@company.com"
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                        />
                      </FormField>

                      <FormField label="Business Category">
                        <div className="relative">
                          <select
                            className={`${inputClass} appearance-none pr-10`}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                            <Icon k="chevron_down" size={18} color="#6B7280" />
                          </div>
                        </div>
                      </FormField>
                    </div>
                  </div>

                  {/* Next button */}
                  <button
                    onClick={handleNext}
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
                    ) : "Next"}
                  </button>
                </div>
              </div>

              {/* Mobile preview */}
              <div className="mt-6 xl:hidden">
                <p className="mb-3 text-[15px] font-semibold text-[#111827]">Profile Preview</p>
                <ProfilePreviewCard
                  name={previewName}
                  phone={previewPhone}
                  email={previewEmail}
                  designation={designation}
                  company={company}
                  city={city}
                  website={website}
                  profileImage={previewProfileImg || null}
                  companyLogo={companyLogo || null}
                  bizPhone={workPhone || null}
                  bizEmail={workEmail || null}
                  connectedSocials={previewSocials}
                />
              </div>
            </main>

            {/* ── Right preview panel ── */}
            <aside className="hidden w-[400px] shrink-0 overflow-y-auto border-l border-[#EBEBEB] bg-white p-5 xl:block">
              <p className="mb-4 text-[13px] font-semibold text-[#6B7280]">Profile Preview</p>
              <ProfilePreviewCard
                name={previewName}
                phone={previewPhone}
                email={previewEmail}
                designation={designation}
                company={company}
                city={city}
                website={website}
                profileImage={previewProfileImg || null}
                companyLogo={companyLogo || null}
                bizPhone={workPhone || null}
                bizEmail={workEmail || null}
                connectedSocials={previewSocials}
              />
            </aside>
          </div>
        </div>
      </div>

      {/* Crop modal — sibling to avoid z-index conflicts */}
      {cropState && (
        <CropImageModal
          imageSrc={cropState.imageSrc}
          aspect={cropState.aspect}
          title="Crop Business Logo"
          filename="logo.jpg"
          onCancel={closeCrop}
          onApply={handleCropApply}
        />
      )}
    </>
  );
}
