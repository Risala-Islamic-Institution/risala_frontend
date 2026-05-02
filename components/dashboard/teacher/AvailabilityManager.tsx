import React, { useState } from 'react';
import { Slot } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface AvailabilityManagerProps {
    slots: Slot[];
    onChange: (slots: Slot[]) => void;
    onError: (msg: string) => void;
}

export function AvailabilityManager({ slots, onChange, onError }: AvailabilityManagerProps) {
    const [form, setForm] = useState({ day_of_week: 1, start_time: '09:00', end_time: '11:00', timezone: 'UTC' });
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
        } catch (e: any) {
            onError(e?.message || 'Failed to add slot.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-secondary">Availability</h2>
                <span className="text-[10px] font-bold tracking-[.15em] uppercase text-secondary/35 border border-primary/15 px-2.5 py-1 rounded-full bg-white/75">
                    {slots.filter((a) => a.is_active).length} Active
                </span>
            </div>

            {slots.length === 0 ? (
                <div className="rounded-[2rem] border border-primary/15 bg-linear-to-br from-white via-[#f8fbf5] to-[#edf7e8] p-10 text-center mb-4 ring-1 ring-accent/20 shadow-[0_26px_60px_rgba(15,61,46,0.12)]">
                    <div className="mx-auto mb-3 h-14 w-14 rounded-2xl border border-primary/20 bg-white/80 text-2xl text-primary flex items-center justify-center">◌</div>
                    <p className="text-secondary/45 font-semibold">No availability configured</p>
                    <p className="text-secondary/30 text-sm mt-1">Add your sacred teaching windows so students can request sessions.</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary/55 font-bold mt-4">Sacred Schedule</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {slots.map((a) => (
                        <div
                            key={a.id}
                            className={`relative overflow-hidden flex items-center justify-between p-4 border rounded-[1.2rem] transition-all duration-200 ${a.is_active
                                    ? 'bg-linear-to-br from-white via-[#f7fcf5] to-[#eef7e9] border-primary/18 hover:shadow-[0_16px_32px_rgba(15,61,46,0.14)] ring-1 ring-primary/10'
                                    : 'bg-neutral/10 border-neutral/20 opacity-60'
                                }`}
                        >
                            {a.is_active ? <div className="pointer-events-none absolute top-0 left-0 h-full w-1.5 bg-linear-to-b from-primary/70 to-primary/10" /> : null}
                            <div>
                                <p className={`text-sm font-black tracking-[0.01em] ${a.is_active ? 'text-secondary' : 'text-secondary/40'}`}>
                                    {DAYS[a.day_of_week]}
                                </p>
                                <p className="text-xs text-secondary/45 mt-0.5">
                                    {a.start_time} – {a.end_time}
                                </p>
                                <p className="text-[10px] text-secondary/25 mt-0.5">{a.timezone}</p>
                            </div>
                            <button
                                title={a.is_active ? 'Deactivate' : 'Activate'}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-200 ${a.is_active
                                        ? 'bg-[#2F7D5A]/15 text-[#2F7D5A] hover:bg-[#2F7D5A]/25 border border-[#2F7D5A]/25 shadow-[0_8px_18px_rgba(47,125,90,0.2)]'
                                        : 'bg-neutral/20 text-secondary/30 hover:bg-neutral/30'
                                    }`}
                                onClick={() => toggleSlot(a)}
                            >
                                {a.is_active ? '✓' : '—'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Slot Form */}
            <div className="relative overflow-hidden bg-linear-to-br from-[#143f35] via-[#145346] to-[#10372f] border border-[#0E5A47]/50 ring-1 ring-accent/30 rounded-[1.4rem] p-5 shadow-[0_22px_46px_rgba(10,43,34,0.35)]">
                <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-accent/22 blur-2xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-1.5 w-full bg-linear-to-r from-transparent via-[#F4E6B2]/60 to-transparent" />
                <p className="relative text-[10px] font-black tracking-[.18em] uppercase text-[#F4E6B2]/85 mb-3">+ Add New Slot</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <select
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 text-secondary focus:ring-2 focus:ring-[#F4E6B2]/40 focus:border-[#F4E6B2] outline-none"
                        value={form.day_of_week}
                        onChange={(e) => setForm((f) => ({ ...f, day_of_week: parseInt(e.target.value) }))}
                    >
                        {DAYS.map((d, i) => (
                            <option key={i} value={i}>
                                {d}
                            </option>
                        ))}
                    </select>
                    <input
                        type="time"
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 text-secondary focus:ring-2 focus:ring-[#F4E6B2]/40 focus:border-[#F4E6B2] outline-none"
                        value={form.start_time}
                        onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                    />
                    <input
                        type="time"
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 text-secondary focus:ring-2 focus:ring-[#F4E6B2]/40 focus:border-[#F4E6B2] outline-none"
                        value={form.end_time}
                        onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                    />
                    <select
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 text-secondary focus:ring-2 focus:ring-[#F4E6B2]/40 focus:border-[#F4E6B2] outline-none"
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
                    <Button variant="primary" className="rounded-xl w-full shadow-lg shadow-primary/25" onClick={addSlot} isLoading={loading}>
                        Add
                    </Button>
                </div>
            </div>
        </section>
    );
}
