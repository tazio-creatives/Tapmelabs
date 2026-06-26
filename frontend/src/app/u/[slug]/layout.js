const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tapmelabs.com").replace(/\/$/, "");

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res  = await fetch(`${API}/profiles/public/${slug}`, { cache: "no-store" });
    const json = await res.json();
    const p    = json?.data?.profile ?? json?.profile ?? json?.data ?? json ?? {};

    const name  = p.name        || "Digital Profile";
    const bio   = p.bio         || p.designation || "Connect with me via TapMe Labs NFC card";
    const image = p.profile_image || null;
    const url   = `${SITE}/u/${slug}`;

    return {
      title:       `${name} | TapMe Labs`,
      description: bio,
      openGraph: {
        title:       `${name} | TapMe Labs`,
        description: bio,
        url,
        type:        "profile",
        images:      image ? [{ url: image, width: 800, height: 800, alt: name }] : [],
      },
      twitter: {
        card:        "summary",
        title:       `${name} | TapMe Labs`,
        description: bio,
        images:      image ? [image] : [],
      },
    };
  } catch {
    return {
      title:       "Digital Profile | TapMe Labs",
      description: "Connect with me via TapMe Labs NFC card",
    };
  }
}

export default function ProfileLayout({ children }) {
  return children;
}
