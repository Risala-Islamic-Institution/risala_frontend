"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/components/brand-mark';
import { ArrowRight, Quote, Verified } from '@/components/icons';
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
        <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            {/* ── Left brand panel ─────────────────────────────────────────── */}
            <aside
                className="relative hidden flex-col overflow-hidden p-10 text-secondary-foreground lg:flex xl:p-14"
                style={{ background: "linear-gradient(180deg, #0F3D2E 0%, #0a2920 100%)" }}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.18]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 50% 50%, rgba(198,167,94,0.7) 0 1px, transparent 1px), linear-gradient(45deg, transparent 46%, rgba(247,248,245,0.08) 46% 54%, transparent 54%), linear-gradient(-45deg, transparent 46%, rgba(247,248,245,0.08) 46% 54%, transparent 54%)",
                        backgroundSize: "32px 32px, 64px 64px, 64px 64px",
                    }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
                    style={{ background: "radial-gradient(closest-side, #C6A75E, transparent 70%)" }}
                />

                <Link href="/" aria-label="Risala home" className="relative">
                    <BrandMark variant="light" />
                </Link>

                <div className="relative mt-auto max-w-lg">
                    <Quote className="h-8 w-8 text-accent" aria-hidden />
                    <p className="mt-6 font-display text-2xl leading-snug tracking-tight text-secondary-foreground/95 xl:text-[28px]">
                        &ldquo;Read! In the name of your Lord who created — created man from a clinging substance.&rdquo;
                    </p>
                    <p className="mt-3 text-sm text-secondary-foreground/65">
                        Surah Al-&apos;Alaq · 96:1–2
                    </p>

                    <ul className="mt-12 space-y-3 text-sm text-secondary-foreground/80">
                        {[
                            "Verified Ustaz, structured progress",
                            "Live availability and disciplined booking",
                            "Stripe-backed payments, certificates on completion",
                        ].map((line) => (
                            <li key={line} className="flex items-start gap-3">
                                <Verified className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative mt-12 text-xs text-secondary-foreground/55">
                    Risala Islamic Knowledge & Skills PLC
                </p>
            </aside>

            {/* ── Right form panel ─────────────────────────────────────────── */}
            <main className="relative flex flex-col">
                <div className="flex items-center justify-between border-b border-border px-6 py-5 lg:hidden">
                    <Link href="/" aria-label="Risala home">
                        <BrandMark />
                    </Link>
                    <Link
                        href="/register"
                        className="text-sm font-medium text-foreground/70 hover:text-foreground"
                    >
                        Create account
                    </Link>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
                    <div className="w-full max-w-sm">
                        <div className="hidden lg:flex lg:items-center lg:justify-end lg:pb-12">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                            >
                                Create account
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            Welcome back
                        </p>
                        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                            Sign in to continue
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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

                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            New to Risala?{' '}
                            <Link href="/register" className="font-medium text-primary hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="px-6 pb-6 text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:px-10 lg:px-16">
                    Secured by Risala
                </p>
            </main>
        </div>
    );
}
