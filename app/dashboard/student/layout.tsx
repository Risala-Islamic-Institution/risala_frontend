import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Student Dashboard',
    description: 'Manage your learning, view upcoming sessions, and browse teachers.',
};

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
