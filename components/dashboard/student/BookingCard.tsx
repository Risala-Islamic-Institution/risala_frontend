import React from 'react';
import { Booking } from '@/types';
import { StatusBadge } from './StatusBadge'; // We'll extract this next
import { Button } from '@/components/ui/Button';

interface BookingCardProps {
    bookings: Booking[];
    isPackage: boolean;
    onPay: (id: string, isPackage: boolean) => void;
    isPaying: boolean;
}

export function BookingCard({ bookings, isPackage, onPay, isPaying }: BookingCardProps) {
    const mainBooking = bookings[0];
    const orderId = mainBooking.order;
    const teacherName = mainBooking.teacher_name || 'Unknown Teacher';
    const status = mainBooking.status;

    const showPayButton =
        (status === 'APPROVED' || status === 'RESERVED') &&
        !['CONFIRMED', 'PAID'].includes(status);

    return (
        <div className="bg-white border border-primary/10 rounded-2xl p-6 hover:shadow-[0_16px_32px_rgba(15,61,46,0.12)] transition-all duration-300 group">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {isPackage && (
                            <span className="text-[10px] font-bold bg-accent/20 text-primary px-2 py-1 rounded tracking-wider uppercase border border-accent/40">
                                Package
                            </span>
                        )}
                        <h3 className="font-bold text-lg text-secondary group-hover:text-primary transition-colors">
                            {teacherName}
                        </h3>
                    </div>
                    {isPackage ? (
                        <p className="text-secondary/50 text-sm">{bookings.length} Sessions</p>
                    ) : (
                        <p className="text-secondary/50 text-sm">
                            {new Date(mainBooking.start_at).toLocaleDateString()} at{' '}
                            {new Date(mainBooking.start_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    )}
                </div>

                {showPayButton && (
                    <Button
                        variant="accent"
                        size="sm"
                        className="rounded-xl shadow-lg shadow-accent/30"
                        isLoading={isPaying}
                        onClick={() => onPay(isPackage ? orderId! : mainBooking.id, isPackage)}
                    >
                        Pay Now
                    </Button>
                )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                {bookings.map((sb) => (
                    <div
                        key={sb.id}
                        className="flex items-center gap-2 bg-white border border-primary/10 px-3 py-2 rounded-lg"
                    >
                        <StatusBadge status={sb.status} />
                        <span className="text-xs font-mono text-secondary/60">
                            {new Date(sb.start_at).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
