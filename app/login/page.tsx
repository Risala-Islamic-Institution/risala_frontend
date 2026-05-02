"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/components/brand-mark';
import { GeometricPattern } from '@/components/geometric-pattern';
import { api } from '@/lib/api';
import { setToken, clearToken } from '@/lib/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        clearToken();

        try {
            const response = await api.post<{ key: string }>('/auth/login/', {
                email,
                password,
            });

            setToken(response.key);

            const user = await api.get<{ primary_role?: string; roles?: { name: string }[] }>('/auth/user/');

            const role = (user.primary_role || user.roles?.[0]?.name || '').toUpperCase();
            if (role === 'USTAZ') {
                window.location.href = '/dashboard/ustaz';
            } else {
                window.location.href = '/dashboard/student';
            }
        } catch {
            setError('Invalid username or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Backdrop */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(900px 500px at 85% -10%, color-mix(in oklab, #C6A75E 10%, transparent), transparent 60%), radial-gradient(700px 400px at -10% 0%, color-mix(in oklab, #0F3D2E 8%, transparent), transparent 60%)",
                }}
            />
            <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.3]">
                <GeometricPattern />
            </div>

            <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-10 sm:px-6">
                <div className="flex items-center justify-between">
                    <Link href="/" aria-label="Risala home">
                        <BrandMark />
                    </Link>
                    <Link
                        href="/register"
                        className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                    >
                        Create account
                    </Link>
                </div>

                <div className="my-auto py-12">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Welcome back
                    </p>
                    <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                        Sign in to continue
                        <span className="block text-primary">your journey.</span>
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Bismillāh. Pick up where you left off — your bookings, lessons, and progress are waiting.
                    </p>

                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-md border border-[color:var(--error)]/25 bg-[color:var(--error)]/8 px-3.5 py-2.5 text-sm text-[color:var(--error)]"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1.5 block h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <Link
                                    href="#"
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1.5 block h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                            Sign in
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        New to Risala?{' '}
                        <Link href="/register" className="font-medium text-primary hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    Risala Islamic Knowledge & Skills PLC
                </p>
            </div>
        </div>
    );
}
