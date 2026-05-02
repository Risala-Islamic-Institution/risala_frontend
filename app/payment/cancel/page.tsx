"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/brand-mark";

export default function PaymentCancelPage() {
  const router = useRouter();

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

      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <article className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="relative overflow-hidden border-b border-border bg-muted/60 px-6 py-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full border border-foreground/[0.04]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 top-2 h-20 w-20 rounded-full border border-foreground/[0.03]"
            />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Payment cancelled
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground">
              Booking not completed.
            </h1>
          </div>

          <div className="px-6 py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your payment was cancelled. You can try again from your dashboard
              whenever you&apos;re ready — your seat is held for a short while.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push("/dashboard/student")}
              >
                Return to dashboard
              </Button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-muted/40"
              >
                Visit risala.com
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
