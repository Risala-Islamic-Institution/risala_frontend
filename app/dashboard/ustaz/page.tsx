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

        {/* Editorial intro */}
        <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Ustaz workspace
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl text-balance">
                Approve requests, manage availability, and shape your courses with calm authority.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                A focused command surface for verified Ustaz — disciplined scheduling, clear approvals, and a structured course studio.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 lg:col-span-4 lg:grid-cols-3 lg:border-t-0 lg:pt-0">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Pending</dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{requestBookings.length}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Sessions</dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{confirmedBookings.length}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Courses</dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{courses.length}</dd>
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
              <section
                className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6"
                aria-labelledby="booking-requests-heading"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 id="booking-requests-heading" className="font-display text-lg font-semibold text-foreground">
                    Booking requests
                  </h2>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {requestBookings.length} pending
                  </span>
                </div>
                <BookingRequests
                  bookings={requestBookings}
                  onChange={setBookings}
                  onError={setError}
                />
              </section>

              <section
                className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6"
                aria-labelledby="upcoming-heading"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 id="upcoming-heading" className="font-display text-lg font-semibold text-foreground">
                    Upcoming sessions
                  </h2>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {confirmedBookings.length} sessions
                  </span>
                </div>
                <ConfirmedSessions bookings={confirmedBookings} />
              </section>

              <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
                <AvailabilityManager
                  slots={availabilities}
                  onChange={setAvailabilities}
                  onError={setError}
                />
              </section>

              <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
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

              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Quick actions
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-foreground">
                  Move your studio forward
                </h3>
                <div className="mt-4 space-y-2">
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
