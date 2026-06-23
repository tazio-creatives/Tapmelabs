"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, TopHeader, Icon, inputClass, FormField } from "@/components/dashboard/shared";
import authService from "@/services/authService";
import api from "@/services/api";

/* ─── section card ───────────────────────────────────────────────────────── */

function SectionCard({ title, children }) {
  return (
    <div className="rounded-[16px] border border-[#F0F0F0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {title && <h2 className="mb-5 text-[18px] font-bold text-[#111827]">{title}</h2>}
      {children}
    </div>
  );
}

/* ─── inline alert ───────────────────────────────────────────────────────── */

function Alert({ type, message }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div
      className="flex items-center gap-2 rounded-[10px] px-4 py-3 text-[13px] font-medium"
      style={{
        background: isError ? "rgba(239,68,68,0.08)" : "rgba(40,220,79,0.10)",
        color:      isError ? "#EF4444"              : "#16a34a",
        border:     `1px solid ${isError ? "rgba(239,68,68,0.2)" : "rgba(40,220,79,0.25)"}`,
      }}
    >
      {isError ? (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/></svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l5 5 7-8"/></svg>
      )}
      {message}
    </div>
  );
}

/* ─── save button ────────────────────────────────────────────────────────── */

function SaveButton({ loading, label = "Save Changes" }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-[48px] items-center justify-center gap-2 rounded-[10px] px-8 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      style={{ background: "#28DC4F" }}
    >
      {loading ? (
        <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5"/>
          <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="15 29"/>
        </svg>
      ) : null}
      {label}
    </button>
  );
}

/* ─── account info section ───────────────────────────────────────────────── */

function AccountInfoSection({ user, onSaved }) {
  const [fullName, setFullName] = useState("");
  const [phone,    setPhone]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [status,   setStatus]   = useState(null); // { type, message }

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fullName.trim()) {
      setStatus({ type: "error", message: "Full name is required." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.put("/auth/me", { full_name: fullName.trim(), phone: phone.trim() });
      const updated = res.data?.data?.user;
      if (updated) {
        const stored = authService.getStoredUser() || {};
        authService.saveSession(localStorage.getItem("customerToken"), { ...stored, ...updated });
        onSaved(updated);
      }
      setStatus({ type: "success", message: "Account information updated." });
    } catch (err) {
      setStatus({ type: "error", message: err?.response?.data?.message || "Failed to save changes." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionCard title="Account Information">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Full Name">
            <input
              className={inputClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </FormField>
          <FormField label="Email Address">
            <input
              className={inputClass}
              value={user?.email || ""}
              disabled
              style={{ background: "#F9F9F9", color: "#9CA3AF", cursor: "not-allowed" }}
            />
          </FormField>
          <FormField label="Phone Number">
            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              type="tel"
            />
          </FormField>
        </div>

        {status && <Alert type={status.type} message={status.message} />}

        <div className="flex justify-end">
          <SaveButton loading={loading} />
        </div>
      </form>
    </SectionCard>
  );
}

/* ─── change password section ────────────────────────────────────────────── */

function ChangePasswordSection() {
  const [form,    setForm]    = useState({ current: "", newPwd: "", confirm: "" });
  const [show,    setShow]    = useState({ current: false, newPwd: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState(null);

  function toggle(field) { setShow((s) => ({ ...s, [field]: !s[field] })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.current || !form.newPwd || !form.confirm) {
      setStatus({ type: "error", message: "All fields are required." });
      return;
    }
    if (form.newPwd.length < 8) {
      setStatus({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (form.newPwd !== form.confirm) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await api.post("/auth/change-password", { current_password: form.current, new_password: form.newPwd });
      setStatus({ type: "success", message: "Password changed successfully." });
      setForm({ current: "", newPwd: "", confirm: "" });
    } catch (err) {
      setStatus({ type: "error", message: err?.response?.data?.message || "Failed to change password." });
    } finally {
      setLoading(false);
    }
  }

  function PasswordInput({ field, label, placeholder }) {
    return (
      <FormField label={label}>
        <div className="relative">
          <input
            className={inputClass}
            type={show[field] ? "text" : "password"}
            value={form[field]}
            onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
            placeholder={placeholder}
            style={{ paddingRight: "44px" }}
          />
          <button
            type="button"
            onClick={() => toggle(field)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] transition-colors hover:text-[#374151]"
            aria-label={show[field] ? "Hide password" : "Show password"}
          >
            {show[field] ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 10S14 15 10 15 3 10 3 10 6 5 10 5s7 5 7 5Z"/><circle cx="10" cy="10" r="2"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 10S14 15 10 15 3 10 3 10 6 5 10 5s7 5 7 5Z"/><circle cx="10" cy="10" r="2"/><path d="M3 3l14 14"/>
              </svg>
            )}
          </button>
        </div>
      </FormField>
    );
  }

  return (
    <SectionCard title="Change Password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PasswordInput field="current" label="Current Password"  placeholder="Enter current password" />
          <div className="hidden sm:block" />
          <PasswordInput field="newPwd"  label="New Password"      placeholder="Min. 8 characters" />
          <PasswordInput field="confirm" label="Confirm New Password" placeholder="Repeat new password" />
        </div>

        {status && <Alert type={status.type} message={status.message} />}

        <div className="flex justify-end">
          <SaveButton loading={loading} label="Update Password" />
        </div>
      </form>
    </SectionCard>
  );
}

/* ─── notification settings ─────────────────────────────────────────────── */

function NotificationSettings() {
  const OPTS = [
    { key: "batch",  label: "Every batch",  desc: "Email me every time new leads are scored (up to hourly)" },
    { key: "daily",  label: "Daily digest", desc: "One summary email per day with all scored leads" },
    { key: "hot",    label: "Hot leads only", desc: "Only notify me when a 🔥 HOT lead is scored" },
    { key: "off",    label: "Off",          desc: "No lead scoring emails" },
  ];
  const [pref,    setPref]    = useState("daily");
  const [saved,   setSaved]   = useState(false);

  function save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("leadNotifPref", pref);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // Load preference
  useState(() => {
    if (typeof window !== "undefined") {
      setPref(localStorage.getItem("leadNotifPref") || "daily");
    }
  });

  return (
    <SectionCard title="Lead Notifications">
      <p className="mb-4 text-[13px] text-[#6B7280]">Choose when to receive email alerts for new leads.</p>
      <div className="flex flex-col gap-2 mb-5">
        {OPTS.map(opt => (
          <button key={opt.key} type="button" onClick={() => setPref(opt.key)}
            className="flex items-start gap-3 rounded-xl border p-4 text-left transition-all"
            style={{ borderColor: pref === opt.key ? "#28DC4F" : "#EBEBEB", background: pref === opt.key ? "#F0FFF4" : "#fff" }}>
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
              style={{ borderColor: pref === opt.key ? "#28DC4F" : "#D1D5DB" }}>
              {pref === opt.key && <div className="h-2.5 w-2.5 rounded-full bg-[#28DC4F]" />}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#111827]">{opt.label}</p>
              <p className="text-[12px] text-[#9CA3AF]">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <button onClick={save}
        className="rounded-xl px-6 py-2.5 text-[13px] font-semibold text-black"
        style={{ background: saved ? "#16A34A" : "#28DC4F", color: saved ? "#fff" : "#000" }}>
        {saved ? "✓ Saved" : "Save Preference"}
      </button>
    </SectionCard>
  );
}

/* ─── danger zone ────────────────────────────────────────────────────────── */

function DangerZone() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleLogout() {
    authService.clearSession();
    globalThis.window?.dispatchEvent(new Event("tapme:authchange"));
    router.push("/login");
  }

  return (
    <SectionCard title="Account Actions">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-[48px] w-full items-center gap-3 rounded-[10px] border border-[#E5E7EB] px-4 text-[15px] font-medium text-[#374151] transition-colors hover:bg-[#F9F9F9]"
        >
          <Icon k="logout" size={16} color="#374151" strokeWidth={1.6} />
          Sign out of your account
        </button>
      </div>
    </SectionCard>
  );
}

/* ─── page ───────────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const router  = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user,         setUser]        = useState(null);

  useEffect(() => {
    const stored = authService.getStoredUser();
    if (!stored) { router.replace("/login"); return; }
    setUser(stored);

    api.get("/auth/me").then((res) => {
      const fresh = res.data?.data?.user;
      if (fresh) {
        setUser(fresh);
        authService.saveSession(localStorage.getItem("customerToken"), fresh);
      }
    }).catch(() => {});
  }, [router]);

  const initials = user?.full_name
    ? user.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F9F9]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav="Settings" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} initials={initials} />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-[24px] font-bold text-[#111827]">Settings</h1>
            <p className="mt-1 text-[14px] text-[#6B7280]">Manage your account preferences and security.</p>
          </div>

          <div className="flex flex-col gap-5 max-w-[760px]">
            <AccountInfoSection user={user} onSaved={(u) => setUser((prev) => ({ ...prev, ...u }))} />
            <ChangePasswordSection />
            <NotificationSettings />
            <DangerZone />
          </div>
        </main>
      </div>
    </div>
  );
}
