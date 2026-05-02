"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { getToken, clearToken } from '@/lib/auth';

export default function DashboardPage() {
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = getToken();
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await api.get<{ primary_role?: string; roles?: { name: string }[] }>('/auth/user/');
                const role = (response.primary_role || response.roles?.[0]?.name || '').toUpperCase();
                if (role === 'USTAZ') {
                    window.location.href = '/dashboard/ustaz';
                } else {
                    window.location.href = '/dashboard/student';
                }
            } catch {
                setError('Failed to load profile. Please sign in again.');
                clearToken();
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-sm text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--error)]">
                        Session expired
                    </p>
                    <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
                        We couldn&apos;t verify your session
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{error}</p>
                    <Link
                        href="/login"
                        className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-[#0b2e22]"
                    >
                        Go to sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
                <span aria-hidden className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Routing you to your dashboard
                </p>
            </div>
        </div>
    );
}
