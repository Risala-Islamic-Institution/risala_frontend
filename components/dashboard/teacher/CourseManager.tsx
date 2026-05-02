import React, { useState } from 'react';
import { Course } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface CourseManagerProps {
    courses: Course[];
    onChange: (courses: Course[]) => void;
    onError: (msg: string) => void;
}

export function CourseManager({ courses, onChange, onError }: CourseManagerProps) {
    const [courseForm, setCourseForm] = useState({
        title: '', description: '', category: 'QURAN', level: 'BEGINNER',
        duration_type: 'FIXED', total_weeks: 4, syllabus: '', prerequisites: '', price: '0',
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
            setCourseForm({ title: '', description: '', category: 'QURAN', level: 'BEGINNER', duration_type: 'FIXED', total_weeks: 4, syllabus: '', prerequisites: '', price: '0' });
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

    return (
        <section id="courses-section">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-secondary">Courses</h2>
                <span className="text-[10px] font-bold tracking-[.15em] uppercase text-secondary/35 border border-primary/15 px-2.5 py-1 rounded-full bg-white/80">{courses.length} Created</span>
            </div>

            {/* Form */}
            <div className="relative overflow-hidden bg-linear-to-br from-[#123b31] via-[#135147] to-[#10362e] border border-[#0E5A47]/50 ring-1 ring-accent/35 rounded-[1.6rem] p-5 mb-5 shadow-[0_24px_52px_rgba(10,43,34,0.36)]">
                <div className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-accent/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <p className="relative text-[10px] font-black tracking-[.18em] uppercase text-[#F4E6B2]/85 mb-3">+ Create New Course</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 relative">
                    <input
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 focus:outline-none focus:border-[#F4E6B2]"
                        placeholder="Course title"
                        value={courseForm.title}
                        onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))}
                    />
                    <input
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 focus:outline-none focus:border-[#F4E6B2]"
                        placeholder="Price ($)"
                        value={courseForm.price}
                        onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))}
                    />
                    <textarea
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 md:col-span-2 focus:outline-none focus:border-[#F4E6B2]"
                        placeholder="Description"
                        rows={2}
                        value={courseForm.description}
                        onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))}
                    />
                    <select className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 focus:outline-none focus:border-[#F4E6B2]" value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))}>
                        {['QURAN', 'TAJWEED', 'ARABIC', 'TAFSIR', 'HIFZ', 'FIQH', 'AQEEDAH'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 focus:outline-none focus:border-[#F4E6B2]" value={courseForm.level} onChange={e => setCourseForm(f => ({ ...f, level: e.target.value }))}>
                        {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <input
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 focus:outline-none focus:border-[#F4E6B2]"
                        placeholder="Duration type (e.g. FIXED)"
                        value={courseForm.duration_type}
                        onChange={e => setCourseForm(f => ({ ...f, duration_type: e.target.value }))}
                    />
                    <input
                        type="number"
                        min={1}
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 focus:outline-none focus:border-[#F4E6B2]"
                        placeholder="Total weeks"
                        value={courseForm.total_weeks}
                        onChange={e => setCourseForm(f => ({ ...f, total_weeks: Number(e.target.value || 0) }))}
                    />
                    <textarea
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 md:col-span-2 focus:outline-none focus:border-[#F4E6B2]"
                        placeholder="Syllabus"
                        rows={2}
                        value={courseForm.syllabus}
                        onChange={e => setCourseForm(f => ({ ...f, syllabus: e.target.value }))}
                    />
                    <textarea
                        className="border border-white/20 rounded-xl px-3 py-2.5 text-sm bg-white/95 md:col-span-2 focus:outline-none focus:border-[#F4E6B2]"
                        placeholder="Prerequisites"
                        rows={2}
                        value={courseForm.prerequisites}
                        onChange={e => setCourseForm(f => ({ ...f, prerequisites: e.target.value }))}
                    />
                </div>
                <div className="flex justify-end relative">
                    <Button variant="primary" className="rounded-xl shadow-lg shadow-primary/30" isLoading={saving} onClick={saveCourse}>Save Course</Button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {courses.map(c => (
                    <div key={c.id} className="relative overflow-hidden bg-linear-to-br from-white via-[#f9fcf7] to-[#f1f8ec] border border-primary/12 ring-1 ring-primary/10 rounded-[1.35rem] hover:shadow-[0_20px_40px_rgba(15,61,46,0.18)] transition-all">
                        <div className="h-1 bg-linear-to-r from-primary via-primary/70 to-accent" />
                        <div className="p-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-black text-secondary tracking-[0.01em]">{c.title}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="text-[10px] font-black tracking-[0.14em] uppercase text-accent border border-accent/30 bg-accent/10 rounded-full px-2.5 py-1">{c.category}</span>
                                    <span className="text-[10px] font-black tracking-[0.14em] uppercase text-secondary/45 border border-primary/15 bg-white/70 rounded-full px-2.5 py-1">{c.level}</span>
                                    <span className="text-[10px] font-black tracking-[0.14em] uppercase text-[#2F7D5A] border border-[#2F7D5A]/30 bg-[#2F7D5A]/10 rounded-full px-2.5 py-1">${c.price}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-black tracking-[0.14em] uppercase px-2.5 py-1 rounded-full border ${c.is_published ? 'bg-[#2F7D5A]/10 text-[#2F7D5A] border-[#2F7D5A]/30' : 'bg-neutral/20 text-secondary/40 border-neutral/30'}`}>
                                    {c.is_published ? 'Published' : 'Draft'}
                                </span>
                                <Button variant={c.is_published ? 'outline' : 'primary'} size="sm" className="rounded-xl"
                                    isLoading={publishing === c.slug}
                                    onClick={() => togglePublish(c)}>
                                    {c.is_published ? 'Unpublish' : 'Publish'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
