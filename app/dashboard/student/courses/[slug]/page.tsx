"use client";

import React, { useEffect, useState, use } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import QuizInterface from '@/components/courses/QuizInterface';
import CertificateDisplay from '@/components/courses/CertificateDisplay';
import CourseReviews from '@/components/courses/CourseReviews';
import CourseAnnouncements from '@/components/courses/CourseAnnouncements';
import CourseQnA from '@/components/courses/CourseQnA';

interface Lesson {
    id: string;
    title: string;
    lesson_type: 'VIDEO' | 'READING' | 'QUIZ';
    content_reference: string;
    duration_minutes: number;
    start_marker?: string;
    end_marker?: string;
    is_completed?: boolean;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
    file?: string; // The base file if lessons are dissected
}

interface Course {
    id: string;
    title: string;
    slug: string;
    modules: Module[];
}

interface Enrollment {
    id: string;
    progress_percent: number;
    status: string;
}

export default function StudentClassroomPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'CONTENT' | 'REVIEWS' | 'QNA' | 'ANNOUNCEMENTS'>('CONTENT');
    const [loading, setLoading] = useState(true);

    // Quiz Questions State
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Get Course details (expanded with modules/lessons)
                // The default /courses/{slug}/ might not return deep nested logic unless configured.
                // Assuming serializer supports it as per my previous checks.
                const c = await api.get<Course>(`/courses/${slug}/`);
                setCourse(c);

                // 2. Get Enrollment to track progress
                // We need to find the enrollment for this course.
                // Ideally backend provides an endpoint /courses/{slug}/enrollment/ or we filter list.
                const enrolls = await api.get<Enrollment[]>(`/courses/enrollments/?course_id=${c.id}`); // Assuming filter works
                if (enrolls && enrolls.length > 0) setEnrollment(enrolls[0]);

                // Set initial active lesson
                if (c.modules.length > 0 && c.modules[0].lessons.length > 0) {
                    setActiveModuleId(c.modules[0].id);
                    setActiveLesson(c.modules[0].lessons[0]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [slug]);

    useEffect(() => {
        if (activeLesson && activeLesson.lesson_type === 'QUIZ') {
            // Fetch questions
            api.get(`/courses/quiz-questions/?lesson_id=${activeLesson.id}`)
                .then((res: any) => setQuizQuestions(res))
                .catch(console.error);
        }
    }, [activeLesson]);

    const handleLessonComplete = async (lessonId: string, score?: number, passed?: boolean) => {
        if (!enrollment) return;
        try {
            // Update progress
            await api.post("/courses/lesson-progress/", {
                enrollment: enrollment.id,
                lesson: lessonId,
                is_completed: true,
                score: score
            });
            // Refresh enrollment to get new progress %
            const enrolls = await api.get<Enrollment[]>(`/courses/enrollments/?course_id=${course?.id}`);
            if (enrolls && enrolls.length > 0) setEnrollment(enrolls[0]);

            // Allow moving to next lesson logic here if needed
        } catch (e) {
            console.error("Failed to update progress", e);
        }
    };

    if (loading) return <div className="p-8">Loading classroom...</div>;
    if (!course) return <div className="p-8">Course not found.</div>;

    const currentModule = course.modules.find(m => m.id === activeModuleId);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-20">
                <div>
                    <h1 className="font-bold text-lg">{course.title}</h1>
                    {enrollment && (
                        <div className="text-sm text-gray-500">
                            Progress: {enrollment.progress_percent}%
                            {enrollment.progress_percent === 100 && <span className="text-green-600 font-bold ml-2">COMPLETED</span>}
                        </div>
                    )}
                </div>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard/student'}>Exit</Button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Modules & Lessons */}
                <aside className="w-80 bg-white border-r overflow-y-auto hidden md:block">
                    {course.modules.map(module => (
                        <div key={module.id} className="border-b">
                            <div
                                className="p-4 bg-gray-50 font-semibold cursor-pointer hover:bg-gray-100"
                                onClick={() => setActiveModuleId(module.id)}
                            >
                                {module.title}
                            </div>
                            {activeModuleId === module.id && (
                                <ul>
                                    {module.lessons.map(lesson => (
                                        <li
                                            key={lesson.id}
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`p - 3 pl - 6 cursor - pointer text - sm flex justify - between items - center ${activeLesson?.id === lesson.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'hover:bg-gray-50'} `}
                                        >
                                            <span>{lesson.title}</span>
                                            {/* We rely on local state or refreshed data to show checks. For MVP just show generic icon */}
                                            <span className="text-xs text-gray-400">{lesson.lesson_type}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Tabs */}
                    <div className="flex space-x-4 border-b mb-6">
                        {['CONTENT', 'ANNOUNCEMENTS', 'QNA', 'REVIEWS'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb - 2 px - 1 text - sm font - medium ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-gray-500'} `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'CONTENT' && activeLesson && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-white p-6 rounded shadow-sm">
                                <h2 className="text-2xl font-bold mb-4">{activeLesson.title}</h2>

                                {/* Content Rendering Logic */}
                                {activeLesson.lesson_type === 'VIDEO' && (
                                    <div className="aspect-video bg-black flex items-center justify-center text-white">
                                        {/* Placeholder for video player */}
                                        Video Player Placeholder (File: {currentModule?.file})
                                    </div>
                                )}

                                {activeLesson.lesson_type === 'READING' && (
                                    <div className="prose max-w-none">
                                        <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-4">
                                            <h4 className="font-bold text-yellow-800">Reading Assignment</h4>
                                            {currentModule?.file ? (
                                                <p className="text-sm">
                                                    Please read <strong>{currentModule.file}</strong>.<br />
                                                    Section: <strong>{activeLesson.start_marker}</strong> to <strong>{activeLesson.end_marker}</strong>.
                                                </p>
                                            ) : (
                                                <p className="text-sm">No file attached to module.</p>
                                            )}
                                            <Button
                                                className="mt-4"
                                                onClick={() => handleLessonComplete(activeLesson.id)}
                                            >
                                                Mark as Read
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {activeLesson.lesson_type === 'QUIZ' && enrollment && (
                                    <QuizInterface
                                        lessonId={activeLesson.id}
                                        enrollmentId={enrollment.id}
                                        questions={quizQuestions}
                                        onComplete={(score, passed) => handleLessonComplete(activeLesson.id, score, passed)}
                                    />
                                )}
                            </div>

                            {enrollment && enrollment.progress_percent === 100 && (
                                <CertificateDisplay courseSlug={course.slug} />
                            )}
                        </div>
                    )}

                    {activeTab === 'ANNOUNCEMENTS' && (
                        <div className="max-w-3xl mx-auto">
                            <CourseAnnouncements courseId={course.id} isTeacher={false} />
                        </div>
                    )}

                    {activeTab === 'QNA' && (
                        <div className="max-w-3xl mx-auto">
                            <CourseQnA courseId={course.id} isTeacher={false} />
                        </div>
                    )}

                    {activeTab === 'REVIEWS' && enrollment && (
                        <div className="max-w-3xl mx-auto">
                            <CourseReviews courseId={course.id} enrollmentId={enrollment.id} />
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}
