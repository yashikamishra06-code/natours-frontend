// Derives the backend's root URL (without /api/v1) from VITE_API_URL,
// so image paths work in both local dev and production.
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL.replace(/\/api\/v1\/?$/, '');

export function tourImageUrl(filename) {
  return `${BACKEND_BASE_URL}/img/tours/${filename}`;
}