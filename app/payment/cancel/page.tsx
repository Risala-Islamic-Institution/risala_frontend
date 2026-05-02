"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BrandMark } from "@/components/brand-mark";

export default function PaymentCancelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <BrandMark />
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-8 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                        Payment cancelled
                    </p>
                    <h1 className="font-serif text-4xl text-foreground mb-3 leading-tight">
                        Booking not completed
                    </h1>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        Your payment was cancelled. You can try again from your dashboard whenever you&apos;re ready.
                    </p>
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
