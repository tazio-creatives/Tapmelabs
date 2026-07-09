"use client";

import { useEffect, useState } from "react";
import { getRandomReviewTemplate } from "@/config/reviewTemplates";

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.4 3.8 3.4.5.2.9.4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.2z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.7 3.2-8z" />
      <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.2 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8C4.1 20.5 7.8 23 12 23z" />
      <path fill="#FBBC05" d="M6 14.4c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7.2H2.3C1.5 8.7 1 10.3 1 12s.5 3.3 1.3 4.8L6 14.4z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1C17.4 2.1 14.9 1 12 1 7.8 1 4.1 3.5 2.3 7.2L6 9.8c.9-2.5 3.2-4.4 6-4.4z" />
    </svg>
  );
}

function NotFoundView() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F9FAFB] px-4 text-center">
      <h1 className="text-[20px] font-semibold text-[#111827]">This tag isn&apos;t active</h1>
      <p className="max-w-xs text-[14px] text-[#6B7280]">
        This card or standee doesn&apos;t exist or has been deactivated. Please contact the business owner.
      </p>
    </main>
  );
}

export default function ReviewTagView({ reviewTag }) {
  const [reviewText, setReviewText]   = useState("");
  const [copied, setCopied]           = useState(false);
  const [showReview, setShowReview]   = useState(false);

  useEffect(() => {
    if (reviewTag) setReviewText(getRandomReviewTemplate(reviewTag.business_name));
  }, [reviewTag]);

  if (!reviewTag) return <NotFoundView />;

  const isSocial = reviewTag.product_type === "standee_social";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — user can still select/copy the text manually
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#F9FAFB] px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm" style={{ border: "1px solid #E5E7EB" }}>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#F3F4F6]">
            {reviewTag.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={reviewTag.logo_url} alt={reviewTag.business_name || "Business logo"} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[24px] font-bold text-[#9CA3AF]">
                {(reviewTag.business_name || "?").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {reviewTag.business_name && (
            <h1 className="text-[18px] font-bold text-[#111827]">{reviewTag.business_name}</h1>
          )}
          <p className="text-[13px] text-[#6B7280]">
            {isSocial ? "Connect with us or leave a review" : "We'd love your feedback!"}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isSocial && reviewTag.instagram_url && (
            <a
              href={reviewTag.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold text-white transition-opacity active:opacity-80"
              style={{ background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)" }}
            >
              <InstagramIcon /> Follow on Instagram
            </a>
          )}

          {isSocial && reviewTag.whatsapp_url && (
            <a
              href={reviewTag.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold text-white transition-opacity active:opacity-80"
              style={{ background: "#25D366" }}
            >
              <WhatsAppIcon /> Message on WhatsApp
            </a>
          )}

          {!showReview ? (
            <button
              onClick={() => setShowReview(true)}
              className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-[14px] font-semibold text-[#111827] transition-colors hover:bg-[#F9FAFB]"
              style={{ borderColor: "#E5E7EB" }}
            >
              <GoogleIcon /> Leave a Google Review
            </button>
          ) : (
            <div className="flex flex-col gap-3 rounded-xl p-4" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
              <p className="text-[12px] font-medium text-[#6B7280]">
                Copy this, then paste it into your Google review:
              </p>
              <p className="text-[14px] leading-relaxed text-[#111827]">{reviewText}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-black transition-opacity active:opacity-80"
                  style={{ background: "#28DC4F" }}
                >
                  {copied ? "Copied!" : "Copy Text"}
                </button>
                <a
                  href={reviewTag.google_review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg px-3 py-2.5 text-center text-[13px] font-semibold text-white transition-opacity active:opacity-80"
                  style={{ background: "#111827" }}
                >
                  Open Google Review
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-[11px] text-[#9CA3AF]">Powered by TapMe Labs</p>
    </main>
  );
}
