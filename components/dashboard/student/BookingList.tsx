import React from 'react';
import { Booking } from '@/types';
import { BookingCard } from './BookingCard';
import { Button } from '@/components/ui/Button';

interface BookingListProps {
    bookings: Booking[];
    payingId: string | null;
    onPay: (id: string, isPackage: boolean) => void;
    onBrowse: () => void;
}

export function BookingList({ bookings, payingId, onPay, onBrowse }: BookingListProps) {
    // Group bookings
    const groupedBookings = bookings.reduce((acc, booking) => {
        const key = booking.order ? `pkg_${booking.order}` : `single_${booking.id}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    if (bookings.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-primary/20 bg-linear-to-br from-white to-[#f5f8f1] rounded-3xl mb-12 animate-in fade-in zoom-in-95 duration-500 ring-1 ring-accent/20">
                <div className="w-16 h-16 mx-auto bg-accent/15 border border-accent/30 rounded-full flex items-center justify-center mb-4 text-2xl">🎓</div>
                <p className="text-secondary/55 font-semibold">No active learning sessions.</p>
                <p className="text-xs text-secondary/40 mt-1 mb-6 max-w-xs mx-auto">Start your journey by finding a teacher that matches your goals.</p>
                <Button variant="outline" className="border-primary/25 hover:bg-primary/5" onClick={onBrowse}>Find a Teacher</Button>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary/50 font-bold mt-5">Learning Pulse</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-secondary">Your Sessions</h2>
                <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-primary/55">Learning Timeline</span>
            </div>
            {Object.entries(groupedBookings).map(([key, group]) => {
                const isPackage = key.startsWith('pkg_');
                const mainId = isPackage ? group[0].order! : group[0].id;

                return (
                    <BookingCard
                        key={key}
                        bookings={group}
                        isPackage={isPackage}
                        onPay={onPay}
                        isPaying={payingId === mainId}
                    />
                );
            })}
        </div>
    );
}
