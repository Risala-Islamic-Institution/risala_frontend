import React from 'react';
import { Booking } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Badge } from '@/components/ui/Badge';
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
    const teacherName = mainBooking.teacher_name || 'Unknown Ustaz';
    const status = mainBooking.status;

    const showPayButton =
        (status === 'APPROVED' || status === 'RESERVED') &&
        !['CONFIRMED', 'PAID'].includes(status);

    return (
        <article className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        {isPackage ? <Badge variant="default" label="Package" /> : null}
                        <h3 className="truncate font-display text-base font-semibold text-foreground">
                            {teacherName}
                        </h3>
                    </div>
                    {isPackage ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {bookings.length} sessions
                        </p>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {new Date(mainBooking.start_at).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                            })}{' '}
                            ·{' '}
                            <span className="tabular-nums">
                                {new Date(mainBooking.start_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </p>
                    )}
                </div>

                {showPayButton ? (
                    <Button
                        variant="accent"
                        size="sm"
                        isLoading={isPaying}
                        onClick={() =>
                            onPay(isPackage ? orderId! : mainBooking.id, isPackage)
                        }
                    >
                        Pay now
                    </Button>
                ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {bookings.map((sb) => (
                    <div
                        key={sb.id}
                        className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs"
                    >
                        <StatusBadge status={sb.status} />
                        <span className="tabular-nums text-muted-foreground">
                            {new Date(sb.start_at).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                ))}
            </div>
        </article>
    );
}
