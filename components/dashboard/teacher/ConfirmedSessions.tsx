import React from 'react';
import { Booking } from '@/types';
import { StatusBadge } from '@/components/dashboard/student/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar } from '@/components/icons';

export function ConfirmedSessions({ bookings }: { bookings: Booking[] }) {
    if (bookings.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-primary">
                    <Calendar className="h-5 w-5" />
                </span>
                <p className="font-display text-base font-semibold text-foreground">
                    No upcoming sessions
                </p>
                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Approved sessions will appear here in chronological order.
                </p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {bookings.map((b, index) => {
                const studentName = b.student_name || 'Student';
                const start = new Date(b.start_at);
                return (
                    <li
                        key={b.id}
                        className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <span className="font-display text-xs font-semibold tabular-nums text-muted-foreground">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <Avatar name={studentName} size="sm" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">
                                    {studentName}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {start.toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}{' '}
                                    ·{' '}
                                    <span className="tabular-nums">
                                        {start.toLocaleTimeString([], {
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
