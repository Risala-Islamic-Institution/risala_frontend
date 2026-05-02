import React from 'react';
import { UserProfile, Booking } from '@/types';
import { Avatar } from '@/components/ui/Avatar';

interface ProfileViewProps {
    profile: UserProfile | null;
    bookings: Booking[];
    activeCount: number;
}

type AnyUserProfile = UserProfile & {
    user_timezone?: string;
};

export function ProfileView({ profile, bookings, activeCount }: ProfileViewProps) {
    if (!profile) return null;
    const p = profile as AnyUserProfile;

    const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const totalCount = bookings.length;
    const name = p.full_name || p.username;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Identity card */}
            <aside className="lg:col-span-4">
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="relative border-b border-border bg-[color:var(--primary)]/[0.04] px-6 pb-6 pt-7">
                        <div className="flex items-center gap-4">
                            <Avatar name={name} src={p.profile_picture} size="xl" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                    Learner
                                </p>
                                <h2 className="mt-0.5 truncate font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                                    {name}
                                </h2>
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                    @{p.username}
                                </p>
                            </div>
                        </div>
                    </div>

                    <dl className="divide-y divide-border text-sm">
                        <div className="flex items-baseline justify-between gap-4 px-6 py-4">
                            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                Email
                            </dt>
                            <dd className="truncate text-foreground">{p.email}</dd>
                        </div>
                        {p.user_timezone ? (
                            <div className="flex items-baseline justify-between gap-4 px-6 py-4">
                                <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                    Timezone
                                </dt>
                                <dd className="truncate text-foreground">{p.user_timezone}</dd>
                            </div>
                        ) : null}
                        <div className="flex items-baseline justify-between gap-4 px-6 py-4">
                            <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                Account
                            </dt>
                            <dd className="text-foreground">
                                {p.is_student ? 'Student' : 'Risala member'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </aside>

            {/* Right column — goals & stats */}
            <div className="space-y-6 lg:col-span-8">
                <section className="rounded-2xl border border-border bg-card p-6">
                    <header className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                            Learning goals
                        </p>
                    </header>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                        {p.learning_goals ||
                            "Not set yet — describe what you'd like to focus on next, and we'll match you with the right Ustaz."}
                    </p>
                </section>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        { label: 'Confirmed', value: confirmedCount },
                        { label: 'Active', value: activeCount },
                        { label: 'Lifetime', value: totalCount },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="rounded-2xl border border-border bg-card p-5"
                        >
                            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                {s.label}
                            </p>
                            <p className="mt-1.5 font-display text-3xl font-semibold tabular-nums text-foreground">
                                {s.value}
                            </p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
