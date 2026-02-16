"use client";

import React from 'react';

interface CategoryFilterProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
    { id: 'all', label: 'All Teachers', icon: '🌟' },
    { id: 'quran', label: 'Quran', icon: '📖' },
    { id: 'arabic', label: 'Arabic', icon: '🗣️' },
    { id: 'hadith', label: 'Hadith', icon: '📚' },
    { id: 'fiqh', label: 'Fiqh', icon: '⚖️' },
    { id: 'tajweed', label: 'Tajweed', icon: '🎵' },
];

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border
                        ${activeCategory === cat.id
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105'
                            : 'bg-white text-secondary/60 border-neutral/10 hover:border-primary/20 hover:text-primary hover:bg-primary/5'
                        }
                    `}
                >
                    <span className="text-base">{cat.icon}</span>
                    {cat.label}
                </button>
            ))}
        </div>
    );
}
