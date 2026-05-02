"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
                }
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
        return (
            <Card className="p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Quiz result
                </p>
                <h3 className="font-serif text-3xl text-foreground mb-2">
                    {result.is_passed ? "Passed" : "Try again"}
                </h3>
                <p className="text-2xl font-serif text-accent">{result.score}%</p>
            </Card>
        );
    }

    return (
        <Card className="p-6 md:p-8">
            <div className="border-b border-border pb-4 mb-6">
                <h2 className="font-serif text-2xl text-foreground">Quiz</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Answer all {questions.length} questions to complete the lesson.
                </p>
            </div>

            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <div key={q.id} className="border border-border rounded-md p-5">
                        <p className="font-medium text-foreground mb-4">
                            <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                            {q.text}
                        </p>
                        <div className="space-y-2">
                            {(["A", "B", "C", "D"] as const).map((optKey) => {
                                const optText = q[`option_${optKey.toLowerCase()}` as keyof Question];
                                if (!optText) return null;
                                const selected = answers[q.id] === optKey;
                                return (
                                    <label
                                        key={optKey}
                                        className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-md border transition-colors ${
                                            selected
                                                ? "border-accent bg-accent/5"
                                                : "border-border hover:border-foreground/40 hover:bg-muted"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={optKey}
                                            checked={selected}
                                            onChange={() => handleSelect(q.id, optKey)}
                                            className="accent-accent"
                                        />
                                        <span className="text-sm text-foreground">{optText}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border flex justify-end">
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(answers).length < questions.length}
                >
                    {submitting ? "Submitting..." : "Submit quiz"}
                </Button>
            </div>
        </Card>
    );
}
