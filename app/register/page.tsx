"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { BrandMark } from '@/components/brand-mark';
import { GeometricPattern } from '@/components/geometric-pattern';
import { api } from '@/lib/api';
import { setToken, clearToken } from '@/lib/auth';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        clearToken();

        if (password1 !== password2) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post<{ key: string }>('/auth/registration/', {
                username,
                full_name: fullName,
                email,
                password1,
                password2,
                role,
            });
            if (response.key) {
                setToken(response.key);
            }
            window.location.href = '/login?registered=true';
        } catch {
            setError('Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputCls =
        'mt-1.5 block h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30';

    return (
        <div className="relative min-h-screen overflow-hidden">
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
                        href="/login"
                        className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                    >
                        Sign in
                    </Link>
                </div>

                <div className="my-auto py-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Join Risala
                    </p>
                    <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                        Begin your journey
                        <span className="block text-primary">of knowledge.</span>
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Public signup is for learners and Ustaz. Platform staff roles are provisioned internally.
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
                            <label className="block text-sm font-medium text-foreground">
                                I want to join as
                            </label>
                            <div className="mt-1.5 grid grid-cols-2 gap-2">
                                {[
                                    { v: 'STUDENT', label: 'Learner', sub: 'Find Ustaz and book sessions' },
                                    { v: 'USTAZ', label: 'Ustaz', sub: 'Teach on Risala' },
                                ].map((opt) => {
                                    const active = role === opt.v;
                                    return (
                                        <button
                                            key={opt.v}
                                            type="button"
                                            onClick={() => setRole(opt.v)}
                                            aria-pressed={active}
                                            className={`rounded-md border px-3 py-2.5 text-left transition-colors ${
                                                active
                                                    ? 'border-primary bg-[color:var(--primary)]/5'
                                                    : 'border-border bg-card hover:border-foreground/30'
                                            }`}
                                        >
                                            <p className={`text-sm font-medium ${active ? 'text-primary' : 'text-foreground'}`}>
                                                {opt.label}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">
                                                {opt.sub}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                                Full name <span className="text-muted-foreground font-normal">(optional)</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className={inputCls}
                                placeholder="Your full name"
                                autoComplete="name"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-foreground">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={inputCls}
                                placeholder="Choose a username"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputCls}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="password1" className="block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <input
                                    id="password1"
                                    type="password"
                                    value={password1}
                                    onChange={(e) => setPassword1(e.target.value)}
                                    className={inputCls}
                                    placeholder="Create"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password2" className="block text-sm font-medium text-foreground">
                                    Confirm
                                </label>
                                <input
                                    id="password2"
                                    type="password"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    className={inputCls}
                                    placeholder="Confirm"
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                            Create account
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already on Risala?{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
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
