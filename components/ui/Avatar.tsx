import React from 'react';

interface AvatarProps {
    src?: string | null;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const SIZES = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-2xl',
};

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
    const initials = name
        ? name
              .split(' ')
              .map((n) => n[0])
              .filter(Boolean)
              .join('')
              .substring(0, 2)
              .toUpperCase()
        : '?';

    return (
        <div
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-muted ${SIZES[size]} ${className}`}
        >
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={name} className="h-full w-full object-cover" />
            ) : (
                <span className="font-display font-semibold text-primary">
                    {initials}
                </span>
            )}
        </div>
    );
}
