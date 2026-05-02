"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { clearToken } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import AuthGuard from '@/components/AuthGuard';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TeacherProfile, Booking, NotificationItem, Course, Slot, UserProfile } from '@/types';

// Components - Lazy Loaded for Performance
const TeacherStats = dynamic(() => import('@/components/dashboard/teacher/TeacherStats').then(mod => mod.TeacherStats), {
  loading: () => <div className="h-32 bg-neutral/5 rounded-2xl animate-pulse" />
});
const BookingRequests = dynamic(() => import('@/components/dashboard/teacher/BookingRequests').then(mod => mod.BookingRequests));
const ConfirmedSessions = dynamic(() => import('@/components/dashboard/teacher/ConfirmedSessions').then(mod => mod.ConfirmedSessions));
const AvailabilityManager = dynamic(() => import('@/components/dashboard/teacher/AvailabilityManager').then(mod => mod.AvailabilityManager));
const CourseManager = dynamic(() => import('@/components/dashboard/teacher/CourseManager').then(mod => mod.CourseManager));
const TeacherProfileCard = dynamic(() => import('@/components/dashboard/teacher/TeacherProfileCard').then(mod => mod.TeacherProfileCard), {
  loading: () => <div className="h-48 bg-primary/10 rounded-3xl animate-pulse mb-6" />
});
const NotificationPanel = dynamic(() => import('@/components/dashboard/teacher/NotificationPanel').then(mod => mod.NotificationPanel));

// ... imports remain ...

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <span className="text-secondary/60 text-sm font-medium tracking-wide">Loading dashboard...</span>
        </div>
      </div>
    </AuthGuard>
  );

  return (
    <AuthGuard allowedRoles={['USTAZ']}>
      <div className="min-h-screen islamic-page-shell pb-20">
        {/* ═══════ HEADER ═══════ */}
        <DashboardHeader
          profile={user}
          onLogout={handleLogout}
          userType="teacher"
        />

        <div className="max-w-7xl mx-auto px-6 pt-4">
          <section className="hero-lamp gold-shine rounded-3xl px-8 py-10 md:px-10 md:py-12 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2 space-y-4">
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/90">Ustaz Command Center</p>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">Teach with Presence, Lead with Wisdom</h1>
                <p className="text-white/80 max-w-2xl">
                  Manage requests, publish courses, and shape meaningful sessions in a bright and polished educator workspace.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
                  <p className="text-white text-2xl font-black">{requestBookings.length}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-bold">Requests</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
                  <p className="text-white text-2xl font-black">{confirmedBookings.length}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-bold">Sessions</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {error && (
            <div className="p-4 bg-[#B5473F]/10 border border-[#B5473F]/20 rounded-2xl flex justify-between items-center cursor-pointer" onClick={() => setError('')}>
              <span className="text-[#B5473F] text-sm font-medium">{error}</span>
            </div>
          )}

          {/* ═══════ Stats ═══════ */}
          <section className="glass-card rounded-3xl p-5 md:p-7">
            <TeacherStats
              requests={requestBookings.length}
              confirmed={confirmedBookings.length}
              courses={courses.length}
              slots={availabilities.filter(a => a.is_active).length}
            />
          </section>

          {/* ═══════ MAIN GRID ═══════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left Column ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Booking Requests */}
              <section className="glass-card rounded-3xl p-5 md:p-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-secondary">Booking Requests</h2>
                  <span className="text-[10px] font-bold tracking-[.15em] uppercase text-secondary/30">{requestBookings.length} Pending</span>
                </div>
                <BookingRequests
                  bookings={requestBookings}
                  onChange={setBookings}
                  onError={setError}
                />
              </section>

              {/* Confirmed Sessions */}
              <section className="glass-card rounded-3xl p-5 md:p-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-secondary">Upcoming Sessions</h2>
                  <span className="text-[10px] font-bold tracking-[.15em] uppercase text-secondary/30">{confirmedBookings.length} Sessions</span>
                </div>
                <ConfirmedSessions bookings={confirmedBookings} />
              </section>

              {/* Availability */}
              <section className="glass-card rounded-3xl p-5 md:p-7">
                <AvailabilityManager
                  slots={availabilities}
                  onChange={setAvailabilities}
                  onError={setError}
                />
              </section>

              {/* Courses */}
              <section className="glass-card rounded-3xl p-5 md:p-7">
                <CourseManager
                  courses={courses}
                  onChange={setCourses}
                  onError={setError}
                />
              </section>
            </div>

            {/* ── Right Sidebar ── */}
            <div className="space-y-6">
              <section className="glass-card rounded-3xl p-5 md:p-6">
                <TeacherProfileCard profile={profile} />
              </section>

              <section className="glass-card rounded-3xl p-5 md:p-6">
                <NotificationPanel
                  notifications={notifications}
                  onRead={async () => setNotifications(await api.get<NotificationItem[]>('/notifications/'))}
                />
              </section>

              {/* Quick Actions */}
              <div className="hero-lamp rounded-2xl p-5 space-y-3 border border-accent/35">
                <p className="text-accent text-[10px] font-bold tracking-[.15em] uppercase">Quick Actions</p>
                <Button variant="primary" className="w-full rounded-xl" onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  Create Course
                </Button>
                <Button variant="outline" className="w-full rounded-xl border-white/35 text-white hover:bg-white/10 hover:text-white">
                  Schedule Live Session
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
