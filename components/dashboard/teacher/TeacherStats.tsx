import React from 'react';

interface StatProps {
    requests: number;
    confirmed: number;
    courses: number;
    slots: number;
}

export function TeacherStats({ requests, confirmed, courses, slots }: StatProps) {
    const stats = [
        { label: 'Pending requests', value: requests, accent: requests > 0 },
        { label: 'Confirmed sessions', value: confirmed, accent: false },
        { label: 'Courses', value: courses, accent: false },
        { label: 'Active slots', value: slots, accent: false },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="overflow-hidden rounded-2xl border border-border bg-card p-5"
                >
                    <div className="flex items-center gap-2">
                        {s.accent ? (
                            <span
                                aria-hidden
                                className="relative inline-flex h-2 w-2"
                            >
                                <span className="absolute inset-0 rounded-full bg-accent animate-pulse-ring" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                            </span>
                        ) : null}
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {s.label}
                        </p>
                    </div>
                    <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">
                        {s.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
