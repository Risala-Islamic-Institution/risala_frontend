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
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-white/80">{description}</p>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {children}
      </main>
    </div>
  );
}

export function DashboardCard({ title, subtitle, className = '', children }: DashboardCardProps) {
  const base = 'bg-white rounded-xl border border-neutral p-6 shadow-sm';
  return (
    <section className={[base, className].filter(Boolean).join(' ')}>
      <h2 className="text-primary font-semibold mb-4">{title}</h2>
      {subtitle ? <p className="text-secondary/70 mb-3">{subtitle}</p> : null}
      {children}
    </section>
  );
}
