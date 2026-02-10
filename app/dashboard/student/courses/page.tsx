"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

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

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.course?.id === courseId);
  };

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
        <div className="text-primary">Loading courses…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold">Browse Courses</h1>
          <p className="text-white/80">Available published courses you can enroll in</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral p-6 shadow-sm text-secondary/60">
            No courses available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-neutral p-6 shadow-sm flex flex-col gap-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-primary font-semibold text-lg">{c.title}</h2>
                    <span className="text-secondary/60 text-sm uppercase">{c.level}</span>
                  </div>
                  <div className="text-secondary/70 text-sm">Category: {c.category}</div>
                  {c.created_by ? (
                    <div className="text-secondary/70 text-sm">By {c.created_by.full_name || c.created_by.username || "Teacher"}</div>
                  ) : null}
                </div>
                <div className="text-secondary/80 text-sm line-clamp-3">{c.description}</div>
                <div className="flex items-center justify-between">
                  <div className="text-accent font-medium">{Number(c.price).toFixed(2)} USD</div>
                  <Button
                    variant={isEnrolled(c.id) ? "secondary" : "accent"}
                    disabled={isEnrolled(c.id) || enrolling === c.id}
                    isLoading={enrolling === c.id}
                    onClick={() => enroll(c.id)}
                  >
                    {isEnrolled(c.id) ? "Enrolled" : "Enroll"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {error && (
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="p-3 bg-error/10 text-error rounded-lg">{error}</div>
        </div>
      )}
    </div>
  );
}
