import React from 'react';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/dashboard/student/StatusBadge';

export function ConfirmedSessions({ bookings }: { bookings: Booking[] }) {
    if (bookings.length === 0) {
        return (
            <div className="rounded-[2rem] border border-primary/15 bg-linear-to-br from-white via-[#f8fbf6] to-[#edf6e8] p-10 text-center ring-1 ring-accent/20 shadow-[0_26px_60px_rgba(15,61,46,0.12)] animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto mb-3 h-14 w-14 rounded-2xl border border-primary/20 bg-white/80 text-2xl text-primary flex items-center justify-center">⟳</div>
                <p className="text-secondary/50 font-black text-base">No upcoming sessions</p>
                <p className="text-secondary/35 text-sm mt-1">Approved sessions will orbit here in chronological order.</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary/55 font-bold mt-4">Session Orbit</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {bookings.map((b, index) => {
                const studentName = (b as Booking & { student_name?: string }).student_name || 'Student';
                return (
                    <div
                        key={b.id}
                        className="relative overflow-hidden bg-linear-to-r from-white via-[#f9fcf7] to-[#f1f8ec] border border-primary/14 ring-1 ring-primary/12 rounded-[1.35rem] p-5 hover:shadow-[0_22px_45px_rgba(15,61,46,0.18)] transition-all"
                    >
                        <div className="pointer-events-none absolute top-0 left-0 h-full w-1.5 bg-linear-to-b from-primary/80 via-primary/35 to-transparent" />
                        <div className="pointer-events-none absolute -bottom-8 -right-6 h-24 w-24 rounded-full bg-accent/18 blur-2xl" />

                        <div className="flex items-center gap-3 pl-2">
                            <div className="h-10 w-10 shrink-0 rounded-xl border border-primary/20 bg-white/80 flex items-center justify-center font-black text-primary text-sm">
                                {index + 1}
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-secondary text-sm tracking-[0.01em]">{studentName}</p>
                                <p className="text-xs text-secondary/45">
                                    {new Date(b.start_at).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}{' '}
                                    ·{' '}
                                    {new Date(b.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-flex text-[10px] uppercase tracking-[0.16em] font-bold text-secondary/35 border border-primary/15 rounded-full px-2.5 py-1 bg-white/70">
                                Upcoming
                            </span>
                            <StatusBadge status={b.status} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
