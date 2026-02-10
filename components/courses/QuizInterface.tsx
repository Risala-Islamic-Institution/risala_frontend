"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface Option {
    text: string;
    key: string;
}

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

export default function QuizInterface({ lessonId, enrollmentId, questions, onComplete }: QuizInterfaceProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ score: number; is_passed: boolean } | null>(null);

    const handleSelect = (questionId: string, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([qid, opt]) => ({
                question_id: qid,
                selected_option: opt,
            }));

            const res = await api.post<{ score: number; is_passed: boolean }>("/courses/quiz-attempts/", {
                enrollment: enrollmentId,
                lesson: lessonId,
                answers: formattedAnswers,
            });

            setResult({
                score: res.score,
                is_passed: res.is_passed,
            });
            onComplete(res.score, res.is_passed);
        } catch (error) {
            console.error("Quiz submission failed", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className={`p-6 rounded-lg text-center ${result.is_passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <h3 className="text-2xl font-bold mb-2">{result.is_passed ? "Passed!" : "Try Again"}</h3>
                <p className="text-xl">Score: {result.score}%</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold border-b pb-4">Quiz</h2>
            {questions.map((q, idx) => (
                <div key={q.id} className="p-4 border rounded hover:shadow-sm">
                    <p className="font-semibold mb-3">{idx + 1}. {q.text}</p>
                    <div className="space-y-2">
                        {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                            const optText = q[`option_${optKey.toLowerCase()}` as keyof Question];
                            if (!optText) return null;
                            return (
                                <label key={optKey} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={optKey}
                                        checked={answers[q.id] === optKey}
                                        onChange={() => handleSelect(q.id, optKey)}
                                        className="h-4 w-4 text-gold-600 focus:ring-gold-500"
                                    />
                                    <span>{optText}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
            <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(answers).length < questions.length}
                className="w-full bg-gold-600 text-white py-3 rounded-lg font-bold hover:bg-gold-700 disabled:opacity-50 transition"
            >
                {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
        </div>
    );
}
