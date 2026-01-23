"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post<{ key: string }>('/auth/login/', {
                username,
                password,
            });
            // Store token in localStorage or cookie
            localStorage.setItem('authToken', response.key);
            // Redirect to dashboard
            window.location.href = '/dashboard';
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
                        <label htmlFor="username" className="block text-sm font-medium text-secondary mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                            placeholder="Enter your username"
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
