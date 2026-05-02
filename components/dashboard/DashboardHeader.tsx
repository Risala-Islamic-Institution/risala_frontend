"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandMark } from '@/components/brand-mark';
import { UserProfile } from '@/types';

interface DashboardHeaderProps {
    profile: UserProfile | null;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    tabs?: { id: string; label: string }[];
    onLogout: () => void;
    userType: 'student' | 'teacher';
}

export function DashboardHeader({
    profile,
    activeTab,
    onTabChange,
    tabs,
    onLogout,
    userType,
}: DashboardHeaderProps) {
    const router = useRouter();
    const fullName = profile?.full_name || profile?.username || 'User';
    const initial = fullName?.[0]?.toUpperCase() || 'U';

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => router.push('/')}
                    aria-label="Risala home"
                    className="shrink-0"
                >
                    <BrandMark />
                </button>

                {tabs && onTabChange ? (
                    <nav
                        aria-label="Dashboard sections"
                        className="hidden lg:flex items-center gap-1"
                    >
                        {tabs.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    aria-current={active ? 'page' : undefined}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-muted text-foreground'
                                            : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                ) : null}

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end leading-tight">
                        <span className="text-sm font-medium text-foreground">{fullName}</span>
                        <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                            {userType === 'teacher' ? 'Ustaz' : 'Student'}
                        </span>
                    </div>

                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
                        {profile?.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profile.profile_picture} alt={fullName} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center font-display text-sm font-semibold text-primary">
                                {initial}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onLogout}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                        title="Sign out"
                        aria-label="Sign out"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="m16 17 5-5-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {tabs && onTabChange ? (
                <nav
                    aria-label="Dashboard sections (mobile)"
                    className="lg:hidden border-t border-border"
                >
                    <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 no-scrollbar">
                        {tabs.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    aria-current={active ? 'page' : undefined}
                                    className={`relative whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                                        active
                                            ? 'border-primary text-foreground'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            ) : null}
        </header>
    );
}
