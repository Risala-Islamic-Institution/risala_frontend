'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface TeacherAvailability {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

interface PackageSchedulerProps {
    teacher: {
        id: string;
        user: { full_name: string; username: string };
        hourly_rate: string;
    };
    onSuccess: (orderId: string) => void;
    onCancel: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const PackageScheduler: React.FC<PackageSchedulerProps> = ({ teacher, onSuccess, onCancel }) => {
    const [availabilities, setAvailabilities] = useState<TeacherAvailability[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<TeacherAvailability[]>([]);
    const [durationWeeks, setDurationWeeks] = useState(4);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchAvail = async () => {
            try {
                const res = await api.get<TeacherAvailability[]>(`/availability/?teacher_id=${teacher.id}`);
                setAvailabilities(res);
            } catch (err) {
                console.error('Failed to fetch availability:', err);
            } finally {
                setFetching(false);
            }
        };
        fetchAvail();
    }, [teacher.id]);

    const toggleSlot = (avail: TeacherAvailability) => {
        if (selectedSlots.find(s => s.id === avail.id)) {
            setSelectedSlots(selectedSlots.filter(s => s.id !== avail.id));
        } else {
            setSelectedSlots([...selectedSlots, avail]);
        }
    };

    const totalSessions = selectedSlots.length * durationWeeks;
    const totalPrice = (parseFloat(teacher.hourly_rate) * totalSessions).toFixed(2);

    const handleConfirm = async () => {
        if (selectedSlots.length === 0) return;
        setLoading(true);
        try {
            const payload = {
                teacher_id: teacher.id,
                weekly_slots: selectedSlots.map(s => ({
                    day_of_week: s.day_of_week,
                    start_time: s.start_time,
                    end_time: s.end_time,
                })),
                duration_weeks: durationWeeks,
            };

            const res = await api.post<{ id: string }>('/bookings/create-package/', payload);
            onSuccess(res.id);
        } catch (err) {
            console.error('Failed to create package:', err);
            alert('Failed to create package. Some slots might be unavailable.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-10 text-center text-sm text-muted-foreground">Loading availability…</div>;
    }

    return (
        <div className="bg-card text-card-foreground">
            <div className="border-b border-border px-6 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Book a lesson package
                </p>
                <h2 className="mt-1 font-display text-lg font-semibold text-foreground">
                    Recurring schedule with{' '}
                    <span className="text-primary">{teacher.user.full_name || teacher.user.username}</span>
                </h2>
            </div>

            <div className="space-y-7 p-6">
                {/* Step 1: Slots */}
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold tabular-nums text-foreground">
                            1
                        </span>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Select weekly windows
                        </p>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {availabilities.length === 0 ? (
                            <p className="col-span-2 rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                                This Ustaz hasn&apos;t set their availability yet.
                            </p>
                        ) : (
                            availabilities.map((avail) => {
                                const isSelected = !!selectedSlots.find(s => s.id === avail.id);
                                return (
                                    <button
                                        key={avail.id}
                                        type="button"
                                        onClick={() => toggleSlot(avail)}
                                        aria-pressed={isSelected}
                                        className={`flex items-center justify-between rounded-md border p-3.5 text-left transition-colors ${
                                            isSelected
                                                ? 'border-primary bg-[color:var(--primary)]/5'
                                                : 'border-border bg-card hover:border-foreground/30'
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                                {DAYS[avail.day_of_week]}
                                            </p>
                                            <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                                                {avail.start_time} – {avail.end_time}
                                            </p>
                                        </div>
                                        {isSelected ? (
                                            <span
                                                aria-hidden
                                                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                                            >
                                                <svg
                                                    width="11"
                                                    height="11"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </span>
                                        ) : null}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Step 2: Duration */}
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[11px] font-semibold tabular-nums text-foreground">
                            2
                        </span>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Choose package duration
                        </p>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {[4, 8, 12].map((weeks) => {
                            const active = durationWeeks === weeks;
                            return (
                                <button
                                    key={weeks}
                                    type="button"
                                    onClick={() => setDurationWeeks(weeks)}
                                    aria-pressed={active}
                                    className={`rounded-md border p-3 transition-colors ${
                                        active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-card text-foreground hover:border-foreground/30'
                                    }`}
                                >
                                    <span className="block font-display text-base font-semibold">
                                        {weeks / 4} month{weeks > 4 ? 's' : ''}
                                    </span>
                                    <span className={`mt-0.5 block text-[11px] uppercase tracking-[0.14em] ${active ? 'opacity-80' : 'text-muted-foreground'}`}>
                                        {weeks} weeks
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Step 3: Summary */}
                <div className="rounded-md border border-border bg-muted/40 p-5">
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Hourly rate</dt>
                            <dd className="font-medium tabular-nums text-foreground">${teacher.hourly_rate}/hr</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">Total sessions</dt>
                            <dd className="font-medium tabular-nums text-foreground">{totalSessions} lessons</dd>
                        </div>
                    </dl>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <p className="font-display text-base font-semibold text-foreground">Total</p>
                        <p className="font-display text-2xl font-semibold tabular-nums text-primary">
                            ${totalPrice}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 pt-1">
                    <Button variant="outline" className="flex-1" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-[2]"
                        onClick={handleConfirm}
                        disabled={selectedSlots.length === 0}
                        isLoading={loading}
                    >
                        Confirm and pay
                    </Button>
                </div>
            </div>
        </div>
    );
};
