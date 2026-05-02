import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Teacher Dashboard',
    description: 'Manage your courses, availability, and booking requests.',
};

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
