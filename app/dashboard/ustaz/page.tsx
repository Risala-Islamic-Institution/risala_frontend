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

interface Booking {
  id: string;
  student_name?: string | null;
  start_at: string;
  end_at: string;
  status: string;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration_type: string;
  total_weeks: number;
  price: string;
  is_published: boolean;
}

export default function UstazDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [availabilities, setAvailabilities] = useState<Array<{id:string; day_of_week:number; start_time:string; end_time:string; timezone:string; is_active:boolean}>>([]);
  const [form, setForm] = useState({ day_of_week: 1, start_time: '09:00', end_time: '11:00', timezone: 'UTC' });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'QURAN',
    level: 'BEGINNER',
    duration_type: 'FIXED',
    total_weeks: 4,
    syllabus: '',
    prerequisites: '',
    price: '0',
  });
  const [savingCourse, setSavingCourse] = useState(false);
  const [publishing, setPublishing] = useState<string | null>(null);

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
        if (!role) {
          setError('Your account has no role assigned. Please contact support.');
          setLoading(false);
          return;
        }
        if (role !== 'USTAZ') {
          window.location.href = '/dashboard/student';
          return;
        }
        const [prof, myAvail, myBookings, notes, myCourses] = await Promise.all([
          api.get<{ type?: string; profile?: TeacherProfile }>('/users/profile/'),
          api.get<Array<any>>('/availability'),
          api.get<Booking[]>('/bookings/'),
          api.get<NotificationItem[]>('/notifications/'),
          api.get<Course[]>('/courses/'),
        ]);
        if (prof.type === 'teacher' && prof.profile) {
          setProfile(prof.profile);
        }
        setAvailabilities(myAvail);
        setBookings(myBookings);
        setNotifications(notes);
        setCourses(myCourses);
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
                    <Button
                      variant="secondary"
                      onClick={async ()=>{
                        try {
                          await api.post(`/notifications/${n.id}/read/`, {});
                          const notes = await api.get<NotificationItem[]>('/notifications/');
                          setNotifications(notes);
                        } catch (e) {
                          setError('Failed to update notification.');
                        }
                      }}
                    >Mark read</Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Bookings / Requests */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-secondary/60">No bookings yet.</div>
          ) : (
            <ul className="divide-y divide-neutral/60">
              {bookings.map(b => (
                <li key={b.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="space-y-1">
                    <div className="font-semibold text-primary">{b.student_name || 'Student'}</div>
                    <div className="text-secondary/70">{new Date(b.start_at).toLocaleString()} - {new Date(b.end_at).toLocaleTimeString()}</div>
                    <div className="text-xs uppercase tracking-wide text-secondary/60">{b.status}</div>
                  </div>
                  {b.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        disabled={busy === b.id}
                        onClick={async ()=>{
                          try {
                            setBusy(b.id);
                            await api.post(`/bookings/${b.id}/confirm/`, {});
                            const refreshed = await api.get<Booking[]>('/bookings/');
                            setBookings(refreshed);
                          } catch (e) {
                            setError('Failed to confirm booking.');
                          } finally {
                            setBusy(null);
                          }
                        }}
                      >Confirm</Button>
                      <Button
                        variant="secondary"
                        disabled={busy === b.id}
                        onClick={async ()=>{
                          try {
                            setBusy(b.id);
                            await api.post(`/bookings/${b.id}/decline/`, {});
                            const refreshed = await api.get<Booking[]>('/bookings/');
                            setBookings(refreshed);
                          } catch (e) {
                            setError('Failed to decline booking.');
                          } finally {
                            setBusy(null);
                          }
                        }}
                      >Decline</Button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
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

        {/* Courses management */}
        <section id="courses-section" className="bg-white rounded-xl border border-neutral p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-primary font-semibold">Courses</h2>
              <p className="text-secondary/70 text-sm">Create, publish, and manage your courses.</p>
            </div>
            <Button
              variant="primary"
              isLoading={savingCourse}
              onClick={async ()=>{
                try {
                  setSavingCourse(true);
                  await api.post('/courses/', {
                    ...courseForm,
                    total_weeks: Number(courseForm.total_weeks || 0),
                    price: courseForm.price || '0',
                  });
                  const refreshed = await api.get<Course[]>('/courses/');
                  setCourses(refreshed);
                  setCourseForm({
                    title: '',
                    description: '',
                    category: 'QURAN',
                    level: 'BEGINNER',
                    duration_type: 'FIXED',
                    total_weeks: 4,
                    syllabus: '',
                    prerequisites: '',
                    price: '0',
                  });
                } catch (e) {
                  setError('Failed to save course.');
                } finally {
                  setSavingCourse(false);
                }
              }}
            >Save Course</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input className="border rounded-lg px-3 py-2" placeholder="Title" value={courseForm.title} onChange={e=>setCourseForm(f=>({...f, title: e.target.value}))} />
            <input className="border rounded-lg px-3 py-2" placeholder="Price" value={courseForm.price} onChange={e=>setCourseForm(f=>({...f, price: e.target.value}))} />
            <textarea className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Description" value={courseForm.description} onChange={e=>setCourseForm(f=>({...f, description: e.target.value}))} />
            <textarea className="border rounded-lg px-3 py-2" placeholder="Syllabus (optional)" value={courseForm.syllabus} onChange={e=>setCourseForm(f=>({...f, syllabus: e.target.value}))} />
            <textarea className="border rounded-lg px-3 py-2" placeholder="Prerequisites (optional)" value={courseForm.prerequisites} onChange={e=>setCourseForm(f=>({...f, prerequisites: e.target.value}))} />
            <select className="border rounded-lg px-3 py-2" value={courseForm.category} onChange={e=>setCourseForm(f=>({...f, category: e.target.value}))}>
              {['QURAN','TAJWEED','ARABIC','TAFSIR','HIFZ','FIQH','AQEEDAH'].map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border rounded-lg px-3 py-2" value={courseForm.level} onChange={e=>setCourseForm(f=>({...f, level: e.target.value}))}>
              {['BEGINNER','INTERMEDIATE','ADVANCED'].map(l=> <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="border rounded-lg px-3 py-2" value={courseForm.duration_type} onChange={e=>setCourseForm(f=>({...f, duration_type: e.target.value}))}>
              {['FIXED','SUBSCRIPTION'].map(d=> <option key={d} value={d}>{d}</option>)}
            </select>
            <input className="border rounded-lg px-3 py-2" type="number" min={0} placeholder="Total weeks" value={courseForm.total_weeks} onChange={e=>setCourseForm(f=>({...f, total_weeks: Number(e.target.value)}))} />
          </div>

          <div className="space-y-3">
            {courses.length === 0 ? (
              <div className="text-secondary/60">No courses yet. Add one above.</div>
            ) : (
              <ul className="divide-y divide-neutral/60">
                {courses.map(c => (
                  <li key={c.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-semibold text-primary">{c.title}</div>
                      <div className="text-secondary/70 text-sm">{c.category} • {c.level} • {c.duration_type}</div>
                      <div className="text-xs text-secondary/60">{c.is_published ? 'Published' : 'Draft'}</div>
                    </div>
                    <div className="flex gap-2">
                      {c.is_published ? (
                        <Button
                          variant="secondary"
                          isLoading={publishing === c.slug}
                          onClick={async ()=>{
                            try {
                              setPublishing(c.slug);
                              await api.post(`/courses/${c.slug}/unpublish/`, {});
                              const refreshed = await api.get<Course[]>('/courses/');
                              setCourses(refreshed);
                            } catch (e) {
                              setError('Failed to unpublish course.');
                            } finally {
                              setPublishing(null);
                            }
                          }}
                        >Unpublish</Button>
                      ) : (
                        <Button
                          variant="primary"
                          isLoading={publishing === c.slug}
                          onClick={async ()=>{
                            try {
                              setPublishing(c.slug);
                              await api.post(`/courses/${c.slug}/publish/`, {});
                              const refreshed = await api.get<Course[]>('/courses/');
                              setCourses(refreshed);
                            } catch (e) {
                              setError('Failed to publish course.');
                            } finally {
                              setPublishing(null);
                            }
                          }}
                        >Publish</Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white rounded-xl border border-neutral p-6 shadow-sm">
          <h2 className="text-primary font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={()=>{
                const el = document.getElementById('courses-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >Create Course</Button>
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
