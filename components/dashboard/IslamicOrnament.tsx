import React from 'react';

/**
 * Tiny 8-point star ornament (rub el hizb-inspired).
 * Used as an eyebrow ornament before section labels.
 */
export function StarOrnament({ className = '', size = 12, style }: { className?: string; size?: number; style?: React.CSSProperties }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            aria-hidden="true"
            className={className}
            style={style}
        >
            {/* Two overlapping squares forming an 8-point star */}
            <path d="M12 2 L14.8 9.2 L22 12 L14.8 14.8 L12 22 L9.2 14.8 L2 12 L9.2 9.2 Z" opacity="0.95" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
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
            <span className="h-px w-8" style={{ background: 'color-mix(in oklab, var(--accent) 40%, transparent)' }} />
            <span className="h-1 w-1 rounded-full" style={{ background: 'var(--accent)' }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
            <span className="h-1 w-1 rounded-full" style={{ background: 'var(--accent)' }} />
            <span className="h-px w-8" style={{ background: 'color-mix(in oklab, var(--accent) 40%, transparent)' }} />
        </span>
    );
}

/**
 * Large decorative geometric panel — used as a right-side ornament for sections.
 * Layered radial 8-point stars. Kept subtle so it never competes with content.
 * Now more vibrant with a larger anchoring star and a richer pattern.
 */
export function GeometricPanel({ className = '' }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 320 240"
            className={`pointer-events-none ${className}`}
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <pattern id="risala-stars-v2" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                    {/* 8-point star tile */}
                    <path
                        d="M24 8 L28.4 19.6 L40 24 L28.4 28.4 L24 40 L19.6 28.4 L8 24 L19.6 19.6 Z"
                        fill="none"
                        stroke="color-mix(in oklab, var(--primary) 22%, transparent)"
                        strokeWidth="0.7"
                    />
                    <circle cx="24" cy="24" r="1.6" fill="color-mix(in oklab, var(--accent) 65%, transparent)" />
                    {/* Corner diamonds */}
                    <path d="M0 24 L4 20 L8 24 L4 28 Z" fill="color-mix(in oklab, var(--accent) 20%, transparent)" />
                    <path d="M40 24 L44 20 L48 24 L44 28 Z" fill="color-mix(in oklab, var(--accent) 20%, transparent)" />
                </pattern>

                <radialGradient id="risala-fade-v2" cx="65%" cy="40%" r="85%">
                    <stop offset="0%" stopColor="black" stopOpacity="0.98" />
                    <stop offset="75%" stopColor="black" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="black" stopOpacity="0" />
                </radialGradient>
                <mask id="risala-mask-v2">
                    <rect width="320" height="240" fill="url(#risala-fade-v2)" />
                </mask>
            </defs>

            {/* Tiled star field */}
            <rect width="320" height="240" fill="url(#risala-stars-v2)" mask="url(#risala-mask-v2)" />

            {/* Large anchoring star — slightly right of centre */}
            <g transform="translate(230 115)" opacity="0.5">
                <path
                    d="M0 -58 L16 -16 L58 0 L16 16 L0 58 L-16 16 L-58 0 L-16 -16 Z"
                    fill="none"
                    stroke="color-mix(in oklab, var(--accent) 55%, transparent)"
                    strokeWidth="1"
                />
                <path
                    d="M0 -38 L10.5 -10.5 L38 0 L10.5 10.5 L0 38 L-10.5 10.5 L-38 0 L-10.5 -10.5 Z"
                    fill="none"
                    stroke="color-mix(in oklab, var(--primary) 40%, transparent)"
                    strokeWidth="0.9"
                />
                <circle r="3.5" fill="color-mix(in oklab, var(--accent) 85%, transparent)" />
            </g>

            {/* Smaller accent star — upper left area */}
            <g transform="translate(80 55)" opacity="0.35">
                <path
                    d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z"
                    fill="none"
                    stroke="color-mix(in oklab, var(--accent) 55%, transparent)"
                    strokeWidth="0.7"
                />
                <circle r="1.5" fill="color-mix(in oklab, var(--accent) 70%, transparent)" />
            </g>
        </svg>
    );
}

/**
 * Full-page watermark star — very large, ultra-faint, used as page background accent.
 */
export function PageWatermarkStar({ className = '' }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            aria-hidden="true"
            className={`pointer-events-none ${className}`}
        >
            <path
                d="M100 10 L120 60 L175 65 L135 100 L148 155 L100 125 L52 155 L65 100 L25 65 L80 60 Z"
                fill="none"
                stroke="color-mix(in oklab, var(--primary) 14%, transparent)"
                strokeWidth="1"
            />
            <path
                d="M100 30 L115 68 L155 72 L125 97 L136 136 L100 113 L64 136 L75 97 L45 72 L85 68 Z"
                fill="none"
                stroke="color-mix(in oklab, var(--accent) 10%, transparent)"
                strokeWidth="0.8"
            />
            <circle cx="100" cy="100" r="6" fill="color-mix(in oklab, var(--accent) 18%, transparent)" />
        </svg>
    );
}
