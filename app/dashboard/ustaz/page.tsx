"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { clearToken, getToken } from '@/lib/auth';

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
  const [availabilities, setAvailabilities] = useState<Array<{id:string; day_of_week:number; start_time:string; end_time:string; timezone:string; is_active:boolean}>>([]);
  const [form, setForm] = useState({ day_of_week: 1, start_time: '09:00', end_time: '11:00', timezone: 'UTC' });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/', {});
    } catch (e) {
      /* ignore */
    }
    clearToken();
    window.location.href = '/login';
  };

  useEffect(() => {
    const run = async () => {
      try {
        const token = getToken();
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const me = await api.get<{ primary_role?: string; roles?: { name: string }[] }>('/auth/user/');
        const role = (me.primary_role || me.roles?.[0]?.name || '').toUpperCase();
        if (role !== 'USTAZ') {
          window.location.href = '/dashboard/student';
          return;
        }
        const prof = await api.get<{ type?: string; profile?: TeacherProfile }>(
          '/users/profile/'
        );
        if (prof.type === 'teacher' && prof.profile) {
          setProfile(prof.profile);
        }
        const myAvail = await api.get<Array<any>>('/availability');
        setAvailabilities(myAvail);
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
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Ustaz Dashboard</h1>
            <p className="text-white/80">Your teaching hub: sessions, availability, and bookings</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-white text-white hover:bg-white/10">
            Logout
          </Button>
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
          <div className="space-y-3">
            {availabilities.length === 0 ? (
              <div className="text-secondary/60">No availability configured.</div>
            ) : (
              <ul className="text-secondary/80 list-disc pl-5">
                {availabilities.map(a => (
                  <li key={a.id}>
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][a.day_of_week]} {a.start_time} - {a.end_time} ({a.timezone})
                  </li>
                ))}
              </ul>
            )}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-2">
              <select className="border rounded-lg px-3 py-2" value={form.day_of_week} onChange={e=>setForm(f=>({...f, day_of_week: parseInt(e.target.value)}))}>
                {[0,1,2,3,4,5,6].map(d=> <option key={d} value={d}>{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][d]}</option>)}
              </select>
              <input className="border rounded-lg px-3 py-2" type="time" value={form.start_time} onChange={e=>setForm(f=>({...f, start_time: e.target.value}))} />
              <input className="border rounded-lg px-3 py-2" type="time" value={form.end_time} onChange={e=>setForm(f=>({...f, end_time: e.target.value}))} />
              <input className="border rounded-lg px-3 py-2" type="text" value={form.timezone} onChange={e=>setForm(f=>({...f, timezone: e.target.value}))} placeholder="Timezone e.g. Africa/Addis_Ababa" />
              <Button
                variant="primary"
                onClick={async ()=>{
                  try {
                    await api.post('/availability/', form);
                    const refreshed = await api.get<Array<any>>('/availability');
                    setAvailabilities(refreshed);
                  } catch (e) {
                    setError('Failed to add availability.');
                  }
                }}
              >Add</Button>
            </div>
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
