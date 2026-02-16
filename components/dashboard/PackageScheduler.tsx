'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';

interface WeeklySlot {
    id: string;
    day_of_week: number;
    start_time: string;
    end_at: string; // backend might return end_at or end_time, checking model... start_time, end_time
}

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
                // Fetch raw availability patterns
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

            const res = await api.post<any>('/bookings/create-package/', payload);
            onSuccess(res.id);
        } catch (err: any) {
            console.error('Failed to create package:', err);
            alert(err.response?.data?.error || 'Failed to create package. Some slots might be unavailable.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center">Loading availability...</div>;
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-neutral/20 overflow-hidden max-w-2xl w-full mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-primary p-8 text-white relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
                <h2 className="text-2xl font-black relative z-10">Book a Lesson Package</h2>
                <p className="text-white/60 text-sm mt-1 relative z-10">Select your weekly schedule with <span className="text-white font-bold">{teacher.user.full_name || teacher.user.username}</span></p>
            </div>

            <div className="p-8 space-y-8">
                {/* Step 1: Select Weekly Slots */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">1</span>
                        <label className="text-xs font-bold uppercase tracking-widest text-secondary/40">Select Weekly Days & Times</label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availabilities.length === 0 ? (
                            <p className="col-span-2 text-sm text-secondary/40 italic p-4 border border-dashed border-neutral/30 rounded-xl text-center">This teacher hasn't set their availability yet.</p>
                        ) : (
                            availabilities.map((avail) => {
                                const isSelected = selectedSlots.find(s => s.id === avail.id);
                                return (
                                    <button
                                        key={avail.id}
                                        onClick={() => toggleSlot(avail)}
                                        className={`flex items-center justify-between p-4 border rounded-xl transition-all duration-200 text-left ${isSelected
                                                ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-sm'
                                                : 'bg-white border-neutral/30 hover:bg-neutral/5 hover:border-neutral/60'
                                            }`}
                                    >
                                        <div>
                                            <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-secondary'}`}>{DAYS[avail.day_of_week]}</p>
                                            <p className="text-xs text-secondary/50 font-medium mt-0.5">{avail.start_time} - {avail.end_time}</p>
                                        </div>
                                        {isSelected && <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">✓</div>}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Step 2: Duration */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">2</span>
                        <label className="text-xs font-bold uppercase tracking-widest text-secondary/40">Choose Package Duration</label>
                    </div>
                    <div className="flex gap-4">
                        {[4, 8, 12].map((weeks) => (
                            <button
                                key={weeks}
                                onClick={() => setDurationWeeks(weeks)}
                                className={`flex-1 py-4 px-4 border rounded-2xl font-bold transition-all duration-200 ${durationWeeks === weeks
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                                        : 'bg-white text-secondary/60 border-neutral/30 hover:bg-neutral/5'
                                    }`}
                            >
                                <span className="block text-lg">{weeks / 4} Month{weeks > 4 ? 's' : ''}</span>
                                <span className={`block text-[10px] uppercase tracking-wider ${durationWeeks === weeks ? 'text-white/60' : 'text-secondary/30'}`}>{weeks} Weeks</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 3: Summary */}
                <div className="bg-neutral/5 rounded-2xl p-6 border border-neutral/10">
                    <div className="flex justify-between items-center mb-3 text-sm">
                        <span className="text-secondary/60">Hourly Rate</span>
                        <span className="font-bold text-secondary">${teacher.hourly_rate}/hr</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 text-sm">
                        <span className="text-secondary/60">Total Sessions</span>
                        <span className="font-bold text-secondary">{totalSessions} Lessons</span>
                    </div>
                    <div className="border-t border-neutral/10 pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-secondary">Total Price</span>
                        <span className="text-3xl font-black text-primary">${totalPrice}</span>
                    </div>
                </div>

                <div className="flex gap-4 pt-2">
                    <Button variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
                    <Button
                        variant="primary"
                        className="flex-[2] rounded-xl shadow-lg shadow-primary/20"
                        onClick={handleConfirm}
                        disabled={selectedSlots.length === 0}
                        isLoading={loading}
                    >
                        Confirm & Pay
                    </Button>
                </div>
            </div>
        </div>
    );
};
