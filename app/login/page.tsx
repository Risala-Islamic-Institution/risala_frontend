"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
        } catch (err) {
            setError('Invalid username or password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-neutral">
                <h1 className="text-3xl font-bold text-primary mb-6 text-center">Welcome Back</h1>
                <p className="text-secondary/70 text-center mb-8">Sign in to continue your journey</p>

                {error && (
                    <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                        Sign In
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary/70">
                    Don't have an account?{' '}
                    <a href="/register" className="text-accent font-medium hover:underline">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
}
