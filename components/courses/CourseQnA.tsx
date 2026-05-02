"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Quote } from "@/components/icons";

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

const inputCls =
    "w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

export default function CourseQnA({
    courseId,
    isTeacher,
}: {
    courseId: string;
    isTeacher: boolean;
}) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [asking, setAsking] = useState(false);
    const [replyBody, setReplyBody] = useState<Record<string, string>>({});
    const [replying, setReplying] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await api.get<Question[]>(
                    `/courses/questions/?course_id=${courseId}`,
                );
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
            {!isTeacher ? (
                <section className="rounded-2xl border border-border bg-card p-5">
                    <form onSubmit={handleAsk} className="flex items-center gap-3">
                        <input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Ask a question…"
                            className={`${inputCls} flex-1`}
                            required
                        />
                        <Button
                            type="submit"
                            disabled={asking}
                            isLoading={asking}
                            variant="primary"
                            size="sm"
                        >
                            Ask
                        </Button>
                    </form>
                </section>
            ) : null}

            <section>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Questions & answers
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                    Discussion thread
                </h2>

                <div className="mt-5 space-y-3">
                    {questions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                            <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-primary">
                                <Quote className="h-5 w-5" />
                            </span>
                            <p className="font-display text-base font-semibold text-foreground">
                                No questions yet
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Be the first to start the discussion.
                            </p>
                        </div>
                    ) : (
                        questions.map((q) => (
                            <article
                                key={q.id}
                                className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-card"
                            >
                                <p className="text-sm leading-relaxed text-foreground">
                                    {q.body}
                                </p>
                                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                    {new Date(q.created_at).toLocaleDateString()}
                                </p>

                                {isTeacher ? (
                                    <div className="mt-4 border-t border-border pt-4">
                                        <textarea
                                            value={replyBody[q.id] || ""}
                                            onChange={(e) =>
                                                setReplyBody((prev) => ({
                                                    ...prev,
                                                    [q.id]: e.target.value,
                                                }))
                                            }
                                            placeholder="Write a reply…"
                                            rows={2}
                                            className={`${inputCls} resize-none`}
                                        />
                                        <div className="mt-2 flex justify-end">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleReply(q.id)}
                                                disabled={replying[q.id]}
                                                isLoading={replying[q.id]}
                                            >
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                ) : null}
                            </article>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
