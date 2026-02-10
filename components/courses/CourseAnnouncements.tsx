"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Announcement {
    id: string;
    title: string;
    body: string;
    created_at: string;
}

export default function CourseAnnouncements({ courseId, isTeacher }: { courseId: string; isTeacher: boolean }) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // Teacher Form State
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                // Need to filter by course. Currently CourseAnnouncementViewSet filters by user logic.
                // Depending on backend implementation, we might need to adjust viewset to filter by course_id for students.
                // Assuming query param support I requested in plan check/update.
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
                body
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
            {isTeacher && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-2">Post Announcement</h4>
                    <form onSubmit={handlePost} className="space-y-3">
                        <input
                            value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full p-2 border rounded"
                            required
                        />
                        <textarea
                            value={body} onChange={e => setBody(e.target.value)}
                            placeholder="Message"
                            className="w-full p-2 border rounded"
                            rows={3}
                            required
                        />
                        <button type="submit" disabled={posting} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700">
                            {posting ? "Posting..." : "Post"}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {announcements.map(a => (
                    <div key={a.id} className="p-4 bg-white border rounded shadow-sm">
                        <h4 className="font-bold text-lg">{a.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{new Date(a.created_at).toLocaleDateString()}</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{a.body}</p>
                    </div>
                ))}
                {announcements.length === 0 && <p className="text-gray-500 italic">No announcements yet.</p>}
            </div>
        </div>
    );
}
