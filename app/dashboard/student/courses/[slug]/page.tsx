"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/brand-mark";
import QuizInterface from "@/components/courses/QuizInterface";
import CertificateDisplay from "@/components/courses/CertificateDisplay";
import CourseReviews from "@/components/courses/CourseReviews";
import CourseAnnouncements from "@/components/courses/CourseAnnouncements";
import CourseQnA from "@/components/courses/CourseQnA";
import { BookOpen, Mic, Layers } from "@/components/icons";

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

const TAB_LABELS: Record<Tab, string> = {
    CONTENT: "Content",
    ANNOUNCEMENTS: "Announcements",
    QNA: "Q&A",
    REVIEWS: "Reviews",
};

const LESSON_TYPE_META: Record<Lesson["lesson_type"], { label: string; Icon: typeof BookOpen }> = {
    VIDEO: { label: "Video lesson", Icon: Mic },
    READING: { label: "Reading", Icon: BookOpen },
    QUIZ: { label: "Quiz", Icon: Layers },
};

export default function StudentClassroomPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("CONTENT");
    const [loading, setLoading] = useState(true);
    const [quizQuestions, setQuizQuestions] = useState<
        { id: string; text: string; option_a: string; option_b: string; option_c: string; option_d: string }[]
    >([]);

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
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Loading classroom
                </p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-sm text-muted-foreground">Course not found.</p>
            </div>
        );
    }

    const currentModule = course.modules.find((m) => m.id === activeModuleId);
    const lessonMeta = activeLesson ? LESSON_TYPE_META[activeLesson.lesson_type] : null;
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Slim header with progress strip */}
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-5">
                        <Link href="/dashboard/student" aria-label="Risala home" className="shrink-0">
                            <BrandMark />
                        </Link>
                        <div className="hidden min-w-0 sm:block">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                                Classroom
                            </p>
                            <h1 className="truncate font-display text-sm font-semibold text-foreground">
                                {course.title}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        {enrollment ? (
                            <div className="hidden items-center gap-3 md:flex">
                                <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                    Progress
                                </span>
                                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                                    <span
                                        aria-hidden
                                        className="block h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${enrollment.progress_percent}%` }}
                                    />
                                </div>
                                <span className="font-display text-sm font-semibold tabular-nums text-foreground">
                                    {enrollment.progress_percent}%
                                </span>
                            </div>
                        ) : null}
                        <Link
                            href="/dashboard/student"
                            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                        >
                            Exit
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Curriculum sidebar */}
                <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-border bg-card md:block">
                    <div className="border-b border-border px-5 py-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                            Curriculum
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {course.modules.length} modules · {totalLessons} lessons
                        </p>
                    </div>
                    {course.modules.map((module, idx) => {
                        const isActive = activeModuleId === module.id;
                        return (
                            <div key={module.id} className="border-b border-border">
                                <button
                                    type="button"
                                    onClick={() => setActiveModuleId(module.id)}
                                    aria-expanded={isActive}
                                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted"
                                >
                                    <span className="font-display text-xs font-semibold tabular-nums text-muted-foreground">
                                        {String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <span className="flex-1 truncate font-display text-sm font-semibold text-foreground">
                                        {module.title}
                                    </span>
                                </button>
                                {isActive ? (
                                    <ul className="bg-muted/40 pb-2">
                                        {module.lessons.map((lesson) => {
                                            const active = activeLesson?.id === lesson.id;
                                            const Meta = LESSON_TYPE_META[lesson.lesson_type];
                                            return (
                                                <li key={lesson.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveLesson(lesson)}
                                                        aria-current={active ? "true" : undefined}
                                                        className={`flex w-full items-center gap-3 px-5 py-2.5 pl-12 text-left text-sm transition-colors ${
                                                            active
                                                                ? "bg-primary text-primary-foreground"
                                                                : "text-foreground/85 hover:bg-card"
                                                        }`}
                                                    >
                                                        <Meta.Icon
                                                            className={`h-3.5 w-3.5 shrink-0 ${
                                                                active
                                                                    ? "text-primary-foreground/80"
                                                                    : "text-muted-foreground"
                                                            }`}
                                                        />
                                                        <span className="flex-1 truncate">{lesson.title}</span>
                                                        {lesson.is_completed ? (
                                                            <span
                                                                aria-hidden
                                                                className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                                                    active
                                                                        ? "text-primary-foreground/70"
                                                                        : "text-[color:var(--success)]"
                                                                }`}
                                                            >
                                                                Done
                                                            </span>
                                                        ) : null}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : null}
                            </div>
                        );
                    })}
                </aside>

                {/* Main classroom */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                        {/* Tabs */}
                        <div
                            role="tablist"
                            aria-label="Course sections"
                            className="mb-8 flex items-center gap-6 overflow-x-auto border-b border-border no-scrollbar"
                        >
                            {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => {
                                const active = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                                            active
                                                ? "border-primary text-foreground"
                                                : "border-transparent text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {TAB_LABELS[tab]}
                                    </button>
                                );
                            })}
                        </div>

                        {activeTab === "CONTENT" && activeLesson ? (
                            <div className="space-y-6">
                                <article className="overflow-hidden rounded-2xl border border-border bg-card">
                                    <header className="border-b border-border bg-[color:var(--primary)]/[0.04] px-6 py-5">
                                        <div className="flex items-center gap-2.5">
                                            {lessonMeta ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
                                                    <lessonMeta.Icon className="h-3 w-3 text-primary" />
                                                    {lessonMeta.label}
                                                </span>
                                            ) : null}
                                            {activeLesson.duration_minutes ? (
                                                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                                    {activeLesson.duration_minutes} min
                                                </span>
                                            ) : null}
                                        </div>
                                        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground text-balance">
                                            {activeLesson.title}
                                        </h2>
                                    </header>

                                    <div className="px-6 py-6 md:px-8 md:py-8">
                                        {activeLesson.lesson_type === "VIDEO" ? (
                                            <div className="aspect-video overflow-hidden rounded-md border border-border bg-secondary text-secondary-foreground">
                                                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                                                    <Mic className="h-6 w-6 text-accent" />
                                                    <p className="text-sm font-medium">Video player</p>
                                                    {currentModule?.file ? (
                                                        <p className="text-xs opacity-65">{currentModule.file}</p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : null}

                                        {activeLesson.lesson_type === "READING" ? (
                                            <div className="space-y-4">
                                                <div className="rounded-md border border-border bg-muted px-5 py-4">
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                                        Reading assignment
                                                    </p>
                                                    {currentModule?.file ? (
                                                        <p className="mt-2 text-sm leading-relaxed text-foreground">
                                                            Please read{" "}
                                                            <a
                                                                href={currentModule.file}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="font-medium text-primary underline underline-offset-4"
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
                                                        <p className="mt-2 text-sm italic text-muted-foreground">
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
                                        ) : null}

                                        {activeLesson.lesson_type === "QUIZ" && enrollment ? (
                                            <QuizInterface
                                                lessonId={activeLesson.id}
                                                enrollmentId={enrollment.id}
                                                questions={quizQuestions}
                                                onComplete={(score) => handleLessonComplete(activeLesson.id, score)}
                                            />
                                        ) : null}
                                    </div>
                                </article>

                                {enrollment && enrollment.progress_percent === 100 ? (
                                    <CertificateDisplay courseSlug={course.slug} />
                                ) : null}
                            </div>
                        ) : null}

                        {activeTab === "ANNOUNCEMENTS" ? (
                            <CourseAnnouncements courseId={course.id} isTeacher={false} />
                        ) : null}

                        {activeTab === "QNA" ? (
                            <CourseQnA courseId={course.id} isTeacher={false} />
                        ) : null}

                        {activeTab === "REVIEWS" && enrollment ? (
                            <CourseReviews courseId={course.id} enrollmentId={enrollment.id} />
                        ) : null}
                    </div>
                </main>
            </div>
        </div>
    );
}
