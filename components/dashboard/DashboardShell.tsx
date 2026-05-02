import React from "react";

interface DashboardShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Risala
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl text-balance">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export function DashboardCard({
  title,
  subtitle,
  className = "",
  children,
}: DashboardCardProps) {
  const base =
    "overflow-hidden rounded-2xl border border-border bg-card shadow-card";
  return (
    <section className={[base, className].filter(Boolean).join(" ")}>
      <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-6 py-4">
        <h2 className="font-display text-base font-semibold leading-tight text-foreground">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}
