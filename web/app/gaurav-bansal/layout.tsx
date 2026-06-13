import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gaurav Bansal | Setu - TheStartupSchool',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
