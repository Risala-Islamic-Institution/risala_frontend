"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { ArrowRight, ArrowUpRight, BookOpen } from "@/components/icons";
import { Course } from "@/types";

interface Enrollment {
    id: string;
    course: Course;
    status: string;
    progress_percent: number;
}

const FILTERS = [
    { id: "all", label: "All" },
    { id: "QURAN", label: "Quran" },
    { id: "TAJWEED", label: "Tajweed" },
    { id: "ARABIC", label: "Arabic" },
    { id: "TAFSIR", label: "Tafsir" },
    { id: "HIFZ", label: "Hifz" },
    { id: "FIQH", label: "Fiqh" },
    { id: "AQEEDAH", label: "Aqeedah" },
];

export default function StudentCoursesPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [enrolling, setEnrolling] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const run = async () => {
            try {
                await Promise.all([loadCourses(), loadEnrollments()]);
            } catch {
                setError("Failed to load courses.");
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    const loadCourses = async () => {
        const res = await api.get<Course[]>("/courses/");
        setCourses(res);
    };

    const loadEnrollments = async () => {
        const res = await api.get<Enrollment[]>("/enrollments/");
        setEnrollments(res);
    };

    const enrolledMap = useMemo(() => {
        const m = new Map<string, Enrollment>();
        enrollments.forEach((e) => {
            if (e.course?.id) m.set(e.course.id, e);
        });
        return m;
    }, [enrollments]);

    const enroll = async (courseId: string) => {
        try {
            setEnrolling(courseId);
            await api.post("/enrollments/", { course_id: courseId });
            await loadEnrollments();
        } catch {
            setError("Enrollment failed.");
        } finally {
            setEnrolling(null);
        }
    };

    const filteredCourses = useMemo(() => {
        if (activeFilter === "all") return courses;
        return courses.filter(
            (c) => (c.category || "").toUpperCase() === activeFilter,
        );
    }, [courses, activeFilter]);

    const continueLearning = enrollments.filter((e) => e.progress_percent < 100);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Loading courses
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

            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Editorial hero */}
                <section className="grid grid-cols-1 gap-6 border-b border-border py-12 lg:grid-cols-12 lg:items-end lg:gap-10">
                    <div className="lg:col-span-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                            Self-paced learning
                        </p>
                        <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl text-balance">
                            Structured courses, taught with care.
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                            Recorded by verified scholars with modules, lessons, quizzes, and certificates. Enroll once and learn at your own pace.
                        </p>
                    </div>
                    <dl className="grid grid-cols-3 gap-6 lg:col-span-4 lg:justify-self-end lg:text-right">
                        <div>
                            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Catalog
                            </dt>
                            <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                                {courses.length}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                Enrolled
                            </dt>
                            <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                                {enrollments.length}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                In progress
                            </dt>
                            <dd className="mt-1 font-display text-2xl font-semibold tabular-nums text-foreground">
                                {continueLearning.length}
                            </dd>
                        </div>
                    </dl>
                </section>

                {error && (
                    <div
                        role="alert"
                        className="mt-6 rounded-md border border-[color:var(--error)]/25 bg-[color:var(--error)]/8 px-3.5 py-2.5 text-sm text-[color:var(--error)]"
                    >
                        {error}
                    </div>
                )}

                {/* Continue learning band */}
                {continueLearning.length > 0 ? (
                    <section className="border-b border-border py-10">
                        <div className="mb-5 flex items-end justify-between gap-5">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                    Continue learning
                                </p>
                                <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                                    Pick up where you left off.
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {continueLearning.slice(0, 3).map((e) => (
                                <Link
                                    key={e.id}
                                    href={`/dashboard/student/courses/${e.course.slug}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-elevated"
                                >
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        {e.course.category}
                                    </p>
                                    <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
                                        {e.course.title}
                                    </h3>
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium text-foreground">
                                                {Math.round(e.progress_percent)}% complete
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-foreground/65 transition-transform group-hover:translate-x-0.5">
                                                Continue
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                        </div>
                                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                            <span
                                                aria-hidden
                                                className="block h-full rounded-full bg-primary"
                                                style={{ width: `${Math.min(100, e.progress_percent)}%` }}
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}

                {/* Catalog */}
                <section className="py-10">
                    <div className="mb-6 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                Catalog
                            </p>
                            <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                                Browse every course.
                            </h2>
                        </div>
                        <div
                            role="tablist"
                            aria-label="Filter by category"
                            className="flex max-w-full items-center gap-2 overflow-x-auto no-scrollbar"
                        >
                            {FILTERS.map((f) => {
                                const active = activeFilter === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setActiveFilter(f.id)}
                                        className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                                            active
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-card text-foreground/75 hover:border-foreground/30 hover:text-foreground"
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {filteredCourses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                            <span className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-primary">
                                <BookOpen className="h-5 w-5" />
                            </span>
                            <p className="font-display text-lg font-semibold text-foreground">
                                No courses match this filter
                            </p>
                            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Try a different category — we&apos;re publishing new courses every week.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {filteredCourses.map((c) => {
                                const enrolled = enrolledMap.get(c.id);
                                return (
                                    <article
                                        key={c.id}
                                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-elevated"
                                    >
                                        <div className="relative border-b border-border bg-[color:var(--primary)]/[0.04] px-5 pt-5 pb-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                                    {c.category}
                                                </span>
                                            </div>
                                            <h3 className="mt-4 font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
                                                {c.title}
                                            </h3>
                                        </div>

                                        <div className="flex flex-1 flex-col gap-4 p-5">
                                            <p className="line-clamp-3 text-sm leading-relaxed text-foreground/75">
                                                {c.description}
                                            </p>

                                            <dl className="grid grid-cols-3 gap-3 border-y border-border py-3 text-xs">
                                                <div>
                                                    <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                                        Level
                                                    </dt>
                                                    <dd className="mt-0.5 truncate font-medium text-foreground">
                                                        {c.level || "—"}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                                        Length
                                                    </dt>
                                                    <dd className="mt-0.5 truncate font-medium text-foreground">
                                                        {c.total_weeks ? `${c.total_weeks} weeks` : "Self-paced"}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                                        Price
                                                    </dt>
                                                    <dd className="mt-0.5 font-medium tabular-nums text-foreground">
                                                        ${Number(c.price).toFixed(0)}
                                                    </dd>
                                                </div>
                                            </dl>

                                            <div className="mt-auto">
                                                {enrolled ? (
                                                    <Link
                                                        href={`/dashboard/student/courses/${c.slug}`}
                                                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                    >
                                                        Continue
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="w-full"
                                                        disabled={enrolling === c.id}
                                                        isLoading={enrolling === c.id}
                                                        onClick={() => enroll(c.id)}
                                                    >
                                                        Enroll
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
