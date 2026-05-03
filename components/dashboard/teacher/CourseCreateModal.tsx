'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StarOrnament } from '@/components/dashboard/IslamicOrnament';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Course } from '@/types';

interface CourseCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (courses: Course[]) => void;
}

const CATEGORIES = ['QURAN', 'TAJWEED', 'ARABIC', 'TAFSIR', 'HIFZ', 'FIQH', 'AQEEDAH'];
const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const DURATION_TYPES = ['FIXED', 'ONGOING'];

const CURRENCY_SYMBOL = '$';

export function CourseCreateModal({ isOpen, onClose, onSuccess }: CourseCreateModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [level, setLevel] = useState(LEVELS[0]);
    const [durationType, setDurationType] = useState(DURATION_TYPES[0]);
    const [totalWeeks, setTotalWeeks] = useState('0');
    const [price, setPrice] = useState('0.00');
    const [syllabus, setSyllabus] = useState('');
    const [prerequisites, setPrerequisites] = useState('');
    
    // File upload
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('level', level);
            formData.append('duration_type', durationType);
            formData.append('total_weeks', totalWeeks);
            formData.append('price', price);
            formData.append('syllabus', syllabus);
            formData.append('prerequisites', prerequisites);
            formData.append('is_published', 'false'); // Create as draft by default
            
            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            // Use raw fetch for FormData so the browser can set the correct multipart/form-data boundary.
            // api.post JSON-stringifies, so we call api.post with a special path via options body override.
            // Actually: api client detects FormData and skips JSON stringify — but api.post wraps body as JSON.stringify.
            // So we directly call the low-level request by using the 'put' trick — instead we pass formData via
            // the options body field, which bypasses the JSON.stringify in api.post.
            const token = getToken();
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const res = await fetch(`${baseUrl}/courses/`, {
                method: 'POST',
                headers: token ? { Authorization: `Token ${token}` } : {},
                body: formData,
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data?.detail || data?.title?.[0] || JSON.stringify(data);
                throw new Error(msg || `Error ${res.status}`);
            }

            // Refetch courses
            const updatedCourses = await api.get<Course[]>('/courses/');
            onSuccess(updatedCourses);
            onClose();
        } catch (err: any) {
            console.error('Course creation error:', err);
            setError(err.message || 'Failed to create course. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-background/80 px-4 py-8 backdrop-blur-sm sm:px-6">
            <div 
                className="relative mx-auto w-full max-w-4xl rounded-2xl p-6 sm:p-8 animate-fade-in"
                style={{
                    background: 'var(--card)',
                    border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)',
                    boxShadow: '0 25px 50px -12px color-mix(in oklab, var(--primary) 30%, transparent)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4" style={{ borderBottom: '1px solid color-mix(in oklab, var(--primary) 10%, transparent)' }}>
                    <div className="flex items-center gap-3">
                        <StarOrnament size={24} className="text-primary" />
                        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Create New Course</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg bg-red-500/10 p-4 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Left Column: Essential Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">Course Title *</label>
                                <input 
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                    style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                    placeholder="e.g. Advanced Tajweed Rules"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">Description *</label>
                                <textarea 
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full resize-none rounded-xl bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                    style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                    placeholder="Detailed overview of what the course covers..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                        style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Level</label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                        style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                    >
                                        {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Meta & Media */}
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-foreground">Course Thumbnail</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="group relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all hover:bg-primary/5"
                                    style={{ borderColor: 'color-mix(in oklab, var(--primary) 30%, transparent)' }}
                                >
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="Thumbnail preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground transition-colors group-hover:text-primary">
                                            <ImageIcon size={32} />
                                            <span className="text-xs font-medium">Click to upload image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity flex items-center justify-center group-hover:opacity-100">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                    <input 
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Price</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground font-medium">
                                            {CURRENCY_SYMBOL}
                                        </div>
                                        <input 
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full rounded-xl bg-background pl-8 pr-4 py-3 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                            style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Duration Type</label>
                                    <select
                                        value={durationType}
                                        onChange={(e) => setDurationType(e.target.value)}
                                        className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                        style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                    >
                                        {DURATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                            </div>

                            {durationType === 'FIXED' && (
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-foreground">Total Weeks</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={totalWeeks}
                                        onChange={(e) => setTotalWeeks(e.target.value)}
                                        className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                        style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Row: Detailed Text */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 pt-4" style={{ borderTop: '1px dashed color-mix(in oklab, var(--primary) 20%, transparent)' }}>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">Syllabus Overview</label>
                            <textarea 
                                value={syllabus}
                                onChange={(e) => setSyllabus(e.target.value)}
                                rows={4}
                                className="w-full resize-none rounded-xl bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                placeholder="What will students learn week by week?"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground">Prerequisites</label>
                            <textarea 
                                value={prerequisites}
                                onChange={(e) => setPrerequisites(e.target.value)}
                                rows={4}
                                className="w-full resize-none rounded-xl bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-2 focus:ring-primary/50"
                                style={{ border: '1px solid color-mix(in oklab, var(--primary) 20%, transparent)' }}
                                placeholder="Any required prior knowledge or tools..."
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isLoading || !title || !description}
                            className="min-w-[150px]"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
