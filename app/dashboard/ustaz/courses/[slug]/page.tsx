"use client";

import React, { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import ModuleManager from '@/components/dashboard/teacher/ModuleManager';
import CourseAnnouncements from '@/components/courses/CourseAnnouncements';
import CourseQnA from '@/components/courses/CourseQnA';

interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    is_published: boolean;
}

export default function ManageCoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'CONTENT' | 'ANNOUNCEMENTS' | 'QNA'>('CONTENT');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Fetch course details by slug
                const res = await api.get<Course>(`/courses/${slug}/`);
                setCourse(res);
            } catch (error) {
                console.error("Failed to load course", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [slug]);

    if (loading) return <div className="p-8">Loading course details...</div>;
    if (!course) return <div className="p-8 text-red-500">Course not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                        <p className="text-gray-500 text-sm">Manage Content & Interaction</p>
                    </div>
                    <div className="space-x-4">
                        <a href="/dashboard/ustaz" className="text-gray-600 hover:text-gray-900">Back to Dashboard</a>
                        <Button onClick={() => window.open(`/dashboard/student/courses/${course.slug}`, '_blank')} variant="outline">
                            View as Student
                        </Button>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 mt-4 flex space-x-6">
                    <button
                        onClick={() => setActiveTab('CONTENT')}
                        className={`pb-3 px-1 border-b-2 font-medium ${activeTab === 'CONTENT' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Modules & Lessons
                    </button>
                    <button
                        onClick={() => setActiveTab('ANNOUNCEMENTS')}
                        className={`pb-3 px-1 border-b-2 font-medium ${activeTab === 'ANNOUNCEMENTS' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Announcements
                    </button>
                    <button
                        onClick={() => setActiveTab('QNA')}
                        className={`pb-3 px-1 border-b-2 font-medium ${activeTab === 'QNA' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Q & A
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {activeTab === 'CONTENT' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                            <h3 className="font-bold text-blue-900">How to add content:</h3>
                            <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
                                <li>Upload a course material file (PDF, Video, etc) to a Module.</li>
                                <li>Use the "Dissect" tool to break that file into multiple Lessons (e.g. "Chapter 1: Pages 1-10").</li>
                                <li>Or create separate lessons manually.</li>
                            </ul>
                        </div>
                        <ModuleManager courseId={course.id} />
                    </div>
                )}

                {activeTab === 'ANNOUNCEMENTS' && (
                    <div className="max-w-3xl">
                        <h2 className="text-xl font-bold mb-6">Course Announcements</h2>
                        <CourseAnnouncements courseId={course.id} isTeacher={true} />
                    </div>
                )}

                {activeTab === 'QNA' && (
                    <div className="max-w-3xl">
                        <h2 className="text-xl font-bold mb-6">Student Questions</h2>
                        <CourseQnA courseId={course.id} isTeacher={true} />
                    </div>
                )}
            </main>
        </div>
    );
}
