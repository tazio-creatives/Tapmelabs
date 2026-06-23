"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import orderService from "@/services/orderService";
import profileService from "@/services/profileService";
import PaymentModal from "@/components/PaymentModal";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn,       setIsLoggedIn]       = useState(false);
  const [hasPaidOrder,     setHasPaidOrder]     = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUserMenu,     setShowUserMenu]     = useState(false);
  const [userName,         setUserName]         = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    async function syncAuth() {
      const token = localStorage.getItem("customerToken");
      setIsLoggedIn(Boolean(token));

      if (!token) {
        setHasPaidOrder(false);
        sessionStorage.removeItem("tapme:hasPaidOrder");
        sessionStorage.removeItem("tapme:hasProfile");
        return;
      }

      // 1. Check if user already has a completed profile (fastest signal)
      const cachedProfile = sessionStorage.getItem("tapme:hasProfile");
      if (cachedProfile === "true") {
        setHasPaidOrder(true);
        return;
      }

      // 2. Check sessionStorage cache for paid order
      const cached = sessionStorage.getItem("tapme:hasPaidOrder");
      if (cached === "true") {
        setHasPaidOrder(true);
        return;
      }

      // 3. Fetch from API — check profile existence first (most authoritative)
      try {
        await profileService.getMyProfile();
        // Profile exists → user has completed setup
        sessionStorage.setItem("tapme:hasProfile", "true");
        sessionStorage.setItem("tapme:hasPaidOrder", "true");
        setHasPaidOrder(true);
        return;
      } catch {
        // No profile yet — fall through to order check
      }

      // 4. Check for paid orders (fallback for users mid-flow)
      try {
        const res    = await orderService.getMyOrders();
        const orders = res?.data?.orders ?? [];
        const paid   = orders.some((o) => o.payment_status === "paid");
        sessionStorage.setItem("tapme:hasPaidOrder", String(paid));
        setHasPaidOrder(paid);
      } catch {
        setHasPaidOrder(false);
      }
    }

    syncAuth();
    // Load user name from localStorage
    try {
      const u = JSON.parse(localStorage.getItem("customerUser") || "{}");
      setUserName(u.full_name || u.name || "");
    } catch {}

    globalThis.window?.addEventListener("tapme:authchange", syncAuth);
    return () => globalThis.window?.removeEventListener("tapme:authchange", syncAuth);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleProfileClick(e) {
    e.preventDefault();
    if (!isLoggedIn) { router.push("/login"); return; }
    if (hasPaidOrder) { router.push("/dashboard"); return; }
    setShowPaymentModal(true);
  }

  function logout() {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");
    sessionStorage.removeItem("tapme:hasPaidOrder");
    sessionStorage.removeItem("tapme:hasProfile");
    setIsLoggedIn(false);
    setHasPaidOrder(false);
    setShowUserMenu(false);
    setUserName("");
    window.dispatchEvent(new Event("tapme:authchange"));
    router.push("/");
  }

  const initials = userName ? userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "U";
  const navLabel = !isLoggedIn ? "Profile Login" : hasPaidOrder ? "Dashboard" : "Complete Profile";

  return (
  <>
    <header className="sticky top-0 z-50 flex w-full items-center justify-center border-b border-[#EEEEEE] bg-white shadow-[0_4px_10px_0_rgba(0,0,0,0.10)]">
      <div className="flex w-full max-w-[1440px] items-center justify-center px-4 py-[15px] md:px-[120px] md:pb-[17px]">
        <div className="flex w-full items-center justify-between">
          {/* Left Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-[10px]">
            <Image
              src="/images/logo.svg"
              alt="TapMe Lab Logo"
              width={40}
              height={40}
              priority
              className="h-[40px] w-[40px]"
            />

            <Image
              src="/images/logo-text.svg"
              alt="TapMe Labs"
              width={155}
              height={14}
              priority
              className="h-auto w-[155px]"
            />
          </Link>

          {/* Right Menu */}
          <div className="hidden items-center justify-end gap-[30px] md:flex">
            <nav className="flex items-center gap-[30px] px-2 py-[7px]">
              <a href="/#home" className="text-[15px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black">Home</a>
              <a href="/#products" className="text-[14.6px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black">Products</a>
              <a href="/#contact" className="text-[14.8px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black">Contact Us</a>

              {/* Auth nav item */}
              {!isLoggedIn ? (
                <a href="/login" className="text-[14.8px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black">
                  Profile Login
                </a>
              ) : (
                <div ref={menuRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setShowUserMenu(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
                  >
                    {/* Avatar */}
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#28DC4F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#000" }}>
                      {initials}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{navLabel}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: "transform 0.2s", transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)" }}>
                      <path d="M2 4l4 4 4-4" stroke="#6D6D6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 10px)", right: 0, minWidth: 180,
                      background: "#fff", borderRadius: 12, border: "1px solid #F0F0F0",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 100, overflow: "hidden",
                    }}>
                      {userName && (
                        <div style={{ padding: "12px 16px", borderBottom: "1px solid #F5F5F5" }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{userName}</p>
                        </div>
                      )}
                      <button
                        onClick={() => { setShowUserMenu(false); handleProfileClick({ preventDefault: () => {} }); }}
                        style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", fontSize: 13, color: "#374151", background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        {hasPaidOrder ? "My Dashboard" : "Complete Profile"}
                      </button>
                      {hasPaidOrder && (
                        <button
                          onClick={() => { setShowUserMenu(false); router.push("/dashboard/orders"); }}
                          style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", fontSize: 13, color: "#374151", background: "none", border: "none", cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >
                          My Orders
                        </button>
                      )}
                      <div style={{ height: 1, background: "#F5F5F5", margin: "4px 0" }} />
                      <button
                        onClick={logout}
                        style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", fontSize: 13, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Mobile — auth button */}
          {!isLoggedIn ? (
            <a
              href="/login"
              className="flex h-[36px] shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] px-4 text-[13px] font-medium text-[#111827] md:hidden"
            >
              Profile Login
            </a>
          ) : (
            <div className="md:hidden" style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserMenu(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #E5E7EB", borderRadius: 99, padding: "4px 12px 4px 6px", cursor: "pointer" }}
              >
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#28DC4F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000" }}>
                  {initials}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{navLabel}</span>
              </button>
              {showUserMenu && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 160,
                  background: "#fff", borderRadius: 12, border: "1px solid #F0F0F0",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden",
                }}>
                  <button onClick={() => { setShowUserMenu(false); handleProfileClick({ preventDefault: () => {} }); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", fontSize: 13, color: "#374151", background: "none", border: "none", cursor: "pointer" }}>
                    {hasPaidOrder ? "My Dashboard" : "Complete Profile"}
                  </button>
                  {hasPaidOrder && (
                    <button onClick={() => { setShowUserMenu(false); router.push("/dashboard/orders"); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", fontSize: 13, color: "#374151", background: "none", border: "none", cursor: "pointer" }}>
                      My Orders
                    </button>
                  )}
                  <div style={{ height: 1, background: "#F5F5F5" }} />
                  <button onClick={logout}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", fontSize: 13, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>

    {showPaymentModal && (
      <PaymentModal
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          setHasPaidOrder(true);
          sessionStorage.setItem("tapme:hasPaidOrder", "true");
          router.push("/dashboard");
        }}
      />
    )}
  </>
  );
}
