"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("customerToken")) {
      router.replace("/login");
    }
  }, [router]);

  if (typeof window !== "undefined" && !localStorage.getItem("customerToken")) {
    return null;
  }

  return <>{children}</>;
}
