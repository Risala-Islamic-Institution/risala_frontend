type Props = {
  className?: string;
  variant?: "default" | "light";
  showWordmark?: boolean;
};

export function BrandMark({
  className,
  variant = "default",
  showWordmark = true,
}: Props) {
  const fg = variant === "light" ? "#F7F8F5" : "#0F3D2E";
  const accent = "#C6A75E";
  return (
    <div className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <span
        aria-hidden="true"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md"
        style={{
          background:
            variant === "light"
              ? "rgba(247,248,245,0.06)"
              : "color-mix(in oklab, #0F3D2E 8%, transparent)",
        }}
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
          {/* Crescent */}
          <path
            d="M22 8a8 8 0 1 0 0 16 6.5 6.5 0 1 1 0-16z"
            fill={fg}
          />
          {/* Gold barakah dot */}
          <circle cx="24" cy="9" r="2" fill={accent} />
        </svg>
      </span>
      {showWordmark && (
        <span
          className="font-display text-lg font-semibold tracking-tight"
          style={{ color: fg }}
        >
          Risala
        </span>
      )}
    </div>
  );
}
