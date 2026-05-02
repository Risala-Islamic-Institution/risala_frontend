import React from 'react';
import { Booking } from '@/types';
import { StatusBadge } from './StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock } from '@/components/icons';

interface BookingCardProps {
    bookings: Booking[];
    isPackage: boolean;
    onPay: (id: string, isPackage: boolean) => void;
    isPaying: boolean;
}

export function BookingCard({ bookings, isPackage, onPay, isPaying }: BookingCardProps) {
    const main = bookings[0];
    const orderId = main.order;
    const teacherName = main.teacher_name || 'Unknown Ustaz';
    const status = main.status;

    const showPayButton =
        (status === 'APPROVED' || status === 'RESERVED') &&
        !['CONFIRMED', 'PAID'].includes(status);

    const startDate = new Date(main.start_at);

    return (
        <article className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-elevated">
            {/* Header band */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={teacherName} size="md" />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-display text-base font-semibold text-foreground">
                                {teacherName}
                            </h3>
                            {isPackage ? (
                                <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/65">
                                    Package · {bookings.length} sessions
                                </span>
                            ) : null}
                        </div>
                        {!isPackage ? (
                            <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                    {startDate.toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <span className="opacity-60">·</span>
                                <Clock className="h-3.5 w-3.5" />
                                <span className="tabular-nums">
                                    {startDate.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </p>
                        ) : (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Recurring schedule · weekly
                            </p>
                        )}
                    </div>
                </div>

                <div className="shrink-0">
                    <StatusBadge status={status} />
                </div>
            </div>

            {/* Time slot grid */}
            {isPackage && bookings.length > 1 ? (
                <div className="px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Sessions
                    </p>
                    <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
                        {bookings.slice(0, 10).map((sb) => {
                            const d = new Date(sb.start_at);
                            const tone =
                                sb.status === 'CONFIRMED' || sb.status === 'PAID'
                                    ? 'border-[color:var(--success)]/40 bg-[color:var(--success)]/[0.08] text-[color:var(--success)]'
                                    : sb.status === 'APPROVED' || sb.status === 'RESERVED' || sb.status === 'PENDING'
                                      ? 'border-[color:var(--warning)]/40 bg-[color:var(--warning)]/[0.12] text-[#8a6326]'
                                      : 'border-border bg-muted text-muted-foreground';
                            return (
                                <span
                                    key={sb.id}
                                    title={sb.status}
                                    className={`flex h-9 flex-col items-center justify-center rounded-md border text-[10px] font-medium tabular-nums leading-tight ${tone}`}
                                >
                                    <span>
                                        {d.toLocaleDateString([], {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </span>
                            );
                        })}
                        {bookings.length > 10 ? (
                            <span className="flex h-9 items-center justify-center rounded-md border border-dashed border-border text-[10px] font-medium text-muted-foreground">
                                +{bookings.length - 10}
                            </span>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {showPayButton ? (
                <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-5 py-3">
                    <p className="text-xs text-muted-foreground">
                        Approved by your Ustaz — complete payment to confirm.
                    </p>
                    <Button
                        variant="accent"
                        size="sm"
                        isLoading={isPaying}
                        onClick={() => onPay(isPackage ? orderId! : main.id, isPackage)}
                    >
                        Pay now
                    </Button>
                </div>
            ) : null}
        </article>
    );
}
