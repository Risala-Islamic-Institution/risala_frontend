"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BrandMark } from "@/components/brand-mark";
import QuizInterface from "@/components/courses/QuizInterface";
import CertificateDisplay from "@/components/courses/CertificateDisplay";
import CourseReviews from "@/components/courses/CourseReviews";
import CourseAnnouncements from "@/components/courses/CourseAnnouncements";
import CourseQnA from "@/components/courses/CourseQnA";

interface Lesson {
    id: string;
    title: string;
    lesson_type: "VIDEO" | "READING" | "QUIZ";
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
    file?: string;
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

type Tab = "CONTENT" | "REVIEWS" | "QNA" | "ANNOUNCEMENTS";

const tabLabels: Record<Tab, string> = {
    CONTENT: "Content",
    ANNOUNCEMENTS: "Announcements",
    QNA: "Q&A",
    REVIEWS: "Reviews",
};

export default function StudentClassroomPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("CONTENT");
    const [loading, setLoading] = useState(true);
    const [quizQuestions, setQuizQuestions] = useState<{ id: string; text: string; option_a: string; option_b: string; option_c: string; option_d: string }[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const c = await api.get<Course>(`/courses/${slug}/`);
                setCourse(c);
                const enrolls = await api.get<Enrollment[]>(`/courses/enrollments/?course_id=${c.id}`);
                if (enrolls && enrolls.length > 0) setEnrollment(enrolls[0]);

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
        if (activeLesson && activeLesson.lesson_type === "QUIZ") {
            api.get(`/courses/quiz-questions/?lesson_id=${activeLesson.id}`)
                .then((res) => setQuizQuestions(res as typeof quizQuestions))
                .catch(console.error);
        }
    }, [activeLesson]);

    const handleLessonComplete = async (lessonId: string, score?: number) => {
        if (!enrollment) return;
        try {
            await api.post("/courses/lesson-progress/", {
                enrollment: enrollment.id,
                lesson: lessonId,
                is_completed: true,
                score,
            });
            const enrolls = await api.get<Enrollment[]>(`/courses/enrollments/?course_id=${course?.id}`);
            if (enrolls && enrolls.length > 0) setEnrollment(enrolls[0]);
        } catch (e) {
            console.error("Failed to update progress", e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading classroom...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Course not found.</p>
            </div>
        );
    }

    const currentModule = course.modules.find((m) => m.id === activeModuleId);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6 min-w-0">
                        <Link href="/dashboard/student" aria-label="Risala home" className="shrink-0">
                            <BrandMark />
                        </Link>
                        <div className="hidden sm:block min-w-0">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Classroom
                            </p>
                            <h1 className="font-serif text-base text-foreground truncate">
                                {course.title}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {enrollment && (
                            <div className="hidden md:flex items-center gap-3">
                                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Progress
                                </span>
                                <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full bg-foreground transition-all"
                                        style={{ width: `${enrollment.progress_percent}%` }}
                                    />
                                </div>
                                <span className="text-sm text-foreground tabular-nums">
                                    {enrollment.progress_percent}%
                                </span>
                            </div>
                        )}
                        <Link
                            href="/dashboard/student"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Exit
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 bg-card border-r border-border overflow-y-auto hidden md:block">
                    <div className="p-5 border-b border-border">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Curriculum
                        </p>
                    </div>
                    {course.modules.map((module, idx) => (
                        <div key={module.id} className="border-b border-border">
                            <button
                                type="button"
                                onClick={() => setActiveModuleId(module.id)}
                                className="w-full p-4 text-left hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-muted-foreground">
                                        {String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <span className="font-serif text-sm text-foreground">
                                        {module.title}
                                    </span>
                                </div>
                            </button>
                            {activeModuleId === module.id && (
                                <ul className="bg-muted/40">
                                    {module.lessons.map((lesson) => {
                                        const active = activeLesson?.id === lesson.id;
                                        return (
                                            <li key={lesson.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveLesson(lesson)}
                                                    className={`w-full px-4 py-3 pl-12 text-left text-sm flex items-center justify-between gap-3 transition-colors ${
                                                        active
                                                            ? "bg-foreground text-background"
                                                            : "text-foreground hover:bg-muted"
                                                    }`}
                                                >
                                                    <span className="truncate">{lesson.title}</span>
                                                    <span
                                                        className={`text-[10px] uppercase tracking-wider shrink-0 ${
                                                            active ? "text-background/70" : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {lesson.lesson_type}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    ))}
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
                        <div className="flex gap-6 border-b border-border mb-8 overflow-x-auto">
                            {(Object.keys(tabLabels) as Tab[]).map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === tab
                                            ? "border-foreground text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {tabLabels[tab]}
                                </button>
                            ))}
                        </div>

                        {activeTab === "CONTENT" && activeLesson && (
                            <div className="space-y-6">
                                <Card className="p-6 md:p-8">
                                    <Badge variant="outline" className="mb-4 uppercase text-[10px] tracking-wider">
                                        {activeLesson.lesson_type}
                                    </Badge>
                                    <h2 className="font-serif text-3xl text-foreground mb-6 leading-tight text-balance">
                                        {activeLesson.title}
                                    </h2>

                                    {activeLesson.lesson_type === "VIDEO" && (
                                        <div className="aspect-video bg-foreground rounded-md flex items-center justify-center text-background text-sm">
                                            Video player ({currentModule?.file})
                                        </div>
                                    )}

                                    {activeLesson.lesson_type === "READING" && (
                                        <div className="space-y-4">
                                            <div className="bg-muted border border-border rounded-md p-5">
                                                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                                                    Reading assignment
                                                </p>
                                                {currentModule?.file ? (
                                                    <p className="text-sm text-foreground leading-relaxed">
                                                        Please read{" "}
                                                        <a
                                                            href={currentModule.file}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="font-medium underline underline-offset-4"
                                                        >
                                                            the assigned file
                                                        </a>
                                                        {activeLesson.start_marker || activeLesson.end_marker ? (
                                                            <>
                                                                , section{" "}
                                                                <span className="font-medium">
                                                                    {activeLesson.start_marker}
                                                                </span>{" "}
                                                                to{" "}
                                                                <span className="font-medium">
                                                                    {activeLesson.end_marker}
                                                                </span>
                                                                .
                                                            </>
                                                        ) : (
                                                            "."
                                                        )}
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">
                                                        No file attached to this module.
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex justify-end">
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleLessonComplete(activeLesson.id)}
                                                >
                                                    Mark as read
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {activeLesson.lesson_type === "QUIZ" && enrollment && (
                                        <QuizInterface
                                            lessonId={activeLesson.id}
                                            enrollmentId={enrollment.id}
                                            questions={quizQuestions}
                                            onComplete={(score) => handleLessonComplete(activeLesson.id, score)}
                                        />
                                    )}
                                </Card>

                                {enrollment && enrollment.progress_percent === 100 && (
                                    <CertificateDisplay courseSlug={course.slug} />
                                )}
                            </div>
                        )}

                        {activeTab === "ANNOUNCEMENTS" && (
                            <CourseAnnouncements courseId={course.id} isTeacher={false} />
                        )}

                        {activeTab === "QNA" && <CourseQnA courseId={course.id} isTeacher={false} />}

                        {activeTab === "REVIEWS" && enrollment && (
                            <CourseReviews courseId={course.id} enrollmentId={enrollment.id} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
