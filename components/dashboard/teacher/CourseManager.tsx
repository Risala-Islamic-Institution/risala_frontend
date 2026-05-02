import React, { useState } from 'react';
import { Course } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { BookOpen } from '@/components/icons';

interface CourseManagerProps {
    courses: Course[];
    onChange: (courses: Course[]) => void;
    onError: (msg: string) => void;
}

const CATEGORIES = ['QURAN', 'TAJWEED', 'ARABIC', 'TAFSIR', 'HIFZ', 'FIQH', 'AQEEDAH'] as const;
const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
const DURATION_TYPES = ['FIXED', 'SUBSCRIPTION'] as const;

export function CourseManager({ courses, onChange, onError }: CourseManagerProps) {
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
        'h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30';
    const textareaCls =
        'block w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30';

    return (
        <section id="courses-section">
            <div className="mb-5 flex items-end justify-between gap-5">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        Course studio
                    </p>
                    <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                        Build courses, publish with intent.
                    </h2>
                </div>
                <span className="hidden shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
                    {courses.length} created
                </span>
            </div>

            {/* Form */}
            <div className="mb-5 overflow-hidden rounded-2xl border border-border bg-card">
                <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        New course
                    </p>
                    <h3 className="mt-1 font-display text-base font-semibold leading-tight text-foreground">
                        Define the structure first, then add modules later.
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2">
                    <input
                        aria-label="Course title"
                        className={`${inputCls} md:col-span-2`}
                        placeholder="Course title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
                    />
                    <textarea
                        aria-label="Description"
                        className={`${textareaCls} md:col-span-2`}
                        placeholder="Description — what will students learn?"
                        rows={2}
                        value={courseForm.description}
                        onChange={(e) =>
                            setCourseForm((f) => ({ ...f, description: e.target.value }))
                        }
                    />
                    <select
                        aria-label="Category"
                        className={inputCls}
                        value={courseForm.category}
                        onChange={(e) =>
                            setCourseForm((f) => ({ ...f, category: e.target.value }))
                        }
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label="Level"
                        className={inputCls}
                        value={courseForm.level}
                        onChange={(e) => setCourseForm((f) => ({ ...f, level: e.target.value }))}
                    >
                        {LEVELS.map((l) => (
                            <option key={l} value={l}>
                                {l}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label="Duration type"
                        className={inputCls}
                        value={courseForm.duration_type}
                        onChange={(e) =>
                            setCourseForm((f) => ({ ...f, duration_type: e.target.value }))
                        }
                    >
                        {DURATION_TYPES.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                    <input
                        aria-label="Total weeks"
                        type="number"
                        min={1}
                        className={inputCls}
                        placeholder="Total weeks"
                        value={courseForm.total_weeks}
                        onChange={(e) =>
                            setCourseForm((f) => ({
                                ...f,
                                total_weeks: Number(e.target.value || 0),
                            }))
                        }
                    />
                    <input
                        aria-label="Price in USD"
                        className={`${inputCls} md:col-span-2`}
                        placeholder="Price ($)"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm((f) => ({ ...f, price: e.target.value }))}
                    />
                </div>
                <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/40 px-5 py-3">
                    <p className="text-xs text-muted-foreground">
                        You can publish later, after adding modules.
                    </p>
                    <Button variant="primary" isLoading={saving} onClick={saveCourse}>
                        Save course
                    </Button>
                </div>
            </div>

            {/* List */}
            {courses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                    <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-primary">
                        <BookOpen className="h-5 w-5" />
                    </span>
                    <p className="font-display text-base font-semibold text-foreground">
                        No courses yet
                    </p>
                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        Create your first course above. You can publish it once it&apos;s ready.
                    </p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {courses.map((c) => (
                        <li
                            key={c.id}
                            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-elevated"
                        >
                            <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-5 pt-5 pb-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
                                        <BookOpen className="h-4.5 w-4.5" />
                                    </div>
                                    <span
                                        className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                            c.is_published
                                                ? 'border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)]'
                                                : 'border-border bg-muted text-foreground/65'
                                        }`}
                                    >
                                        {c.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <h3 className="mt-3 truncate font-display text-base font-semibold leading-tight text-foreground">
                                    {c.title}
                                </h3>
                            </div>
                            <div className="flex flex-1 flex-col gap-3 p-5">
                                <dl className="grid grid-cols-3 gap-3 text-xs">
                                    <div>
                                        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                            Category
                                        </dt>
                                        <dd className="mt-0.5 truncate font-medium text-foreground">
                                            {String(c.category)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                            Level
                                        </dt>
                                        <dd className="mt-0.5 truncate font-medium text-foreground">
                                            {String(c.level)}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                            Price
                                        </dt>
                                        <dd className="mt-0.5 font-medium tabular-nums text-foreground">
                                            ${c.price}
                                        </dd>
                                    </div>
                                </dl>
                                <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
                                    <Button
                                        variant={c.is_published ? 'outline' : 'primary'}
                                        size="sm"
                                        className="flex-1"
                                        isLoading={publishing === c.slug}
                                        onClick={() => togglePublish(c)}
                                    >
                                        {c.is_published ? 'Unpublish' : 'Publish'}
                                    </Button>
                                    <a
                                        href={`/dashboard/ustaz/courses/${c.slug}`}
                                        className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                    >
                                        Manage
                                    </a>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
