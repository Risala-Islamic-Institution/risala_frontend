import React from 'react';
import { Teacher } from '@/types';
import { TeacherCard } from './TeacherCard';

interface TeacherGridProps {
    teachers: Teacher[];
    onBook: (t: Teacher) => void;
    onPackage: (t: Teacher) => void;
}

export function TeacherGrid({ teachers, onBook, onPackage }: TeacherGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
