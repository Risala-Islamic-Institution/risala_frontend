import React from 'react';

interface AvatarProps {
    src?: string | null;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const SIZES = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
    xl: 'w-24 h-24 text-4xl',
};

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
    const initials = name
        ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
        : '?';

    return (
        <div className={`relative rounded-full overflow-hidden flex items-center justify-center bg-white border-2 border-white shadow-md ${SIZES[size]} ${className}`}>
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black">
                    {initials}
                </div>
            )}
        </div>
    );
}
