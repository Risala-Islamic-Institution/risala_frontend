import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Verified, Star } from '@/components/icons';
import { Teacher } from '@/types';

interface TeacherCardProps {
    teacher: Teacher;
    onBook: () => void;
    onPackage: () => void;
}

export function TeacherCard({ teacher, onBook, onPackage }: TeacherCardProps) {
    const name = teacher.user.full_name || teacher.user.username;
    const verified =
        (teacher.verification_status || '').toString().toUpperCase() === 'VERIFIED';
    const rating = teacher.rating_average ?? 0;
    const students = teacher.total_students ?? 0;

    return (
        <article className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
            <div className="flex items-start gap-4">
                <Avatar
                    name={name}
                    src={teacher.user.profile_picture}
                    size="lg"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                        <h3 className="truncate font-display text-base font-semibold text-foreground">
                            {name}
                        </h3>
                        {verified ? (
                            <Verified className="h-4 w-4 shrink-0 text-accent" aria-label="Verified Ustaz" />
                        ) : null}
                    </div>
                    {teacher.specialization ? (
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {teacher.specialization}
                        </p>
                    ) : null}
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-accent" />
                            <span className="font-medium tabular-nums text-foreground">
                                {Number(rating).toFixed(1)}
                            </span>
                        </span>
                        <span className="tabular-nums">{students} students</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-display text-lg font-semibold tabular-nums text-foreground">
                        ${teacher.hourly_rate}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        per hour
                    </p>
                </div>
            </div>

            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/75">
                {teacher.biography ||
                    'Experienced Ustaz ready to guide you with care, structure, and dignity.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
                {teacher.teaching_level ? (
                    <Badge variant="outline" label={String(teacher.teaching_level)} />
                ) : null}
                {teacher.years_of_experience ? (
                    <Badge
                        variant="ghost"
                        label={`${teacher.years_of_experience}y experience`}
                    />
                ) : null}
                {verified ? <Badge variant="success" label="Verified" /> : null}
            </div>

            <div className="mt-auto flex gap-2 pt-5">
                <Button variant="primary" size="sm" className="flex-1" onClick={onBook}>
                    Book session
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={onPackage}>
                    Package
                </Button>
            </div>
        </article>
    );
}
