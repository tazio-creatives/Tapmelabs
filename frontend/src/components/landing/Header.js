"use client";

import { useState, useEffect } from "react";
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
    globalThis.window?.addEventListener("tapme:authchange", syncAuth);
    return () => globalThis.window?.removeEventListener("tapme:authchange", syncAuth);
  }, []);

  function handleProfileClick(e) {
    e.preventDefault();
    if (!isLoggedIn) { router.push("/login"); return; }
    if (hasPaidOrder) { router.push("/dashboard"); return; }
    setShowPaymentModal(true);
  }

  const navLabel = !isLoggedIn ? "Profile Login" : hasPaidOrder ? "Dashboard" : "Complete Profile";
  const navHref  = !isLoggedIn ? "/login"        : hasPaidOrder ? "/dashboard" : "#";

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

          {/* Right Menu + Cart */}
          <div className="hidden items-center justify-end gap-[30px] md:flex">
            <nav className="flex items-center gap-[30px] px-2 py-[7px]">
              <a
                href="/#home"
                className="text-[15px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black"
              >
                Home
              </a>

              <a
                href="/#products"
                className="text-[14.6px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black"
              >
                Products
              </a>

              <a
                href="/#contact"
                className="text-[14.8px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black"
              >
                Contact Us
              </a>

              <a
                href={navHref}
                onClick={handleProfileClick}
                className="text-[14.8px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black"
              >
                {navLabel}
              </a>
            </nav>

          </div>

          {/* Mobile Login button */}
          <a
            href={navHref}
            onClick={handleProfileClick}
            className="flex h-[36px] shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] px-4 text-[13px] font-medium text-[#111827] md:hidden"
          >
            {navLabel}
          </a>
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
