type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  id,
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  const eyebrowCls = invert
    ? "text-accent"
    : "text-primary";
  const descCls = invert ? "text-primary-foreground/70" : "text-foreground/70";
  return (
    <header className={`max-w-2xl ${alignCls}`} id={id}>
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[0.18em] ${eyebrowCls}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl ${
          invert ? "text-primary-foreground" : ""
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-3 text-base leading-relaxed text-pretty ${descCls}`}>
          {description}
        </p>
      )}
    </header>
  );
}
