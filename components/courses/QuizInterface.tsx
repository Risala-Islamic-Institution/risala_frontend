"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Verified } from "@/components/icons";

interface Question {
    id: string;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
}

interface QuizInterfaceProps {
    lessonId: string;
    enrollmentId: string;
    questions: Question[];
    onComplete: (score: number, passed: boolean) => void;
}

export default function QuizInterface({
    lessonId,
    enrollmentId,
    questions,
    onComplete,
}: QuizInterfaceProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ score: number; is_passed: boolean } | null>(null);

    const handleSelect = (questionId: string, option: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([qid, opt]) => ({
                question_id: qid,
                selected_option: opt,
            }));

            const res = await api.post<{ score: number; is_passed: boolean }>(
                "/courses/quiz-attempts/",
                {
                    enrollment: enrollmentId,
                    lesson: lessonId,
                    answers: formattedAnswers,
                },
            );

            setResult({ score: res.score, is_passed: res.is_passed });
            onComplete(res.score, res.is_passed);
        } catch (error) {
            console.error("Quiz submission failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        const pct = Math.round(result.score);
        return (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Quiz result
                </p>
                <p className="mt-3 font-display text-5xl font-semibold tabular-nums text-foreground">
                    {pct}%
                </p>
                <div
                    className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium ${
                        result.is_passed
                            ? "border-[color:var(--success)]/25 bg-[color:var(--success)]/10 text-[color:var(--success)]"
                            : "border-[color:var(--warning)]/30 bg-[color:var(--warning)]/15 text-[#8a6326]"
                    }`}
                >
                    {result.is_passed ? <Verified className="h-4 w-4" /> : null}
                    {result.is_passed ? "Lesson passed" : "Try again"}
                </div>
            </div>
        );
    }

    const allAnswered = Object.keys(answers).length >= questions.length;

    return (
        <div className="space-y-6">
            <header className="border-b border-border pb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Quiz
                </p>
                <h3 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                    Answer all {questions.length} questions to complete the lesson.
                </h3>
            </header>

            <div className="space-y-4">
                {questions.map((q, idx) => (
                    <article
                        key={q.id}
                        className="rounded-2xl border border-border bg-card p-5"
                    >
                        <div className="flex items-baseline gap-2.5">
                            <span className="font-display text-xs font-semibold tabular-nums text-muted-foreground">
                                {String(idx + 1).padStart(2, "0")}
                            </span>
                            <p className="font-display text-base font-semibold leading-snug text-foreground">
                                {q.text}
                            </p>
                        </div>
                        <div className="mt-4 space-y-2">
                            {(["A", "B", "C", "D"] as const).map((optKey) => {
                                const optText = q[`option_${optKey.toLowerCase()}` as keyof Question];
                                if (!optText) return null;
                                const selected = answers[q.id] === optKey;
                                return (
                                    <label
                                        key={optKey}
                                        className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors ${
                                            selected
                                                ? "border-primary bg-[color:var(--primary)]/5 text-foreground"
                                                : "border-border bg-card text-foreground hover:border-foreground/30 hover:bg-muted"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={optKey}
                                            checked={selected}
                                            onChange={() => handleSelect(q.id, optKey)}
                                            className="h-4 w-4 accent-primary"
                                        />
                                        <span className="flex-1">{optText}</span>
                                        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                            {optKey}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </article>
                ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-5">
                <span className="text-xs text-muted-foreground">
                    {Object.keys(answers).length} of {questions.length} answered
                </span>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={submitting || !allAnswered}
                    isLoading={submitting}
                >
                    Submit quiz
                </Button>
            </div>
        </div>
    );
}
