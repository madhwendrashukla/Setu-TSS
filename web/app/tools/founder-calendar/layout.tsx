import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Founder Events Calendar | Setu - TheStartupSchool',
    description: 'Never miss a crucial opportunity. B2B events, exhibitions, and networking hubs curated for founders.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
