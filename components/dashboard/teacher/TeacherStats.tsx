import React from 'react';

interface StatProps {
    requests: number;
    confirmed: number;
    courses: number;
    slots: number;
}

export function TeacherStats({ requests, confirmed, courses, slots }: StatProps) {
    const stats = [
        { label: 'Pending requests', value: requests },
        { label: 'Confirmed sessions', value: confirmed },
        { label: 'Courses', value: courses },
        { label: 'Active slots', value: slots },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="rounded-xl border border-border bg-card p-5 shadow-card"
                >
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        {s.label}
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                        {s.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
