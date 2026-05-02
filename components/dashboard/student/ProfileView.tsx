import React from 'react';
import { UserProfile, Booking } from '@/types';
import { Avatar } from '@/components/ui/Avatar';

interface ProfileViewProps {
    profile: UserProfile | null;
    bookings: Booking[];
    activeCount: number;
}

export function ProfileView({ profile, bookings, activeCount }: ProfileViewProps) {
    if (!profile) return null;

    const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
    const name = profile.full_name || profile.username;

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <section className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-4">
                    <Avatar name={name} size="xl" />
                    <div className="min-w-0">
                        <h2 className="font-display text-xl font-semibold text-foreground">
                            {name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {profile.is_student ? 'Student account' : 'Risala account'}
                        </p>
                    </div>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-md border border-border bg-muted/40 p-4">
                        <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                            Confirmed sessions
                        </dt>
                        <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                            {confirmedCount}
                        </dd>
                    </div>
                    <div className="rounded-md border border-border bg-muted/40 p-4">
                        <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                            Active requests
                        </dt>
                        <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                            {activeCount}
                        </dd>
                    </div>
                </dl>
            </section>

            <section className="space-y-3">
                <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Learning goals
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                        {profile.learning_goals || 'Not set yet — describe what you want to focus on next.'}
                    </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Email
                    </p>
                    <p className="mt-2 text-sm text-foreground">{profile.email}</p>
                </div>
                {profile.user_timezone ? (
                    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Timezone
                        </p>
                        <p className="mt-2 text-sm text-foreground">{profile.user_timezone}</p>
                    </div>
                ) : null}
            </section>
        </div>
    );
}
