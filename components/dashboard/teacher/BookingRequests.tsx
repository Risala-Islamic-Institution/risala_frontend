import React, { useState } from 'react';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/dashboard/student/StatusBadge';

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

    const handleApprove = async (key: string, b: Booking, isPackage: boolean, orderId?: string) => {
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
                const group = bookings.filter(gb => gb.order === b.order);
                await Promise.all(group.map(gb => api.post(`/bookings/${gb.id}/decline/`, {})));
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
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <p className="font-display text-base font-semibold text-foreground">
                    No pending requests
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
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
                const studentName = (b as Booking & { student_name?: string }).student_name || 'Student';
                const initial = studentName[0]?.toUpperCase() || 'S';

                return (
                    <div
                        key={key}
                        className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated sm:p-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-display text-sm font-semibold text-primary">
                                    {initial}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="truncate font-medium text-foreground">{studentName}</p>
                                        {isPackage ? <Badge variant="default" label="Package" /> : null}
                                    </div>
                                    {isPackage ? (
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {group.length} sessions · starting{' '}
                                            {new Date(b.start_at).toLocaleDateString()}
                                        </p>
                                    ) : (
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
                                    )}
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {group.slice(0, 4).map((entry) => (
                                            <StatusBadge key={entry.id} status={entry.status} />
                                        ))}
                                        {group.length > 4 ? (
                                            <Badge variant="ghost" label={`+${group.length - 4} more`} />
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    disabled={busy === key}
                                    onClick={() => handleApprove(key, b, isPackage, orderId)}
                                    isLoading={busy === key}
                                >
                                    Approve{isPackage ? ' all' : ''}
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    disabled={busy === key}
                                    onClick={() => handleDecline(key, b, isPackage)}
                                >
                                    Decline
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
