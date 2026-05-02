type Props = {
  className?: string;
  variant?: "light" | "dark";
};

/**
 * A subtle, intentional Islamic 8-point star (rub el hizb) tileable pattern,
 * used as a non-decorative compositional layer. Renders an inline SVG pattern
 * so it blends with the parent background and adapts via currentColor.
 */
export function GeometricPattern({ className, variant = "light" }: Props) {
  const stroke = variant === "dark" ? "rgba(198,167,94,0.18)" : "rgba(15,61,46,0.10)";
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="risala-rub"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          {/* 8-point star (two overlapping squares) */}
          <g fill="none" stroke={stroke} strokeWidth="1">
            <rect x="14" y="14" width="36" height="36" />
            <rect
              x="14"
              y="14"
              width="36"
              height="36"
              transform="rotate(45 32 32)"
            />
            <circle cx="32" cy="32" r="2" fill={stroke} stroke="none" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#risala-rub)" />
    </svg>
  );
}
