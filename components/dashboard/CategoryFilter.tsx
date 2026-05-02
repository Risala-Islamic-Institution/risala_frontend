"use client";

import React from 'react';

interface CategoryFilterProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
    { id: 'all', label: 'All Teachers' },
    { id: 'quran', label: 'Quran' },
    { id: 'arabic', label: 'Arabic' },
    { id: 'hadith', label: 'Hadith' },
    { id: 'fiqh', label: 'Fiqh' },
    { id: 'tajweed', label: 'Tajweed' },
];

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="glass-card rounded-2xl p-3 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`
                        px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border
                        ${activeCategory === cat.id
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105'
                            : 'bg-white/80 text-secondary/75 border-primary/10 hover:border-accent/40 hover:text-primary hover:bg-accent/10'
                        }
                    `}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}
