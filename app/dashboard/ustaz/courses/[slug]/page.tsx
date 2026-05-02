"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BrandMark } from "@/components/brand-mark";
import ModuleManager from "@/components/dashboard/teacher/ModuleManager";
import CourseAnnouncements from "@/components/courses/CourseAnnouncements";
import CourseQnA from "@/components/courses/CourseQnA";

interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    is_published: boolean;
}

type Tab = "CONTENT" | "ANNOUNCEMENTS" | "QNA";

const tabLabels: Record<Tab, string> = {
    CONTENT: "Modules & Lessons",
    ANNOUNCEMENTS: "Announcements",
    QNA: "Q&A",
};

export default function ManageCoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("CONTENT");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading course details...</p>
            </div>
        );
    }
    if (!course) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-sm text-destructive">Course not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
                <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard/ustaz" aria-label="Back to dashboard" className="shrink-0">
                        <BrandMark />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                                window.open(`/dashboard/student/courses/${course.slug}`, "_blank")
                            }
                        >
                            View as student
                        </Button>
                        <Link
                            href="/dashboard/ustaz"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            &larr; Back
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-16">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Course management
                </p>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight text-balance">
                    {course.title}
                </h1>
                <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
                    Manage content, communicate with students, and answer questions.
                </p>

                <div className="flex gap-6 border-b border-border mt-10 mb-10 overflow-x-auto">
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
            </div>

            <main className="max-w-6xl mx-auto px-6">
                {activeTab === "CONTENT" && (
                    <div className="space-y-6">
                        <Card className="p-6 bg-muted">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                                How to add content
                            </p>
                            <ul className="text-sm text-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                                <li>Upload a course material file (PDF, video, etc.) to a module.</li>
                                <li>
                                    Use the &ldquo;Dissect&rdquo; tool to break that file into multiple
                                    lessons.
                                </li>
                                <li>Or create separate lessons manually.</li>
                            </ul>
                        </Card>
                        <ModuleManager courseId={course.id} />
                    </div>
                )}

                {activeTab === "ANNOUNCEMENTS" && (
                    <div className="max-w-3xl">
                        <CourseAnnouncements courseId={course.id} isTeacher={true} />
                    </div>
                )}

                {activeTab === "QNA" && (
                    <div className="max-w-3xl">
                        <CourseQnA courseId={course.id} isTeacher={true} />
                    </div>
                )}
            </main>
        </div>
    );
}
