import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function GET(request, context) {
  const { id } = await context.params;

  try {
    const res  = await fetch(`${API}/nfc-cards/public/${id}`, { cache: "no-store" });
    const data = await res.json();

    if (!res.ok || !data.card) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const card = data.card;

    // Redirect to form if card is set to form mode and has a form
    if (card.default_action === "form" && card.form_slug) {
      return NextResponse.redirect(new URL(`/f/${card.form_slug}`, request.url));
    }

    // Default: redirect to digital profile
    if (card.profile_slug) {
      return NextResponse.redirect(new URL(`/u/${card.profile_slug}`, request.url));
    }

    return NextResponse.redirect(new URL("/", request.url));
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
