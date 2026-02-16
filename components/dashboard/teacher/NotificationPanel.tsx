import React from 'react';
import { NotificationItem } from '@/types';
import { api } from '@/lib/api';

interface NotificationPanelProps {
    notifications: NotificationItem[];
    onRead: () => void;
}

export function NotificationPanel({ notifications, onRead }: NotificationPanelProps) {
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <section className="bg-white border border-neutral/30 rounded-2xl overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-neutral/20 flex items-center justify-between">
                <h3 className="font-bold text-secondary text-sm">Notifications</h3>
                {unreadCount > 0 && (
                    <span className="bg-accent/15 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="p-5 text-center text-secondary/25 text-sm">All caught up ✓</p>
                ) : (
                    <div className="divide-y divide-neutral/15">
                        {notifications.slice(0, 8).map((n) => (
                            <div key={n.id} className={`px-5 py-3 ${n.is_read ? 'opacity-50' : ''}`}>
                                <p className="text-sm font-bold text-secondary">{n.title}</p>
                                {n.body && <p className="text-xs text-secondary/40 mt-0.5 line-clamp-2">{n.body}</p>}
                                <div className="flex items-center justify-between mt-1.5">
                                    <p className="text-[10px] text-secondary/20">{new Date(n.created_at).toLocaleDateString()}</p>
                                    {!n.is_read && (
                                        <button
                                            className="text-[10px] font-bold text-primary hover:text-primary/70 transition-colors"
                                            onClick={async () => {
                                                try {
                                                    await api.post(`/notifications/${n.id}/read/`, {});
                                                    onRead();
                                                } catch { }
                                            }}
                                        >
                                            Mark read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
