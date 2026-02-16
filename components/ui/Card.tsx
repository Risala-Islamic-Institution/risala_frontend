import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Card({ className = '', children, ...props }: CardProps) {
    return (
        <div className={`bg-white rounded-3xl border border-neutral/30 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ className = '', children, ...props }: CardProps) {
    return (
        <div className={`p-6 pb-3 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardBody({ className = '', children, ...props }: CardProps) {
    return (
        <div className={`p-6 pt-0 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className = '', children, ...props }: CardProps) {
    return (
        <div className={`p-6 border-t border-neutral/10 bg-neutral/5 flex items-center gap-3 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardCover({ src, alt, className = '' }: { src?: string; alt?: string; className?: string }) {
    if (!src) return (
        <div className={`h-32 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden ${className}`}>
            <div className="absolute -right-4 -top-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
        </div>
    );
    return (
        <div className={`h-48 relative overflow-hidden ${className}`}>
            <img src={src} alt={alt || 'Cover'} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
    );
}
