import React from 'react';
import { TeacherProfile } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Verified } from '@/components/icons';

export function TeacherProfileCard({ profile }: { profile: TeacherProfile | null }) {
    const verified =
        (profile?.verification_status || '').toString().toUpperCase() === 'VERIFIED';

    return (
        <section className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Ustaz profile
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                        {profile?.specialization || 'Your specialization'}
                    </h3>
                </div>
                {verified ? (
                    <Verified className="h-5 w-5 shrink-0 text-accent" aria-label="Verified" />
                ) : null}
            </div>

            {profile?.teaching_level ? (
                <p className="mt-2 text-sm text-muted-foreground">
                    {String(profile.teaching_level)}
                    {profile.years_of_experience
                        ? ` · ${profile.years_of_experience} years experience`
                        : ''}
                </p>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-3">
                {profile?.hourly_rate ? (
                    <div className="rounded-md border border-border bg-muted/40 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            Hourly rate
                        </p>
                        <p className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground">
                            ${profile.hourly_rate}
                        </p>
                    </div>
                ) : null}
                {typeof profile?.total_students === 'number' ? (
                    <div className="rounded-md border border-border bg-muted/40 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            Students
                        </p>
                        <p className="mt-1 font-display text-xl font-semibold tabular-nums text-foreground">
                            {profile.total_students}
                        </p>
                    </div>
                ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge
                    variant={verified ? 'success' : 'warning'}
                    label={verified ? 'Verified' : 'Verification pending'}
                />
                {profile?.profile_visibility ? (
                    <Badge variant="default" label="Visible to students" />
                ) : (
                    <Badge variant="ghost" label="Hidden from directory" />
                )}
            </div>
        </section>
    );
}
