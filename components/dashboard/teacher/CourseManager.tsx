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
                <span className="text-[10px] font-bold tracking-[.15em] uppercase text-secondary/30">{courses.length} Created</span>
            </div>

            {/* Form */}
            <div className="bg-primary/[.03] border border-primary/10 rounded-2xl p-5 mb-5">
                <p className="text-[10px] font-bold tracking-[.15em] uppercase text-primary/50 mb-3">+ Create New Course</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary" placeholder="Title" value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} />
                    <input className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary" placeholder="Price ($)" value={courseForm.price} onChange={e => setCourseForm(f => ({ ...f, price: e.target.value }))} />
                    <textarea className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white md:col-span-2 focus:outline-none focus:border-primary" placeholder="Description" rows={2} value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} />
                    <select className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary" value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))}>
                        {['QURAN', 'TAJWEED', 'ARABIC', 'TAFSIR', 'HIFZ', 'FIQH', 'AQEEDAH'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select className="border border-neutral/40 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary" value={courseForm.level} onChange={e => setCourseForm(f => ({ ...f, level: e.target.value }))}>
                        {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                </div>
                <div className="flex justify-end">
                    <Button variant="primary" className="rounded-xl" isLoading={saving} onClick={saveCourse}>Save Course</Button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                {courses.map(c => (
                    <div key={c.id} className="bg-white border border-neutral/30 rounded-2xl overflow-hidden hover:shadow-md hover:shadow-primary/5 transition-all">
                        <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-accent" />
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-secondary">{c.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold tracking-[.1em] uppercase text-accent">{c.category}</span>
                                    <span className="text-neutral">·</span>
                                    <span className="text-[10px] font-bold tracking-[.1em] uppercase text-secondary/30">{c.level}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold tracking-[.1em] uppercase px-2.5 py-1 rounded-full ${c.is_published ? 'bg-[#2F7D5A]/10 text-[#2F7D5A]' : 'bg-neutral/20 text-secondary/40'}`}>
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
