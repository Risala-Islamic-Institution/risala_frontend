"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    level: string;
    price: string;
    created_by?: { full_name?: string; username?: string };
}

interface Enrollment {
    id: string;
    course: Course;
    status: string;
    progress_percent: number;
}

export default function StudentCoursesPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [enrolling, setEnrolling] = useState<string | null>(null);

    useEffect(() => {
        const run = async () => {
            try {
                await Promise.all([loadCourses(), loadEnrollments()]);
            } catch (e) {
                setError("Failed to load courses.");
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    const loadCourses = async () => {
        const res = await api.get<Course[]>("/courses/");
        setCourses(res);
    };

    const loadEnrollments = async () => {
        const res = await api.get<Enrollment[]>("/enrollments/");
        setEnrollments(res);
    };

    const isEnrolled = (courseId: string) => enrollments.some((e) => e.course?.id === courseId);

    const enroll = async (courseId: string) => {
        try {
            setEnrolling(courseId);
            await api.post("/enrollments/", { course_id: courseId });
            await loadEnrollments();
        } catch (e) {
            setError("Enrollment failed.");
        } finally {
            setEnrolling(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading courses...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard/student" aria-label="Back to dashboard">
                        <BrandMark />
                    </Link>
                    <Link
                        href="/dashboard/student"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        &larr; Back to dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                <div className="mb-10 md:mb-12">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                        Self-paced learning
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight text-balance">
                        Browse courses
                    </h1>
                    <p className="text-muted-foreground mt-3 max-w-2xl text-pretty">
                        Recorded courses from our scholars. Enroll once, learn at your pace.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md text-sm">
                        {error}
                    </div>
                )}

                {courses.length === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <p className="text-sm text-muted-foreground">No courses available yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.map((c) => (
                            <Card key={c.id} className="p-6 flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <Badge variant="outline" className="mb-3 uppercase text-[10px] tracking-wider">
                                            {c.level}
                                        </Badge>
                                        <h2 className="font-serif text-xl text-foreground leading-tight">
                                            {c.title}
                                        </h2>
                                        <p className="text-xs uppercase tracking-wide text-muted-foreground mt-1">
                                            {c.category}
                                        </p>
                                    </div>
                                </div>

                                {c.created_by && (
                                    <p className="text-sm text-muted-foreground">
                                        By {c.created_by.full_name || c.created_by.username || "Teacher"}
                                    </p>
                                )}

                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                    {c.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                                    <div className="font-serif text-lg text-foreground">
                                        ${Number(c.price).toFixed(2)}
                                    </div>
                                    <Button
                                        variant={isEnrolled(c.id) ? "ghost" : "primary"}
                                        size="sm"
                                        disabled={isEnrolled(c.id) || enrolling === c.id}
                                        onClick={() => enroll(c.id)}
                                    >
                                        {isEnrolled(c.id)
                                            ? "Enrolled"
                                            : enrolling === c.id
                                                ? "Enrolling..."
                                                : "Enroll"}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
