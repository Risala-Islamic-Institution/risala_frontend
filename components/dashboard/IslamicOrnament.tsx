import React from 'react';

/**
 * Tiny 8-point star ornament (rub el hizb-inspired).
 * Used as an eyebrow ornament before section labels.
 */
export function StarOrnament({ className = '', size = 12 }: { className?: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            aria-hidden="true"
            className={className}
        >
            {/* Two overlapping squares forming an 8-point star */}
            <path d="M12 2 L14.8 9.2 L22 12 L14.8 14.8 L12 22 L9.2 14.8 L2 12 L9.2 9.2 Z" opacity="0.95" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
    );
}

/**
 * Mini geometric divider — three dots flanked by hairlines.
 * Used inside section headings for an Islamic-manuscript feel.
 */
export function GeometricDivider({ className = '' }: { className?: string }) {
    return (
        <span aria-hidden className={`inline-flex items-center gap-1.5 ${className}`}>
            <span className="h-px w-6 bg-[color:var(--accent)]/40" />
            <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
            <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
            <span className="h-px w-6 bg-[color:var(--accent)]/40" />
        </span>
    );
}

/**
 * Decorative geometric panel — used as the right-side ornament for the dashboard hero.
 * Layered radial 8-point stars, kept extremely subtle so it never competes with content.
 */
export function GeometricPanel({ className = '' }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 320 240"
            className={`pointer-events-none ${className}`}
            aria-hidden="true"
        >
            <defs>
                <pattern id="rishala-stars" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                    {/* 8-point star */}
                    <path
                        d="M24 8 L28.4 19.6 L40 24 L28.4 28.4 L24 40 L19.6 28.4 L8 24 L19.6 19.6 Z"
                        fill="none"
                        stroke="color-mix(in oklab, var(--primary) 18%, transparent)"
                        strokeWidth="0.6"
                    />
                    <circle cx="24" cy="24" r="1.4" fill="color-mix(in oklab, var(--accent) 60%, transparent)" />
                </pattern>
                <radialGradient id="rishala-fade" cx="65%" cy="40%" r="80%">
                    <stop offset="0%" stopColor="black" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="black" stopOpacity="0" />
                </radialGradient>
                <mask id="rishala-mask">
                    <rect width="320" height="240" fill="url(#rishala-fade)" />
                </mask>
            </defs>
            <rect width="320" height="240" fill="url(#rishala-stars)" mask="url(#rishala-mask)" />
            {/* Larger anchoring star */}
            <g transform="translate(220 110)" opacity="0.55">
                <path
                    d="M0 -52 L14.5 -14.5 L52 0 L14.5 14.5 L0 52 L-14.5 14.5 L-52 0 L-14.5 -14.5 Z"
                    fill="none"
                    stroke="color-mix(in oklab, var(--accent) 55%, transparent)"
                    strokeWidth="0.9"
                />
                <path
                    d="M0 -36 L10 -10 L36 0 L10 10 L0 36 L-10 10 L-36 0 L-10 -10 Z"
                    fill="none"
                    stroke="color-mix(in oklab, var(--primary) 35%, transparent)"
                    strokeWidth="0.9"
                />
                <circle r="3" fill="color-mix(in oklab, var(--accent) 80%, transparent)" />
            </g>
        </svg>
    );
}
