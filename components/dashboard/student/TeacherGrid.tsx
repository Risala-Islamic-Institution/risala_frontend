import React from 'react';
import { Teacher } from '@/types';
import { TeacherCard } from './TeacherCard';

interface TeacherGridProps {
    teachers: Teacher[];
    onBook: (t: Teacher) => void;
    onPackage: (t: Teacher) => void;
}

export function TeacherGrid({ teachers, onBook, onPackage }: TeacherGridProps) {
    if (teachers.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <p className="font-display text-base font-semibold text-foreground">
                    No Ustaz match this filter yet.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try a different specialization or come back soon — we&apos;re onboarding new verified Ustaz every week.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
                <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    onBook={() => onBook(teacher)}
                    onPackage={() => onPackage(teacher)}
                />
            ))}
        </div>
    );
}
