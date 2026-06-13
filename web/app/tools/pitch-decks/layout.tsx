import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Pitch Deck Repo | Setu - TheStartupSchool',
    description: 'The ultimate repository of winning pitch decks from global unicorns. Study how the best in the world built their narrative.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
