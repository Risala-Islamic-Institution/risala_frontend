import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Sign in to Risala to access your dashboard.',
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
