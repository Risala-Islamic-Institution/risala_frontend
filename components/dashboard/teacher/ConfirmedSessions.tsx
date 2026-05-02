import React from 'react';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/dashboard/student/StatusBadge';
import { Calendar } from '@/components/icons';

export function ConfirmedSessions({ bookings }: { bookings: Booking[] }) {
    if (bookings.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-card text-primary">
                    <Calendar className="h-5 w-5" />
                </span>
                <p className="font-display text-base font-semibold text-foreground">
                    No upcoming sessions
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Approved sessions will appear here in chronological order.
                </p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card shadow-card">
            {bookings.map((b, index) => {
                const studentName = (b as Booking & { student_name?: string }).student_name || 'Student';
                return (
                    <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted font-display text-xs font-semibold tabular-nums text-foreground">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">
                                    {studentName}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {new Date(b.start_at).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}{' '}
                                    ·{' '}
                                    <span className="tabular-nums">
                                        {new Date(b.start_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <StatusBadge status={b.status} />
                    </li>
                );
            })}
        </ul>
    );
}
