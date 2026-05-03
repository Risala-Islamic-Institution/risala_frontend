'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { clearToken } from '@/lib/auth';
import AuthGuard from '@/components/AuthGuard';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { GeometricPanel, StarOrnament, GeometricDivider } from '@/components/dashboard/IslamicOrnament';
import { TeacherProfile, Booking, NotificationItem, Course, Slot, UserProfile } from '@/types';
import { Verified } from '@/components/icons';

const BookingRequests = dynamic(() =>
    import('@/components/dashboard/teacher/BookingRequests').then((m) => m.BookingRequests),
);
const ConfirmedSessions = dynamic(() =>
    import('@/components/dashboard/teacher/ConfirmedSessions').then((m) => m.ConfirmedSessions),
);
const AvailabilityManager = dynamic(() =>
    import('@/components/dashboard/teacher/AvailabilityManager').then((m) => m.AvailabilityManager),
);
const CourseManager = dynamic(() =>
    import('@/components/dashboard/teacher/CourseManager').then((m) => m.CourseManager),
);
const NotificationPanel = dynamic(() =>
    import('@/components/dashboard/teacher/NotificationPanel').then((m) => m.NotificationPanel),
);

export default function UstazDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [user, setUser] = useState<UserProfile | null>(null);
    const [profile, setProfile] = useState<TeacherProfile | null>(null);
    const [availabilities, setAvailabilities] = useState<Slot[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    const notifRef = useRef<HTMLDivElement | null>(null);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout/', {});
        } catch {}
        clearToken();
        window.location.href = '/login';
    };

    const fetchData = async () => {
        try {
            const [usr, prof, myAvail, myBookings, notes, myCourses] = await Promise.all([
                api.get<UserProfile>('/auth/user/'),
                api.get<{ type?: string; profile?: TeacherProfile }>('/users/profile/'),
                api.get<Slot[]>('/availability'),
                api.get<Booking[]>('/bookings/'),
                api.get<NotificationItem[]>('/notifications/'),
                api.get<Course[]>('/courses/'),
            ]);
            setUser(usr);
            if (prof.type === 'teacher' && prof.profile) setProfile(prof.profile);
            setAvailabilities(myAvail);
            setBookings(myBookings);
            setNotifications(notes);
            setCourses(myCourses);
        } catch {
            setError('Failed to refresh data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const requestBookings = useMemo(
        () => bookings.filter((b) => b.status === 'REQUESTED' || b.status === 'PENDING'),
        [bookings],
    );
    const upcomingBookings = useMemo(
        () =>
            bookings.filter(
                (b) =>
                    b.status === 'CONFIRMED' ||
                    b.status === 'APPROVED' ||
                    b.status === 'RESERVED' ||
                    b.status === 'PAID',
            ),
        [bookings],
    );
    const todayCount = useMemo(() => {
        const today = new Date();
        return upcomingBookings.filter((b) => {
            const d = new Date(b.start_at);
            return (
                d.getFullYear() === today.getFullYear() &&
                d.getMonth() === today.getMonth() &&
                d.getDate() === today.getDate()
            );
        }).length;
    }, [upcomingBookings]);

    const unreadNotifs = notifications.filter((n) => !n.is_read).length;
    const verified = (profile?.verification_status || '').toString().toUpperCase() === 'VERIFIED';
    const firstName = user?.full_name?.split(' ')[0] || user?.username || 'Ustaz';
    const todayLabel = useMemo(
        () =>
            new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
        [],
    );

    const scrollToNotifications = () => {
        notifRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (loading) {
        return (
            <AuthGuard allowedRoles={['USTAZ']}>
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-6 animate-fade-in">
                        <div className="relative h-16 w-16">
                            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                                <StarOrnament size={64} className="text-primary opacity-20" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-3 w-3 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard allowedRoles={['USTAZ']}>
            <div className="min-h-screen bg-background pb-20">
                <DashboardHeader
                    profile={user}
                    onLogout={handleLogout}
                    userType="teacher"
                    unreadCount={unreadNotifs}
                    onNotificationsClick={scrollToNotifications}
                    verified={verified}
                />

                {/* ═══════════════════════════════════════════
                    HERO — Islamic dark-emerald gradient panorama
                ═══════════════════════════════════════════ */}
                <section className="relative overflow-hidden shadow-islamic">
                    {/* Deep layered gradient background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `
                                radial-gradient(ellipse 90% 80% at 10% 60%, color-mix(in oklab, var(--primary) 55%, transparent) 0%, transparent 65%),
                                radial-gradient(ellipse 50% 70% at 90% 10%, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 60%),
                                radial-gradient(ellipse 70% 50% at 50% 100%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 70%),
                                linear-gradient(160deg, #0a2a1f 0%, #111620 60%, #1c1f26 100%)
                            `,
                        }}
                    />

                    {/* Islamic star tile pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 5L34.7 17.6L47.6 13L40 24L52 30L40 36L47.6 47L34.7 42.4L30 55L25.3 42.4L12.4 47L20 36L8 30L20 24L12.4 13L25.3 17.6Z' fill='%23C6A75E' fill-opacity='1'/%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px',
                    }} />

                    {/* Geometric SVG panel on right */}
                    <GeometricPanel
                        className="pointer-events-none absolute -right-8 top-0 hidden h-full w-[45%] opacity-30 lg:block"
                    />

                    {/* Gold accent hairline at bottom edge */}
                    <span
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-[2px]"
                        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
                    />

                    <div className="relative mx-auto w-full max-w-7xl px-4 pt-14 pb-14 sm:px-6 lg:px-8 lg:pt-16 lg:pb-16">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
                            {/* LEFT COLUMN — greeting + stats */}
                            <div className="lg:col-span-8 animate-fade-up">
                                <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--accent)' }}>
                                    <StarOrnament size={10} />
                                    Ustaz Workspace
                                    <span style={{ opacity: 0.4 }}>·</span>
                                    <span className="font-semibold normal-case tracking-normal" style={{ color: 'color-mix(in oklab, #fff 60%, transparent)' }}>
                                        {todayLabel}
                                    </span>
                                </p>

                                <h1 className="mt-4 font-display leading-[1.05] tracking-tight text-balance" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#fff' }}>
                                    <span className="block" style={{ color: 'color-mix(in oklab, #fff 60%, transparent)', fontSize: '0.65em' }}>
                                        Assalamu alaykum,
                                    </span>
                                    <span className="block mt-1">{firstName}.</span>
                                </h1>

                                <p className="mt-5 max-w-lg text-sm leading-relaxed" style={{ color: 'color-mix(in oklab, #fff 70%, transparent)' }}>
                                    Your command centre for guiding seekers of knowledge — review requests, shape your schedule, and build courses that endure.
                                </p>

                                {/* ── Premium Stats Ledger ── */}
                                <dl
                                    className="mt-8 grid max-w-2xl grid-cols-4 overflow-hidden rounded-2xl"
                                    style={{
                                        border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
                                        background: 'color-mix(in oklab, #082017 40%, transparent)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    <HeroStat label="Pending" value={requestBookings.length} accent={requestBookings.length > 0} />
                                    <HeroStat label="Today" value={todayCount} />
                                    <HeroStat label="Sessions" value={upcomingBookings.length} />
                                    <HeroStat label="Courses" value={courses.length} />
                                </dl>
                            </div>

                            {/* RIGHT COLUMN — Profile Pro Badge */}
                            <div className="relative hidden lg:col-span-4 lg:flex lg:justify-end animate-fade-up" style={{ animationDelay: '120ms' }}>
                                <div
                                    className="relative w-full max-w-sm overflow-hidden rounded-2xl p-6"
                                    style={{
                                        background: 'color-mix(in oklab, #082017 80%, transparent)',
                                        border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        boxShadow: '0 0 40px -10px color-mix(in oklab, var(--accent) 20%, transparent)',
                                    }}
                                >
                                    <span aria-hidden className="absolute inset-x-0 top-0 h-[3px]" style={{ background: 'var(--accent)' }} />

                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
                                                {verified ? 'Verified Ustaz' : 'Pending Ustaz'}
                                            </p>
                                            <p className="mt-1 font-display text-xl font-bold leading-tight text-white">
                                                {profile?.specialization || 'Set Specialization'}
                                            </p>
                                        </div>
                                        {user?.profile_picture ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={user.profile_picture}
                                                alt=""
                                                className="h-12 w-12 rounded-full border-2 object-cover shadow-gold-glow"
                                                style={{ borderColor: 'var(--accent)' }}
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 font-display text-lg font-bold shadow-gold-glow" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                                                {firstName[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex items-center justify-center">
                                        <GeometricDivider />
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <dt className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'color-mix(in oklab, #fff 50%, transparent)' }}>
                                                Hourly rate
                                            </dt>
                                            <dd className="mt-1 font-display text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
                                                ${profile?.hourly_rate || '0'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'color-mix(in oklab, #fff 50%, transparent)' }}>
                                                Level
                                            </dt>
                                            <dd className="mt-1 text-sm font-bold text-white truncate px-2">
                                                {profile?.teaching_level || '—'}
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════
                    MAIN CONTENT
                ═══════════════════════════════════════════ */}
                <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
                    {error && (
                        <div
                            role="alert"
                            className="animate-scale-in cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-3 shadow-elevated"
                            style={{
                                border: '1px solid color-mix(in oklab, var(--error) 30%, transparent)',
                                background: 'color-mix(in oklab, var(--error) 8%, var(--card))',
                                color: 'var(--error)',
                            }}
                            onClick={() => setError('')}
                        >
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: 'var(--error)' }} />
                            {error}
                            <span className="ml-auto text-[10px] uppercase tracking-[0.14em] opacity-60">Dismiss</span>
                        </div>
                    )}

                    {/* TOP ROW: Action Inbox & Notifications */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Action Inbox (Left side, takes more space) */}
                        <section aria-labelledby="inbox-heading" className="lg:col-span-8">
                            <SectionHeader
                                id="inbox-heading"
                                eyebrow="Action inbox"
                                title="Review with intent."
                                description="Approve or decline incoming session and package requests."
                                badge={requestBookings.length > 0 ? `${requestBookings.length} pending` : undefined}
                                badgeVariant="accent"
                            />
                            <BookingRequests
                                bookings={requestBookings}
                                onChange={setBookings}
                                onError={setError}
                            />
                        </section>

                        {/* Notifications (Right side) */}
                        <aside aria-labelledby="notifications-heading" className="lg:col-span-4" ref={notifRef}>
                            <SectionHeader
                                id="notifications-heading"
                                eyebrow="Alerts"
                                title="Notifications."
                                description="System updates and messages."
                            />
                            <NotificationPanel
                                notifications={notifications}
                                onRead={async () =>
                                    setNotifications(await api.get<NotificationItem[]>('/notifications/'))
                                }
                            />
                        </aside>
                    </div>

                    {/* MIDDLE SECTION: Confirmed Sessions Calendar */}
                    <section aria-labelledby="schedule-heading">
                        <SectionHeader
                            id="schedule-heading"
                            eyebrow="Your schedule"
                            title="Upcoming sessions."
                            description="Full calendar view — each booked day is highlighted in vivid green. Click any highlighted day to see attending students."
                            badge={upcomingBookings.length > 0 ? `${upcomingBookings.length} booked` : undefined}
                            badgeVariant="primary"
                        />
                        <ConfirmedSessions bookings={upcomingBookings} />
                    </section>

                    {/* BOTTOM GRID: Rhythm & Courses */}
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        {/* Availability Manager */}
                        <AvailabilityManager
                            slots={availabilities}
                            onChange={setAvailabilities}
                            onError={setError}
                        />

                        {/* Course Studio */}
                        <CourseManager
                            courses={courses}
                            onChange={setCourses}
                            onError={setError}
                        />
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}

/* ── Hero stat tile ── */
function HeroStat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
    return (
        <div
            className="flex flex-col items-center justify-center py-5 gap-1"
            style={{ borderRight: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)' }}
        >
            <dt className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: 'color-mix(in oklab, #fff 60%, transparent)' }}>
                {accent && (
                    <span className="relative inline-flex h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: 'var(--accent)' }} />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
                    </span>
                )}
                {label}
            </dt>
            <dd
                className="font-display text-3xl font-bold tabular-nums"
                style={{ color: accent ? 'var(--accent)' : '#fff' }}
            >
                {value}
            </dd>
        </div>
    );
}

/* ── Shared section header ── */
function SectionHeader({
    id,
    eyebrow,
    title,
    description,
    badge,
    badgeVariant = 'primary',
}: {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    badge?: string;
    badgeVariant?: 'primary' | 'accent';
}) {
    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
                <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>
                    <StarOrnament size={9} />
                    {eyebrow}
                </p>
                <h2
                    id={id}
                    className="mt-1.5 font-display text-[26px] font-bold leading-tight tracking-tight text-foreground"
                >
                    {title}
                </h2>
                <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>
            {badge && (
                <span
                    className="hidden shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] sm:inline-flex"
                    style={badgeVariant === 'accent' ? {
                        background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
                        border: '1px solid color-mix(in oklab, var(--accent) 35%, transparent)',
                        color: '#7a5a14',
                    } : {
                        background: 'color-mix(in oklab, var(--primary) 10%, transparent)',
                        border: '1px solid color-mix(in oklab, var(--primary) 30%, transparent)',
                        color: 'var(--primary)',
                    }}
                >
                    {badge}
                </span>
            )}
        </div>
    );
}
