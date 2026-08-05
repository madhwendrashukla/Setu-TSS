/**
 * Route segment config for the whole /admin tree.
 *
 * ⚠️ Do not delete, and do not move this into (protected)/layout.tsx — that file
 * is a Client Component, and Next.js only reads route segment config from Server
 * Components, so the export would be silently ignored there.
 *
 * Why force-dynamic: middleware mints a FRESH nonce per request for the strict
 * admin CSP ('strict-dynamic' makes 'self' and every host allowlist be ignored
 * for script-src, so a nonce mismatch means NO script runs). Left static, Next
 * renders /admin/* once, writes the HTML to the full route cache with that first
 * nonce baked into every <script>, and serves it to everyone afterwards — while
 * the response header carries a new nonce each time. The nonces then never match
 * and the admin panel serves HTML that silently fails to hydrate: no login, no
 * navigation, no data. Rendering per request keeps header and markup in sync.
 */
export const dynamic = 'force-dynamic';

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
    return children;
}
