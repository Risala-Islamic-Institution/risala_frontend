import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Card({ className = '', children, ...props }: CardProps) {
    return (
        <div
            className={`bg-card text-card-foreground rounded-xl border border-border shadow-card overflow-hidden transition-shadow hover:shadow-elevated ${className}`}
            {...props}
        >
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
        <div
            className={`p-6 border-t border-border bg-muted/40 flex items-center gap-3 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardCover({
    src,
    alt,
    className = '',
}: {
    src?: string;
    alt?: string;
    className?: string;
}) {
    if (!src) {
        return (
            <div
                className={`h-32 relative overflow-hidden bg-muted ${className}`}
                aria-hidden={!alt}
            >
                <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(600px 200px at 80% 20%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 60%), radial-gradient(500px 220px at 0% 100%, color-mix(in oklab, var(--primary) 10%, transparent), transparent 60%)",
                    }}
                />
            </div>
        );
    }
    return (
        <div className={`h-44 relative overflow-hidden ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt || ''}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div
                aria-hidden
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, transparent 50%, color-mix(in oklab, #1c1f26 55%, transparent) 100%)",
                }}
            />
        </div>
    );
}
