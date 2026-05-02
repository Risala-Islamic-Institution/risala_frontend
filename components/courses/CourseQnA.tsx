"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Answer {
    id: string;
    body: string;
    teacher: string;
    created_at: string;
}

interface Question {
    id: string;
    body: string;
    student: string;
    created_at: string;
    answers?: Answer[];
}

export default function CourseQnA({ courseId, isTeacher }: { courseId: string; isTeacher: boolean }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [asking, setAsking] = useState(false);
    const [replyBody, setReplyBody] = useState<Record<string, string>>({});
    const [replying, setReplying] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get<Question[]>(`/courses/questions/?course_id=${courseId}`);
                if (Array.isArray(res)) setQuestions(res);
            } catch (e) {
                console.error(e);
            }
        };
        fetchQuestions();
    }, [courseId]);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        setAsking(true);
        try {
            const q = await api.post<Question>("/courses/questions/", {
                course: courseId,
                body: newQuestion,
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
        setReplying((prev) => ({ ...prev, [questionId]: true }));
        try {
            await api.post("/courses/answers/", {
                question: questionId,
                body: replyBody[questionId],
            });
            setReplyBody((prev) => ({ ...prev, [questionId]: "" }));
        } catch (error) {
            console.error(error);
        } finally {
            setReplying((prev) => ({ ...prev, [questionId]: false }));
        }
    };

    return (
        <div className="space-y-6">
            {!isTeacher && (
                <Card className="p-5">
                    <form onSubmit={handleAsk} className="flex gap-3">
                        <input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                        <Button type="submit" disabled={asking} variant="primary" size="sm">
                            {asking ? "Sending..." : "Ask"}
                        </Button>
                    </form>
                </Card>
            )}

            <div className="space-y-3">
                {questions.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No questions yet.</p>
                ) : (
                    questions.map((q) => (
                        <Card key={q.id} className="p-5">
                            <p className="text-foreground leading-relaxed">{q.body}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {new Date(q.created_at).toLocaleDateString()}
                            </p>

                            {isTeacher && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <textarea
                                        value={replyBody[q.id] || ""}
                                        onChange={(e) =>
                                            setReplyBody((prev) => ({ ...prev, [q.id]: e.target.value }))
                                        }
                                        placeholder="Write a reply..."
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleReply(q.id)}
                                            disabled={replying[q.id]}
                                        >
                                            {replying[q.id] ? "Sending..." : "Reply"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
