import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gaurav Bansal | Setu - TheStartupSchool',
    description: 'Connect with Gaurav Bansal, Founder of Setu - TheStartupSchool. Building Bharat\'s launchpad for the next generation of entrepreneurs.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
