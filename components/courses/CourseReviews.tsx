"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    student_name?: string; // Assuming API expands this
}

export default function CourseReviews({ courseId, enrollmentId }: { courseId: string; enrollmentId?: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            // Mocking endpoint structure, adjust query as needed
            // Ideally backend filters by course via enrollment__course
            // Currently CourseReviewViewSet filters by user. 
            // We might need a public endpoint for course reviews. 
            // For now, let's assume we can fetch own reviews or we need to update backend to list per course.
            // Let's implement the submission part mainly which is user request.
        };
        // fetchReviews();
    }, [courseId]);

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
            alert("Review submitted!");
            setNewComment("");
        } catch (error) {
            console.error("Failed to submit review", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!enrollmentId) return null; // Only show add form if enrolled

    return (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewRating(star)}
                                className={`text-2xl ${star <= newRating ? "text-yellow-400" : "text-gray-300"}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-gold-500 focus:border-gold-500 p-2 border"
                        rows={3}
                        placeholder="Share your experience..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50"
                >
                    {submitting ? "Posting..." : "Post Review"}
                </button>
            </form>
        </div>
    );
}
