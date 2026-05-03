'use client';

import React, { useState } from 'react';
import { Course } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowUpRight, BookOpen, Layers, Sparkles, Verified } from '@/components/icons';

interface CourseManagerProps {
    courses: Course[];
    onChange: (courses: Course[]) => void;
    onError: (msg: string) => void;
}

const CATEGORIES = ['QURAN', 'TAJWEED', 'ARABIC', 'TAFSIR', 'HIFZ', 'FIQH', 'AQEEDAH'] as const;
const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
const DURATION_TYPES = ['FIXED', 'SUBSCRIPTION'] as const;

const CATEGORY_LABEL: Record<(typeof CATEGORIES)[number], string> = {
    QURAN: 'Quran',
    TAJWEED: 'Tajweed',
    ARABIC: 'Arabic',
    TAFSIR: 'Tafsir',
    HIFZ: 'Hifz',
    FIQH: 'Fiqh',
    AQEEDAH: 'Aqeedah',
};

export function CourseManager({ courses, onChange, onError }: CourseManagerProps) {
    const [open, setOpen] = useState(false);
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        category: 'QURAN',
        level: 'BEGINNER',
        duration_type: 'FIXED',
        total_weeks: 4,
        price: '0',
    });
    const [saving, setSaving] = useState(false);
    const [publishing, setPublishing] = useState<string | null>(null);

    const saveCourse = async () => {
        if (!courseForm.title.trim()) {
            onError('Course title is required.');
            return;
        }
        try {
            setSaving(true);
            await api.post('/courses/', {
                ...courseForm,
                total_weeks: Number(courseForm.total_weeks || 0),
                price: courseForm.price || '0',
            });
            onChange(await api.get<Course[]>('/courses/'));
            setCourseForm({
                title: '',
                description: '',
                category: 'QURAN',
                level: 'BEGINNER',
                duration_type: 'FIXED',
                total_weeks: 4,
                price: '0',
            });
            setOpen(false);
        } catch {
            onError('Failed to save course.');
        } finally {
            setSaving(false);
        }
    };

    const togglePublish = async (c: Course) => {
        try {
            setPublishing(c.slug);
            await api.post(
                `/courses/${c.slug}/${c.is_published ? 'unpublish' : 'publish'}/`,
                {},
            );
            onChange(await api.get<Course[]>('/courses/'));
        } catch {
            onError(`Failed to ${c.is_published ? 'unpublish' : 'publish'}.`);
        } finally {
            setPublishing(null);
        }
    };

    const inputCls =
        'h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30';
    const textareaCls =
        'block w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30';

    const published = courses.filter((c) => c.is_published).length;
    const drafts = courses.length - published;

    return (
        <section id="courses-section" aria-labelledby="courses-heading">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
                <div>
                    <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                        Course studio
                    </p>
                    <h2
                        id="courses-heading"
                        className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground"
                    >
                        Build, refine, publish.
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
                        {published} published · {drafts} drafts
                    </span>
                    <Button
                        variant={open ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => setOpen((v) => !v)}
                    >
                        {open ? 'Close' : 'New course'}
                    </Button>
                </div>
            </div>

            {/* Collapsible new-course form */}
            {open ? (
                <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                    <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-6 py-5">
                        <div className="flex items-center gap-2.5">
                            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                New course
                            </p>
                        </div>
                        <h3 className="mt-1 font-display text-lg font-semibold leading-tight tracking-tight text-foreground">
                            Define the structure first, then add modules later.
                        </h3>
                    </div>

                    {/* Section: Identity */}
                    <fieldset className="border-b border-dashed border-border px-6 py-5">
                        <legend className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Identity
                        </legend>
                        <div className="grid grid-cols-1 gap-3">
                            <input
                                aria-label="Course title"
                                className={inputCls}
                                placeholder="Course title — e.g. Tajweed Foundations"
                                value={courseForm.title}
                                onChange={(e) =>
                                    setCourseForm((f) => ({ ...f, title: e.target.value }))
                                }
                            />
                            <textarea
                                aria-label="Description"
                                className={textareaCls}
                                placeholder="Describe what students will learn, the outcomes, and your approach."
                                rows={3}
                                value={courseForm.description}
                                onChange={(e) =>
                                    setCourseForm((f) => ({ ...f, description: e.target.value }))
                                }
                            />
                        </div>
                    </fieldset>

                    {/* Section: Structure */}
                    <fieldset className="border-b border-dashed border-border px-6 py-5">
                        <legend className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Structure
                        </legend>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label
                                    htmlFor="cat"
                                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                                >
                                    Category
                                </label>
                                <select
                                    id="cat"
                                    className={inputCls}
                                    value={courseForm.category}
                                    onChange={(e) =>
                                        setCourseForm((f) => ({ ...f, category: e.target.value }))
                                    }
                                >
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {CATEGORY_LABEL[c]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="lvl"
                                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                                >
                                    Level
                                </label>
                                <select
                                    id="lvl"
                                    className={inputCls}
                                    value={courseForm.level}
                                    onChange={(e) =>
                                        setCourseForm((f) => ({ ...f, level: e.target.value }))
                                    }
                                >
                                    {LEVELS.map((l) => (
                                        <option key={l} value={l}>
                                            {l.charAt(0) + l.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="dur"
                                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                                >
                                    Duration
                                </label>
                                <select
                                    id="dur"
                                    className={inputCls}
                                    value={courseForm.duration_type}
                                    onChange={(e) =>
                                        setCourseForm((f) => ({
                                            ...f,
                                            duration_type: e.target.value,
                                        }))
                                    }
                                >
                                    {DURATION_TYPES.map((d) => (
                                        <option key={d} value={d}>
                                            {d.charAt(0) + d.slice(1).toLowerCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="weeks"
                                    className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                                >
                                    Total weeks
                                </label>
                                <input
                                    id="weeks"
                                    aria-label="Total weeks"
                                    type="number"
                                    min={1}
                                    className={inputCls}
                                    value={courseForm.total_weeks}
                                    onChange={(e) =>
                                        setCourseForm((f) => ({
                                            ...f,
                                            total_weeks: Number(e.target.value || 0),
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Section: Pricing */}
                    <fieldset className="px-6 py-5">
                        <legend className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Pricing
                        </legend>
                        <div className="flex items-center gap-3">
                            <span className="font-display text-2xl font-semibold text-foreground">
                                $
                            </span>
                            <input
                                aria-label="Price in USD"
                                type="text"
                                inputMode="decimal"
                                className={`${inputCls} font-display text-base tabular-nums`}
                                placeholder="0.00"
                                value={courseForm.price}
                                onChange={(e) =>
                                    setCourseForm((f) => ({ ...f, price: e.target.value }))
                                }
                            />
                            <span className="text-xs text-muted-foreground">USD</span>
                        </div>
                    </fieldset>

                    <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
                        <p className="text-xs text-muted-foreground">
                            Saved as a draft. Add modules from the manage page, then publish.
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" isLoading={saving} onClick={saveCourse}>
                            Save course
                        </Button>
                    </div>
                </div>
            ) : null}

            {/* Course list */}
            {courses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                    <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-primary">
                        <BookOpen className="h-5 w-5" />
                    </span>
                    <p className="font-display text-base font-semibold text-foreground">
                        No courses yet
                    </p>
                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Open <span className="font-medium text-foreground">New course</span> above to build your first.
                    </p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {courses.map((c) => {
                        const cat = c.category as (typeof CATEGORIES)[number];
                        const catLabel = CATEGORY_LABEL[cat] || c.category;
                        return (
                            <li
                                key={c.id}
                                className="group/card flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                            >
                                {/* Tinted band — categorical accent */}
                                <div className="relative overflow-hidden border-b border-border bg-[color:var(--primary)]/[0.05] px-5 pt-5 pb-4">
                                    <span
                                        aria-hidden
                                        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--accent)]/40 to-transparent"
                                    />
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-card text-primary shadow-card">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        <span
                                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                                c.is_published
                                                    ? 'border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)]'
                                                    : 'border-border bg-card text-foreground/65'
                                            }`}
                                        >
                                            {c.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <h3 className="mt-3 font-display text-lg font-semibold leading-tight tracking-tight text-foreground line-clamp-2">
                                        {c.title}
                                    </h3>
                                    <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        <Layers className="h-3 w-3" aria-hidden />
                                        {catLabel} · {c.level}
                                    </p>
                                </div>

                                <div className="flex flex-1 flex-col gap-4 p-5">
                                    {c.description ? (
                                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                            {c.description}
                                        </p>
                                    ) : null}

                                    <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-dashed border-border pt-3 text-xs">
                                        <div>
                                            <dt className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                                                Weeks
                                            </dt>
                                            <dd className="mt-0.5 font-display text-base font-semibold tabular-nums text-foreground">
                                                {c.total_weeks}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                                                Mode
                                            </dt>
                                            <dd className="mt-0.5 truncate text-sm font-medium text-foreground">
                                                {c.duration_type === 'FIXED' ? 'Fixed' : 'Subscr.'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                                                Price
                                            </dt>
                                            <dd className="mt-0.5 font-display text-base font-semibold tabular-nums text-foreground">
                                                ${c.price}
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="flex items-center gap-2 border-t border-border pt-4">
                                        <Button
                                            variant={c.is_published ? 'outline' : 'primary'}
                                            size="sm"
                                            className="flex-1"
                                            isLoading={publishing === c.slug}
                                            onClick={() => togglePublish(c)}
                                        >
                                            {c.is_published ? (
                                                <>
                                                    <Verified className="h-3.5 w-3.5" aria-hidden />
                                                    Unpublish
                                                </>
                                            ) : (
                                                <>
                                                    Publish
                                                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                                                </>
                                            )}
                                        </Button>
                                        <a
                                            href={`/dashboard/ustaz/courses/${c.slug}`}
                                            className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                        >
                                            Manage
                                            <ArrowUpRight className="h-3 w-3" aria-hidden />
                                        </a>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
