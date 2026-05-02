import React from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowUpRight } from '@/components/icons';
import { Teacher } from '@/types';

interface TeacherCardProps {
    teacher: Teacher;
    onBook: () => void;
    onPackage: () => void;
}

export function TeacherCard({ teacher, onBook, onPackage }: TeacherCardProps) {
    const name = teacher.user.full_name || teacher.user.username;
    const initial = (name || 'U').trim().charAt(0).toUpperCase();

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-elevated">
            {/* Header band — soft primary tint */}
            <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-5 pt-5 pb-4">
                <div className="flex items-start gap-4">
                    <Avatar name={name} src={teacher.user.profile_picture} size="lg" />
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
                            {name}
                        </h3>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            @{teacher.user.username}
                        </p>
                        {teacher.specialization ? (
                            <span className="mt-2 inline-flex max-w-full items-center gap-1 truncate rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/70">
                                {teacher.specialization}
                            </span>
                        ) : null}
                    </div>
                    <span
                        aria-hidden
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-display text-sm font-semibold text-accent-foreground"
                    >
                        {initial}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-4 p-5">
                <p className="line-clamp-3 text-sm leading-relaxed text-foreground/75">
                    {teacher.biography ||
                        'Experienced Ustaz ready to guide you with care, structure, and dignity.'}
                </p>

                <dl className="grid grid-cols-2 gap-3 border-y border-border py-3 text-xs">
                    <div>
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            Specialization
                        </dt>
                        <dd className="mt-0.5 truncate font-medium text-foreground">
                            {teacher.specialization || '—'}
                        </dd>
                    </div>
                    <div className="text-right">
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            Hourly rate
                        </dt>
                        <dd className="mt-0.5 font-display text-base font-semibold tabular-nums text-foreground">
                            ${teacher.hourly_rate}
                        </dd>
                    </div>
                </dl>

                <div className="mt-auto flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 transition-transform group-hover:translate-x-0.5">
                        View details
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                </div>

                <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1" onClick={onBook}>
                        Book session
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={onPackage}>
                        Package
                    </Button>
                </div>
            </div>
        </article>
    );
}
