'use client';

import React, { useState } from 'react';
import { Course } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search } from 'lucide-react';
import { StarOrnament, GeometricDivider } from '@/components/dashboard/IslamicOrnament';
import { CourseCreateModal } from '@/components/dashboard/teacher/CourseCreateModal';

interface CourseManagerProps {
    courses: Course[];
    onChange: (c: Course[]) => void;
    onError: (msg: string) => void;
}

export function CourseManager({ courses, onChange, onError }: CourseManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filtered = courses.filter(
        (c) =>
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleCreateDraft = () => {
        setIsModalOpen(true);
    };

    const handleCourseCreated = (updatedCourses: Course[]) => {
        onChange(updatedCourses);
    };

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case 'QURAN':
                return 'var(--primary)'; // Deep emerald
            case 'ARABIC':
                return '#8c593b'; // Warm umber
            case 'ISLAMIC_STUDIES':
                return '#4a6b8c'; // Muted steel blue
            default:
                return 'var(--muted-foreground)';
        }
    };

    return (
        <>
        <section
            className="overflow-hidden rounded-2xl flex flex-col h-full animate-fade-up"
            style={{
                border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)',
                background: 'color-mix(in oklab, var(--card) 98%, transparent)',
                boxShadow: '0 8px 32px -8px color-mix(in oklab, var(--primary) 15%, transparent)',
                animationDelay: '150ms'
            }}
        >
            {/* Header */}
            <header
                className="relative flex items-center justify-between px-6 py-5"
                style={{
                    background: 'color-mix(in oklab, var(--primary) 5%, transparent)',
                    borderBottom: '1px solid color-mix(in oklab, var(--primary) 15%, transparent)'
                }}
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <StarOrnament size={12} style={{ color: 'var(--primary)' }} />
                        <h3 className="font-display text-lg font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                            Course Studio
                        </h3>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                        Manage your curriculum and pricing.
                    </p>
                </div>
                <Button
                    onClick={handleCreateDraft}
                    size="sm"
                    variant="primary"
                    className="shadow-gold-glow"
                >
                    New Course
                </Button>
            </header>

            {/* Toolbar */}
            <div
                className="px-6 py-4"
                style={{ borderBottom: '1px solid color-mix(in oklab, var(--primary) 10%, transparent)' }}
            >
                <div className="relative max-w-sm">
                    <Search
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                        style={{ color: 'var(--muted-foreground)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-full border bg-transparent py-2 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                        style={{
                            borderColor: 'color-mix(in oklab, var(--primary) 20%, transparent)',
                            color: 'var(--foreground)'
                        }}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6">
                {filtered.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center p-8 opacity-60">
                        <GeometricDivider />
                        <p className="mt-4 font-display text-lg font-bold text-foreground">No courses found.</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {searchTerm ? 'Try adjusting your search.' : 'Create a new draft to begin.'}
                        </p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {filtered.map((c) => {
                            const isDraft = !c.is_published;
                            const accentColor = getCategoryColor(c.category);

                            return (
                                <li
                                    key={c.id}
                                    className="group relative flex flex-col overflow-hidden rounded-xl transition-all hover:-translate-y-1"
                                    style={{
                                        background: 'var(--card)',
                                        border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)',
                                        boxShadow: '0 4px 12px -4px color-mix(in oklab, var(--primary) 20%, transparent)'
                                    }}
                                >
                                    {/* Category Color Band */}
                                    <div
                                        className="h-1.5 w-full"
                                        style={{ background: accentColor }}
                                    />
                                    
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <Badge
                                                variant={isDraft ? 'ghost' : 'default'}
                                                className="text-[9px] uppercase tracking-wider"
                                                label={isDraft ? 'DRAFT' : 'PUBLISHED'}
                                            />
                                            <span
                                                className="font-display text-sm font-bold tabular-nums"
                                                style={{ color: 'var(--accent)' }}
                                            >
                                                ${c.price}
                                            </span>
                                        </div>

                                        <h4 className="mt-3 font-display text-base font-bold leading-tight text-foreground line-clamp-2">
                                            {c.title}
                                        </h4>
                                        <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                            {c.description || 'No description provided.'}
                                        </p>

                                        <div
                                            className="mt-4 flex items-center justify-between pt-3"
                                            style={{ borderTop: '1px dashed color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                        >
                                            <span
                                                className="text-[10px] font-bold uppercase tracking-widest"
                                                style={{ color: accentColor }}
                                            >
                                                {c.category}
                                            </span>
                                            <span className="text-[10px] font-semibold text-muted-foreground">
                                                {c.modules?.length || 0} Modules
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </section>

        <CourseCreateModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleCourseCreated}
        />
        </>
    );
}
