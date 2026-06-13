import FooterGate from './FooterGate';

async function getSiteSettings() {
    try {
        const res = await fetch('http://localhost:5000/api/homepage', { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data.siteSettings;
    } catch (error) {
        return null;
    }
}

export default async function FooterLoader() {
    const settings = await getSiteSettings();
    return <FooterGate siteSettings={settings} />;
}
