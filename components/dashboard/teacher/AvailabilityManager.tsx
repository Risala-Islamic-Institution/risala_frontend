'use client';

import React, { useState } from 'react';
import { Slot } from '@/types';
import { api } from '@/lib/api';
import { Check, Loader2 } from 'lucide-react';
import { StarOrnament, GeometricDivider } from '@/components/dashboard/IslamicOrnament';

interface AvailabilityManagerProps {
    slots: Slot[];
    onChange: (slots: Slot[]) => void;
    onError: (msg: string) => void;
}

const DAYS = [
    { id: 0, name: 'Monday', short: 'MON' },
    { id: 1, name: 'Tuesday', short: 'TUE' },
    { id: 2, name: 'Wednesday', short: 'WED' },
    { id: 3, name: 'Thursday', short: 'THU' },
    { id: 4, name: 'Friday', short: 'FRI' },
    { id: 5, name: 'Saturday', short: 'SAT' },
    { id: 6, name: 'Sunday', short: 'SUN' },
];

export function AvailabilityManager({ slots, onChange, onError }: AvailabilityManagerProps) {
    const [loadingDay, setLoadingDay] = useState<number | null>(null);

    const toggleDay = async (dayId: number) => {
        try {
            setLoadingDay(dayId);
            // Find existing slot for this day
            const existing = slots.find((s) => s.day_of_week === dayId);

            if (existing) {
                // If exists, delete it (deactivate)
                await api.delete(`/availability/${existing.id}/`);
            } else {
                // If doesn't exist, create it (activate full day)
                await api.post('/availability/', {
                    day_of_week: dayId,
                    start_time: '00:00:00',
                    end_time: '23:59:00',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                });
            }

            // Refresh slots
            const fresh = await api.get<Slot[]>('/availability/');
            onChange(fresh);
        } catch {
            onError('Failed to update teaching rhythm.');
        } finally {
            setLoadingDay(null);
        }
    };

    return (
        <section
            className="overflow-hidden rounded-2xl flex flex-col h-full"
            style={{
                border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)',
                background: 'color-mix(in oklab, var(--card) 98%, transparent)',
                boxShadow: '0 8px 32px -8px color-mix(in oklab, var(--primary) 15%, transparent)',
            }}
        >
            {/* Header */}
            <header
                className="relative px-6 py-5"
                style={{
                    background: 'color-mix(in oklab, var(--primary) 5%, transparent)',
                    borderBottom: '1px solid color-mix(in oklab, var(--primary) 15%, transparent)'
                }}
            >
                <div className="flex items-center gap-2 mb-1">
                    <StarOrnament size={12} style={{ color: 'var(--primary)' }} />
                    <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                        Teaching Rhythm
                    </h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    Click a day to toggle your availability. Active days are available for student bookings.
                </p>
                <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[1px]"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--primary), transparent)', opacity: 0.3 }}
                />
            </header>

            {/* 7-Day Grid */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {DAYS.map((day) => {
                        const isActive = slots.some((s) => s.day_of_week === day.id);
                        const isLoading = loadingDay === day.id;

                        return (
                            <button
                                key={day.id}
                                onClick={() => toggleDay(day.id)}
                                disabled={isLoading}
                                className="relative flex flex-col items-center justify-center rounded-xl p-4 transition-all duration-300 outline-none focus-visible:ring-2"
                                style={isActive ? {
                                    background: 'color-mix(in oklab, var(--primary) 8%, transparent)',
                                    border: '1px solid var(--primary)',
                                    boxShadow: '0 4px 16px -4px color-mix(in oklab, var(--primary) 40%, transparent)',
                                    transform: 'translateY(-2px)'
                                } : {
                                    background: 'var(--card)',
                                    border: '1px dashed color-mix(in oklab, var(--primary) 30%, transparent)',
                                    opacity: 0.7,
                                }}
                            >
                                {/* Decorative corner markers for active state */}
                                {isActive && (
                                    <>
                                        <span className="absolute left-1.5 top-1.5 h-1 w-1 rounded-full" style={{ background: 'var(--accent)' }} />
                                        <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full" style={{ background: 'var(--accent)' }} />
                                    </>
                                )}

                                <span
                                    className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                                    style={{ color: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }}
                                >
                                    {day.short}
                                </span>
                                <span
                                    className="mt-1 font-display text-sm font-bold transition-colors"
                                    style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                                >
                                    {day.name}
                                </span>

                                <div className="mt-3 h-6 w-6">
                                    {isLoading ? (
                                        <Loader2 className="h-full w-full animate-spin" style={{ color: 'var(--primary)' }} />
                                    ) : isActive ? (
                                        <div
                                            className="flex h-full w-full items-center justify-center rounded-full shadow-gold-glow animate-scale-in"
                                            style={{ background: 'var(--primary)', color: 'var(--accent)' }}
                                        >
                                            <Check className="h-3.5 w-3.5 stroke-[3px]" />
                                        </div>
                                    ) : (
                                        <div
                                            className="flex h-full w-full items-center justify-center rounded-full transition-colors"
                                            style={{ border: '2px solid color-mix(in oklab, var(--muted-foreground) 40%, transparent)' }}
                                        />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto pt-6 flex justify-center opacity-40">
                    <GeometricDivider />
                </div>
            </div>
        </section>
    );
}
