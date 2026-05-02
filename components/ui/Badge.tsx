import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';

const VARIANTS: Record<BadgeVariant, string> = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/20 text-[#7A5A18]',
    error: 'bg-error/10 text-error',
    outline: 'border border-neutral/40 text-secondary/60',
    ghost: 'bg-neutral/10 text-secondary/60',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    label: string;
    icon?: React.ReactNode;
}

export function Badge({ variant = 'default', label, icon, className = '', ...props }: BadgeProps) {
    const styles = VARIANTS[variant] || VARIANTS.default;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${styles} ${className}`} {...props}>
            {icon}
            {label}
        </span>
    );
}
