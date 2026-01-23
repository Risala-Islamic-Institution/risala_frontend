"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
    // Placeholder - would be replaced with actual user data from API
    const user = {
        name: "Learner",
        role: "STUDENT",
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-primary text-white p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-accent">Risala</h1>
                    <p className="text-sm text-white/70 mt-1">Islamic Knowledge Platform</p>
                </div>

                <nav className="space-y-2">
                    <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white">
                        <span>📊</span>
                        <span>Dashboard</span>
                    </a>
                    <a href="/courses" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
                        <span>📚</span>
                        <span>My Courses</span>
                    </a>
                    <a href="/schedule" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
                        <span>📅</span>
                        <span>Schedule</span>
                    </a>
                    <a href="/messages" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
                        <span>💬</span>
                        <span>Messages</span>
                    </a>
                    <a href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white/80 transition-colors">
                        <span>⚙️</span>
                        <span>Settings</span>
                    </a>
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-secondary">Welcome back, {user.name}!</h2>
                        <p className="text-secondary/60 mt-1">Continue your journey of knowledge</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg hover:bg-neutral/50 transition-colors">
                            🔔
                        </button>
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary/60 text-sm">Enrolled Courses</p>
                                <p className="text-3xl font-bold text-secondary mt-1">4</p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                                📚
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary/60 text-sm">Completed Lessons</p>
                                <p className="text-3xl font-bold text-secondary mt-1">23</p>
                            </div>
                            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center text-2xl">
                                ✅
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary/60 text-sm">Upcoming Sessions</p>
                                <p className="text-3xl font-bold text-secondary mt-1">2</p>
                            </div>
                            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-2xl">
                                📅
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral">
                    <h3 className="text-xl font-bold text-secondary mb-4">Continue Learning</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-background hover:bg-neutral/30 transition-colors cursor-pointer">
                            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                                🕌
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-secondary">Foundations of Fiqh</h4>
                                <p className="text-sm text-secondary/60">Module 3: Prayer Essentials</p>
                                <div className="mt-2 h-2 bg-neutral rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[65%]"></div>
                                </div>
                            </div>
                            <span className="text-sm text-secondary/60">65% complete</span>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-lg bg-background hover:bg-neutral/30 transition-colors cursor-pointer">
                            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center text-2xl">
                                📖
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-secondary">Quranic Arabic</h4>
                                <p className="text-sm text-secondary/60">Module 2: Verb Conjugation</p>
                                <div className="mt-2 h-2 bg-neutral rounded-full overflow-hidden">
                                    <div className="h-full bg-accent w-[40%]"></div>
                                </div>
                            </div>
                            <span className="text-sm text-secondary/60">40% complete</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
