'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { clearToken } from '@/lib/auth';
import AuthGuard from '@/components/AuthGuard';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { GeometricPanel, StarOrnament, GeometricDivider } from '@/components/dashboard/IslamicOrnament';
import { TeacherProfile, Booking, NotificationItem, Course, Slot, UserProfile } from '@/types';

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
const TeacherProfileCard = dynamic(
    () =>
        import('@/components/dashboard/teacher/TeacherProfileCard').then(
            (m) => m.TeacherProfileCard,
        ),
    {
        loading: () => <div className="h-44 rounded-2xl border border-border bg-muted animate-pulse" />,
    },
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
            new Date().toLocaleDateString(undefined, {
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
                    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
                        <span aria-hidden className="relative inline-flex h-2.5 w-2.5">
                            <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                        </span>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Loading workspace
                        </p>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard allowedRoles={['USTAZ']}>
            <div className="min-h-screen bg-background pb-16">
                <DashboardHeader
                    profile={user}
                    onLogout={handleLogout}
                    userType="teacher"
                    unreadCount={unreadNotifs}
                    onNotificationsClick={scrollToNotifications}
                    verified={verified}
                />

                {/* HERO — Islamic-inspired editorial hero with geometric panel */}
                <section className="relative overflow-hidden border-b border-border bg-card">
                    <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)]/45 to-transparent"
                    />
                    {/* Decorative geometric panel — desktop only, masked to fade */}
                    <GeometricPanel
                        className="pointer-events-none absolute -right-12 top-0 hidden h-full w-[42%] opacity-70 lg:block"
                    />

                    <div className="relative mx-auto w-full max-w-7xl px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16 lg:pb-12">
                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
                            <div className="lg:col-span-7">
                                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                    <StarOrnament size={11} className="text-[color:var(--accent)]" />
                                    Ustaz workspace
                                    <span className="opacity-50">·</span>
                                    <span className="font-normal normal-case tracking-normal text-muted-foreground">
                                        {todayLabel}
                                    </span>
                                </p>
                                <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[42px] lg:text-5xl text-balance">
                                    <span className="block text-foreground/50">
                                        Assalamu alaykum,
                                    </span>
                                    <span className="block">{firstName}.</span>
                                </h1>
                                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    A focused command surface for verified Ustaz — approve requests,
                                    shape your weekly rhythm, and refine your courses with calm authority.
                                </p>

                                {/* Stats ledger */}
                                <dl className="mt-8 grid max-w-xl grid-cols-4 divide-x divide-border rounded-2xl border border-border bg-card/80 backdrop-blur-sm">
                                    <Stat
                                        label="Pending"
                                        value={requestBookings.length}
                                        accent={requestBookings.length > 0}
                                    />
                                    <Stat label="Today" value={todayCount} />
                                    <Stat label="Sessions" value={upcomingBookings.length} />
                                    <Stat label="Courses" value={courses.length} />
                                </dl>
                            </div>

                            {/* Right column — verified badge / Hijri-style accent (desktop only) */}
                            <div className="relative hidden lg:col-span-5 lg:block">
                                <div className="ml-auto max-w-sm">
                                    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/85 p-6 shadow-card backdrop-blur-sm">
                                        <span
                                            aria-hidden
                                            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)]/55 to-transparent"
                                        />
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                                Status
                                            </p>
                                            <StarOrnament className="text-[color:var(--accent)]/80" />
                                        </div>
                                        <p className="mt-2 font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                                            {verified ? 'Verified Ustaz' : 'Verification pending'}
                                        </p>
                                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                                            {verified
                                                ? 'Your profile is live in the directory and discoverable to seekers.'
                                                : 'Complete verification to be listed in the public directory.'}
                                        </p>
                                        <div className="mt-5 flex items-center justify-center">
                                            <GeometricDivider />
                                        </div>
                                        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                                    Specialization
                                                </dt>
                                                <dd className="mt-0.5 truncate font-medium text-foreground">
                                                    {profile?.specialization || '—'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                                    Hourly rate
                                                </dt>
                                                <dd className="mt-0.5 font-display text-base font-semibold tabular-nums text-foreground">
                                                    {profile?.hourly_rate ? `$${profile.hourly_rate}` : '—'}
                                                </dd>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <main className="mx-auto w-full max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
                    {error && (
                        <div
                            role="alert"
                            className="cursor-pointer rounded-md border border-[color:var(--error)]/25 bg-[color:var(--error)]/8 px-3.5 py-2.5 text-sm text-[color:var(--error)]"
                            onClick={() => setError('')}
                        >
                            {error}
                        </div>
                    )}

                    {/* PRIORITY ROW — Pending requests (action inbox) */}
                    <section aria-labelledby="inbox-heading">
                        <div className="mb-6 flex items-end justify-between gap-5">
                            <div>
                                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                    <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                                    Action inbox
                                </p>
                                <h2
                                    id="inbox-heading"
                                    className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[28px]"
                                >
                                    Decide with intent.
                                </h2>
                                <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                                    Approve or decline incoming session and package requests. Package classes are grouped — review all sessions, then act once.
                                </p>
                            </div>
                            <span className="hidden shrink-0 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7a5a14] sm:inline-flex">
                                {requestBookings.length} pending
                            </span>
                        </div>
                        <BookingRequests
                            bookings={requestBookings}
                            onChange={setBookings}
                            onError={setError}
                        />
                    </section>

                    {/* SCHEDULE — sessions split by status */}
                    <section aria-labelledby="schedule-heading">
                        <div className="mb-6 flex items-end justify-between gap-5">
                            <div>
                                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                    <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                                    Your schedule
                                </p>
                                <h2
                                    id="schedule-heading"
                                    className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[28px]"
                                >
                                    Upcoming sessions.
                                </h2>
                                <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                                    Package students appear as one row — expand to see every session. Awaiting payment is shown separately from confirmed.
                                </p>
                            </div>
                            <span className="hidden shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
                                {upcomingBookings.length} scheduled
                            </span>
                        </div>
                        <ConfirmedSessions bookings={upcomingBookings} />
                    </section>

                    {/* OPERATIONS — main content + sidebar */}
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        <div className="space-y-12 lg:col-span-8">
                            <AvailabilityManager
                                slots={availabilities}
                                onChange={setAvailabilities}
                                onError={setError}
                            />
                            <CourseManager
                                courses={courses}
                                onChange={setCourses}
                                onError={setError}
                            />
                        </div>

                        <aside ref={notifRef} className="space-y-5 lg:col-span-4">
                            <TeacherProfileCard profile={profile} />
                            <NotificationPanel
                                notifications={notifications}
                                onRead={async () =>
                                    setNotifications(
                                        await api.get<NotificationItem[]>('/notifications/'),
                                    )
                                }
                            />
                        </aside>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
    return (
        <div className="px-4 py-4 first:pl-5 last:pr-5">
            <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {accent ? (
                    <span aria-hidden className="relative inline-flex h-1.5 w-1.5">
                        <span className="absolute inset-0 rounded-full bg-[color:var(--accent)] animate-pulse-ring" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    </span>
                ) : null}
                {label}
            </dt>
            <dd className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
                {value}
            </dd>
        </div>
    );
}
