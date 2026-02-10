"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Answer {
    id: string;
    body: string;
    teacher: string; // ID or object
    created_at: string;
}

interface Question {
    id: string;
    body: string;
    student: string;
    created_at: string;
    answers?: Answer[]; // Assuming we nest or fetch separately
}

export default function CourseQnA({ courseId, isTeacher }: { courseId: string; isTeacher: boolean }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [asking, setAsking] = useState(false);

    // For answering
    const [replyBody, setReplyBody] = useState<Record<string, string>>({});
    const [replying, setReplying] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchQuestions = async () => {
            // Mock fetch. API needs to support filtering by course_id which CourseQuestionViewSet does.
            try {
                const res = await api.get<Question[]>(`/courses/questions/?course_id=${courseId}`);
                // We also need to fetch answers. 
                // Optimized way: expand questions with answers or fetch answers separately.
                // For MVP, assuming questions list doesn't include answers deep nested, we might look for a "thread" endpoint.
                // Let's assume for now we list questions and if I am a teacher I can click to reply.
                if (Array.isArray(res)) setQuestions(res);
            } catch (e) { console.error(e); }
        };
        fetchQuestions();
    }, [courseId]);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        setAsking(true);
        try {
            const q = await api.post<Question>("/courses/questions/", {
                course: courseId,
                body: newQuestion
            });
            setQuestions([q, ...questions]);
            setNewQuestion("");
        } catch (error) {
            console.error(error);
        } finally {
            setAsking(false);
        }
    };

    const handleReply = async (questionId: string) => {
        setReplying(prev => ({ ...prev, [questionId]: true }));
        try {
            await api.post("/courses/answers/", {
                question: questionId,
                body: replyBody[questionId]
            });
            // Refresh logic or optimistic update needed here
            alert("Reply sent");
            setReplyBody(prev => ({ ...prev, [questionId]: "" }));
        } catch (error) {
            console.error(error);
        } finally {
            setReplying(prev => ({ ...prev, [questionId]: false }));
        }
    };

    return (
        <div className="space-y-8">
            {/* Student Ask Form */}
            {!isTeacher && (
                <form onSubmit={handleAsk} className="flex gap-2">
                    <input
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 p-2 border rounded"
                        required
                    />
                    <button disabled={asking} type="submit" className="bg-gold-600 text-white px-4 rounded hover:bg-gold-700">
                        Ask
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {questions.map(q => (
                    <div key={q.id} className="p-4 bg-gray-50 rounded border">
                        <p className="font-medium text-gray-900">{q.body}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(q.created_at).toLocaleDateString()}</p>

                        {/* Answers/Replies Section */}
                        {/* Note: In a real app we'd map answers here. */}

                        {isTeacher && (
                            <div className="mt-3 pl-4 border-l-2 border-gray-200">
                                <textarea
                                    value={replyBody[q.id] || ""}
                                    onChange={e => setReplyBody(prev => ({ ...prev, [q.id]: e.target.value }))}
                                    placeholder="Write a reply..."
                                    className="w-full text-sm p-1 border rounded"
                                />
                                <button
                                    onClick={() => handleReply(q.id)}
                                    disabled={replying[q.id]}
                                    className="text-xs bg-slate-800 text-white px-2 py-1 rounded mt-1"
                                >
                                    Reply
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
