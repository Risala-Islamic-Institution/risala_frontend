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
        <div
            role="tablist"
            className={`flex items-center gap-6 overflow-x-auto no-scrollbar border-b border-border ${className}`}
        >
            {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab.id)}
                        className={`relative -mb-px whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors ${
                            active
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
