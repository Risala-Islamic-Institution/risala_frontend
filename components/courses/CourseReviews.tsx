"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function CourseReviews({
    courseId,
    enrollmentId,
}: {
    courseId: string;
    enrollmentId?: string;
}) {
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
        <Card className="p-6">
            <h3 className="font-serif text-xl text-foreground mb-1">Leave a review</h3>
            <p className="text-sm text-muted-foreground mb-6">
                Share your experience to help future students.
            </p>

            {submitted ? (
                <div className="bg-muted border border-border rounded-md p-4 text-sm text-foreground">
                    Thank you. Your review has been submitted.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">
                            Rating
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewRating(star)}
                                    className={`text-2xl transition-colors ${
                                        star <= newRating ? "text-accent" : "text-border"
                                    }`}
                                    aria-label={`${star} stars`}
                                >
                                    &#9733;
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">
                            Comment
                        </label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your experience..."
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={submitting} variant="primary">
                            {submitting ? "Posting..." : "Post review"}
                        </Button>
                    </div>
                </form>
            )}
        </Card>
    );
}
