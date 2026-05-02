import React from 'react';
import { TeacherProfile } from '@/types';
import { Verified } from '@/components/icons';

type AnyTeacherProfile = TeacherProfile & {
    years_of_experience?: number | string;
    total_students?: number;
    profile_visibility?: boolean;
};

export function TeacherProfileCard({ profile }: { profile: TeacherProfile | null }) {
    const p = profile as AnyTeacherProfile | null;
    const verified =
        (p?.verification_status || '').toString().toUpperCase() === 'VERIFIED';

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative border-b border-border bg-[color:var(--primary)]/[0.04] px-5 pt-5 pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Ustaz profile
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
                    {p?.specialization || 'Your specialization'}
                </h3>
                {p?.teaching_level ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {String(p.teaching_level)}
                        {p.years_of_experience
                            ? ` · ${p.years_of_experience} years`
                            : ''}
                    </p>
                ) : null}
                {verified ? (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-accent/30 bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                        <Verified className="h-3 w-3 text-accent" />
                        Verified
                    </span>
                ) : null}
            </div>

            <dl className="grid grid-cols-2 divide-x divide-border border-b border-border">
                {p?.hourly_rate ? (
                    <div className="px-5 py-4">
                        <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            Hourly rate
                        </dt>
                        <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground">
                            ${p.hourly_rate}
                        </dd>
                    </div>
                ) : null}
                {typeof p?.total_students === 'number' ? (
                    <div className="px-5 py-4">
                        <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            Students
                        </dt>
                        <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground">
                            {p.total_students}
                        </dd>
                    </div>
                ) : null}
            </dl>

            <div className="space-y-2 px-5 py-4 text-xs">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Verification</span>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            verified
                                ? 'border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)]'
                                : 'border-[color:var(--warning)]/30 bg-[color:var(--warning)]/15 text-[#8a6326]'
                        }`}
                    >
                        {verified ? 'Verified' : 'Pending'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Directory listing</span>
                    <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            p?.profile_visibility
                                ? 'border-primary/15 bg-[color:var(--primary)]/10 text-primary'
                                : 'border-border bg-muted text-muted-foreground'
                        }`}
                    >
                        {p?.profile_visibility ? 'Visible' : 'Hidden'}
                    </span>
                </div>
            </div>
        </section>
    );
}
