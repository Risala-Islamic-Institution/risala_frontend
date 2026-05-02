import React from 'react';
import { NotificationItem } from '@/types';
import { api } from '@/lib/api';
import { Bell } from '@/components/icons';

interface NotificationPanelProps {
    notifications: NotificationItem[];
    onRead: () => void;
}

export function NotificationPanel({ notifications, onRead }: NotificationPanelProps) {
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return (
        <section className="rounded-xl border border-border bg-card shadow-card">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" aria-hidden />
                    <h3 className="font-display text-sm font-semibold text-foreground">
                        Notifications
                    </h3>
                </div>
                {unreadCount > 0 ? (
                    <span className="inline-flex items-center rounded-full border border-[color:var(--primary)]/15 bg-[color:var(--primary)]/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-primary">
                        {unreadCount} new
                    </span>
                ) : null}
            </header>

            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="px-5 py-6 text-center text-sm text-muted-foreground">
                        All caught up. No new alerts right now.
                    </p>
                ) : (
                    <ul className="divide-y divide-border">
                        {notifications.slice(0, 8).map((n) => (
                            <li
                                key={n.id}
                                className={`px-5 py-3 transition-colors ${
                                    n.is_read ? 'opacity-70' : 'bg-muted/30'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        aria-hidden
                                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                            n.is_read ? 'bg-border' : 'bg-accent'
                                        }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                                        {n.body ? (
                                            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                {n.body}
                                            </p>
                                        ) : null}
                                        <div className="mt-1.5 flex items-center justify-between">
                                            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                                {new Date(n.created_at).toLocaleDateString()}
                                            </p>
                                            {!n.is_read ? (
                                                <button
                                                    type="button"
                                                    className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary hover:underline"
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
        </section>
    );
}
