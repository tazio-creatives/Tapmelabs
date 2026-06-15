"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import profileService from "@/services/profileService";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    // If already on setup page, skip the check so the form can load
    if (window.location.pathname.startsWith("/dashboard/profile/setup")) return;

    // Check whether profile setup has been completed
    profileService.getMyProfile()
      .then((result) => {
        const profile = result?.data?.profile;
        if (!profile?.name || !profile?.slug) {
          router.replace("/dashboard/profile/setup");
        }
      })
      .catch((err) => {
        // No profile record yet (404) → send to setup
        if (err.response?.status === 404) {
          router.replace("/dashboard/profile/setup");
        }
        // Other errors (network, 500) — let the page handle them
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (typeof window !== "undefined" && !localStorage.getItem("customerToken")) {
    return null;
  }

  return <>{children}</>;
}
