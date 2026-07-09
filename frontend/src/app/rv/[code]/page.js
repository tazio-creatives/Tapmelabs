import ReviewTagView from "@/components/reviewtag/ReviewTagView";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getReviewTag(code) {
  try {
    const res = await fetch(`${API}/review-tags/public/${code}`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok || !data.review_tag) return null;
    return data.review_tag;
  } catch {
    return null;
  }
}

export default async function ReviewTagPage({ params }) {
  const { code } = await params;
  const reviewTag = await getReviewTag(code);

  return <ReviewTagView reviewTag={reviewTag} />;
}
