"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');

    const [status, setStatus] = useState<'processing' | 'confirmed' | 'failed'>('processing');
    const [message, setMessage] = useState('Verifying payment...');

    useEffect(() => {
        if (!sessionId) {
            setStatus('failed');
            setMessage('No session ID found.');
            return;
        }
        // Assume success for now, as specific polling requires booking ID
        setStatus('confirmed');
        setMessage('Payment successful! Your booking is being confirmed.');

    }, [sessionId]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-neutral">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-2xl font-bold text-primary mb-2">Payment Successful!</h1>
                <p className="text-secondary/70 mb-6">{message}</p>

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

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
