import React from 'react';
import { Booking } from '@/types';
import { BookingCard } from './BookingCard';
import { Button } from '@/components/ui/Button';
import { GraduationCap } from '@/components/icons';

interface BookingListProps {
    bookings: Booking[];
    payingId: string | null;
    onPay: (id: string, isPackage: boolean) => void;
    onBrowse: () => void;
}

export function BookingList({ bookings, payingId, onPay, onBrowse }: BookingListProps) {
    const groupedBookings = bookings.reduce((acc, booking) => {
        const key = booking.order ? `pkg_${booking.order}` : `single_${booking.id}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(booking);
        return acc;
    }, {} as Record<string, Booking[]>);

    if (bookings.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-muted text-primary">
                    <GraduationCap className="h-5 w-5" />
                </span>
                <p className="font-display text-base font-semibold text-foreground">
                    No active learning sessions
                </p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Begin your journey by finding an Ustaz who matches your goals and schedule.
                </p>
                <Button variant="primary" size="sm" className="mt-5" onClick={onBrowse}>
                    Find an Ustaz
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
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
