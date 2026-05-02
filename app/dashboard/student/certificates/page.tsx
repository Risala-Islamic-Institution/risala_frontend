"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ArrowUpRight, Verified } from "@/components/icons";

interface CertificateItem {
    id: string;
    enrollment: string;
    issued_at: string;
    code: string;
    course_title?: string;
    course_slug?: string;
}

export default function CertificatesPage() {
    const [loading, setLoading] = useState(true);
    const [certs, setCerts] = useState<CertificateItem[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const run = async () => {
            try {
                const res = await api.get<CertificateItem[]>("/certificates/");
                setCerts(res);
            } catch {
                setError("Failed to load certificates.");
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Loading certificates
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Slim header */}
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard/student" aria-label="Back to dashboard">
                        <BrandMark />
                    </Link>
                    <Link
                        href="/dashboard/student"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                    >
                        <span aria-hidden>&larr;</span>
                        Back to dashboard
                    </Link>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
                {/* Editorial hero */}
                <section className="grid grid-cols-1 gap-6 border-b border-border py-12 lg:grid-cols-12 lg:items-end lg:gap-10">
                    <div className="lg:col-span-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                            Achievements
                        </p>
                        <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl text-balance">
                            Your certificates
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                            Courses you have completed in full. Each certificate carries a unique credential ID you can verify and share.
                        </p>
                    </div>
                    <dl className="grid grid-cols-2 gap-6 lg:col-span-4 lg:justify-self-end lg:text-right">
                        <div>
                            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Earned
                            </dt>
                            <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                                {certs.length}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                This year
                            </dt>
                            <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                                {certs.filter((c) =>
                                    new Date(c.issued_at).getFullYear() === new Date().getFullYear(),
                                ).length}
                            </dd>
                        </div>
                    </dl>
                </section>

                {error ? (
                    <div
                        role="alert"
                        className="mt-6 rounded-md border border-[color:var(--error)]/25 bg-[color:var(--error)]/8 px-3.5 py-2.5 text-sm text-[color:var(--error)]"
                    >
                        {error}
                    </div>
                ) : null}

                <section className="py-10">
                    {certs.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                            <span className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-card text-accent">
                                <Verified className="h-5 w-5" />
                            </span>
                            <p className="font-display text-lg font-semibold text-foreground">
                                No certificates yet
                            </p>
                            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Complete a course in full to earn your first certificate. It will appear here automatically.
                            </p>
                            <Link
                                href="/dashboard/student/courses"
                                className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#0b2e22]"
                            >
                                Browse courses
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {certs.map((c) => (
                                <article
                                    key={c.id}
                                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-accent/30 bg-card transition-shadow hover:shadow-elevated"
                                >
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 opacity-[0.04]"
                                        style={{
                                            backgroundImage:
                                                "radial-gradient(circle at 50% 50%, var(--accent) 0 1px, transparent 1px), linear-gradient(45deg, transparent 46%, var(--primary) 46% 54%, transparent 54%), linear-gradient(-45deg, transparent 46%, var(--primary) 46% 54%, transparent 54%)",
                                            backgroundSize: "32px 32px, 64px 64px, 64px 64px",
                                        }}
                                    />
                                    <div className="relative flex h-full flex-col p-6">
                                        <span className="inline-flex items-center gap-2 self-start rounded-full border border-accent/30 bg-card px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
                                            <Verified className="h-3.5 w-3.5 text-accent" />
                                            Certificate
                                        </span>
                                        <h2 className="mt-4 font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                                            {c.course_title || "Course"}
                                        </h2>
                                        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
                                            <div>
                                                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                                    Issued
                                                </dt>
                                                <dd className="mt-1 font-medium text-foreground">
                                                    {new Date(c.issued_at).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                                    Credential ID
                                                </dt>
                                                <dd className="mt-1 truncate font-mono text-[11px] text-foreground">
                                                    {c.code}
                                                </dd>
                                            </div>
                                        </dl>
                                        {c.course_slug ? (
                                            <Link
                                                href={`/dashboard/student/courses/${c.course_slug}`}
                                                className="mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
                                            >
                                                Open course
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </Link>
                                        ) : null}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
