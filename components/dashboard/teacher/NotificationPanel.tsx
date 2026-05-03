'use client';

import React from 'react';
import { NotificationItem } from '@/types';
import { api } from '@/lib/api';
import { Bell } from '@/components/icons';
import { StarOrnament } from '@/components/dashboard/IslamicOrnament';

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
        <section
            className="overflow-hidden rounded-2xl animate-fade-up"
            style={{
                border: '1px solid var(--border)',
                background: 'var(--card)',
                boxShadow: '0 4px 24px -8px color-mix(in oklab, var(--primary) 10%, transparent)',
                animationDelay: '80ms',
            }}
        >
            {/* Header */}
            <header
                className="flex items-center justify-between px-5 py-4"
                style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'color-mix(in oklab, var(--primary) 5%, transparent)',
                }}
            >
                <div className="flex items-center gap-2.5">
                    <div
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{
                            background: 'color-mix(in oklab, var(--primary) 12%, transparent)',
                            border: '1px solid color-mix(in oklab, var(--primary) 25%, transparent)',
                        }}
                    >
                        <Bell className="h-3.5 w-3.5" style={{ color: 'var(--primary)' } as React.CSSProperties} />
                    </div>
                    <h3 className="font-display text-sm font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                        Notifications
                    </h3>
                    {unreadCount > 0 ? (
                        <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] tabular-nums"
                            style={{
                                background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
                                border: '1px solid color-mix(in oklab, var(--accent) 35%, transparent)',
                                color: '#7a5a14',
                            }}
                        >
                            {unreadCount} new
                        </span>
                    ) : null}
                </div>
                {unreadCount > 0 ? (
                    <button
                        type="button"
                        onClick={markAllRead}
                        className="text-[10px] font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
                        style={{ color: 'var(--primary)' }}
                    >
                        Mark all read
                    </button>
                ) : null}
            </header>

            {/* Notification list */}
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                        <StarOrnament
                            size={32}
                            className="mb-4 animate-float"
                            style={{ color: 'var(--accent)', opacity: 0.4 } as React.CSSProperties}
                        />
                        <p className="font-display text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                            All caught up.
                        </p>
                        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                            Alerts about requests, payments, and messages will appear here.
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
                        {notifications.slice(0, 8).map((n) => (
                            <li
                                key={n.id}
                                className="transition-colors"
                                style={!n.is_read ? {
                                    background: 'color-mix(in oklab, var(--accent) 4%, transparent)',
                                } : {
                                    opacity: 0.65,
                                }}
                            >
                                <div className="flex items-start gap-3 px-5 py-3.5">
                                    {/* Unread dot */}
                                    <span
                                        aria-hidden
                                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full transition-colors"
                                        style={{
                                            background: n.is_read ? 'var(--border)' : 'var(--accent)',
                                        }}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                            {n.title}
                                        </p>
                                        {n.body ? (
                                            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                                                {n.body}
                                            </p>
                                        ) : null}
                                        <div className="mt-2 flex items-center justify-between">
                                            <p className="text-[9px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                                                {formatRelative(n.created_at)}
                                            </p>
                                            {!n.is_read ? (
                                                <button
                                                    type="button"
                                                    className="text-[9px] font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
                                                    style={{ color: 'var(--primary)' }}
                                                    onClick={async () => {
                                                        try {
                                                            await api.post(`/notifications/${n.id}/read/`, {});
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

            {notifications.length > 8 && (
                <div
                    className="px-5 py-3 text-center"
                    style={{ borderTop: '1px solid var(--border)', background: 'color-mix(in oklab, var(--muted) 60%, transparent)' }}
                >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--muted-foreground)' }}>
                        + {notifications.length - 8} more notifications
                    </p>
                </div>
            )}
        </section>
    );
}
