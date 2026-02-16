import React from 'react';

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
    return (
        <div className={`flex items-center gap-8 overflow-x-auto no-scrollbar border-b border-neutral/20 ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`py-4 text-sm font-bold tracking-wide uppercase transition-all duration-300 border-b-2 whitespace-nowrap ${activeTab === tab.id
                            ? 'border-accent text-primary'
                            : 'border-transparent text-secondary/40 hover:text-secondary hover:border-secondary/20'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
