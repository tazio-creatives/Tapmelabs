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

function generateSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export default function BasicsPage() {
  const router = useRouter();

  const [sidebarOpen,        setSidebarOpen]        = useState(false);
  const [initials,           setInitials]           = useState("U");
  const [name,               setName]               = useState("");
  const [email,              setEmail]              = useState("");
  const [phone,              setPhone]              = useState("");
  const [profileImage,       setProfileImage]       = useState("");
  const [hasProfile,         setHasProfile]         = useState(false);
  const [loading,            setLoading]            = useState(true);
  const [saving,             setSaving]             = useState(false);
  const [apiError,           setApiError]           = useState("");
  const [uploading,          setUploading]          = useState(false);
  const [uploadError,        setUploadError]        = useState("");
  const [cropState,          setCropState]          = useState(null);
  /* preview-only fields fetched from API but edited on other tabs */
  const [previewDesignation, setPreviewDesignation] = useState("");
  const [previewCompany,     setPreviewCompany]     = useState("");
  const [previewCity,        setPreviewCity]        = useState("");
  const [previewWebsite,     setPreviewWebsite]     = useState("");
  const [previewSocials,     setPreviewSocials]     = useState([]);

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
          setName(p.name || "");
          setEmail(p.email || "");
          const raw = p.phone || "";
          setPhone(raw.startsWith("+91 ") ? raw.slice(4) : raw.startsWith("+91") ? raw.slice(3) : raw);
          setProfileImage(p.profile_image || "");
          setPreviewDesignation(p.designation || "");
          setPreviewCompany(p.company_name || "");
          setPreviewCity(p.city || p.social_links?.city || "");
          setPreviewWebsite(p.website || "");
          const sl = p.social_links || {};
          const SOCIAL_KEYS = ["whatsapp", "linkedin", "messenger", "instagram", "twitter", "snapchat"];
          setPreviewSocials(SOCIAL_KEYS.filter((k) => !!sl[k]));
        }
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          setApiError("Failed to load profile. Please refresh.");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = "";
    const imageSrc = URL.createObjectURL(file);
    setCropState({
      imageSrc,
      aspect: 1,
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
          if (url) setProfileImage(url);
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
      const payload = {
        name:          name.trim(),
        email:         email.trim(),
        phone:         phone.trim(),
        profile_image: profileImage,
      };

      if (!hasProfile) {
        const stored     = JSON.parse(localStorage.getItem("customerUser") || "{}");
        const slugBase   = name.trim() || stored.full_name || "user";
        const slug       = generateSlug(slugBase) || `user-${Date.now()}`;
        await profileService.createProfile({ ...payload, slug });
        setHasProfile(true);
      } else {
        await profileService.updateMyProfile(payload);
      }

      router.push("/dashboard/profile/business");
    } catch (err) {
      setApiError(
        err.response?.data?.message || err.message || "Failed to save. Please try again."
      );
      setSaving(false);
    }
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
    <>
      <div className="flex h-screen overflow-hidden bg-[#F7F8F9]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Dashboard" />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

          <div className="flex flex-1 overflow-hidden">
            {/* ── Scrollable main ── */}
            <main className="flex-1 overflow-y-auto px-6 py-6">

              {/* Page heading */}
              <div className="mb-5">
                <h1 className="text-[24px] font-bold text-[#111827]">Edit Profile</h1>
                <p className="mt-1 text-[14px] text-[#6B7280]">Update your digital card details</p>
              </div>

              {/* Tabs */}
              <ProfileTabs active="basics" />

              {/* Form card */}
              <div className="rounded-[16px] border border-[#EBEBEB] bg-white p-8">
                <div className="flex flex-col gap-8">

                  <div className="flex flex-col gap-6">

                    {/* Section heading */}
                    <div>
                      <h2 className="text-[24px] font-bold text-[#111827]">Basics</h2>
                      <p className="mt-2 max-w-[410px] text-[14px] text-[#6B7280]">
                        Share your best shot. These details will reflect in your card. Yes, you can edit it later too.
                      </p>
                    </div>

                    {/* Error banner */}
                    {apiError && (
                      <div className="rounded-[8px] border border-[#FEE2E2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#EF4444]">
                        {apiError}
                      </div>
                    )}

                    {/* Photo upload */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-[16px] bg-[#F9FAFB] transition-colors hover:bg-[#F0FDF4]"
                        style={{ width: "125px", height: "125px", border: "1px solid #E5E7EB" }}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        title="Click to upload profile photo"
                      >
                        {uploading ? (
                          <svg className="animate-spin" style={{ animationDuration: "0.75s" }} width="28" height="28" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="7" stroke="rgba(40,220,79,0.25)" strokeWidth="2.5" />
                            <circle cx="9" cy="9" r="7" stroke="#28DC4F" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 29" />
                          </svg>
                        ) : profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Icon k="camera" size={36} color="#9CA3AF" strokeWidth={1.4} />
                        )}
                      </div>

                      <button
                        type="button"
                        className="text-[16px] font-medium text-[#28DC4F] transition-opacity hover:opacity-80"
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {profileImage ? "Change Photo" : "+ Add Photo"}
                      </button>

                      {uploadError && (
                        <p className="text-[12px] text-[#EF4444]">{uploadError}</p>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col gap-[10px]">
                      <FormField label="Name">
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="Maya Iyengar"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FormField>

                      <FormField label="Email ID">
                        <input
                          type="email"
                          className={inputClass}
                          placeholder="maya.iyengar@maxview.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </FormField>

                      <FormField label="Phone number">
                        <div className="flex h-[48px] overflow-hidden rounded-[10px] border border-[#E5E7EB]">
                          <div className="flex shrink-0 items-center gap-2 border-r border-[#E5E7EB] bg-[#F9FAFB] px-3">
                            <span style={{ fontSize: "18px" }}>🇮🇳</span>
                            <span className="text-[14px] font-medium text-[#374151]">+91</span>
                          </div>
                          <input
                            type="tel"
                            className="flex-1 bg-white px-4 text-[16px] text-black outline-none placeholder:text-[#9CA3AF] focus:bg-white"
                            placeholder="99988 77766"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
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
                  name={name}
                  email={email}
                  phone={phone ? `+91 ${phone}` : ""}
                  designation={previewDesignation}
                  company={previewCompany}
                  city={previewCity}
                  website={previewWebsite}
                  profileImage={profileImage || null}
                  connectedSocials={previewSocials}
                />
              </div>
            </main>

            {/* ── Right preview panel — desktop only ── */}
            <aside className="hidden w-[400px] shrink-0 overflow-y-auto border-l border-[#EBEBEB] bg-white p-5 xl:block">
              <p className="mb-4 text-[13px] font-semibold text-[#6B7280]">Profile Preview</p>
              <ProfilePreviewCard
                name={name}
                email={email}
                phone={phone ? `+91 ${phone}` : ""}
                designation={previewDesignation}
                company={previewCompany}
                city={previewCity}
                website={previewWebsite}
                profileImage={profileImage || null}
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
          title="Crop Profile Photo"
          filename="photo.jpg"
          onCancel={closeCrop}
          onApply={handleCropApply}
        />
      )}
    </>
  );
}
