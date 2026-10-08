import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Get In Touch - Setu Startup School',
    description: 'Contact us for admissions, founder support, program and cohort inquiries, incubation guidance, and partnerships to help grow your startup.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Get In Touch - Setu Startup School',
        description: 'Contact us for admissions, founder support, program and cohort inquiries, incubation guidance, and partnerships to help grow your startup.',
        url: 'https://setustartupschool.com/contact',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
