'use client';

import React, { useMemo, useState } from 'react';
import { Booking } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Calendar, Clock, ArrowRight } from '@/components/icons';
import { StarOrnament } from '@/components/dashboard/IslamicOrnament';

interface ConfirmedSessionsProps {
    bookings: Booking[];
}

type SessionGroup = {
    key: string;
    studentName: string;
    bookings: Booking[];
    isPackage: boolean;
    nextStart: Date;
    lastStart: Date;
};

function groupBookings(bookings: Booking[]): SessionGroup[] {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
        const key = b.order ? `pkg_${b.order}` : `single_${b.id}`;
        const list = map.get(key);
        if (list) list.push(b);
        else map.set(key, [b]);
    }

    const groups: SessionGroup[] = [];
    for (const [key, list] of map.entries()) {
        const sorted = [...list].sort(
            (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
        );
        const isPackage = key.startsWith('pkg_') && sorted.length > 1;
        groups.push({
            key,
            studentName: sorted[0].student_name || 'Student',
            bookings: sorted,
            isPackage,
            nextStart: new Date(sorted[0].start_at),
            lastStart: new Date(sorted[sorted.length - 1].start_at),
        });
    }
    return groups.sort((a, b) => a.nextStart.getTime() - b.nextStart.getTime());
}

function formatDate(d: Date) {
    return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

function formatTime(d: Date) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRange(a: Date, b: Date) {
    const sameYear = a.getFullYear() === b.getFullYear();
    return `${a.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: sameYear ? undefined : 'numeric',
    })} – ${b.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })}`;
}

function GroupRow({ group }: { group: SessionGroup }) {
    const [expanded, setExpanded] = useState(false);

    if (!group.isPackage) {
        const b = group.bookings[0];
        const start = new Date(b.start_at);
        return (
            <li className="group/row relative px-5 py-4 transition-colors hover:bg-muted/40">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md border border-border bg-card text-center">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {start.toLocaleDateString(undefined, { month: 'short' })}
                        </span>
                        <span className="font-display text-base font-semibold leading-none text-foreground">
                            {start.getDate()}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <Avatar name={group.studentName} size="sm" />
                            <p className="font-medium text-foreground">{group.studentName}</p>
                        </div>
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" aria-hidden />
                            {formatDate(start)}
                            <span aria-hidden className="opacity-50">·</span>
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            <span className="tabular-nums">{formatTime(start)}</span>
                        </p>
                    </div>
                </div>
            </li>
        );
    }

    // Package row — collapsible
    return (
        <li className="relative">
            <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/40"
            >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[color:var(--primary)]/[0.06] text-primary">
                    <span className="font-display text-sm font-semibold tabular-nums">
                        {group.bookings.length}
                    </span>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <Avatar name={group.studentName} size="sm" />
                        <p className="font-medium text-foreground">{group.studentName}</p>
                        <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a5a14]">
                            <StarOrnament size={9} className="text-[color:var(--accent)]" />
                            Package · {group.bookings.length} sessions
                        </span>
                    </div>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" aria-hidden />
                        {formatRange(group.nextStart, group.lastStart)}
                        <span aria-hidden className="opacity-50">·</span>
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        <span className="tabular-nums">
                            Next {formatDate(group.nextStart)} · {formatTime(group.nextStart)}
                        </span>
                    </p>
                </div>
                <span
                    aria-hidden
                    className={`mt-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground/60 transition-transform ${
                        expanded ? 'rotate-90' : ''
                    }`}
                >
                    <ArrowRight className="h-3 w-3" />
                </span>
            </button>

            {expanded ? (
                <div className="border-t border-dashed border-border bg-muted/30 px-5 py-4">
                    <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        All sessions
                    </p>
                    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {group.bookings.map((b, idx) => {
                            const d = new Date(b.start_at);
                            return (
                                <li
                                    key={b.id}
                                    className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-xs"
                                >
                                    <span className="font-display text-[11px] font-semibold tabular-nums text-muted-foreground">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                    <span className="flex-1 truncate text-foreground">
                                        {formatDate(d)}
                                    </span>
                                    <span className="font-medium tabular-nums text-foreground">
                                        {formatTime(d)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : null}
        </li>
    );
}

function SessionsBlock({
    title,
    eyebrow,
    accent,
    groups,
}: {
    title: string;
    eyebrow: string;
    accent: 'primary' | 'warning';
    groups: SessionGroup[];
}) {
    if (groups.length === 0) return null;

    const headerStyles =
        accent === 'primary'
            ? 'bg-[color:var(--primary)]/[0.05] text-primary'
            : 'bg-[color:var(--warning)]/[0.12] text-[#8a6326]';
    const dotColor =
        accent === 'primary' ? 'var(--primary)' : 'var(--warning)';

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <header
                className={`flex items-center justify-between border-b border-border px-5 py-3.5 ${headerStyles}`}
            >
                <div className="flex items-center gap-2.5">
                    <span
                        aria-hidden
                        className="h-2 w-2 rounded-full"
                        style={{ background: dotColor }}
                    />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                        {eyebrow}
                    </p>
                    <span aria-hidden className="opacity-40">·</span>
                    <p className="font-display text-sm font-semibold tracking-tight">
                        {title}
                    </p>
                </div>
                <span className="rounded-full border border-current/20 bg-card/80 px-2 py-0.5 text-[10px] font-semibold tabular-nums">
                    {groups.length}
                </span>
            </header>
            <ul className="divide-y divide-border">
                {groups.map((g) => (
                    <GroupRow key={g.key} group={g} />
                ))}
            </ul>
        </section>
    );
}

export function ConfirmedSessions({ bookings }: ConfirmedSessionsProps) {
    const { awaiting, confirmed } = useMemo(() => {
        const awaitingPay = bookings.filter(
            (b) => b.status === 'APPROVED' || b.status === 'RESERVED',
        );
        const confirmedPaid = bookings.filter(
            (b) => b.status === 'CONFIRMED' || b.status === 'PAID',
        );
        return {
            awaiting: groupBookings(awaitingPay),
            confirmed: groupBookings(confirmedPaid),
        };
    }, [bookings]);

    if (bookings.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-primary">
                    <Calendar className="h-5 w-5" />
                </span>
                <p className="font-display text-base font-semibold text-foreground">
                    No upcoming sessions
                </p>
                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Approved and confirmed sessions will appear here, with package classes grouped together.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <SessionsBlock
                eyebrow="Awaiting payment"
                title="Approved · pending student payment"
                accent="warning"
                groups={awaiting}
            />
            <SessionsBlock
                eyebrow="Confirmed"
                title="Paid & ready to teach"
                accent="primary"
                groups={confirmed}
            />
        </div>
    );
}
