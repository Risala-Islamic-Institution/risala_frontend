"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { UserProfile } from '@/types';

interface DashboardHeaderProps {
    profile: UserProfile | null;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    tabs?: { id: string; label: string }[];
    onLogout: () => void;
    userType: 'student' | 'teacher';
}

export function DashboardHeader({ profile, activeTab, onTabChange, tabs, onLogout, userType }: DashboardHeaderProps) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-primary/10 bg-background/75 backdrop-blur-xl transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="hero-lamp gold-shine rounded-2xl px-5 py-3 flex items-center justify-between">
                {/* 1. Logo & Brand */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
                        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-accent/85 via-accent to-[#e6b566] flex items-center justify-center shadow-xl shadow-accent/40 group-hover:scale-105 transition-transform duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0F3D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="#0F3D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="#0F3D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <span className="text-xl leading-none font-black text-white tracking-[0.12em]">RISALA</span>
                            <p className="text-[10px] tracking-[0.22em] uppercase font-bold text-accent/90">Knowledge with Noor</p>
                        </div>
                    </div>

                    {/* 2. Main Navigation (Desktop) */}
                    {tabs && onTabChange && (
                        <nav className="hidden md:flex items-center gap-1 bg-white/10 border border-white/15 p-1 rounded-xl">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`
                                        px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300
                                        ${activeTab === tab.id
                                            ? 'bg-white text-primary shadow-sm shadow-black/10'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    )}
                </div>

                {/* 3. User Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-sm font-bold text-white">{profile?.full_name || 'User'}</span>
                        <span className="text-[10px] uppercase tracking-[0.16em] text-accent/95 font-bold">{userType}</span>
                    </div>

                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-accent/85 to-accent p-0.5 shadow-lg shadow-accent/30">
                        <div className="h-full w-full rounded-[10px] bg-white/95 overflow-hidden">
                            {/* Placeholder Avatar if no image, implemented simply here or use Avatar component */}
                            {profile?.profile_picture ? (
                                <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-accent/10 flex items-center justify-center text-primary font-bold">
                                    {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="p-2 text-white/65 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        title="Sign Out"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
            </div>
        </header>
    );
}
