"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import authService from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

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
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F7FA", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>

      <div style={{ width: "100%", maxWidth: 400, position: "relative" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 40 }}>
          <Image src="/images/logo.svg" alt="TapMe Labs" width={52} height={52} />
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Image src="/images/logo-text.svg" alt="TapMe Labs" width={140} height={13} />
            <span style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.04em" }}>Reseller Portal</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6, marginBottom: 32 }}>Sign in to your reseller account</p>

          {error && (
            <div style={{ background: "#1a0a0a", border: "1px solid #3a1212", borderRadius: 10, padding: "10px 14px", marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#777" }}>Email address</label>
              <input
                type="email" required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{
                  background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10,
                  padding: "12px 14px", color: "#111827", fontSize: 13, outline: "none",
                  width: "100%", boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.borderColor = "#28DC4F"}
                onBlur={(e)  => e.target.style.borderColor = "#E5E7EB"}
              />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: "#777" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10,
                    padding: "12px 42px 12px 14px", color: "#111827", fontSize: 13, outline: "none",
                    width: "100%", boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#28DC4F"}
                  onBlur={(e)  => e.target.style.borderColor = "#E5E7EB"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0, display: "flex" }}>
                  {showPw ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                marginTop: 4,
                width: "100%", background: loading ? "#1a5c2a" : "#28DC4F",
                border: "none", borderRadius: 10, padding: "13px 0",
                color: loading ? "#4a9a5a" : "#000", fontWeight: 700,
                fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 24 }}>
          Don&apos;t have an account?{" "}
          <span style={{ color: "#6B7280" }}>Contact TapMe Labs admin.</span>
        </p>
      </div>
    </div>
  );
}
