"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface UserProfile {
    username: string;
    name: string;
    email: string;
    role: string;
}

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const response = await api.get<{ primary_role?: string; roles?: { name: string }[] }>('/auth/user/', {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });
                const role = (response.primary_role || response.roles?.[0]?.name || '').toUpperCase();
                if (role === 'USTAZ') {
                    window.location.href = '/dashboard/ustaz';
                } else {
                    window.location.href = '/dashboard/student';
                }
            } catch (err) {
                setError('Failed to load profile. Please login again.');
                localStorage.removeItem('authToken');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('authToken');
        try {
            await api.post('/auth/logout/', {}, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
        } catch (err) {
            // Ignore logout errors
        }
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-secondary">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-error mb-4">{error || 'Please login to continue'}</p>
                    <a href="/login" className="text-accent hover:underline">Go to Login</a>
                </div>
            </div>
        );
    }

    return null;
}
