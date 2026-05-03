'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, Clock, Sparkles } from '@/components/icons';
import { StarOrnament, GeometricDivider } from '@/components/dashboard/IslamicOrnament';

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
            <div
                className="rounded-2xl p-10 text-center border animate-fade-in"
                style={{ 
                    borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)', 
                    background: 'color-mix(in oklab, var(--primary) 3%, var(--card))',
                    boxShadow: 'inset 0 0 40px -10px color-mix(in oklab, var(--primary) 8%, transparent)'
                }}
            >
                <div className="flex justify-center mb-6 opacity-40">
                    <GeometricDivider />
                </div>
                <span
                    className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                        background: 'color-mix(in oklab, var(--accent) 15%, transparent)',
                        border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
                        boxShadow: '0 0 20px -5px color-mix(in oklab, var(--accent) 30%, transparent)'
                    }}
                >
                    <Sparkles className="h-7 w-7" style={{ color: 'var(--accent)' } as React.CSSProperties} />
                </span>
                <p className="font-display text-xl font-bold" style={{ color: 'var(--primary)' }}>
                    Your Inbox is Clear
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    No pending session requests at the moment. Take this time to refine your courses or update your availability.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {Object.entries(groupedBookings).map(([key, group], cardIdx) => {
                const isPackage = key.startsWith('pkg_') && group.length > 1;
                const b = group[0];
                const orderId = b.order;
                const studentName = b.student_name || 'Student';
                const start = new Date(b.start_at);
                const isBusy = busy === key;

                return (
                    <article
                        key={key}
                        className="overflow-hidden rounded-2xl flex flex-col transition-all animate-fade-up shadow-islamic"
                        style={{
                            border: '1px solid color-mix(in oklab, var(--primary) 30%, transparent)',
                            background: 'color-mix(in oklab, var(--card) 95%, transparent)',
                            animationDelay: `${cardIdx * 80}ms`,
                            transform: 'translateY(0)',
                            transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms ease',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                            (e.currentTarget as HTMLElement).style.boxShadow =
                                '0 12px 32px -8px color-mix(in oklab, var(--primary) 25%, transparent), 0 0 0 1px color-mix(in oklab, var(--accent) 40%, transparent)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLElement).style.boxShadow =
                                '0 4px 16px -4px color-mix(in oklab, var(--primary) 20%, transparent)';
                        }}
                    >
                        {/* Deep Emerald Header Band */}
                        <div
                            className="relative px-6 py-4"
                            style={{
                                background: 'color-mix(in oklab, var(--primary) 85%, transparent)',
                                borderBottom: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)'
                            }}
                        >
                            <span
                                aria-hidden
                                className="absolute inset-x-0 bottom-0 h-[1px]"
                                style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <StarOrnament size={12} style={{ color: 'var(--accent)' }} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                        Session Request
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'color-mix(in oklab, #fff 60%, transparent)' }}>
                                    Just now
                                </span>
                            </div>
                        </div>

                        {/* Request Body */}
                        <div className="px-6 py-5" style={{ background: 'var(--card)' }}>
                            <div className="flex items-start gap-4">
                                <Avatar name={studentName} size="lg" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <p className="truncate font-display text-lg font-bold tracking-tight text-foreground">
                                            {studentName}
                                        </p>
                                        {isPackage ? (
                                            <span
                                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em]"
                                                style={{
                                                    background: 'color-mix(in oklab, var(--accent) 15%, transparent)',
                                                    border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)',
                                                    color: '#7a5a14',
                                                }}
                                            >
                                                <StarOrnament size={8} />
                                                Package of {group.length}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-2 inline-flex flex-wrap items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'color-mix(in oklab, var(--primary) 6%, transparent)', border: '1px solid color-mix(in oklab, var(--primary) 15%, transparent)' }}>
                                        <Calendar className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                                        <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                                            {start.toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                        {!isPackage ? (
                                            <>
                                                <span style={{ color: 'var(--primary)', opacity: 0.3 }}>|</span>
                                                <Clock className="h-4 w-4" style={{ color: 'var(--primary)' }} />
                                                <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--primary)' }}>
                                                    {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Package date chips */}
                        {isPackage ? (
                            <div
                                className="px-6 py-4"
                                style={{
                                    borderTop: '1px dashed color-mix(in oklab, var(--primary) 20%, transparent)',
                                    background: 'color-mix(in oklab, var(--muted) 40%, transparent)',
                                }}
                            >
                                <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--primary)' }}>
                                    All requested dates
                                </p>
                                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                                    {group.slice(0, 7).map((sb) => {
                                        const d = new Date(sb.start_at);
                                        return (
                                            <div
                                                key={sb.id}
                                                className="flex flex-col items-center justify-center rounded-xl py-2 text-center transition-transform hover:scale-105"
                                                style={{
                                                    border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)',
                                                    background: 'color-mix(in oklab, var(--card) 100%, transparent)',
                                                    boxShadow: '0 2px 8px -4px color-mix(in oklab, var(--accent) 20%, transparent)'
                                                }}
                                            >
                                                <span className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--primary)' }}>
                                                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                                <span className="mt-0.5 font-display text-sm font-bold tabular-nums text-foreground">
                                                    {d.getDate()}
                                                </span>
                                                <span className="text-[8px] tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                                                    {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {group.length > 7 ? (
                                        <div
                                            className="flex items-center justify-center rounded-xl text-xs font-bold"
                                            style={{
                                                border: '1px dashed color-mix(in oklab, var(--primary) 40%, transparent)',
                                                color: 'var(--primary)',
                                            }}
                                        >
                                            +{group.length - 7}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        {/* Actions */}
                        <div
                            className="flex items-center justify-end gap-3 px-6 py-4"
                            style={{
                                borderTop: '1px solid color-mix(in oklab, var(--primary) 15%, transparent)',
                                background: 'color-mix(in oklab, var(--primary) 3%, transparent)',
                            }}
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => handleDecline(key, b, isPackage)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                                Decline
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                disabled={isBusy}
                                onClick={() => handleApprove(key, b, isPackage, orderId)}
                                isLoading={isBusy}
                                className="shadow-gold-glow"
                            >
                                Approve {isPackage ? 'Package' : 'Session'}
                            </Button>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
