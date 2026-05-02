"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { api } from '@/lib/api';
import { clearToken } from '@/lib/auth';
import { UserProfile, Booking, Teacher, Availability } from '@/types';

// UI Components
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CategoryFilter } from '@/components/dashboard/CategoryFilter';
import { Button } from '@/components/ui/Button';
import AuthGuard from '@/components/AuthGuard';

// Lazy Loaded Components
const TeacherGrid = dynamic(() => import('@/components/dashboard/student/TeacherGrid').then(mod => mod.TeacherGrid), {
  loading: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map(i => <div key={i} className="h-72 rounded-xl border border-border bg-muted animate-pulse" />)}
    </div>
  )
});
const BookingList = dynamic(() => import('@/components/dashboard/student/BookingList').then(mod => mod.BookingList));
const ProfileView = dynamic(() => import('@/components/dashboard/student/ProfileView').then(mod => mod.ProfileView));
const PackageScheduler = dynamic(() => import('@/components/dashboard/PackageScheduler').then(mod => mod.PackageScheduler));

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [activeCategory, setActiveCategory] = useState('all');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showPackageScheduler, setShowPackageScheduler] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Single-session booking state
  const [bookingTeacher, setBookingTeacher] = useState<Teacher | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Availability[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  /* ── Data Loading & Verification ── */
  useEffect(() => {
    (async () => {
      try {
        const [p, b, t] = await Promise.all([
          api.get<UserProfile>('/users/profile/'),
          api.get<Booking[]>('/bookings/'),
          api.get<Teacher[]>('/teachers/'),
        ]);
        setProfile(p); setBookings(b); setTeachers(t);

        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        if (sessionId) {
          try {
            setSuccess('Verifying payment status...');
            await api.post('/payments/verify-session/', { session_id: sessionId });
            setSuccess('Payment confirmed. Your lessons are now active.');
            setBookings(await api.get<Booking[]>('/bookings/'));
            setActiveTab('learning');
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch {
            setError('Payment verification failed. Please refresh or contact support.');
          }
        }
      } catch { setError('Failed to load dashboard.'); }
      finally { setLoading(false); }
    })();
  }, []);

  /* ── Handlers ── */
  const handleRequestSession = async (teacher: Teacher) => {
    setBookingTeacher(teacher); setSelectedSlot(null); setBookingDate(''); setFetchingSlots(true); setError(null);
    try { setAvailableSlots(await api.get<Availability[]>(`/availability/?teacher_id=${teacher.id}`)); }
    catch { setError('Could not load teacher availability.'); }
    finally { setFetchingSlots(false); }
  };

  const handleSubmitBooking = async () => {
    if (!bookingTeacher || !selectedSlot || !bookingDate) return;
    setSubmitting(true); setError(null);
    try {
      await api.post('/bookings/', { teacher: bookingTeacher.id, start_at: `${bookingDate}T${selectedSlot.start_time}`, end_at: `${bookingDate}T${selectedSlot.end_time}` });
      setSuccess('Session request sent. Your Ustaz will review it shortly.');
      setBookingTeacher(null);
      setBookings(await api.get<Booking[]>('/bookings/'));
      setActiveTab('learning');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to request session.';
      setError(message);
    }
    finally { setSubmitting(false); }
  };

  const handlePayBooking = async (bookingId: string) => {
    setPayingId(bookingId); setError(null);
    try {
      const res = await api.post<{ checkout_url: string; sessionId?: string }>('/payments/create-session/', { booking_id: bookingId });
      if (res?.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      } else {
        setError('Could not get checkout URL from server.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment failed.';
      setError(message);
    }
    setPayingId(null);
  };

  const handleOrderPayment = async (orderId: string) => {
    try {
      const res = await api.post<{ checkout_url: string }>('/payments/create-session/', { order_id: orderId });
      if (res?.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        setError('Could not get checkout URL from server.');
      }
    } catch { setError('Payment initiation failed.'); }
  };

  const handlePayWrapper = (id: string, isPackage: boolean) => {
    if (isPackage) handleOrderPayment(id);
    else handlePayBooking(id);
  };

  const handlePackageSuccess = async (orderId: string) => {
    setShowPackageScheduler(false); setSelectedTeacher(null);
    handleOrderPayment(orderId);
    try { setBookings(await api.get<Booking[]>('/bookings/')); setActiveTab('learning'); } catch { }
  };

  const getNextDatesForDay = (dow: number, count = 4): string[] => {
    const dates: string[] = []; const c = new Date();
    const diff = (dow - c.getDay() + 7) % 7 || 7; c.setDate(c.getDate() + diff);
    for (let i = 0; i < count; i++) { dates.push(c.toISOString().split('T')[0]); c.setDate(c.getDate() + 7); }
    return dates;
  };

  const handleLogout = () => { clearToken(); window.location.href = '/login'; };

  const activeBookings = bookings.filter(b => ['REQUESTED', 'APPROVED', 'RESERVED', 'CONFIRMED'].includes(b.status));
  const verifiedTeachers = teachers.filter(t => t.verification_status === 'VERIFIED' || t.verification_status === 'verified').length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
        <span aria-hidden className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Loading your dashboard
        </p>
      </div>
    </div>
  );

  return (
    <AuthGuard allowedRoles={['STUDENT']}>
      <div className="min-h-screen bg-background pb-16">
        <DashboardHeader
          profile={profile}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'browse', label: 'Browse Ustaz' },
            { id: 'learning', label: 'My Learning' },
            { id: 'profile', label: 'Profile' },
          ]}
          onLogout={handleLogout}
          userType="student"
        />

        {/* Dashboard hero — editorial heading + stats rail */}
        <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 border-b border-border pb-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                As-salāmu ʿalaykum
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl text-balance">
                {profile?.full_name?.split(' ')[0] || profile?.username || 'Welcome back'}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Pick up where you left off. Browse verified Ustaz, request a session or recurring package, and follow your bookings through approval and payment in one calm flow.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-6 lg:col-span-5 lg:justify-self-end lg:text-right">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Available
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                  {teachers.length}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Verified
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                  {verifiedTeachers}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Active
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                  {activeBookings.length}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Toasts */}
          {error && (
            <div
              role="alert"
              onClick={() => setError(null)}
              className="mb-6 cursor-pointer rounded-md border border-[color:var(--error)]/25 bg-[color:var(--error)]/8 px-3.5 py-2.5 text-sm text-[color:var(--error)]"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              role="status"
              onClick={() => setSuccess(null)}
              className="mb-6 cursor-pointer rounded-md border border-[color:var(--success)]/25 bg-[color:var(--success)]/8 px-3.5 py-2.5 text-sm text-[color:var(--success)]"
            >
              {success}
            </div>
          )}

          {activeTab === 'browse' && (
            <>
              <div className="mb-6 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Teacher marketplace
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                    Verified Ustaz, chosen with care.
                  </h2>
                </div>
                <CategoryFilter
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </div>

              <TeacherGrid
                teachers={teachers}
                onBook={handleRequestSession}
                onPackage={(t) => { setSelectedTeacher(t); setShowPackageScheduler(true); }}
              />
            </>
          )}

          {activeTab === 'learning' && (
            <>
              <div className="mb-6 flex items-end justify-between gap-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    My learning
                  </p>
                  <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                    Track every session, end to end.
                  </h2>
                </div>
                <span className="hidden shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
                  {activeBookings.length} active
                </span>
              </div>
              <BookingList
                bookings={activeBookings}
                payingId={payingId}
                onPay={handlePayWrapper}
                onBrowse={() => setActiveTab('browse')}
              />
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Profile
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                  Keep your goals and details up to date.
                </h2>
              </div>
              <ProfileView
                profile={profile}
                bookings={bookings}
                activeCount={activeBookings.length}
              />
            </>
          )}
        </main>

        {/* ═══════ MODALS ═══════ */}
        {showPackageScheduler && selectedTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-elevated">
              <PackageScheduler
                teacher={selectedTeacher}
                onCancel={() => { setShowPackageScheduler(false); setSelectedTeacher(null); }}
                onSuccess={handlePackageSuccess}
              />
            </div>
          </div>
        )}

        {/* Book Session Modal */}
        {bookingTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4">
            <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
              <div className="border-b border-border px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Book a session</p>
                <h2 className="mt-1 font-display text-lg font-semibold text-foreground">
                  with {bookingTeacher.user.full_name || bookingTeacher.user.username}
                </h2>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {fetchingSlots ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">Loading availability…</div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">No slots available right now.</div>
                ) : (
                  <>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Select a window
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {availableSlots.map(slot => {
                          const active = selectedSlot?.id === slot.id;
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => { setSelectedSlot(slot); setBookingDate(''); }}
                              aria-pressed={active}
                              className={`flex items-center justify-between rounded-md border p-3.5 text-left text-sm transition-colors ${
                                active
                                  ? 'border-primary bg-[color:var(--primary)]/5 text-foreground'
                                  : 'border-border bg-card hover:border-foreground/30'
                              }`}
                            >
                              <span className="font-medium">{DAYS[slot.day_of_week]}</span>
                              <span className="tabular-nums text-muted-foreground">
                                {slot.start_time} ��� {slot.end_time}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedSlot && (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Choose a date
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {getNextDatesForDay(selectedSlot.day_of_week).map(d => {
                            const active = bookingDate === d;
                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => setBookingDate(d)}
                                aria-pressed={active}
                                className={`rounded-md border p-3 text-sm font-medium transition-colors ${
                                  active
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-card hover:border-foreground/30'
                                }`}
                              >
                                {new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-border bg-muted/40 p-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setBookingTeacher(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  disabled={!selectedSlot || !bookingDate || submitting}
                  onClick={handleSubmitBooking}
                  isLoading={submitting}
                >
                  Confirm request
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
