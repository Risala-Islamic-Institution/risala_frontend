import React from 'react';

interface StatProps {
    requests: number;
    confirmed: number;
    courses: number;
    slots: number;
}

export function TeacherStats({ requests, confirmed, courses, slots }: StatProps) {
    const stats = [
        { label: 'Requests', value: requests, tone: 'from-[#163f33] to-[#255846]', chip: 'text-accent' },
        { label: 'Confirmed', value: confirmed, tone: 'from-[#0f3d2e] to-[#2F7D5A]', chip: 'text-accent' },
        { label: 'Courses', value: courses, tone: 'from-[#1C1F26] to-[#2a2f3a]', chip: 'text-accent' },
        { label: 'Slots', value: slots, tone: 'from-[#6f5a2c] to-[#8e7236]', chip: 'text-white' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className={`rounded-2xl p-5 text-center border border-white/15 bg-gradient-to-br ${s.tone} shadow-[0_12px_26px_rgba(15,61,46,0.18)] hover:shadow-[0_18px_34px_rgba(15,61,46,0.28)] transition-all duration-300`}
                >
                    <p className="text-3xl font-black text-white">{s.value}</p>
                    <p className={`text-[10px] font-bold tracking-[.15em] uppercase mt-1 ${s.chip}`}>
                        {s.label}
                    </p>
                </div>
            ))}
        </div>
    );
}
