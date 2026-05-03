"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrandMark } from '@/components/brand-mark';
import { Bell, Verified } from '@/components/icons';
import { UserProfile } from '@/types';

interface DashboardHeaderProps {
    profile: UserProfile | null;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    tabs?: { id: string; label: string }[];
    onLogout: () => void;
    userType: 'student' | 'teacher';
    unreadCount?: number;
    onNotificationsClick?: () => void;
    verified?: boolean;
}

export function DashboardHeader({
    profile,
    activeTab,
    onTabChange,
    tabs,
    onLogout,
    userType,
    unreadCount = 0,
    onNotificationsClick,
    verified = false,
}: DashboardHeaderProps) {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        const close = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-account-menu]')) setMenuOpen(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [menuOpen]);

    const fullName = profile?.full_name || profile?.username || 'User';
    const initial = fullName?.[0]?.toUpperCase() || 'U';
    const roleLabel = userType === 'teacher' ? 'Ustaz' : 'Student';

    return (
        <header
            className={`sticky top-0 z-40 w-full transition-all ${
                scrolled
                    ? 'border-b border-border bg-background/90 backdrop-blur-xl shadow-card'
                    : 'border-b border-border/60 bg-background'
            }`}
        >
            {/* Subtle accent hairline */}
            <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)]/45 to-transparent"
            />

            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-5">
                    <Link href="/" aria-label="Risala home" className="shrink-0">
                        <BrandMark />
                    </Link>
                    <span
                        aria-hidden
                        className="hidden h-6 w-px bg-border lg:block"
                    />
                    <span className="hidden items-center gap-2 lg:inline-flex">
                        <span className="font-display text-sm font-semibold text-foreground">
                            {roleLabel} workspace
                        </span>
                    </span>
                </div>

                {tabs && onTabChange ? (
                    <nav
                        aria-label="Dashboard sections"
                        className="hidden items-center gap-1 lg:flex"
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
                                            : 'text-foreground/65 hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                ) : null}

                <div className="flex items-center gap-2" data-account-menu>
                    {/* Notification bell */}
                    {onNotificationsClick ? (
                        <button
                            type="button"
                            onClick={onNotificationsClick}
                            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-foreground/70 transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                        >
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 ? (
                                <span
                                    aria-hidden
                                    className="absolute -right-0.5 -top-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full border-2 border-background bg-[color:var(--error)] px-1 text-[10px] font-semibold leading-none text-white tabular-nums"
                                >
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            ) : null}
                        </button>
                    ) : null}

                    <span aria-hidden className="hidden h-6 w-px bg-border sm:block" />

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            className="flex items-center gap-2.5 rounded-md border border-transparent px-1.5 py-1 transition-colors hover:border-border hover:bg-muted"
                        >
                            <div className="hidden flex-col items-end leading-tight sm:flex">
                                <span className="inline-flex max-w-[16ch] items-center gap-1.5 truncate text-sm font-medium text-foreground">
                                    {fullName}
                                    {verified ? (
                                        <Verified
                                            className="h-3.5 w-3.5 text-[color:var(--accent)]"
                                            aria-label="Verified"
                                        />
                                    ) : null}
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                    {roleLabel}
                                </span>
                            </div>

                            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-muted">
                                {profile?.profile_picture ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={profile.profile_picture}
                                        alt={fullName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center font-display text-sm font-semibold text-primary">
                                        {initial}
                                    </div>
                                )}
                                <span
                                    aria-hidden
                                    className="absolute -bottom-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full ring-2 ring-background"
                                    style={{ background: 'var(--success)' }}
                                />
                            </div>
                        </button>

                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-elevated"
                            >
                                <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-4 py-3.5">
                                    <p className="inline-flex items-center gap-1.5 truncate text-sm font-medium text-foreground">
                                        {fullName}
                                        {verified ? (
                                            <Verified
                                                className="h-3.5 w-3.5 text-[color:var(--accent)]"
                                                aria-label="Verified"
                                            />
                                        ) : null}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {profile?.email || `${roleLabel} workspace`}
                                    </p>
                                </div>
                                <div className="py-1.5 text-sm">
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.push('/');
                                        }}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-foreground/80 transition-colors hover:bg-muted"
                                    >
                                        Visit risala.com
                                    </button>
                                    {tabs && onTabChange ? (
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onTabChange('profile');
                                            }}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-foreground/80 transition-colors hover:bg-muted"
                                        >
                                            Account & profile
                                        </button>
                                    ) : null}
                                </div>
                                <div className="border-t border-border py-1.5">
                                    <button
                                        onClick={onLogout}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[color:var(--error)] transition-colors hover:bg-[color:var(--error)]/8"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {tabs && onTabChange ? (
                <nav
                    aria-label="Dashboard sections (mobile)"
                    className="border-t border-border lg:hidden"
                >
                    <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 sm:px-6 no-scrollbar">
                        {tabs.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    aria-current={active ? 'page' : undefined}
                                    className={`relative whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors ${
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
