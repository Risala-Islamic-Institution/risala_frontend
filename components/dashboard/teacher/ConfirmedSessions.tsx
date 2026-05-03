'use client';

import React, { useMemo, useState } from 'react';
import { Booking } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { ChevronLeft, ChevronRight, Clock, Video } from 'lucide-react';
import { StarOrnament, GeometricDivider } from '@/components/dashboard/IslamicOrnament';

interface ConfirmedSessionsProps {
    bookings: Booking[];
}

export function ConfirmedSessions({ bookings }: ConfirmedSessionsProps) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState<Date>(today);

    // Group active bookings by YYYY-MM-DD
    const bookingsByDate = useMemo(() => {
        const map = new Map<string, Booking[]>();
        bookings.forEach((b) => {
            const d = new Date(b.start_at);
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(b);
        });
        return map;
    }, [bookings]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    // Generate calendar days
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const selectedKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    const selectedBookings = bookingsByDate.get(selectedKey) || [];

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* ═══════════════════════════════════════════
                LEFT: The Calendar Grid
            ═══════════════════════════════════════════ */}
            <div
                className="lg:col-span-8 overflow-hidden rounded-2xl shadow-islamic animate-fade-in"
                style={{
                    border: '1px solid color-mix(in oklab, var(--primary) 30%, transparent)',
                    background: 'var(--card)',
                }}
            >
                {/* Header (Month Navigation) */}
                <div
                    className="flex items-center justify-between px-6 py-5"
                    style={{
                        background: 'color-mix(in oklab, var(--primary) 8%, transparent)',
                        borderBottom: '1px solid color-mix(in oklab, var(--primary) 15%, transparent)'
                    }}
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>
                            Gregorian Calendar
                        </span>
                        <h3 className="font-display text-2xl font-bold text-foreground">
                            {monthName} <span style={{ color: 'var(--primary)', opacity: 0.6 }}>{year}</span>
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={prevMonth}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
                            style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)', color: 'var(--primary)' }}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
                            style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)', color: 'var(--primary)' }}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Day Labels */}
                <div
                    className="grid grid-cols-7 border-b"
                    style={{
                        borderColor: 'color-mix(in oklab, var(--primary) 15%, transparent)',
                        background: 'color-mix(in oklab, var(--primary) 2%, transparent)'
                    }}
                >
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <div
                            key={d}
                            className="py-3 text-center text-[10px] font-bold uppercase tracking-[0.16em]"
                            style={{ color: 'var(--muted-foreground)' }}
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* The Grid */}
                <div className="grid grid-cols-7" style={{ background: 'color-mix(in oklab, var(--primary) 4%, transparent)' }}>
                    {days.map((day, i) => {
                        if (!day) {
                            return (
                                <div
                                    key={`empty-${i}`}
                                    className="aspect-square border-b border-r"
                                    style={{ borderColor: 'color-mix(in oklab, var(--primary) 10%, transparent)' }}
                                />
                            );
                        }

                        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`;
                        const isSelected = selectedKey === dateStr;
                        const dayBookings = bookingsByDate.get(dateStr) || [];
                        const hasBookings = dayBookings.length > 0;
                        const isToday =
                            today.getDate() === day &&
                            today.getMonth() === currentDate.getMonth() &&
                            today.getFullYear() === currentDate.getFullYear();

                        return (
                            <button
                                key={day}
                                onClick={() =>
                                    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                                }
                                className="group relative flex aspect-square flex-col items-center justify-center border-b border-r p-1 transition-all hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
                                style={{ borderColor: 'color-mix(in oklab, var(--primary) 10%, transparent)' }}
                            >
                                {/* Active Selection Border */}
                                {isSelected && (
                                    <div
                                        className="absolute inset-[2px] rounded-lg border-2 pointer-events-none transition-all"
                                        style={{ borderColor: 'var(--accent)' }}
                                    />
                                )}

                                {/* Today Indicator */}
                                {isToday && (
                                    <div
                                        className="absolute top-1.5 left-1.5 h-1.5 w-1.5 rounded-full"
                                        style={{ background: 'var(--primary)' }}
                                    />
                                )}

                                {/* The Number */}
                                <span
                                    className={`font-display text-lg transition-colors ${
                                        hasBookings ? 'font-bold' : 'font-medium'
                                    }`}
                                    style={{
                                        color: hasBookings
                                            ? 'var(--primary)'
                                            : isSelected
                                            ? 'var(--foreground)'
                                            : 'var(--muted-foreground)',
                                    }}
                                >
                                    {day}
                                </span>

                                {/* Booking Indicators */}
                                {hasBookings && (
                                    <div className="mt-1 flex gap-0.5">
                                        {dayBookings.slice(0, 3).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className="h-1 w-3 rounded-full"
                                                style={{ background: 'var(--accent)' }}
                                            />
                                        ))}
                                        {dayBookings.length > 3 && (
                                            <div
                                                className="h-1 w-1 rounded-full"
                                                style={{ background: 'var(--primary)' }}
                                            />
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                RIGHT: The Daily Session Panel
            ═══════════════════════════════════════════ */}
            <div className="lg:col-span-4 flex flex-col gap-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div
                    className="overflow-hidden rounded-2xl flex flex-col min-h-[400px]"
                    style={{
                        border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)',
                        background: 'color-mix(in oklab, var(--primary) 85%, transparent)',
                        boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5)',
                    }}
                >
                    <div className="px-6 py-5 relative">
                        <span aria-hidden className="absolute inset-x-0 top-0 h-[2px]" style={{ background: 'var(--accent)' }} />
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
                                Selected Day
                            </span>
                            <StarOrnament size={12} style={{ color: 'var(--accent)' }} />
                        </div>
                        <h4 className="font-display text-2xl font-bold text-white">
                            {selectedDate.getDate()}{' '}
                            <span style={{ opacity: 0.8, fontSize: '0.85em' }}>
                                {selectedDate.toLocaleString('default', { month: 'short' })}
                            </span>
                        </h4>
                        <p className="mt-1 text-sm font-medium" style={{ color: 'color-mix(in oklab, #fff 60%, transparent)' }}>
                            {selectedBookings.length} session{selectedBookings.length !== 1 ? 's' : ''} scheduled
                        </p>
                    </div>

                    <div className="flex-1 px-4 pb-4 overflow-y-auto">
                        {selectedBookings.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center text-center p-6 opacity-60">
                                <GeometricDivider />
                                <p className="mt-4 text-sm font-semibold text-white">No sessions today.</p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {selectedBookings.map((sb) => {
                                    const d = new Date(sb.start_at);
                                    return (
                                        <li
                                            key={sb.id}
                                            className="group flex flex-col rounded-xl p-4 transition-all"
                                            style={{
                                                background: 'color-mix(in oklab, #082017 40%, transparent)',
                                                border: '1px solid color-mix(in oklab, var(--accent) 20%, transparent)',
                                            }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={sb.student_name || 'Student'} size="md" />
                                                    <div>
                                                        <p className="font-display text-sm font-bold text-white">
                                                            {sb.student_name || 'Student'}
                                                        </p>
                                                        <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110"
                                                    style={{
                                                        background: 'color-mix(in oklab, var(--accent) 15%, transparent)',
                                                        color: 'var(--accent)',
                                                        border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)'
                                                    }}
                                                    title="Join Session"
                                                >
                                                    <Video className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
