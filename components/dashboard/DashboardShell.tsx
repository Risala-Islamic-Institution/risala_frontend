import React from 'react';

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

export function DashboardShell({ title, description, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Risala</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </header>
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export function DashboardCard({ title, subtitle, className = '', children }: DashboardCardProps) {
  const base = 'bg-card rounded-xl border border-border p-6 shadow-card';
  return (
    <section className={[base, className].filter(Boolean).join(' ')}>
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
