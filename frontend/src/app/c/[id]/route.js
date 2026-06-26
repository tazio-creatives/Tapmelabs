import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// When running behind a reverse proxy (Nginx etc.) request.url contains the
// internal address (http://localhost:3000). NEXT_PUBLIC_SITE_URL overrides
// this so redirects always land on the correct public domain.
function getOrigin(request) {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host  = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

export async function GET(request, context) {
  const { id }   = await context.params;
  const origin   = getOrigin(request);

  try {
    const res  = await fetch(`${API}/nfc-cards/public/${id}`, { cache: "no-store" });
    const data = await res.json();

    if (!res.ok || !data.card) {
      return NextResponse.redirect(`${origin}/`);
    }

    const card = data.card;

    // Redirect to form if card is set to form mode and has a form
    if (card.default_action === "form" && card.form_slug) {
      return NextResponse.redirect(`${origin}/f/${card.form_slug}`);
    }

    // Default: redirect to digital profile
    if (card.profile_slug) {
      return NextResponse.redirect(`${origin}/u/${card.profile_slug}`);
    }

    return NextResponse.redirect(`${origin}/`);
  } catch {
    return NextResponse.redirect(`${origin}/`);
  }
}
