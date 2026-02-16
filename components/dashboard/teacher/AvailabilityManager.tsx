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
                <span className="text-[10px] font-bold tracking-[.15em] uppercase text-secondary/30">
                    {slots.filter((a) => a.is_active).length} Active
                </span>
            </div>

            {slots.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-neutral/40 rounded-3xl p-10 text-center mb-4">
                    <p className="text-secondary/30 font-medium">No availability configured</p>
                    <p className="text-secondary/20 text-sm mt-1">Add time slots below so students can book sessions</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {slots.map((a) => (
                        <div
                            key={a.id}
                            className={`flex items-center justify-between p-4 border rounded-2xl transition-all duration-200 ${a.is_active
                                    ? 'bg-white border-neutral/30 hover:shadow-md hover:shadow-primary/5'
                                    : 'bg-neutral/10 border-neutral/20 opacity-50'
                                }`}
                        >
                            <div>
                                <p className={`text-sm font-bold ${a.is_active ? 'text-secondary' : 'text-secondary/40'}`}>
                                    {DAYS[a.day_of_week]}
                                </p>
                                <p className="text-xs text-secondary/40 mt-0.5">
                                    {a.start_time} – {a.end_time}
                                </p>
                                <p className="text-[10px] text-secondary/25 mt-0.5">{a.timezone}</p>
                            </div>
                            <button
                                title={a.is_active ? 'Deactivate' : 'Activate'}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-200 ${a.is_active
                                        ? 'bg-[#2F7D5A]/10 text-[#2F7D5A] hover:bg-[#2F7D5A]/20'
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
            <div className="bg-primary/[.03] border border-primary/10 rounded-2xl p-5">
                <p className="text-[10px] font-bold tracking-[.15em] uppercase text-primary/50 mb-3">+ Add New Slot</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <select
                        className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white text-secondary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
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
                        className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white text-secondary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        value={form.start_time}
                        onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                    />
                    <input
                        type="time"
                        className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white text-secondary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        value={form.end_time}
                        onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                    />
                    <select
                        className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white text-secondary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
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
                    <Button variant="primary" className="rounded-xl w-full" onClick={addSlot} isLoading={loading}>
                        Add
                    </Button>
                </div>
            </div>
        </section>
    );
}
