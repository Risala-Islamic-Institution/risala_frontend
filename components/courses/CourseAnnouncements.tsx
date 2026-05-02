"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Bell } from "@/components/icons";

interface Announcement {
    id: string;
    title: string;
    body: string;
    created_at: string;
}

const inputCls =
    "w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

export default function CourseAnnouncements({
    courseId,
    isTeacher,
}: {
    courseId: string;
    isTeacher: boolean;
}) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get<Announcement[]>(
                    `/courses/announcements/?course_id=${courseId}`,
                );
                if (Array.isArray(res)) setAnnouncements(res);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAnnouncements();
    }, [courseId]);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setPosting(true);
        try {
            const newPost = await api.post<Announcement>("/courses/announcements/", {
                course: courseId,
                title,
                body,
            });
            setAnnouncements([newPost, ...announcements]);
            setTitle("");
            setBody("");
        } catch (error) {
            console.error("Failed to post", error);
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="space-y-6">
            {isTeacher ? (
                <section className="rounded-2xl border border-border bg-card p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                        New announcement
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight text-foreground">
                        Share an update with your class.
                    </h3>
                    <form onSubmit={handlePost} className="mt-5 space-y-3">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className={inputCls}
                            required
                        />
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Message"
                            rows={3}
                            className={`${inputCls} resize-none`}
                            required
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={posting}
                                isLoading={posting}
                                variant="primary"
                                size="sm"
                            >
                                Post announcement
                            </Button>
                        </div>
                    </form>
                </section>
            ) : null}

            <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Latest
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                    Course announcements
                </h2>

                <div className="mt-5 space-y-3">
                    {announcements.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                            <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-primary">
                                <Bell className="h-5 w-5" />
                            </span>
                            <p className="font-display text-base font-semibold text-foreground">
                                No announcements yet
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Updates from your Ustaz will appear here.
                            </p>
                        </div>
                    ) : (
                        announcements.map((a) => (
                            <article
                                key={a.id}
                                className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-card"
                            >
                                <div className="flex items-baseline justify-between gap-4">
                                    <h4 className="font-display text-lg font-semibold leading-tight text-foreground">
                                        {a.title}
                                    </h4>
                                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                        {new Date(a.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                                    {a.body}
                                </p>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
