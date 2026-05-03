'use client';

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
            className={`sticky top-0 z-40 w-full transition-all duration-300 ${
                scrolled
                    ? 'shadow-islamic backdrop-blur-xl'
                    : 'border-b border-border/60'
            }`}
            style={{
                background: scrolled
                    ? 'color-mix(in oklab, #0a2a1f 95%, transparent)'
                    : '#082017',
            }}
        >
            {/* Islamic subtle geometric background pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 5L34.7 17.6L47.6 13L40 24L52 30L40 36L47.6 47L34.7 42.4L30 55L25.3 42.4L12.4 47L20 36L8 30L20 24L12.4 13L25.3 17.6Z' fill='%23C6A75E' fill-opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Glowing gold bottom hairline */}
            <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[2px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
                    opacity: scrolled ? 1 : 0.4,
                }}
            />

            <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-5">
                    <Link href="/" aria-label="Risala home" className="shrink-0 transition-transform hover:scale-105">
                        <span style={{ filter: 'brightness(0) invert(1)', display: 'inline-block' }}>
                            <BrandMark />
                        </span>
                    </Link>
                    <span
                        aria-hidden
                        className="hidden h-6 w-px bg-[color:var(--accent)]/30 lg:block"
                    />
                    <span className="hidden items-center gap-2 lg:inline-flex">
                        <span className="font-display text-sm font-bold tracking-wide" style={{ color: 'var(--accent)' }}>
                            {roleLabel} Workspace
                        </span>
                    </span>
                </div>

                {tabs && onTabChange ? (
                    <nav
                        aria-label="Dashboard sections"
                        className="hidden items-center gap-2 lg:flex"
                    >
                        {tabs.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    aria-current={active ? 'page' : undefined}
                                    className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                                        active
                                            ? 'text-[color:var(--accent)]'
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                    {active && (
                                        <span
                                            aria-hidden
                                            className="absolute -bottom-2 left-1/2 h-[2px] w-full -translate-x-1/2 rounded-t-md"
                                            style={{ background: 'var(--accent)' }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                ) : null}

                <div className="flex items-center gap-3" data-account-menu>
                    {/* Notification bell */}
                    {onNotificationsClick ? (
                        <button
                            type="button"
                            onClick={onNotificationsClick}
                            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
                            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-all hover:bg-white/10"
                            style={{ color: 'var(--accent)' }}
                        >
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 ? (
                                <span
                                    aria-hidden
                                    className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full border-2 border-[#082017] px-1 text-[9px] font-bold leading-none text-white tabular-nums animate-pulse"
                                    style={{ background: 'var(--error)' }}
                                >
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            ) : null}
                        </button>
                    ) : null}

                    <span aria-hidden className="hidden h-5 w-px bg-[color:var(--accent)]/30 sm:block" />

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            className="flex items-center gap-2.5 rounded-full pl-2 pr-1 py-1 transition-all hover:bg-white/5 border border-transparent hover:border-[color:var(--accent)]/20"
                        >
                            <div className="hidden flex-col items-end leading-tight sm:flex">
                                <span className="inline-flex max-w-[16ch] items-center gap-1.5 truncate text-sm font-bold text-white">
                                    {fullName}
                                    {verified ? (
                                        <Verified
                                            className="h-3.5 w-3.5 text-[color:var(--accent)]"
                                            aria-label="Verified"
                                        />
                                    ) : null}
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
                                    {roleLabel}
                                </span>
                            </div>

                            <div className="relative h-9 w-9 overflow-hidden rounded-full border-2" style={{ borderColor: 'var(--accent)' }}>
                                {profile?.profile_picture ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={profile.profile_picture}
                                        alt={fullName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center font-display text-sm font-bold" style={{ background: 'var(--accent)', color: '#082017' }}>
                                        {initial}
                                    </div>
                                )}
                            </div>
                        </button>

                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border bg-card shadow-islamic animate-scale-in"
                                style={{ borderColor: 'color-mix(in oklab, var(--primary) 30%, transparent)' }}
                            >
                                <div
                                    className="px-5 py-4"
                                    style={{ background: 'color-mix(in oklab, var(--primary) 8%, transparent)', borderBottom: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                >
                                    <p className="inline-flex items-center gap-1.5 truncate text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                                        {fullName}
                                        {verified ? (
                                            <Verified
                                                className="h-3.5 w-3.5 text-[color:var(--accent)]"
                                                aria-label="Verified"
                                            />
                                        ) : null}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                        {profile?.email || `${roleLabel} workspace`}
                                    </p>
                                </div>
                                <div className="py-2 text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            router.push('/');
                                        }}
                                        className="flex w-full items-center gap-2 px-5 py-2.5 text-left transition-colors hover:bg-muted"
                                        style={{ color: 'var(--foreground)' }}
                                    >
                                        Visit risala.com
                                    </button>
                                    {tabs && onTabChange ? (
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onTabChange('profile');
                                            }}
                                            className="flex w-full items-center gap-2 px-5 py-2.5 text-left transition-colors hover:bg-muted"
                                            style={{ color: 'var(--foreground)' }}
                                        >
                                            Account & Profile
                                        </button>
                                    ) : null}
                                </div>
                                <div className="py-2 border-t" style={{ borderColor: 'var(--border)' }}>
                                    <button
                                        onClick={onLogout}
                                        className="flex w-full items-center gap-2 px-5 py-2.5 text-left text-sm font-bold transition-colors"
                                        style={{ color: 'var(--error)' }}
                                    >
                                        Sign Out
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
                    className="lg:hidden"
                    style={{ background: '#061811', borderTop: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)' }}
                >
                    <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 sm:px-6 no-scrollbar">
                        {tabs.map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    aria-current={active ? 'page' : undefined}
                                    className={`relative whitespace-nowrap border-b-2 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                                        active
                                            ? 'border-[color:var(--accent)] text-[color:var(--accent)]'
                                            : 'border-transparent text-white/50 hover:text-white'
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
