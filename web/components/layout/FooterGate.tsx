'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

const EXCLUDED_FOOTER_PATHS = ['/fundraising-workshop-15apr', '/AI-workshop-15may'];

export default function FooterGate({ siteSettings }: { siteSettings?: any }) {
    const pathname = usePathname();
    if (EXCLUDED_FOOTER_PATHS.includes(pathname) || pathname.startsWith('/admin')) return null;
    return <Footer siteSettings={siteSettings} />;
}
