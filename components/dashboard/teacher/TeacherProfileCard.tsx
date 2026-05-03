import React from 'react';
import { TeacherProfile } from '@/types';
import { Verified } from '@/components/icons';
import { GeometricPanel } from '@/components/dashboard/IslamicOrnament';

export function TeacherProfileCard({ profile }: { profile: TeacherProfile | null }) {
    const verified =
        (profile?.verification_status || '').toString().toUpperCase() === 'VERIFIED';

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {/* Hero band with subtle Islamic pattern */}
            <div className="relative border-b border-border bg-[color:var(--primary)]/[0.05] px-5 pt-5 pb-5">
                <GeometricPanel className="absolute inset-y-0 right-0 h-full w-40 opacity-50" />
                <div className="relative">
                    <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                        Ustaz profile
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
                        {profile?.specialization || 'Set your specialization'}
                    </h3>
                    {profile?.teaching_level ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {profile.teaching_level}
                        </p>
                    ) : null}
                    {verified ? (
                        <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/35 bg-card px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a5a14]">
                            <Verified className="h-3 w-3 text-[color:var(--accent)]" />
                            Verified Ustaz
                        </span>
                    ) : null}
                </div>
            </div>

            {/* KPI tile */}
            {profile?.hourly_rate ? (
                <div className="border-b border-border px-5 py-4">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        Hourly rate
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                        ${profile.hourly_rate}
                    </p>
                </div>
            ) : null}

            {/* Status rows */}
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
                    <span className="text-muted-foreground">Specialization</span>
                    <span className="truncate font-medium text-foreground">
                        {profile?.specialization || '—'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Teaching level</span>
                    <span className="truncate font-medium text-foreground">
                        {profile?.teaching_level || '—'}
                    </span>
                </div>
            </div>
        </section>
    );
}
