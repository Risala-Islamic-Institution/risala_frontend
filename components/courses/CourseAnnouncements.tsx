"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Announcement {
    id: string;
    title: string;
    body: string;
    created_at: string;
}

export default function CourseAnnouncements({ courseId, isTeacher }: { courseId: string; isTeacher: boolean }) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get<Announcement[]>(`/courses/announcements/?course_id=${courseId}`);
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
        <div className="space-y-8">
            {isTeacher && (
                <Card className="p-6">
                    <h4 className="font-serif text-xl text-foreground mb-4">Post a new announcement</h4>
                    <form onSubmit={handlePost} className="space-y-3">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                            required
                        />
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Message"
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                            required
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={posting} variant="primary" size="sm">
                                {posting ? "Posting..." : "Post announcement"}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No announcements yet.</p>
                ) : (
                    announcements.map((a) => (
                        <Card key={a.id} className="p-5">
                            <div className="flex items-baseline justify-between gap-4 mb-2">
                                <h4 className="font-serif text-lg text-foreground">{a.title}</h4>
                                <span className="text-xs text-muted-foreground shrink-0">
                                    {new Date(a.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{a.body}</p>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
