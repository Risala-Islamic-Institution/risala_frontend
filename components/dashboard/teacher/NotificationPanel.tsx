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
        <section className="relative overflow-hidden bg-linear-to-br from-[#103a31] via-[#12453a] to-[#0f2f28] border border-[#0E5A47]/50 ring-1 ring-accent/35 rounded-[1.4rem] mb-6 shadow-[0_24px_50px_rgba(10,43,34,0.35)]">
            <div className="pointer-events-none absolute -top-10 -right-12 h-36 w-36 rounded-full bg-accent/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

            <div className="relative px-5 py-4 border-b border-white/15 flex items-center justify-between bg-white/5 backdrop-blur-sm">
                <h3 className="font-black text-white text-sm tracking-[0.08em] uppercase">Learning Pulse</h3>
                {unreadCount > 0 && (
                    <span className="bg-accent/25 text-[#F4E6B2] text-[10px] font-black px-3 py-1 rounded-full border border-[#F4E6B2]/40 tracking-[0.12em] uppercase">
                        {unreadCount} New
                    </span>
                )}
            </div>

            <div className="relative max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <p className="p-6 text-center text-white/70 text-sm font-semibold">All caught up. No new alerts right now.</p>
                ) : (
                    <div className="divide-y divide-white/10">
                        {notifications.slice(0, 8).map((n) => (
                            <div
                                key={n.id}
                                className={`px-5 py-3 transition-colors ${n.is_read ? 'bg-transparent opacity-70' : 'bg-white/8 hover:bg-white/12'}`}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${n.is_read ? 'bg-white/35' : 'bg-[#F4E6B2] shadow-[0_0_12px_rgba(244,230,178,0.8)]'}`}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-white">{n.title}</p>
                                        {n.body && <p className="text-xs text-white/75 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-1.5">
                                    <p className="text-[10px] text-white/55 tracking-[0.1em] uppercase">{new Date(n.created_at).toLocaleDateString()}</p>
                                    {!n.is_read && (
                                        <button
                                            className="text-[10px] font-black text-[#F4E6B2] hover:text-white transition-colors uppercase tracking-[0.16em]"
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
