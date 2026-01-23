"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface TeacherProfile {
  id: string;
  verification_status?: string;
  specialization?: string;
  teaching_level?: string;
  hourly_rate?: string;
}

export default function UstazDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const me = await api.get<{ primary_role?: string; roles?: { name: string }[] }>('/auth/user/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        const role = (me.primary_role || me.roles?.[0]?.name || '').toUpperCase();
        if (role !== 'USTAZ') {
          window.location.href = '/dashboard/student';
          return;
        }
        const prof = await api.get<{ type?: string; profile?: TeacherProfile }>(
          '/users/profile/',
          { headers: { 'Authorization': `Token ${token}` } }
        );
        if (prof.type === 'teacher' && prof.profile) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header mirrors student dashboard */}
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold">Ustaz Dashboard</h1>
          <p className="text-white/80">Your teaching hub: sessions, availability, and bookings</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <section className="md:col-span-2 bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Upcoming Sessions</h2>
          <p className="text-secondary/70 mb-3">Host scheduled live sessions when the time comes.</p>
          <div className="text-secondary/60">No upcoming sessions yet.</div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Notifications</h2>
          <div className="text-secondary/60">You're all caught up.</div>
        </section>

        {/* Bookings / Requests */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Bookings</h2>
          <div className="space-y-2 text-secondary/70">
            <div className="text-secondary/60">No bookings yet.</div>
          </div>
        </section>

        {/* Availability slot mirrors student Progress positioning */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm md:col-span-2">
          <h2 className="text-primary font-semibold mb-4">Availability</h2>
          <p className="text-secondary/70 mb-3">Set time slots so students can book sessions.</p>
          <div className="text-secondary/60">No availability configured.</div>
          <div className="mt-4">
            <Button variant="primary">Manage Availability</Button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="primary" className="w-full">Create Course</Button>
            <Button variant="secondary" className="w-full">Schedule Live Session</Button>
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
