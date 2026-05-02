"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16 sm:px-6 lg:px-8">
          <article className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            {/* Tinted header band */}
            <div className="relative overflow-hidden border-b border-border bg-[color:var(--destructive)]/[0.06] px-6 py-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full border border-foreground/[0.04]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 top-2 h-20 w-20 rounded-full border border-foreground/[0.03]"
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-destructive">
                An unexpected error
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-foreground">
                Something went wrong.
              </h1>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                We encountered an unexpected error. Please try refreshing the
                page or returning to the previous one.
              </p>

              {this.state.error?.message && (
                <div className="mt-5 overflow-hidden rounded-xl border border-border bg-muted/40 p-3">
                  <p className="break-words font-mono text-xs text-muted-foreground">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.history.back()}
                >
                  Go back
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => window.location.reload()}
                >
                  Refresh page
                </Button>
              </div>
            </div>
          </article>
        </div>
      );
    }

    return this.props.children;
  }
}
