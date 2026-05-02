"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BrandMark } from "@/components/brand-mark";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const [status, setStatus] = useState<"processing" | "confirmed" | "failed">("processing");
    const [message, setMessage] = useState("Verifying payment...");

    useEffect(() => {
        if (!sessionId) {
            setStatus("failed");
            setMessage("No session ID found.");
            return;
        }
        setStatus("confirmed");
        setMessage("Your booking is being confirmed. You can return to your dashboard now.");
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <BrandMark />
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4">
                        {status === "confirmed" ? "Payment confirmed" : "Processing"}
                    </p>
                    <h1 className="font-serif text-4xl text-foreground mb-3 leading-tight">
                        Thank you
                    </h1>
                    <p className="text-muted-foreground mb-8 leading-relaxed">{message}</p>
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => router.push("/dashboard/student")}
                    >
                        Return to dashboard
                    </Button>
                </Card>
            </main>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            }
        >
            <PaymentSuccessContent />
        </Suspense>
    );
}
