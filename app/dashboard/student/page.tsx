"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { clearToken, getToken } from '@/lib/auth';

interface TeacherProfile {
  id: string;
  verification_status?: string;
}

interface StudentProfile {
  id: string;
  current_level?: string;
  enrollment_status?: string;
}

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<StudentProfile | null>(null);

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
        if (role === 'USTAZ') {
          window.location.href = '/dashboard/ustaz';
          return;
        }
        // Load student profile
        const prof = await api.get<{ type?: string; profile?: StudentProfile }>(
          '/users/profile/'
        );
        if (prof.type === 'student' && prof.profile) {
          setProfile(prof.profile);
        }
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
          {/* TODO: Integrate /notifications endpoint */}
          <div className="text-secondary/60">You're all caught up.</div>
        </section>

        {/* Booking History per UC-8 */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Bookings</h2>
          {/* TODO: Integrate bookings list */}
          <div className="space-y-2 text-secondary/70">
            <div className="text-secondary/60">No bookings yet.</div>
          </div>
        </section>

        {/* Learning Progress per Enrollment + LessonProgress */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm md:col-span-2">
          <h2 className="text-primary font-semibold mb-4">Progress</h2>
          {/* TODO: Integrate lesson progress visuals */}
          <div className="text-secondary/60">Start a course to see progress here.</div>
        </section>

        {/* Actions */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="primary" className="w-full">Browse Instructors</Button>
            <Button variant="secondary" className="w-full">View Categories</Button>
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
