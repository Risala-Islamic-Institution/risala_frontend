"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { clearToken } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import AuthGuard from '@/components/AuthGuard';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TeacherProfile, Booking, NotificationItem, Course, Slot, UserProfile } from '@/types';

const TeacherStats = dynamic(() => import('@/components/dashboard/teacher/TeacherStats').then(mod => mod.TeacherStats), {
  loading: () => <div className="h-24 rounded-xl border border-border bg-muted animate-pulse" />
});
const BookingRequests = dynamic(() => import('@/components/dashboard/teacher/BookingRequests').then(mod => mod.BookingRequests));
const ConfirmedSessions = dynamic(() => import('@/components/dashboard/teacher/ConfirmedSessions').then(mod => mod.ConfirmedSessions));
const AvailabilityManager = dynamic(() => import('@/components/dashboard/teacher/AvailabilityManager').then(mod => mod.AvailabilityManager));
const CourseManager = dynamic(() => import('@/components/dashboard/teacher/CourseManager').then(mod => mod.CourseManager));
const TeacherProfileCard = dynamic(() => import('@/components/dashboard/teacher/TeacherProfileCard').then(mod => mod.TeacherProfileCard), {
  loading: () => <div className="h-44 rounded-xl border border-border bg-muted animate-pulse" />
});
const NotificationPanel = dynamic(() => import('@/components/dashboard/teacher/NotificationPanel').then(mod => mod.NotificationPanel));

export default function UstazDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [availabilities, setAvailabilities] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const handleLogout = async () => {
    try { await api.post('/auth/logout/', {}); } catch { }
    clearToken(); window.location.href = '/login';
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
      setAvailabilities(myAvail); setBookings(myBookings); setNotifications(notes); setCourses(myCourses);
    } catch { setError('Failed to refresh data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const requestBookings = bookings.filter(b => b.status === 'REQUESTED' || b.status === 'PENDING');
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'APPROVED' || b.status === 'RESERVED');

  if (loading) return (
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

  return (
    <AuthGuard allowedRoles={['USTAZ']}>
      <div className="min-h-screen bg-background pb-16">
        <DashboardHeader
          profile={user}
          onLogout={handleLogout}
          userType="teacher"
        />

        {/* Dashboard hero — editorial heading + stats rail */}
        <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 border-b border-border pb-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Ustaz workspace
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl text-balance">
                {user?.full_name?.split(' ')[0] || user?.username || 'Welcome'}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Approve requests, manage availability, and shape your courses with calm authority. A focused command surface for verified Ustaz.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-6 lg:col-span-5 lg:justify-self-end lg:text-right">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Pending
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                  {requestBookings.length}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Sessions
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                  {confirmedBookings.length}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Courses
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                  {courses.length}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <main className="mx-auto w-full max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          {error && (
            <div
              role="alert"
              className="cursor-pointer rounded-md border border-[color:var(--error)]/25 bg-[color:var(--error)]/8 px-3.5 py-2.5 text-sm text-[color:var(--error)]"
              onClick={() => setError('')}
            >
              {error}
            </div>
          )}

          {/* Stats */}
          <TeacherStats
            requests={requestBookings.length}
            confirmed={confirmedBookings.length}
            courses={courses.length}
            slots={availabilities.filter(a => a.is_active).length}
          />

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section aria-labelledby="booking-requests-heading">
                <div className="mb-5 flex items-end justify-between gap-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Booking inbox
                    </p>
                    <h2
                      id="booking-requests-heading"
                      className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground"
                    >
                      Decide with intent.
                    </h2>
                  </div>
                  <span className="hidden shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
                    {requestBookings.length} pending
                  </span>
                </div>
                <BookingRequests
                  bookings={requestBookings}
                  onChange={setBookings}
                  onError={setError}
                />
              </section>

              <section aria-labelledby="upcoming-heading">
                <div className="mb-5 flex items-end justify-between gap-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      This week
                    </p>
                    <h2
                      id="upcoming-heading"
                      className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground"
                    >
                      Upcoming sessions.
                    </h2>
                  </div>
                  <span className="hidden shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
                    {confirmedBookings.length} sessions
                  </span>
                </div>
                <ConfirmedSessions bookings={confirmedBookings} />
              </section>

              <section>
                <AvailabilityManager
                  slots={availabilities}
                  onChange={setAvailabilities}
                  onError={setError}
                />
              </section>

              <section>
                <CourseManager
                  courses={courses}
                  onChange={setCourses}
                  onError={setError}
                />
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <TeacherProfileCard profile={profile} />

              <NotificationPanel
                notifications={notifications}
                onRead={async () => setNotifications(await api.get<NotificationItem[]>('/notifications/'))}
              />

              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-5 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Quick actions
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold leading-tight text-foreground">
                    Move your studio forward.
                  </h3>
                </div>
                <div className="space-y-2 p-5">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Create a course
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule a live session
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
