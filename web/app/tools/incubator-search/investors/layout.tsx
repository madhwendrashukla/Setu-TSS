import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Investors Match | Setu - TheStartupSchool',
    description: 'A curated database of top-tier VCs, Angel Networks, and Family Offices. Find the right capital for your mission.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
