'use client';

import React, { useMemo, useState } from 'react';
import { Slot } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Globe } from '@/components/icons';
import { GeometricDivider } from '@/components/dashboard/IslamicOrnament';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Render order: Mon → Sun (week starts Monday for clarity)
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];
const TIMEZONES = [
    'UTC',
    'Africa/Cairo',
    'Asia/Riyadh',
    'Asia/Dubai',
    'Europe/London',
    'America/New_York',
    'Asia/Kuala_Lumpur',
];

interface AvailabilityManagerProps {
    slots: Slot[];
    onChange: (slots: Slot[]) => void;
    onError: (msg: string) => void;
}

function formatTimeRange(start: string, end: string) {
    return `${start.slice(0, 5)} – ${end.slice(0, 5)}`;
}

export function AvailabilityManager({ slots, onChange, onError }: AvailabilityManagerProps) {
    const [form, setForm] = useState({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '11:00',
        timezone: 'UTC',
    });
    const [loading, setLoading] = useState(false);

    const grouped = useMemo(() => {
        const map = new Map<number, Slot[]>();
        for (const day of WEEK_ORDER) map.set(day, []);
        for (const s of slots) {
            const list = map.get(s.day_of_week);
            if (list) list.push(s);
        }
        for (const list of map.values()) {
            list.sort((a, b) => a.start_time.localeCompare(b.start_time));
        }
        return map;
    }, [slots]);

    const activeCount = slots.filter((a) => a.is_active).length;
    const totalCount = slots.length;

    const toggleSlot = async (a: Slot) => {
        try {
            await api.put(`/availability/${a.id}/`, {
                day_of_week: a.day_of_week,
                start_time: a.start_time,
                end_time: a.end_time,
                timezone: a.timezone,
                is_active: !a.is_active,
            });
            onChange(await api.get<Slot[]>('/availability'));
        } catch {
            onError('Failed to toggle slot.');
        }
    };

    const addSlot = async () => {
        if (form.start_time >= form.end_time) {
            onError('End time must be after start time.');
            return;
        }
        try {
            setLoading(true);
            await api.post('/availability/', form);
            onChange(await api.get<Slot[]>('/availability'));
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to add slot.';
            onError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section aria-labelledby="availability-heading">
            <div className="mb-6 flex items-end justify-between gap-5">
                <div>
                    <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                        Weekly windows
                    </p>
                    <h2
                        id="availability-heading"
                        className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground"
                    >
                        Your teaching rhythm.
                    </h2>
                </div>
                <span className="hidden shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
                    {activeCount} active · {totalCount} total
                </span>
            </div>

            {/* Weekly grid — one column per day */}
            {totalCount === 0 ? (
                <div className="mb-6 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                    <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-primary">
                        <Calendar className="h-5 w-5" />
                    </span>
                    <p className="font-display text-base font-semibold text-foreground">
                        No availability configured
                    </p>
                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Add your first weekly window below. Stack as many time blocks per day as you teach.
                    </p>
                </div>
            ) : (
                <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7">
                        {WEEK_ORDER.map((day, idx) => {
                            const blocks = grouped.get(day) || [];
                            const hasActive = blocks.some((b) => b.is_active);
                            return (
                                <div
                                    key={day}
                                    className={`flex flex-col gap-2 border-b border-border p-4 last:border-b-0 sm:border-r sm:last:border-r-0 ${
                                        idx >= 3 ? 'lg:border-b-0' : ''
                                    }`}
                                >
                                    {/* Day header */}
                                    <div className="flex items-baseline justify-between">
                                        <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                                            {SHORT_DAYS[day]}
                                        </span>
                                        <span
                                            aria-hidden
                                            className={`h-1.5 w-1.5 rounded-full ${
                                                hasActive
                                                    ? 'bg-[color:var(--success)]'
                                                    : blocks.length > 0
                                                    ? 'bg-border'
                                                    : 'bg-transparent'
                                            }`}
                                        />
                                    </div>

                                    {/* Blocks */}
                                    {blocks.length === 0 ? (
                                        <div className="flex h-20 items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/40 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                            Closed
                                        </div>
                                    ) : (
                                        <ul className="flex flex-col gap-1.5">
                                            {blocks.map((b) => (
                                                <li key={b.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSlot(b)}
                                                        title={
                                                            b.is_active
                                                                ? 'Click to deactivate'
                                                                : 'Click to activate'
                                                        }
                                                        aria-pressed={b.is_active}
                                                        className={`group relative flex w-full flex-col gap-0.5 rounded-md border px-2.5 py-1.5 text-left transition-colors ${
                                                            b.is_active
                                                                ? 'border-[color:var(--primary)]/20 bg-[color:var(--primary)]/[0.07] text-primary hover:bg-[color:var(--primary)]/[0.11]'
                                                                : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted'
                                                        }`}
                                                    >
                                                        <span className="text-[11px] font-semibold tabular-nums">
                                                            {formatTimeRange(b.start_time, b.end_time)}
                                                        </span>
                                                        <span className="text-[9px] uppercase tracking-[0.14em] opacity-70">
                                                            {b.timezone || 'UTC'}
                                                        </span>
                                                        {b.is_active ? (
                                                            <span
                                                                aria-hidden
                                                                className="absolute right-1.5 top-1.5 inline-block h-1 w-1 rounded-full bg-[color:var(--success)]"
                                                            />
                                                        ) : null}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Visual add-window form */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <div className="relative border-b border-border bg-[color:var(--primary)]/[0.04] px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <Calendar className="h-4 w-4 text-primary" aria-hidden />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                            Add window
                        </p>
                    </div>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
                        Open a new teaching window.
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Choose a day, set the time range, and select your local timezone.
                    </p>
                </div>

                <div className="space-y-6 p-6">
                    {/* Day picker — 7 toggle pills */}
                    <fieldset>
                        <legend className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Day of week
                        </legend>
                        <div className="grid grid-cols-7 gap-1.5">
                            {WEEK_ORDER.map((day) => {
                                const selected = form.day_of_week === day;
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, day_of_week: day }))}
                                        aria-pressed={selected}
                                        className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                                            selected
                                                ? 'border-primary bg-primary text-primary-foreground shadow-card'
                                                : 'border-border bg-card text-foreground/70 hover:border-foreground/30 hover:bg-muted'
                                        }`}
                                    >
                                        <span className="font-display text-[11px] font-semibold tracking-normal">
                                            {SHORT_DAYS[day]}
                                        </span>
                                        <span
                                            className={`text-[8px] tracking-[0.16em] ${
                                                selected ? 'opacity-80' : 'opacity-60'
                                            }`}
                                        >
                                            {DAYS[day].slice(0, 3).toUpperCase()}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>

                    {/* Time range + timezone */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr]">
                        <div>
                            <label
                                htmlFor="start-time"
                                className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                            >
                                <Clock className="h-3 w-3" />
                                Start
                            </label>
                            <input
                                id="start-time"
                                type="time"
                                value={form.start_time}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, start_time: e.target.value }))
                                }
                                className="h-11 w-full rounded-md border border-border bg-card px-3 font-display text-base tabular-nums text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="end-time"
                                className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                            >
                                <Clock className="h-3 w-3" />
                                End
                            </label>
                            <input
                                id="end-time"
                                type="time"
                                value={form.end_time}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, end_time: e.target.value }))
                                }
                                className="h-11 w-full rounded-md border border-border bg-card px-3 font-display text-base tabular-nums text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="tz"
                                className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                            >
                                <Globe className="h-3 w-3" />
                                Timezone
                            </label>
                            <select
                                id="tz"
                                value={form.timezone}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, timezone: e.target.value }))
                                }
                                className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                            >
                                {TIMEZONES.map((tz) => (
                                    <option key={tz} value={tz}>
                                        {tz}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Live preview */}
                    <div className="rounded-md border border-dashed border-border bg-muted/40 p-4">
                        <div className="flex items-center justify-center gap-3 text-xs">
                            <GeometricDivider />
                            <div className="text-center">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                    Preview
                                </p>
                                <p className="mt-1 font-display text-base font-semibold text-foreground tabular-nums">
                                    {DAYS[form.day_of_week]} · {form.start_time} – {form.end_time}
                                </p>
                                <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                    {form.timezone}
                                </p>
                            </div>
                            <GeometricDivider />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
                    <p className="hidden text-xs text-muted-foreground sm:block">
                        Students see only active windows.
                    </p>
                    <Button
                        variant="primary"
                        onClick={addSlot}
                        isLoading={loading}
                    >
                        Save window
                    </Button>
                </div>
            </div>
        </section>
    );
}
