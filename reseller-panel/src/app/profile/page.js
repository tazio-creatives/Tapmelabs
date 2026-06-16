"use client";
import { useEffect, useState } from "react";
import ResellerLayout from "@/components/ResellerLayout";
import api from "@/services/api";

export default function ProfilePage() {
  const [profile, setProfile]   = useState(null);
  const [form, setForm]         = useState({ full_name: "", email: "", phone: "" });
  const [pwForm, setPwForm]     = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [pwMsg, setPwMsg]           = useState({ type: "", text: "" });
  const [saving, setSaving]         = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    api.get("/reseller/profile")
      .then((r) => {
        setProfile(r.data);
        setForm({ full_name: r.data.full_name || "", email: r.data.email || "", phone: r.data.phone || "" });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setSaving(true);
    try {
      const { data } = await api.patch("/reseller/profile", form);
      setProfile(data);
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwMsg({ type: "", text: "" });
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwMsg({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    setChangingPw(true);
    try {
      await api.patch("/reseller/profile/password", {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      setPwMsg({ type: "success", text: "Password changed successfully." });
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.response?.data?.message || "Failed to change password" });
    } finally {
      setChangingPw(false);
    }
  }

  const inp = "w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#28DC4F] transition-colors";

  if (loading) {
    return <ResellerLayout><div className="text-[13px] text-[#6B7280]">Loading…</div></ResellerLayout>;
  }

  return (
    <ResellerLayout>
      <div className="max-w-xl mx-auto space-y-5">
        <div>
          <h2 className="text-[18px] font-bold text-[#111827]">My Profile</h2>
          <p className="text-[13px] text-[#6B7280]">Manage your account information</p>
        </div>

        {/* Account info card */}
        {profile && (
          <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#28DC4F] flex items-center justify-center text-black font-black text-[18px] shrink-0">
              {profile.full_name?.charAt(0)?.toUpperCase() || "R"}
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#111827]">{profile.full_name}</p>
              <p className="text-[12px] text-[#6B7280]">{profile.email}</p>
              <span className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${profile.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {profile.status}
              </span>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[11px] text-[#9CA3AF]">Commission Rate</p>
              <p className="text-[20px] font-black text-[#7C3AED]">{profile.commission_rate}%</p>
            </div>
          </div>
        )}

        {/* Edit profile */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="text-[14px] font-semibold text-[#111827] mb-4">Edit Profile</h3>
          {profileMsg.text && (
            <div className={`mb-4 p-3 rounded-lg text-[13px] border ${profileMsg.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
              {profileMsg.text}
            </div>
          )}
          <form onSubmit={handleProfileSave} className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Full Name</label>
              <input className={inp} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Email</label>
              <input className={inp} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Phone</label>
              <input className={inp} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <button type="submit" disabled={saving}
              className="w-full bg-[#28DC4F] text-black font-semibold text-[13px] py-2.5 rounded-lg hover:bg-[#22c946] transition-colors disabled:opacity-60">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
          <h3 className="text-[14px] font-semibold text-[#111827] mb-4">Change Password</h3>
          {pwMsg.text && (
            <div className={`mb-4 p-3 rounded-lg text-[13px] border ${pwMsg.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
              {pwMsg.text}
            </div>
          )}
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Current Password</label>
              <input className={inp} type="password" value={pwForm.current_password}
                onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
                placeholder="Current password" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">New Password</label>
              <input className={inp} type="password" value={pwForm.new_password}
                onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Confirm New Password</label>
              <input className={inp} type="password" value={pwForm.confirm_password}
                onChange={(e) => setPwForm({ ...pwForm, confirm_password: e.target.value })}
                placeholder="Repeat new password" />
            </div>
            <button type="submit" disabled={changingPw}
              className="w-full bg-[#111827] text-white font-semibold text-[13px] py-2.5 rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-60">
              {changingPw ? "Changing…" : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </ResellerLayout>
  );
}
