"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authService.login(form.email, form.password);

      const { token, user } = res.data;

      // TODO: Replace localStorage with httpOnly cookie session for production.
      // Storing JWTs in localStorage is convenient but exposes them to XSS.
      // Consider using a server-side session or Next.js middleware with cookies.
      if (user.role !== "admin") {
        setError("You are not allowed to access admin panel.");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      router.push("/dashboard");
    } catch (err) {
      // err.response.data is the backend { success, message, data } shape
      const message =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-[400px] px-4">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-black"
            style={{ background: "#28DC4F" }}
          >
            T
          </div>
          <div className="text-center">
            <h1 className="text-[22px] font-bold text-slate-900">TapMe Admin</h1>
            <p className="mt-1 text-[13px] text-slate-500">Sign in to your admin account</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm" style={{ border: "1px solid #E2E8F0" }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-[13px] text-red-600" style={{ border: "1px solid #FECACA" }}>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="admin@tapmelabs.com"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-[14px] text-slate-900 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 items-center justify-center rounded-lg text-[14px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "#28DC4F" }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
