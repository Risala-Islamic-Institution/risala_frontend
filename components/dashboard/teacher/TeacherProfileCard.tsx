import React from 'react';
import { TeacherProfile } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';

export function TeacherProfileCard({ profile }: { profile: TeacherProfile | null }) {
    return (
        <div className="bg-primary rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-primary/25 text-white mb-6">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-accent/15 rounded-full blur-xl" />
            <div className="absolute right-4 top-4 w-8 h-8 bg-accent/20 rounded-full blur-md" />
            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 border-2 border-accent/30 flex items-center justify-center mb-4">
                    <span className="text-accent font-black text-xl">U</span>
                </div>
                <p className="text-white/40 text-[10px] font-bold tracking-[.2em] uppercase">Teacher Profile</p>
                <p className="text-white text-lg font-black mt-0.5">{profile?.specialization || 'Ustaz'}</p>
                {profile?.hourly_rate && (
                    <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <p className="text-white/30 text-[10px] font-bold tracking-[.15em] uppercase">Hourly Rate</p>
                        <p className="text-accent text-xl font-black mt-0.5">${profile.hourly_rate}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
