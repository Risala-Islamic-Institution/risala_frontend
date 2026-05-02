"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/brand-mark";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"processing" | "confirmed" | "failed">(
    "processing"
  );
  const [message, setMessage] = useState("Verifying payment…");

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      setMessage("No session ID found.");
      return;
    }
    setStatus("confirmed");
    setMessage(
      "Your booking is being confirmed. You can return to your dashboard now."
    );
  }, [sessionId]);

  const isConfirmed = status === "confirmed";
  const isFailed = status === "failed";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Slim brand header */}
      <header className="border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Risala home">
            <BrandMark />
          </Link>
          <Link
            href="/dashboard/student"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard &rarr;
          </Link>
        </div>
      </header>

      {/* Centered confirmation card */}
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <article className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {/* Tinted header band */}
          <div
            className={`relative overflow-hidden border-b border-border px-6 py-6 ${
              isConfirmed
                ? "bg-[color:var(--success)]/[0.08]"
                : isFailed
                  ? "bg-[color:var(--destructive)]/[0.06]"
                  : "bg-[color:var(--primary)]/[0.04]"
            }`}
          >
            {/* Geometric accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full border border-foreground/[0.04]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 top-2 h-20 w-20 rounded-full border border-foreground/[0.03]"
            />
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                isConfirmed
                  ? "text-[color:var(--success)]"
                  : isFailed
                    ? "text-destructive"
                    : "text-primary"
              }`}
            >
              {isConfirmed
                ? "Payment confirmed"
                : isFailed
                  ? "Verification failed"
                  : "Processing"}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground">
              {isConfirmed ? "Thank you." : isFailed ? "Hold on." : "One moment."}
            </h1>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {message}
            </p>

            {sessionId && (
              <dl className="mt-5 rounded-xl border border-border bg-muted/40 px-4 py-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Session ID
                </dt>
                <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
                  {sessionId}
                </dd>
              </dl>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push("/dashboard/student")}
              >
                Return to dashboard
              </Button>
              <Link
                href="/dashboard/student/courses"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-muted/40"
              >
                Browse courses
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
