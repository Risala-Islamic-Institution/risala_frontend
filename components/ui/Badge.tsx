import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';

const VARIANTS: Record<BadgeVariant, string> = {
    default:
        'bg-[color:var(--primary)]/10 text-primary border border-[color:var(--primary)]/15',
    success:
        'bg-[color:var(--success)]/10 text-[color:var(--success)] border border-[color:var(--success)]/20',
    warning:
        'bg-[color:var(--warning)]/15 text-[#8a6326] border border-[color:var(--warning)]/30',
    error:
        'bg-[color:var(--error)]/10 text-[color:var(--error)] border border-[color:var(--error)]/20',
    outline:
        'bg-card text-muted-foreground border border-border',
    ghost:
        'bg-muted text-muted-foreground border border-transparent',
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    label: string;
    icon?: React.ReactNode;
}

export function Badge({ variant = 'default', label, icon, className = '', ...props }: BadgeProps) {
    const styles = VARIANTS[variant] || VARIANTS.default;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${styles} ${className}`}
            {...props}
        >
            {icon}
            {label}
        </span>
    );
}
