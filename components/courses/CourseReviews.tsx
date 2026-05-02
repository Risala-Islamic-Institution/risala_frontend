"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Star, Verified } from "@/components/icons";

const inputCls =
    "w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

interface CourseReviewsProps {
    courseId: string;
    enrollmentId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CourseReviews({ courseId, enrollmentId }: CourseReviewsProps) {
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!enrollmentId) return;
        setSubmitting(true);
        try {
            await api.post("/courses/reviews/", {
                enrollment: enrollmentId,
                rating: newRating,
                comment: newComment,
            });
            setSubmitted(true);
            setNewComment("");
        } catch (error) {
            console.error("Failed to submit review", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!enrollmentId) return null;

    return (
        <section className="rounded-2xl border border-border bg-card p-6">
            <header>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Your review
                </p>
                <h3 className="mt-1.5 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                    Share your experience.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Help future students choose the right course. Reviews are read by your Ustaz.
                </p>
            </header>

            {submitted ? (
                <div className="mt-6 inline-flex items-center gap-2.5 rounded-md border border-[color:var(--success)]/25 bg-[color:var(--success)]/8 px-3.5 py-2.5 text-sm text-[color:var(--success)]">
                    <Verified className="h-4 w-4" />
                    Thank you. Your review has been submitted.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Rating
                        </label>
                        <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    aria-label={`${star} stars`}
                                    className="rounded p-1 transition-colors hover:bg-muted"
                                >
                                    <Star
                                        className={`h-6 w-6 transition-colors ${
                                            star <= newRating
                                                ? "text-accent"
                                                : "text-border"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="review-comment"
                            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        >
                            Comment
                        </label>
                        <textarea
                            id="review-comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your experience…"
                            rows={4}
                            className={`mt-2 ${inputCls} resize-none`}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={submitting}
                            isLoading={submitting}
                            variant="primary"
                        >
                            Post review
                        </Button>
                    </div>
                </form>
            )}
        </section>
    );
}
