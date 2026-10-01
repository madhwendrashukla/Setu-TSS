/**
 * Returns the appropriate API base URL.
 * - In Browser: ALWAYS returns `''` so all requests are same-origin (`/api/...`).
 * - In Server (SSR): Returns `process.env.INTERNAL_API_URL || 'http://127.0.0.1:5000'`.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '';
  }
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
}

