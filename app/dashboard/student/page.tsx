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
  loading: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-neutral/5 rounded-2xl" />)}
  </div>
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

        // Verification logic for Stripe redirect
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get('session_id');
        if (sessionId) {
          try {
            setSuccess('Verifying payment status...');
            await api.post('/payments/verify-session/', { session_id: sessionId });
            setSuccess('Payment confirmed! Your lessons are now active.');
            setBookings(await api.get<Booking[]>('/bookings/'));
            // Switch to learning tab on success
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
      setSuccess('Session request sent! Your teacher will review it shortly.');
      setBookingTeacher(null);
      setBookings(await api.get<Booking[]>('/bookings/'));
      setActiveTab('learning'); // Auto-switch to learning
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to request session.';
      setError(message);
    }
    finally { setSubmitting(false); }
  };

  const handlePayBooking = async (bookingId: string) => {
    setPayingId(bookingId); setError(null);
    try {
      console.log('Paying for booking:', bookingId);
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
      console.log('Paying for order:', orderId);
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
  }

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

  const handleLogout = () => { clearToken(); window.location.href = '/auth/login'; };

  const activeBookings = bookings.filter(b => ['REQUESTED', 'APPROVED', 'RESERVED', 'CONFIRMED'].includes(b.status));

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <span className="text-secondary/60 text-sm font-medium tracking-wide">Loading...</span>
      </div>
    </div>
  );

  return (
    <AuthGuard allowedRoles={['STUDENT']}>
      <div className="min-h-screen islamic-page-shell pb-20">
        {/* 1. New Dashboard Header */}
        <DashboardHeader
          profile={profile}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'browse', label: 'Browse Teachers' },
            { id: 'learning', label: 'My Learning' },
            { id: 'profile', label: 'Profile' },
          ]}
          onLogout={handleLogout}
          userType="student"
        />

        {/* 2. Sub-Navigation / Filters (Only for Browse) */}
        {activeTab === 'browse' && (
          <div className="max-w-7xl mx-auto px-6 py-6 animate-in slide-in-from-top-2">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 pt-4">
          <section className="hero-lamp gold-shine rounded-3xl px-8 py-10 md:px-10 md:py-12 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-2 space-y-4">
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/90">Student Sanctuary</p>
                <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">Learn with Focus, Grow with Barakah</h1>
                <p className="text-white/80 max-w-2xl">
                  Discover trusted teachers, request sessions, and follow your learning rhythm in a calm and inspiring Islamic environment.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
                  <p className="text-white text-2xl font-black">{teachers.length}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-bold">Teachers</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
                  <p className="text-white text-2xl font-black">{activeBookings.length}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-bold">Active</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 3. Main Content */}
        <main className="max-w-7xl mx-auto px-6">
          {/* Global Toasts */}
          {error && (
            <div onClick={() => setError(null)} className="cursor-pointer mb-8 p-4 bg-error/10 border border-error/20 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-error text-sm font-medium">{error}</span>
            </div>
          )}
          {success && (
            <div onClick={() => setSuccess(null)} className="cursor-pointer mb-8 p-4 bg-success/10 border border-success/20 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-success text-sm font-medium">{success}</span>
            </div>
          )}

          {/* View Switching */}
          {activeTab === 'browse' && (
            <section className="glass-card rounded-3xl p-5 md:p-7 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-secondary">Browse Teachers</h2>
                  <p className="text-secondary/65">Choose a mentor aligned with your goals and schedule.</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary/70">Guided Matching</span>
              </div>
              <TeacherGrid
                teachers={teachers}
                onBook={handleRequestSession}
                onPackage={(t) => { setSelectedTeacher(t); setShowPackageScheduler(true); }}
              />
            </section>
          )}

          {activeTab === 'learning' && (
            <section className="glass-card rounded-3xl p-5 md:p-7 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-secondary">My Learning Journey</h2>
                  <p className="text-secondary/65">Track session requests, approvals, and upcoming lessons.</p>
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary/70">Progress Stream</span>
              </div>
              <BookingList
                bookings={activeBookings}
                payingId={payingId}
                onPay={handlePayWrapper}
                onBrowse={() => setActiveTab('browse')}
              />
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="glass-card rounded-3xl p-5 md:p-7 animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="mb-5">
                <h2 className="text-2xl font-black text-secondary">Profile & Learning Identity</h2>
                <p className="text-secondary/65">Keep your goals and account details up to date.</p>
              </div>
              <ProfileView
                profile={profile}
                bookings={bookings}
                activeCount={activeBookings.length}
              />
            </section>
          )}
        </main>

        {/* ═══════ MODALS ═══════ */}
        {/* Package Scheduler */}
        {showPackageScheduler && selectedTeacher && (
          <div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-background shadow-2xl">
              <PackageScheduler teacher={selectedTeacher} onCancel={() => { setShowPackageScheduler(false); setSelectedTeacher(null); }} onSuccess={handlePackageSuccess} />
            </div>
          </div>
        )}

        {/* Book Session Modal */}
        {bookingTeacher && (
          <div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-3xl shadow-2xl border border-neutral/50 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-primary px-8 py-6">
                <h2 className="text-white text-xl font-bold">Book a Session</h2>
                <p className="text-white/50 text-sm">with {bookingTeacher.user.full_name}</p>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {fetchingSlots ? (
                  <div className="text-center py-10">Loading availability...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-10 text-secondary/50">No slots available.</div>
                ) : (
                  <>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-4">Select Time</p>
                      <div className="grid grid-cols-1 gap-2">
                        {availableSlots.map(slot => (
                          <button key={slot.id}
                            onClick={() => { setSelectedSlot(slot); setBookingDate(''); }}
                            className={`p-4 rounded-xl border text-left transition-all ${selectedSlot?.id === slot.id ? 'border-accent bg-accent/10 text-primary font-bold shadow-sm' : 'border-neutral/40 hover:bg-neutral/5'
                              }`}
                          >
                            <div className="flex justify-between">
                              <span>{DAYS[slot.day_of_week]}</span>
                              <span>{slot.start_time} - {slot.end_time}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedSlot && (
                      <div className="animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-4">Select Date</p>
                        <div className="grid grid-cols-2 gap-2">
                          {getNextDatesForDay(selectedSlot.day_of_week).map(d => (
                            <button key={d} onClick={() => setBookingDate(d)}
                              className={`p-3 rounded-xl border text-sm font-medium transition-all ${bookingDate === d ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'border-neutral/40 hover:bg-neutral/5'
                                }`}
                            >
                              {new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-neutral/20 bg-neutral/5 flex gap-3">
                <button onClick={() => setBookingTeacher(null)} className="flex-1 py-3 text-sm font-bold text-secondary/60 hover:text-secondary rounded-xl hover:bg-neutral/10 transition-colors">Cancel</button>
                <Button className="flex-1 rounded-xl" variant="primary" disabled={!selectedSlot || !bookingDate || submitting} onClick={handleSubmitBooking} isLoading={submitting}>
                  Confirm Request
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
