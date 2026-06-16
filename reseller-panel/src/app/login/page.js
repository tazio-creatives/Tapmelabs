"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authService.login(form);
      localStorage.setItem("resellerToken",        data.token);
      localStorage.setItem("resellerRefreshToken", data.refresh_token);
      router.replace("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-[380px]">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#28DC4F] flex items-center justify-center text-white font-black text-xl">T</div>
          <div>
            <p className="text-[15px] font-bold text-[#111827] leading-tight">TapMe Labs</p>
            <p className="text-[11px] text-[#6B7280]">Reseller Portal</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h1 className="text-[18px] font-bold text-[#111827] mb-1">Welcome back</h1>
          <p className="text-[13px] text-[#6B7280] mb-6">Sign in to your reseller account</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#28DC4F] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#374151] mb-1">Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#28DC4F] transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#28DC4F] text-black font-semibold text-[14px] py-2.5 rounded-lg hover:bg-[#22c946] transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-[#9CA3AF] mt-6">
          Don&apos;t have an account? Contact TapMe Labs admin.
        </p>
      </div>
    </div>
  );
}
