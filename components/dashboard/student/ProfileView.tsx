import React from 'react';
import { UserProfile, Booking } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';

interface ProfileViewProps {
    profile: UserProfile | null;
    bookings: Booking[];
    activeCount: number;
}

export function ProfileView({ profile, bookings, activeCount }: ProfileViewProps) {
    if (!profile) return null;

    const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <Card className="mb-6 border-primary/12 ring-1 ring-accent/20 bg-linear-to-b from-white to-[#f6f8f2] shadow-[0_14px_30px_rgba(15,61,46,0.10)]">
                <CardBody className="p-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary/55 font-bold mb-5">Identity Canvas</p>
                    <div className="flex items-center gap-6 mb-8">
                        <Avatar name={profile.full_name || profile.username} size="xl" />
                        <div>
                            <h2 className="text-2xl font-black text-secondary">{profile.full_name || profile.username}</h2>
                            <p className="text-secondary/55 capitalize font-medium">
                                {profile.is_student ? 'Student Account' : 'User Account'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-linear-to-br from-primary/10 to-primary/3 rounded-2xl text-center border border-primary/15">
                            <div className="text-3xl font-black text-primary">{confirmedCount}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-secondary/45">Confirmed Sessions</div>
                        </div>
                        <div className="p-4 bg-linear-to-br from-accent/20 to-accent/8 rounded-2xl text-center border border-accent/30">
                            <div className="text-3xl font-black text-primary">{activeCount}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-secondary/45">Active Requests</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 border border-primary/12 bg-white/85 rounded-2xl">
                            <div className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-1">Learning Goals</div>
                            <div className="text-secondary text-sm leading-relaxed">{profile.learning_goals || 'Not set'}</div>
                        </div>
                        <div className="p-4 border border-primary/12 bg-white/85 rounded-2xl">
                            <div className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-1">Email</div>
                            <div className="text-secondary text-sm">{profile.email}</div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
