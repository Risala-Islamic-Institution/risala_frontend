"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { clearToken, getToken } from '@/lib/auth';

interface TeacherProfile {
  id: string;
  verification_status?: string;
  user?: {
    full_name?: string;
    username?: string;
  };
}

interface StudentProfile {
  id: string;
  current_level?: string;
  enrollment_status?: string;
}

interface Booking {
  id: string;
  teacher: string;
  teacher_name?: string | null;
  start_at: string;
  end_at: string;
  status: string;
}

interface EnrollmentItem {
  id: string;
  course: { id: string; slug: string; title: string };
  progress_percent: number;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [teacherId, setTeacherId] = useState('');
  const [slots, setSlots] = useState<Array<{start_at:string; end_at:string}>>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const token = getToken();
        if (!token) {
          window.location.href = '/login';
          return;
        }
        // Ensure current user is student
        const me = await api.get<{ primary_role?: string; roles?: { name: string }[] }>('/auth/user/');
        const role = (me.primary_role || me.roles?.[0]?.name || '').toUpperCase();
        if (!role) {
          setError('Your account has no role assigned. Please contact support.');
          setLoading(false);
          return;
        }
        if (role === 'USTAZ') {
          window.location.href = '/dashboard/ustaz';
          return;
        }
        if (role !== 'STUDENT') {
          setError('Your account is not allowed to access the student dashboard.');
          setLoading(false);
          return;
        }

        // Parallelize dashboard data fetches for faster load
        const [prof, teacherList] = await Promise.all([
          api.get<{ type?: string; profile?: StudentProfile }>('/users/profile/'),
          api.get<TeacherProfile[]>('/teachers/'),
        ]);
        if (prof.type === 'student' && prof.profile) {
          setProfile(prof.profile);
        }
        setTeachers(teacherList);

        await Promise.all([loadBookings(), loadNotifications(), loadEnrollments()]);
      } catch (e) {
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/', {});
    } catch (e) {
      /* ignore */
    }
    clearToken();
    window.location.href = '/login';
  };

  const fetchSlots = async () => {
    try {
      if (!teacherId) return;
      const res = await api.get<{slots: Array<{start_at:string; end_at:string}>}>(`/availability/slots?teacher_id=${teacherId}&days=14&slot_minutes=60`);
      setSlots(res.slots || []);
    } catch (e) {
      setError('Failed to fetch slots');
    }
  };

  const loadBookings = async () => {
    try {
      const res = await api.get<Booking[]>('/bookings/');
      setBookings(res);
    } catch (e) {
      setError('Failed to load bookings');
    }
  };

  const loadEnrollments = async () => {
    try {
      const res = await api.get<EnrollmentItem[]>("/enrollments/");
      setEnrollments(res);
    } catch (e) {
      setError('Failed to load enrollments');
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await api.post(`/bookings/${id}/cancel/`, {});
      await loadBookings();
      await fetchSlots();
      await loadNotifications();
    } catch (e) {
      setError('Cancellation failed');
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await api.get<NotificationItem[]>('/notifications/');
      setNotifications(res);
    } catch (e) {
      setError('Failed to load notifications');
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read/`, {});
      await loadNotifications();
    } catch (e) {
      setError('Failed to update notification');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header using Deep Emerald Serenity */}
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-white/80">Your learning hub: sessions, progress, and feedback</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-white text-white hover:bg-white/10">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Sessions aligned with sequence diagram */}
        <section className="md:col-span-2 bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Upcoming Sessions</h2>
          <p className="text-secondary/70 mb-3">Join scheduled live sessions when the time comes.</p>
          {/* TODO: Integrate actual sessions endpoint: LiveSession + SessionParticipant */}
          <div className="text-secondary/60">No upcoming sessions yet.</div>
        </section>

        {/* Notifications per use case UC-24 */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Notifications</h2>
          {notifications.length === 0 ? (
            <div className="text-secondary/60">You're all caught up.</div>
          ) : (
            <ul className="divide-y divide-neutral/60">
              {notifications.map(n => (
                <li key={n.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-primary">{n.title}</div>
                    {n.body ? <div className="text-secondary/70 text-sm">{n.body}</div> : null}
                    <div className="text-xs text-secondary/60">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  {!n.is_read && (
                    <Button variant="secondary" onClick={()=>markRead(n.id)}>Mark read</Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Booking & Slot discovery */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Bookings</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                className="border rounded-lg px-3 py-2"
                value={teacherId}
                onChange={e=>setTeacherId(e.target.value)}
              >
                <option value="">Select a teacher</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.user?.full_name || t.user?.username || 'Teacher'}
                  </option>
                ))}
              </select>
              <Button variant="primary" onClick={fetchSlots} disabled={!teacherId}>Find Slots</Button>
            </div>
            {slots.length === 0 ? (
              <div className="text-secondary/60">No slots found. Pick a teacher and search.</div>
            ) : (
              <ul className="text-secondary/80 space-y-2">
                {slots.map(s => (
                  <li key={s.start_at} className="flex items-center justify-between">
                    <span>{new Date(s.start_at).toLocaleString()} - {new Date(s.end_at).toLocaleTimeString()}</span>
                    <Button
                      variant="accent"
                      onClick={async ()=>{
                        try {
                          await api.post('/bookings/', { teacher: teacherId, start_at: s.start_at, end_at: s.end_at });
                          // Optional: refresh slots to reflect booking removed
                          fetchSlots();
                          loadBookings();
                        } catch (e) {
                          const message = e instanceof Error ? e.message : 'Booking failed';
                          if (message.includes('Only students can create bookings')) {
                            setError('Only students can create bookings. Please complete student registration.');
                          } else {
                            setError(message);
                          }
                        }
                      }}
                    >Book</Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* My Bookings */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm md:col-span-2">
          <h2 className="text-primary font-semibold mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-secondary/60">No bookings yet.</div>
          ) : (
            <ul className="divide-y divide-neutral/60">
              {bookings.map(b => (
                <li key={b.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="space-y-1">
                    <div className="font-semibold text-primary">{b.teacher_name || 'Teacher'}</div>
                    <div className="text-secondary/70">
                      {new Date(b.start_at).toLocaleString()} - {new Date(b.end_at).toLocaleTimeString()}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-secondary/60">{b.status}</div>
                  </div>
                  {b.status === 'PENDING' && (
                    <Button variant="secondary" onClick={() => cancelBooking(b.id)}>
                      Cancel
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Learning Progress per Enrollment + LessonProgress */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm md:col-span-2">
          <h2 className="text-primary font-semibold mb-4">Course Progress</h2>
          {enrollments.length === 0 ? (
            <div className="text-secondary/60">Start a course to see progress here.</div>
          ) : (
            <ul className="divide-y divide-neutral/60">
              {enrollments.map(e => (
                <li key={e.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-primary">{e.course?.title || 'Course'}</div>
                    <div className="text-secondary/70 text-sm">{e.progress_percent}% complete</div>
                  </div>
                  <Button variant="secondary" onClick={()=>{window.location.href = `/dashboard/student/courses/${e.course?.slug}`;}}>Open</Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Actions */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="primary" className="w-full">Browse Instructors</Button>
            <Button variant="secondary" className="w-full" onClick={()=>{window.location.href='/dashboard/student/courses';}}>Browse Courses</Button>
            <Button variant="outline" className="w-full" onClick={()=>{window.location.href='/dashboard/student/certificates';}}>My Certificates</Button>
          </div>
        </section>
      </main>

      {error && (
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="p-3 bg-error/10 text-error rounded-lg">{error}</div>
        </div>
      )}
    </div>
  );
}
