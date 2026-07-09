// Rotating sample review sentences shown to whoever taps/scans a Google
// Review standee/card. Picked pseudo-randomly per visit so reviews left on
// Google don't all read identically (which can get flagged as spam).
export const REVIEW_TEMPLATES = [
  "Had a great experience at {business} — friendly staff and quick service. Highly recommend!",
  "{business} exceeded my expectations. Great quality and a warm welcome. Will definitely be back!",
  "Really enjoyed my visit to {business}. Everything was clean, quick, and the staff were super helpful.",
  "One of the best experiences I've had at {business}. Smooth process from start to finish.",
  "{business} is fantastic — attentive staff, great atmosphere, and excellent service overall.",
  "Very happy with my visit to {business}. Everyone was polite and the service was quick.",
  "Loved the service at {business}! Professional, friendly, and efficient. Would recommend to anyone.",
  "{business} really stood out — great attention to detail and a genuinely friendly team.",
];

export function getRandomReviewTemplate(businessName) {
  const template = REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)];
  return template.replace("{business}", businessName?.trim() || "this place");
}
