import React, { useState } from 'react';
import { Booking } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/dashboard/student/StatusBadge'; // Reuse shared badge

interface BookingRequestsProps {
    bookings: Booking[];
    onChange: (bookings: Booking[]) => void;
    onError: (msg: string) => void;
}

export function BookingRequests({ bookings, onChange, onError }: BookingRequestsProps) {
    const [busy, setBusy] = useState<string | null>(null);

    // Grouping logic (same as student dashboard)
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
                // Mock package decline for now by declining first or all? The original code declined individually if package. 
                // Let's implement the loop as suggested in original code comments or better.
                // Actually, let's just stick to the single API for now based on original, which was:
                // if (isPackage) await Promise.all(...)
                // Let's replicate that behavior.
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
            <div className="rounded-[2rem] border border-primary/15 bg-linear-to-br from-white via-[#f8fbf5] to-[#eef6ea] p-10 text-center ring-1 ring-accent/20 shadow-[0_26px_60px_rgba(15,61,46,0.12)] animate-in fade-in zoom-in-95 duration-500">
                <div className="mx-auto mb-3 h-14 w-14 rounded-2xl border border-primary/20 bg-white/80 text-2xl text-primary flex items-center justify-center">✦</div>
                <p className="text-secondary/50 font-black text-base">No pending requests</p>
                <p className="text-secondary/35 text-sm mt-1">When students request lessons, they will appear in this majlis feed.</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-primary/55 font-bold mt-4">Majlis Requests</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.entries(groupedBookings).map(([key, group]) => {
                const isPackage = key.startsWith('pkg_');
                const b = group[0];
                const orderId = b.order;
                const studentName = (b as Booking & { student_name?: string }).student_name || 'Student';

                return (
                    <div
                        key={key}
                        className={`relative overflow-hidden border rounded-[1.4rem] p-5 hover:shadow-[0_24px_52px_rgba(15,61,46,0.2)] transition-all duration-300 ring-1 ${isPackage ? 'border-primary/25 ring-accent/30 bg-linear-to-br from-[#eef8f1] via-[#f6fbf7] to-[#fff9ec]' : 'border-primary/12 ring-primary/12 bg-linear-to-br from-white via-[#f9fcf7] to-[#f0f7eb]'
                            }`}
                    >
                        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-accent/16 blur-2xl" />
                        <div className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-full bg-linear-to-r from-primary/0 via-primary/40 to-accent/0" />
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2.5">
                                    {isPackage && (
                                        <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-[0.14em] border border-primary/20">
                                            Package
                                        </span>
                                    )}
                                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/16 to-accent/20 border border-primary/20 flex items-center justify-center">
                                        <span className="text-primary font-black text-sm">{studentName[0]?.toUpperCase() || 'S'}</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-secondary text-sm tracking-[0.01em]">{studentName}</p>
                                        {isPackage ? (
                                            <p className="text-xs text-secondary/45">
                                                {group.length} Sessions · Starting {new Date(b.start_at).toLocaleDateString()}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-secondary/45">
                                                {new Date(b.start_at).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}{' '}
                                                ·{' '}
                                                {new Date(b.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2.5 flex flex-wrap gap-2">
                                    {group.slice(0, 4).map((entry) => (
                                        <StatusBadge key={entry.id} status={entry.status} />
                                    ))}
                                    {group.length > 4 ? (
                                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-neutral/10 text-secondary/50 font-bold uppercase tracking-[0.14em] border border-primary/15">
                                            +{group.length - 4}
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex gap-2 shrink-0 items-center">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="rounded-xl shadow-lg shadow-primary/20"
                                    disabled={busy === key}
                                    onClick={() => handleApprove(key, b, isPackage, orderId)}
                                    isLoading={busy === key}
                                >
                                    Approve {isPackage && 'All'}
                                </Button>
                                <button
                                    disabled={busy === key}
                                    className="px-3 py-1.5 text-sm font-semibold text-[#B5473F] border border-[#B5473F]/30 rounded-xl hover:bg-[#B5473F]/8 transition-colors disabled:opacity-50"
                                    onClick={() => handleDecline(key, b, isPackage)}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
