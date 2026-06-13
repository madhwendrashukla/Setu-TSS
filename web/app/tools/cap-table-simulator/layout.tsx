import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Cap Table Simulator | Setu - TheStartupSchool',
    description: 'Simulate your seed round. We handle the brutal Option Pool Shuffle math automatically so you actually understand your dilution.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
