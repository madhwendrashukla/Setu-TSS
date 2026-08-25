import { headers } from 'next/headers';
import FooterGate from './FooterGate';

// 🔴 THE GATE HAS TO BE HERE, ON THE SERVER, NOT IN FooterGate.
//
// FooterGate is a client component and already returns null on /admin — but it
// does so in the BROWSER, after React has serialized `siteSettings` into the RSC
// flight payload and shipped it. Hiding a component does not un-send its props.
//
// The result was that an unauthenticated GET /admin returned the site's whole
// settings object — address, contact email and phone, and the section_toggles
// feature flags — inside a <script>self.__next_f.push(...)</script> block, which
// is what the 9-Aug penetration retest reported. Route Groups had already
// isolated the admin *layout*, so the visible page was only the login form; the
// data was arriving underneath it regardless.
//
// Deciding on the server means /admin never fetches the settings in the first
// place. Nothing is fetched, so nothing can be serialized, so nothing can leak —
// rather than fetching it and trying to remember to hide it everywhere.

// Routes that must never receive the footer, and therefore must never receive
// its data. Kept in sync with EXCLUDED_FOOTER_PATHS in FooterGate.tsx, which
// still guards client-side navigations within an already-loaded page.
const NO_FOOTER_EXACT = ['/fundraising-workshop-15apr', '/AI-workshop-15may'];
const NO_FOOTER_PREFIX = ['/admin'];

async function getSiteSettings() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/homepage`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data.siteSettings;
    } catch (error) {
        return null;
    }
}

export default async function FooterLoader() {
    // Set by middleware.ts. Next.js does not expose the pathname to server
    // components any other way.
    const pathname = (await headers()).get('x-pathname') ?? '';

    // ⚠️ Return BEFORE the fetch, not after. Fetching and then discarding would
    // leave the same payload in the RSC stream and fix nothing.
    if (NO_FOOTER_EXACT.includes(pathname) || NO_FOOTER_PREFIX.some((p) => pathname.startsWith(p))) {
        return null;
    }

    const settings = await getSiteSettings();
    return <FooterGate siteSettings={settings} />;
}
