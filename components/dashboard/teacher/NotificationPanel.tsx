'use client';

import React from 'react';
import { NotificationItem } from '@/types';
import { api } from '@/lib/api';
import { Bell } from '@/components/icons';

interface NotificationPanelProps {
    notifications: NotificationItem[];
    onRead: () => void;
}

function formatRelative(iso: string) {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.round(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return d.toLocaleDateString();
}

export function NotificationPanel({ notifications, onRead }: NotificationPanelProps) {
    const unreadCount = notifications.filter((n) => !n.is_read).length;
    const markAllRead = async () => {
        try {
            await Promise.all(
                notifications
                    .filter((n) => !n.is_read)
                    .map((n) => api.post(`/notifications/${n.id}/read/`, {})),
            );
            onRead();
        } catch {}
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <header className="flex items-center justify-between border-b border-border bg-[color:var(--primary)]/[0.04] px-5 py-3.5">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" aria-hidden />
                    <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                        Notifications
                    </h3>
                    {unreadCount > 0 ? (
                        <span className="inline-flex items-center rounded-full border border-[color:var(--accent)]/35 bg-[color:var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a5a14] tabular-nums">
                            {unreadCount} new
                        </span>
                    ) : null}
                </div>
                {unreadCount > 0 ? (
                    <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary hover:underline"
                    >
                        Mark all read
                    </button>
                ) : null}
            </header>

            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <p className="font-display text-sm font-semibold text-foreground">
                            All caught up.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            New alerts about requests, payments, and messages will appear here.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-border">
                        {notifications.slice(0, 8).map((n) => (
                            <li
                                key={n.id}
                                className={`px-5 py-3 transition-colors ${
                                    n.is_read ? 'opacity-65' : 'bg-[color:var(--accent)]/[0.05]'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        aria-hidden
                                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                            n.is_read
                                                ? 'bg-border'
                                                : 'bg-[color:var(--accent)]'
                                        }`}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            {n.title}
                                        </p>
                                        {n.body ? (
                                            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                {n.body}
                                            </p>
                                        ) : null}
                                        <div className="mt-1.5 flex items-center justify-between">
                                            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                                {formatRelative(n.created_at)}
                                            </p>
                                            {!n.is_read ? (
                                                <button
                                                    type="button"
                                                    className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary hover:underline"
                                                    onClick={async () => {
                                                        try {
                                                            await api.post(
                                                                `/notifications/${n.id}/read/`,
                                                                {},
                                                            );
                                                            onRead();
                                                        } catch {}
                                                    }}
                                                >
                                                    Mark read
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
