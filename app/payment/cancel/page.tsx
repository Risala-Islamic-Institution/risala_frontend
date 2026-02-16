"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-neutral">
                <div className="text-6xl mb-4">🚫</div>
                <h1 className="text-2xl font-bold text-error mb-2">Payment Cancelled</h1>
                <p className="text-secondary/70 mb-6">Create a booking payment was cancelled. You can try again from your dashboard.</p>

                <div className="space-y-3">
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => router.push('/dashboard/student')}
                    >
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
