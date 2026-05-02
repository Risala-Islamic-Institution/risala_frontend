import React, { useState } from 'react';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, Clock } from '@/components/icons';

interface BookingRequestsProps {
    bookings: Booking[];
    onChange: (bookings: Booking[]) => void;
    onError: (msg: string) => void;
}

export function BookingRequests({ bookings, onChange, onError }: BookingRequestsProps) {
    const [busy, setBusy] = useState<string | null>(null);

    const groupedBookings = bookings.reduce((acc, booking) => {
        const key = booking.order ? `pkg_${booking.order}` : `single_${booking.id}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    const handleApprove = async (
        key: string,
        b: Booking,
        isPackage: boolean,
        orderId?: string,
    ) => {
        try {
            setBusy(key);
            if (isPackage && orderId) {
                await api.post('/bookings/approve-package/', { order_id: orderId });
            } else {
                await api.post(`/bookings/${b.id}/approve/`, {});
            }
            onChange(await api.get<Booking[]>('/bookings/'));
        } catch {
            onError('Failed to approve.');
        } finally {
            setBusy(null);
        }
    };

    const handleDecline = async (key: string, b: Booking, isPackage: boolean) => {
        try {
            setBusy(key);
            if (isPackage) {
                const group = bookings.filter((gb) => gb.order === b.order);
                await Promise.all(group.map((gb) => api.post(`/bookings/${gb.id}/decline/`, {})));
            } else {
                await api.post(`/bookings/${b.id}/decline/`, {});
            }
            onChange(await api.get<Booking[]>('/bookings/'));
        } catch {
            onError('Failed to decline.');
        } finally {
            setBusy(null);
        }
    };

    if (bookings.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-primary">
                    <Calendar className="h-5 w-5" />
                </span>
                <p className="font-display text-base font-semibold text-foreground">
                    No pending requests
                </p>
                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    When students request sessions, they will appear here for your review.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {Object.entries(groupedBookings).map(([key, group]) => {
                const isPackage = key.startsWith('pkg_');
                const b = group[0];
                const orderId = b.order;
                const studentName =
                    (b as Booking & { student_name?: string }).student_name || 'Student';
                const start = new Date(b.start_at);

                return (
                    <article
                        key={key}
                        className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-elevated"
                    >
                        <div className="flex items-start justify-between gap-4 px-5 py-4">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                <Avatar name={studentName} size="md" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="truncate font-display text-base font-semibold text-foreground">
                                            {studentName}
                                        </p>
                                        {isPackage ? (
                                            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/65">
                                                Package · {group.length}
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>
                                            {start.toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                        {!isPackage ? (
                                            <>
                                                <span className="opacity-60">·</span>
                                                <Clock className="h-3.5 w-3.5" />
                                                <span className="tabular-nums">
                                                    {start.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </>
                                        ) : null}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isPackage && group.length > 1 ? (
                            <div className="border-t border-border px-5 py-4">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                    Sessions to approve
                                </p>
                                <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
                                    {group.slice(0, 10).map((sb) => {
                                        const d = new Date(sb.start_at);
                                        return (
                                            <span
                                                key={sb.id}
                                                className="flex h-9 items-center justify-center rounded-md border border-border bg-muted text-[10px] font-medium tabular-nums text-foreground"
                                            >
                                                {d.toLocaleDateString([], {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        );
                                    })}
                                    {group.length > 10 ? (
                                        <span className="flex h-9 items-center justify-center rounded-md border border-dashed border-border text-[10px] font-medium text-muted-foreground">
                                            +{group.length - 10}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/40 px-5 py-3">
                            <Button
                                variant="danger"
                                size="sm"
                                disabled={busy === key}
                                onClick={() => handleDecline(key, b, isPackage)}
                            >
                                Decline
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                disabled={busy === key}
                                onClick={() => handleApprove(key, b, isPackage, orderId)}
                                isLoading={busy === key}
                            >
                                Approve{isPackage ? ' all' : ''}
                            </Button>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
