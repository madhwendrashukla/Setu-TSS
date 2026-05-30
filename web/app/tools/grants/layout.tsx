import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Startup Grants & Schemes | The Startup School',
    description: 'Find non-dilutive capital, government grants, and startup schemes available for founders.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
