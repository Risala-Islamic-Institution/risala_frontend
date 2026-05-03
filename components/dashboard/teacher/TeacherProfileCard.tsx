import React from 'react';
import { TeacherProfile } from '@/types';
import { Verified } from '@/components/icons';
import { StarOrnament, GeometricPanel } from '@/components/dashboard/IslamicOrnament';

export function TeacherProfileCard({ profile }: { profile: TeacherProfile | null }) {
    const verified =
        (profile?.verification_status || '').toString().toUpperCase() === 'VERIFIED';

    return (
        <section
            className="overflow-hidden rounded-2xl animate-fade-up"
            style={{
                border: '1px solid var(--border)',
                background: 'var(--card)',
                boxShadow: '0 4px 24px -8px color-mix(in oklab, var(--primary) 12%, transparent)',
            }}
        >
            {/* Dark hero band with emerald gradient */}
            <div
                className="relative overflow-hidden px-5 pt-6 pb-6"
                style={{
                    borderBottom: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)',
                    background: `
                        radial-gradient(ellipse 100% 120% at 0% 50%, color-mix(in oklab, var(--primary) 55%, transparent) 0%, transparent 70%),
                        linear-gradient(160deg, #0a2a1f 0%, #1c1f26 100%)
                    `,
                }}
            >
                {/* Islamic geometric watermark */}
                <GeometricPanel
                    className="pointer-events-none absolute -right-4 inset-y-0 h-full w-36 opacity-20"
                />

                {/* Gold hairline */}
                <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
                />

                <div className="relative">
                    {/* Eyebrow */}
                    <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]"
                        style={{ color: 'var(--accent)' }}>
                        <StarOrnament size={9} />
                        Ustaz Profile
                    </p>

                    {/* Specialization */}
                    <h3 className="mt-2 font-display text-lg font-bold leading-tight tracking-tight" style={{ color: '#fff' }}>
                        {profile?.specialization || 'Set your specialization'}
                    </h3>

                    {profile?.teaching_level ? (
                        <p className="mt-1 text-xs" style={{ color: 'color-mix(in oklab, #fff 55%, transparent)' }}>
                            {profile.teaching_level}
                        </p>
                    ) : null}

                    {/* Verified badge */}
                    {verified ? (
                        <span
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
                            style={{
                                background: 'color-mix(in oklab, var(--accent) 18%, transparent)',
                                border: '1px solid color-mix(in oklab, var(--accent) 40%, transparent)',
                                color: 'var(--accent)',
                            }}
                        >
                            <Verified className="h-3 w-3" />
                            Verified Ustaz
                        </span>
                    ) : (
                        <span
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em]"
                            style={{
                                background: 'color-mix(in oklab, var(--warning) 16%, transparent)',
                                border: '1px solid color-mix(in oklab, var(--warning) 35%, transparent)',
                                color: 'var(--warning)',
                            }}
                        >
                            Verification pending
                        </span>
                    )}
                </div>
            </div>

            {/* Hourly rate — glowing gold display */}
            {profile?.hourly_rate ? (
                <div
                    className="px-5 py-4"
                    style={{
                        borderBottom: '1px solid var(--border)',
                        background: 'color-mix(in oklab, var(--accent) 4%, transparent)',
                    }}
                >
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--muted-foreground)' }}>
                        Hourly rate
                    </p>
                    <p className="mt-1 font-display text-3xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
                        ${profile.hourly_rate}
                        <span className="ml-1.5 text-sm font-normal" style={{ color: 'var(--muted-foreground)' }}>/ hr</span>
                    </p>
                </div>
            ) : null}

            {/* Status rows */}
            <div className="space-y-0">
                {[
                    { label: 'Verification', value: verified ? 'Verified' : 'Pending', isStatus: true, ok: verified },
                    { label: 'Specialization', value: profile?.specialization || '—', isStatus: false },
                    { label: 'Teaching level', value: profile?.teaching_level || '—', isStatus: false },
                ].map(({ label, value, isStatus, ok }) => (
                    <div
                        key={label}
                        className="flex items-center justify-between px-5 py-3"
                        style={{ borderBottom: '1px solid color-mix(in oklab, var(--border) 60%, transparent)' }}
                    >
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</span>
                        {isStatus ? (
                            <span
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]"
                                style={ok ? {
                                    background: 'color-mix(in oklab, var(--success) 12%, transparent)',
                                    border: '1px solid color-mix(in oklab, var(--success) 30%, transparent)',
                                    color: 'var(--success)',
                                } : {
                                    background: 'color-mix(in oklab, var(--warning) 12%, transparent)',
                                    border: '1px solid color-mix(in oklab, var(--warning) 30%, transparent)',
                                    color: '#8a6326',
                                }}
                            >
                                <span className="h-1 w-1 rounded-full" style={{ background: 'currentColor' }} />
                                {value}
                            </span>
                        ) : (
                            <span className="truncate max-w-[50%] text-xs font-semibold text-right" style={{ color: 'var(--foreground)' }}>
                                {value}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
