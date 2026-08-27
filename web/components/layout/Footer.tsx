import Link from 'next/link';
import Image from 'next/image';

const SOCIAL_LINKS = [
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/company/the-startup-school-2026/',
        icon: 'fa-brands fa-linkedin-in',
        color: 'hover:bg-[#0077B5] hover:border-[#0077B5]',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/the__startup__school',
        icon: 'fa-brands fa-instagram',
        color: 'hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:border-[#e6683c]',
    },
    {
        name: 'WhatsApp',
        href: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
        icon: 'fa-brands fa-whatsapp',
        color: 'hover:bg-[#25D366] hover:border-[#25D366]',
    },
    {
        name: 'Twitter / X',
        href: 'https://x.com/The_startup_sch',
        icon: null,
        svgIcon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
        ),
        color: 'hover:bg-black hover:text-white hover:border-black text-inherit',
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/@The_Startup_School',
        icon: 'fa-brands fa-youtube',
        color: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
    },
];

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Mentors', href: '/mentors' },
    { label: 'Events', href: '/events' },
    { label: 'Tools', href: '/tools' },
    { label: 'Workshop', href: '/fundraising-workshop-15apr' },
    { label: 'Contact', href: '/#contact' },
];

const LEGAL_LINKS = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms-of-use' },
];

export function Footer({ siteSettings }: { siteSettings?: any }) {
    let certs: any[] = [];
    if (siteSettings?.certifications) {
        try {
            certs = typeof siteSettings.certifications === 'string' 
                ? JSON.parse(siteSettings.certifications) 
                : siteSettings.certifications;
            if (!Array.isArray(certs)) certs = [];
        } catch(e) {
            certs = [];
        }
    }

    return (
        <footer className="bg-[#1E2640] border-t border-white/10 text-white py-14">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Top row: Brand + Tagline */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-6 md:gap-8 mb-10">
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <Image 
                                src="/setu-logo-footer-new.png" 
                                alt="Setu Logo" 
                                width={120} 
                                height={40} 
                                className="object-contain"
                            />
                        </Link>
                        
                        <div className="flex flex-col gap-1 mt-4 mb-6 text-center md:text-left text-sm text-gray-300">
                            <p>An Alternate B-School for Aspiring Founders</p>
                            <p className="font-bold text-white mt-1 tracking-wide uppercase">RAMSETU ALTERNATE EDUCATION SOLUTIONS PVT LTD</p>
                            <p className="mt-2 text-gray-400">123 Startup Ave, Innovation City</p>
                            <p className="mt-1 text-gray-400">
                                <a href="mailto:hello@foundersschool.in" className="hover:text-white transition-colors">hello@foundersschool.in</a>
                                <span className="mx-3">+91 98765 43210</span>
                            </p>
                        </div>

                        {certs.length > 0 && (
                            <div className="flex gap-2 mt-4">
                                {certs.map((cert: any, i: number) => (
                                    <img key={i} src={encodeURI(cert.image_url)} alt={cert.label} title={cert.label} className="h-10 object-contain bg-white rounded px-1" />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-3">
                        {SOCIAL_LINKS.map((s) => (
                            <a
                                key={s.name}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={s.name}
                                className={`w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${s.color}`}
                            >
                                {'svgIcon' in s && s.svgIcon
                                    ? s.svgIcon
                                    : <i className={`${s.icon} text-sm`}></i>
                                }
                            </a>
                        ))}
                    </div>
                </div>

                {/* Nav Links */}
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 mb-8 border-t border-white/10 pt-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-gray-400 hover:text-white transition-colors font-medium text-center"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Bottom row: Copyright + Legal */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 pt-6">
                    <p className="text-gray-500 text-xs text-center md:text-left">
                        © {new Date().getFullYear()} RAMSETU ALTERNATE EDUCATION SOLUTIONS PVT LTD. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5">
                        {LEGAL_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
