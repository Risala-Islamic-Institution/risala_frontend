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
            <Card className="mb-6">
                <CardBody className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                        <Avatar name={profile.full_name || profile.username} size="xl" />
                        <div>
                            <h2 className="text-2xl font-black text-secondary">{profile.full_name || profile.username}</h2>
                            <p className="text-secondary/50 capitalize">
                                {profile.is_student ? 'Student Account' : 'User Account'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-primary/5 rounded-2xl text-center border border-primary/10">
                            <div className="text-3xl font-black text-primary">{confirmedCount}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-secondary/40">Confirmed Sessions</div>
                        </div>
                        <div className="p-4 bg-accent/10 rounded-2xl text-center border border-accent/20">
                            <div className="text-3xl font-black text-accent-darker">{activeCount}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-secondary/40">Active Requests</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 border border-neutral/30 rounded-2xl">
                            <div className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-1">Learning Goals</div>
                            <div className="text-secondary text-sm leading-relaxed">{profile.learning_goals || 'Not set'}</div>
                        </div>
                        <div className="p-4 border border-neutral/30 rounded-2xl">
                            <div className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-1">Email</div>
                            <div className="text-secondary text-sm">{profile.email}</div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
