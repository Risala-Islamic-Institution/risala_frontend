'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, Clock, Sparkles } from '@/components/icons';
import { StarOrnament } from '@/components/dashboard/IslamicOrnament';

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
                <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-primary">
                    <Sparkles className="h-5 w-5" />
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Object.entries(groupedBookings).map(([key, group]) => {
                const isPackage = key.startsWith('pkg_') && group.length > 1;
                const b = group[0];
                const orderId = b.order;
                const studentName = b.student_name || 'Student';
                const start = new Date(b.start_at);

                return (
                    <article
                        key={key}
                        className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                    >
                        {/* Header */}
                        <div className="relative border-b border-border bg-[color:var(--primary)]/[0.05] px-5 py-4">
                            <span
                                aria-hidden
                                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)]/40 to-transparent"
                            />
                            <div className="flex items-start gap-3">
                                <Avatar name={studentName} size="md" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="truncate font-display text-base font-semibold tracking-tight text-foreground">
                                            {studentName}
                                        </p>
                                        {isPackage ? (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/35 bg-[color:var(--accent)]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a5a14]">
                                                <StarOrnament size={9} className="text-[color:var(--accent)]" />
                                                Package · {group.length}
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="mt-1 inline-flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" aria-hidden />
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
                                                <Clock className="h-3.5 w-3.5" aria-hidden />
                                                <span className="tabular-nums">
                                                    {start.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="opacity-60">·</span>
                                                <span>{group.length} sessions</span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Package preview chips */}
                        {isPackage ? (
                            <div className="border-b border-dashed border-border px-5 py-4">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                    Sessions to approve
                                </p>
                                <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                                    {group.slice(0, 8).map((sb) => {
                                        const d = new Date(sb.start_at);
                                        return (
                                            <span
                                                key={sb.id}
                                                className="flex flex-col items-center justify-center rounded-md border border-border bg-muted px-2 py-1.5 text-center"
                                            >
                                                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                                    {d.toLocaleDateString([], {
                                                        weekday: 'short',
                                                    })}
                                                </span>
                                                <span className="mt-0.5 font-display text-sm font-semibold tabular-nums text-foreground">
                                                    {d.getDate()}
                                                </span>
                                                <span className="text-[9px] tabular-nums text-muted-foreground">
                                                    {d.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </span>
                                        );
                                    })}
                                    {group.length > 8 ? (
                                        <span className="flex items-center justify-center rounded-md border border-dashed border-border text-[10px] font-medium text-muted-foreground">
                                            +{group.length - 8}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 bg-muted/40 px-5 py-3">
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
