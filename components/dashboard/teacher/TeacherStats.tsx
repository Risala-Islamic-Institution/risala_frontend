import React from 'react';

interface StatProps {
    requests: number;
    confirmed: number;
    courses: number;
    slots: number;
}

export function TeacherStats({ requests, confirmed, courses, slots }: StatProps) {
    const stats = [
        { label: 'Requests', value: requests, color: 'text-blue-600' },
        { label: 'Confirmed', value: confirmed, color: 'text-[#2F7D5A]' },
        { label: 'Courses', value: courses, color: 'text-primary' },
        { label: 'Slots', value: slots, color: 'text-accent' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="bg-white border border-neutral/30 rounded-2xl p-5 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                    <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] font-bold tracking-[.15em] uppercase text-secondary/30 mt-1">
                        {s.label}
                    </p>
                </div>
            ))}
        </div>
    );
}
