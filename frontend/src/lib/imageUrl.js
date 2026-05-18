const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/**
 * Resolves a product images value to a usable URL string.
 *
 * Handles every shape the backend/Sequelize may return:
 *   - null / undefined           → null (show placeholder)
 *   - Array  of URLs             → first element
 *   - JSON string of URL array   → parse, then first element
 *   - Bare URL string            → use directly
 *   - Relative /uploads/… path  → prefix with NEXT_PUBLIC_BACKEND_URL
 */
export function getImageUrl(raw) {
  if (!raw) return null;

  let url = null;

  if (Array.isArray(raw)) {
    url = raw[0] ?? null;
  } else if (typeof raw === "string") {
    if (raw.trimStart().startsWith("[")) {
      try {
        const parsed = JSON.parse(raw);
        url = Array.isArray(parsed) ? (parsed[0] ?? null) : null;
      } catch {
        url = null;
      }
    } else {
      url = raw;
    }
  }

  if (!url || typeof url !== "string") return null;

  if (url.startsWith("/uploads")) return `${BACKEND_URL}${url}`;
  if (url.startsWith("http"))    return url;

  return null;
}
