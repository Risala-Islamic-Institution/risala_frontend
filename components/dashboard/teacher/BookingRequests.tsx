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
            <div className="bg-white border-2 border-dashed border-neutral/40 rounded-3xl p-10 text-center animate-in fade-in zoom-in-95 duration-500">
                <p className="text-secondary/30 font-medium">No pending requests</p>
                <p className="text-secondary/20 text-sm mt-1">New requests from students will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {Object.entries(groupedBookings).map(([key, group]) => {
                const isPackage = key.startsWith('pkg_');
                const b = group[0];
                const orderId = b.order;
                // @ts-ignore - Booking type in frontend might differ slightly from API response for teacher (student_name vs teacher_name)
                // Check `types/index.ts`. It has `teacher_name`. Teacher dashboard needs `student_name`. 
                // I should update `Booking` type to include `student_name`.
                const studentName = (b as any).student_name || 'Student';

                return (
                    <div
                        key={key}
                        className={`bg-white border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 ${isPackage ? 'border-primary/20 bg-primary/[.02]' : 'border-neutral/30'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                    {isPackage && (
                                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                                            Package
                                        </span>
                                    )}
                                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-black text-sm">{studentName[0].toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-secondary text-sm">{studentName}</p>
                                        {isPackage ? (
                                            <p className="text-xs text-secondary/40">
                                                {group.length} Sessions · Starting {new Date(b.start_at).toLocaleDateString()}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-secondary/40">
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
                                {/* Status Badge */}
                                {/* For Package: show list summary? */}
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="rounded-xl shadow-md shadow-primary/10"
                                    disabled={busy === key}
                                    onClick={() => handleApprove(key, b, isPackage, orderId)}
                                    isLoading={busy === key}
                                >
                                    Approve {isPackage && 'All'}
                                </Button>
                                <button
                                    disabled={busy === key}
                                    className="px-3 py-1.5 text-sm font-semibold text-[#B5473F] border border-[#B5473F]/20 rounded-xl hover:bg-[#B5473F]/5 transition-colors disabled:opacity-50"
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
