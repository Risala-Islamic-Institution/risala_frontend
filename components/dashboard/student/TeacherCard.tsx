import React from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowUpRight, Globe, Star, Verified } from '@/components/icons';
import { Teacher } from '@/types';

interface TeacherCardProps {
    teacher: Teacher;
    onBook: () => void;
    onPackage: () => void;
}

type AnyTeacher = Teacher & {
    verification_status?: string;
    rating_average?: number | string;
    total_students?: number;
    teaching_level?: string;
    years_of_experience?: number | string;
    languages?: string;
};

export function TeacherCard({ teacher, onBook, onPackage }: TeacherCardProps) {
    const t = teacher as AnyTeacher;
    const name = t.user.full_name || t.user.username;
    const verified =
        (t.verification_status || '').toString().toUpperCase() === 'VERIFIED';
    const rating = Number(t.rating_average ?? 0);
    const students = t.total_students ?? 0;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-elevated">
            {/* Header band — soft primary tint with verified ribbon */}
            <div className="relative border-b border-border bg-[color:var(--primary)]/[0.04] px-5 pt-5 pb-4">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <Avatar name={name} src={t.user.profile_picture} size="lg" />
                        <span
                            aria-hidden
                            className="absolute -bottom-0.5 -right-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-card"
                            style={{ background: 'var(--success)' }}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="truncate font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
                                {name}
                            </h3>
                            {verified ? (
                                <Verified
                                    className="h-4 w-4 shrink-0 text-accent"
                                    aria-label="Verified Ustaz"
                                />
                            ) : null}
                        </div>
                        {t.specialization ? (
                            <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                {t.specialization}
                            </p>
                        ) : null}
                        <div className="mt-2 flex items-center gap-3 text-xs">
                            <span className="inline-flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 text-accent" />
                                <span className="font-medium tabular-nums text-foreground">
                                    {rating.toFixed(1)}
                                </span>
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="tabular-nums text-muted-foreground">
                                {students} students
                            </span>
                        </div>
                    </div>
                </div>

                {verified ? (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-accent/30 bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                        <Verified className="h-3 w-3 text-accent" />
                        Verified
                    </span>
                ) : null}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-4 p-5">
                <p className="line-clamp-3 text-sm leading-relaxed text-foreground/75">
                    {t.biography ||
                        'Experienced Ustaz ready to guide you with care, structure, and dignity.'}
                </p>

                <dl className="grid grid-cols-3 gap-3 border-y border-border py-3 text-xs">
                    <div>
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            Level
                        </dt>
                        <dd className="mt-0.5 truncate font-medium text-foreground">
                            {t.teaching_level || '—'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            Experience
                        </dt>
                        <dd className="mt-0.5 truncate font-medium text-foreground">
                            {t.years_of_experience ? `${t.years_of_experience}y` : '—'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            Rate
                        </dt>
                        <dd className="mt-0.5 font-medium tabular-nums text-foreground">
                            ${t.hourly_rate}/hr
                        </dd>
                    </div>
                </dl>

                <div className="mt-auto flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        {t.languages || 'English'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 transition-transform group-hover:translate-x-0.5">
                        View profile
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
