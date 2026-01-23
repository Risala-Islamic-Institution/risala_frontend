"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

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
            // Store token and redirect
            if (response.key) {
                localStorage.setItem('authToken', response.key);
            }
            window.location.href = '/login?registered=true';
        } catch (err: any) {
            setError('Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-neutral">
                <h1 className="text-3xl font-bold text-primary mb-6 text-center">Join Risala</h1>
                <p className="text-secondary/70 text-center mb-8">Begin your journey of knowledge</p>

                {error && (
                    <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-secondary mb-2">
                            I want to join as
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors bg-white"
                            required
                        >
                            <option value="STUDENT">Learner / Student</option>
                            <option value="USTAZ">Instructor / Ustaz</option>
                        </select>
                        <p className="text-xs text-secondary/70 mt-1">Platform staff roles (admin, finance, support) are provisioned internally.</p>
                    </div>

                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-secondary mb-2">
                            Full name (optional)
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                            placeholder="Your full name"
                        />
                    </div>

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
                            placeholder="Choose a username"
                            required
                        />
                    </div>

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
                        <label htmlFor="password1" className="block text-sm font-medium text-secondary mb-2">
                            Password
                        </label>
                        <input
                            id="password1"
                            type="password"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password2" className="block text-sm font-medium text-secondary mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="password2"
                            type="password"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-neutral focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                        Create Account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary/70">
                    Already have an account?{' '}
                    <a href="/login" className="text-accent font-medium hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
