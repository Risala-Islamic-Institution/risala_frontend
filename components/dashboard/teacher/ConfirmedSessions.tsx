import React from 'react';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/dashboard/student/StatusBadge';

export function ConfirmedSessions({ bookings }: { bookings: Booking[] }) {
    if (bookings.length === 0) {
        return (
            <div className="bg-white border-2 border-dashed border-neutral/40 rounded-3xl p-10 text-center animate-in fade-in zoom-in-95 duration-500">
                <p className="text-secondary/30 font-medium">No upcoming sessions</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {bookings.map((b) => {
                // @ts-ignore
                const studentName = b.student_name || 'Student';
                return (
                    <div
                        key={b.id}
                        className="bg-white border border-neutral/30 rounded-2xl p-5 flex items-center justify-between hover:shadow-md hover:shadow-primary/5 transition-all"
                    >
                        <div className="space-y-1">
                            <p className="font-bold text-secondary text-sm">{studentName}</p>
                            <p className="text-xs text-secondary/40">
                                {new Date(b.start_at).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })}{' '}
                                ·{' '}
                                {new Date(b.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <StatusBadge status={b.status} />
                    </div>
                );
            })}
        </div>
    );
}
