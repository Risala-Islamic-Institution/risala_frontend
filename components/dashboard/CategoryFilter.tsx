"use client";

import React from 'react';

interface CategoryFilterProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
    { id: 'all', label: 'All Ustaz' },
    { id: 'quran', label: 'Quran' },
    { id: 'tajweed', label: 'Tajweed' },
    { id: 'arabic', label: 'Arabic' },
    { id: 'tafsir', label: 'Tafsir' },
    { id: 'hifz', label: 'Hifz' },
    { id: 'fiqh', label: 'Fiqh' },
    { id: 'aqeedah', label: 'Aqeedah' },
];

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div
            role="tablist"
            aria-label="Filter by specialization"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar"
        >
            {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        role="tab"
                        aria-selected={active}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                            active
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-card text-foreground/75 hover:border-foreground/30 hover:text-foreground'
                        }`}
                    >
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}
