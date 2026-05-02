import React, { useState } from 'react';
import { Slot } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/icons';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface AvailabilityManagerProps {
    slots: Slot[];
    onChange: (slots: Slot[]) => void;
    onError: (msg: string) => void;
}

export function AvailabilityManager({ slots, onChange, onError }: AvailabilityManagerProps) {
    const [form, setForm] = useState({
        day_of_week: 1,
        start_time: '09:00',
        end_time: '11:00',
        timezone: 'UTC',
    });
    const [loading, setLoading] = useState(false);

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

    const inputCls =
        'h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30';

    const activeCount = slots.filter((a) => a.is_active).length;

    return (
        <section>
            <div className="mb-5 flex items-end justify-between gap-5">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Availability
                    </p>
                    <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                        Your weekly windows.
                    </h2>
                </div>
                <span className="hidden shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
                    {activeCount} active
                </span>
            </div>

            {slots.length === 0 ? (
                <div className="mb-5 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                    <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-primary">
                        <Calendar className="h-5 w-5" />
                    </span>
                    <p className="font-display text-base font-semibold text-foreground">
                        No availability configured
                    </p>
                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Add your weekly teaching windows so students can request sessions.
                    </p>
                </div>
            ) : (
                <ul className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {slots.map((a) => (
                        <li
                            key={a.id}
                            className={`flex items-center justify-between rounded-2xl border p-4 transition-colors ${
                                a.is_active
                                    ? 'border-border bg-card hover:border-foreground/30'
                                    : 'border-border bg-muted/40 opacity-70'
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className={`flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-md border text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                        a.is_active
                                            ? 'border-primary/20 bg-[color:var(--primary)]/[0.06] text-primary'
                                            : 'border-border bg-card text-muted-foreground'
                                    }`}
                                >
                                    {SHORT_DAYS[a.day_of_week]}
                                </div>
                                <div className="min-w-0">
                                    <p
                                        className={`text-sm font-medium ${
                                            a.is_active ? 'text-foreground' : 'text-muted-foreground'
                                        }`}
                                    >
                                        {DAYS[a.day_of_week]}
                                    </p>
                                    <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                                        {a.start_time} – {a.end_time}
                                    </p>
                                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                        {a.timezone}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                title={a.is_active ? 'Deactivate' : 'Activate'}
                                aria-pressed={a.is_active}
                                onClick={() => toggleSlot(a)}
                                className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                                    a.is_active
                                        ? 'border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)] hover:bg-[color:var(--success)]/15'
                                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                                }`}
                            >
                                {a.is_active ? 'Active' : 'Off'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Add window
                    </p>
                    <h3 className="mt-1 font-display text-base font-semibold leading-tight text-foreground">
                        New weekly slot.
                    </h3>
                </div>
                <div className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-2 md:grid-cols-5">
                    <select
                        aria-label="Day of week"
                        className={inputCls}
                        value={form.day_of_week}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, day_of_week: parseInt(e.target.value) }))
                        }
                    >
                        {DAYS.map((d, i) => (
                            <option key={i} value={i}>
                                {d}
                            </option>
                        ))}
                    </select>
                    <input
                        aria-label="Start time"
                        type="time"
                        className={inputCls}
                        value={form.start_time}
                        onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                    />
                    <input
                        aria-label="End time"
                        type="time"
                        className={inputCls}
                        value={form.end_time}
                        onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                    />
                    <select
                        aria-label="Timezone"
                        className={inputCls}
                        value={form.timezone}
                        onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                    >
                        <option value="UTC">UTC</option>
                        <option value="Africa/Cairo">Africa/Cairo</option>
                        <option value="Asia/Riyadh">Asia/Riyadh</option>
                        <option value="Asia/Dubai">Asia/Dubai</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur</option>
                    </select>
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={addSlot}
                        isLoading={loading}
                    >
                        Add window
                    </Button>
                </div>
            </div>
        </section>
    );
}
