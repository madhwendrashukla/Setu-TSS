import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Payment Successful | Setu - TheStartupSchool',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
