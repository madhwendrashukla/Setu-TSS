import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gaurav Bansal | Founder & Chief Mentor - Setu Startup School',
    description: 'Meet Gaurav Bansal, Founder & Chief Mentor of Setu Startup School, helping aspiring founders in building startups through practical knowledge and mentorship.',
    alternates: {
        canonical: '/gauravbansal',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
