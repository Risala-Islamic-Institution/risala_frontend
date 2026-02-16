"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { clearToken, getToken } from '@/lib/auth';
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
      <div className="min-h-screen bg-background pb-20">
        {/* ═══════ HEADER ═══════ */}
        <DashboardHeader
          profile={user}
          onLogout={handleLogout}
          userType="teacher"
        />

        <div className="pt-2"></div>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {error && (
            <div className="p-4 bg-[#B5473F]/10 border border-[#B5473F]/20 rounded-2xl flex justify-between items-center cursor-pointer" onClick={() => setError('')}>
              <span className="text-[#B5473F] text-sm font-medium">{error}</span>
            </div>
          )}

          {/* ═══════ Stats ═══════ */}
          <TeacherStats
            requests={requestBookings.length}
            confirmed={confirmedBookings.length}
            courses={courses.length}
            slots={availabilities.filter(a => a.is_active).length}
          />

          {/* ═══════ MAIN GRID ═══════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left Column ── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Booking Requests */}
              <section>
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
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-secondary">Upcoming Sessions</h2>
                  <span className="text-[10px] font-bold tracking-[.15em] uppercase text-secondary/30">{confirmedBookings.length} Sessions</span>
                </div>
                <ConfirmedSessions bookings={confirmedBookings} />
              </section>

              {/* Availability */}
              <AvailabilityManager
                slots={availabilities}
                onChange={setAvailabilities}
                onError={setError}
              />

              {/* Courses */}
              <CourseManager
                courses={courses}
                onChange={setCourses}
                onError={setError}
              />
            </div>

            {/* ── Right Sidebar ── */}
            <div className="space-y-6">
              <TeacherProfileCard profile={profile} />

              <NotificationPanel
                notifications={notifications}
                onRead={async () => setNotifications(await api.get<NotificationItem[]>('/notifications/'))}
              />

              {/* Quick Actions */}
              <div className="bg-accent/5 border border-accent/10 rounded-2xl p-5 space-y-3">
                <p className="text-accent text-[10px] font-bold tracking-[.15em] uppercase">Quick Actions</p>
                <Button variant="primary" className="w-full rounded-xl" onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  Create Course
                </Button>
                <Button variant="outline" className="w-full rounded-xl">
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
