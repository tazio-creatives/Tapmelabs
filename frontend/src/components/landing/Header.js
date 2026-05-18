"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    function syncAuth() {
      setIsLoggedIn(Boolean(localStorage.getItem("customerToken")));
    }
    syncAuth();
    globalThis.window?.addEventListener("tapme:authchange", syncAuth);
    return () => globalThis.window?.removeEventListener("tapme:authchange", syncAuth);
  }, []);

  function handleProfileClick(e) {
    e.preventDefault();
    router.push(localStorage.getItem("customerToken") ? "/dashboard" : "/login");
  }

  return (
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
                href="#home"
                className="text-[15px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black"
              >
                Home
              </a>

              <a
                href="#products"
                className="text-[14.6px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black"
              >
                Products
              </a>

              <a
                href="#contact"
                className="text-[14.8px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black"
              >
                Contact Us
              </a>

              <a
                href={isLoggedIn ? "/dashboard" : "/login"}
                onClick={handleProfileClick}
                className="text-[14.8px] font-medium leading-[22.4px] tracking-[-0.64px] text-[#6D6D6D] transition-colors hover:text-black"
              >
                {isLoggedIn ? "Dashboard" : "Profile Login"}
              </a>
            </nav>

            <Link
              href="/cart"
              aria-label="Cart"
              className="flex h-[40px] w-[40px] shrink-0 items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="41"
                viewBox="0 0 41 41"
                fill="none"
              >
                <rect
                  x="0.222229"
                  y="0.222229"
                  width="40"
                  height="40"
                  rx="20"
                  fill="white"
                />
                <rect
                  x="0.222229"
                  y="0.222229"
                  width="40"
                  height="40"
                  rx="20"
                  stroke="#8A8A8A"
                  strokeWidth="0.444444"
                />
                <path
                  d="M11.7778 12.2222H13.3746L15.4983 22.1831C15.5763 22.5479 15.7783 22.874 16.0698 23.1053C16.3612 23.3366 16.7238 23.4586 17.0952 23.4503H24.9035C25.2669 23.4497 25.6193 23.3246 25.9024 23.0957C26.1854 22.8667 26.3823 22.5477 26.4604 22.1912L27.7778 16.2323H14.2289M17.3267 27.4202C17.3267 27.8632 16.9692 28.2222 16.5283 28.2222C16.0873 28.2222 15.7299 27.8632 15.7299 27.4202C15.7299 26.9773 16.0873 26.6182 16.5283 26.6182C16.9692 26.6182 17.3267 26.9773 17.3267 27.4202ZM26.1091 27.4202C26.1091 27.8632 25.7517 28.2222 25.3107 28.2222C24.8698 28.2222 24.5123 27.8632 24.5123 27.4202C24.5123 26.9773 24.8698 26.6182 25.3107 26.6182C25.7517 26.6182 26.1091 26.9773 26.1091 27.4202Z"
                  stroke="black"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Mobile Cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
            >
              <rect
                x="0.222229"
                y="0.222229"
                width="40"
                height="40"
                rx="20"
                fill="white"
              />
              <rect
                x="0.222229"
                y="0.222229"
                width="40"
                height="40"
                rx="20"
                stroke="#8A8A8A"
                strokeWidth="0.444444"
              />
              <path
                d="M11.7778 12.2222H13.3746L15.4983 22.1831C15.5763 22.5479 15.7783 22.874 16.0698 23.1053C16.3612 23.3366 16.7238 23.4586 17.0952 23.4503H24.9035C25.2669 23.4497 25.6193 23.3246 25.9024 23.0957C26.1854 22.8667 26.3823 22.5477 26.4604 22.1912L27.7778 16.2323H14.2289M17.3267 27.4202C17.3267 27.8632 16.9692 28.2222 16.5283 28.2222C16.0873 28.2222 15.7299 27.8632 15.7299 27.4202C15.7299 26.9773 16.0873 26.6182 16.5283 26.6182C16.9692 26.6182 17.3267 26.9773 17.3267 27.4202ZM26.1091 27.4202C26.1091 27.8632 25.7517 28.2222 25.3107 28.2222C24.8698 28.2222 24.5123 27.8632 24.5123 27.4202C24.5123 26.9773 24.8698 26.6182 25.3107 26.6182C25.7517 26.6182 26.1091 26.9773 26.1091 27.4202Z"
                stroke="black"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}