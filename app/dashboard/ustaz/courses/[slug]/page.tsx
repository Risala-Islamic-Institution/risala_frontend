"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
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
  CONTENT: "Modules & lessons",
  ANNOUNCEMENTS: "Announcements",
  QNA: "Q&A",
};

export default function ManageCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading course details…</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-destructive">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Slim sticky header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/ustaz"
            aria-label="Back to dashboard"
            className="shrink-0"
          >
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
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back
            </Link>
          </div>
        </div>
      </header>

      {/* Editorial hero */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Course management
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl text-balance">
              {course.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Manage content, communicate with students, and answer questions in
              one calm studio.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:col-span-4 lg:justify-end">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                course.is_published
                  ? "border-[color:var(--success)]/30 bg-[color:var(--success)]/10 text-[color:var(--success)]"
                  : "border-border bg-muted text-muted-foreground"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  course.is_published
                    ? "bg-[color:var(--success)]"
                    : "bg-muted-foreground"
                }`}
              />
              {course.is_published ? "Published" : "Draft"}
            </span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div
          role="tablist"
          aria-label="Course management sections"
          className="flex gap-6 overflow-x-auto border-b border-border"
        >
          {(Object.keys(tabLabels) as Tab[]).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab)}
                className={`relative whitespace-nowrap px-1 pb-3 text-sm font-medium transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tabLabels[tab]}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-px left-0 right-0 h-0.5 rounded-full transition-opacity ${
                    active ? "bg-primary opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {activeTab === "CONTENT" && (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-6 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Workflow
                </p>
                <h2 className="mt-1 font-display text-base font-semibold leading-tight text-foreground">
                  How to add content
                </h2>
              </div>
              <ol className="space-y-3 p-6 text-sm leading-relaxed text-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-background font-display text-[11px] font-semibold tabular-nums text-foreground">
                    1
                  </span>
                  <span>
                    Upload a course material file (PDF, video, etc.) to a module.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-background font-display text-[11px] font-semibold tabular-nums text-foreground">
                    2
                  </span>
                  <span>
                    Use the &ldquo;Dissect&rdquo; tool to break that file into multiple
                    lessons.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-background font-display text-[11px] font-semibold tabular-nums text-foreground">
                    3
                  </span>
                  <span>Or create separate lessons manually.</span>
                </li>
              </ol>
            </div>

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
