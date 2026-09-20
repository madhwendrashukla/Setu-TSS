import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Connect with Setu Startup School',
    description: 'Get in touch with Setu Startup School. Reach out for founder cohorts, mentorship, incubation programs, workshops, and ecosystem partnerships.',
    openGraph: {
        title: 'Contact Us | Setu Startup School',
        description: 'Get in touch with Setu Startup School. Reach out for founder cohorts, mentorship, incubation programs, workshops, and ecosystem partnerships.',
        url: 'https://foundersschool.in/contact',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
