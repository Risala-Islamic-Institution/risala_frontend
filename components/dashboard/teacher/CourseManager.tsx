import React, { useState } from 'react';
import { Course } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
        syllabus: '',
        prerequisites: '',
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
                syllabus: '',
                prerequisites: '',
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
            await api.post(`/courses/${c.slug}/${c.is_published ? 'unpublish' : 'publish'}/`, {});
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
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">Courses</h2>
                <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {courses.length} created
                </span>
            </div>

            {/* Form */}
            <div className="mb-5 rounded-xl border border-border bg-muted/40 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    New course
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-foreground">
                    Create a new course
                </h3>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                        aria-label="Course title"
                        className={inputCls}
                        placeholder="Course title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
                    />
                    <input
                        aria-label="Price in USD"
                        className={inputCls}
                        placeholder="Price ($)"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm((f) => ({ ...f, price: e.target.value }))}
                    />
                    <textarea
                        aria-label="Description"
                        className={`${textareaCls} md:col-span-2`}
                        placeholder="Description"
                        rows={2}
                        value={courseForm.description}
                        onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
                    />
                    <select
                        aria-label="Category"
                        className={inputCls}
                        value={courseForm.category}
                        onChange={(e) => setCourseForm((f) => ({ ...f, category: e.target.value }))}
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
                        onChange={(e) => setCourseForm((f) => ({ ...f, duration_type: e.target.value }))}
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
                            setCourseForm((f) => ({ ...f, total_weeks: Number(e.target.value || 0) }))
                        }
                    />
                    <textarea
                        aria-label="Syllabus"
                        className={`${textareaCls} md:col-span-2`}
                        placeholder="Syllabus"
                        rows={2}
                        value={courseForm.syllabus}
                        onChange={(e) => setCourseForm((f) => ({ ...f, syllabus: e.target.value }))}
                    />
                    <textarea
                        aria-label="Prerequisites"
                        className={`${textareaCls} md:col-span-2`}
                        placeholder="Prerequisites"
                        rows={2}
                        value={courseForm.prerequisites}
                        onChange={(e) => setCourseForm((f) => ({ ...f, prerequisites: e.target.value }))}
                    />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button variant="primary" isLoading={saving} onClick={saveCourse}>
                        Save course
                    </Button>
                </div>
            </div>

            {/* List */}
            {courses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                    <p className="font-display text-base font-semibold text-foreground">
                        No courses yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create your first course above. You can publish it once it&apos;s ready.
                    </p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {courses.map((c) => (
                        <li
                            key={c.id}
                            className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated sm:p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-display text-base font-semibold text-foreground">
                                        {c.title}
                                    </h3>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        <Badge variant="default" label={String(c.category)} />
                                        <Badge variant="outline" label={String(c.level)} />
                                        <Badge variant="success" label={`$${c.price}`} />
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <Badge
                                        variant={c.is_published ? 'success' : 'ghost'}
                                        label={c.is_published ? 'Published' : 'Draft'}
                                    />
                                    <Button
                                        variant={c.is_published ? 'outline' : 'primary'}
                                        size="sm"
                                        isLoading={publishing === c.slug}
                                        onClick={() => togglePublish(c)}
                                    >
                                        {c.is_published ? 'Unpublish' : 'Publish'}
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
