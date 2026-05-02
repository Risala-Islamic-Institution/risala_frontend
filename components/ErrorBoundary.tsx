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
                <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
                    <div className="bg-card border border-border rounded-md max-w-md w-full p-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                            An unexpected error
                        </p>
                        <h1 className="font-serif text-3xl text-foreground mb-3">Something went wrong</h1>
                        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                            We encountered an unexpected error. Please try refreshing the page or returning to the previous one.
                        </p>

                        {this.state.error?.message && (
                            <div className="bg-muted border border-border rounded-md p-3 text-left mb-6 overflow-hidden">
                                <p className="text-xs text-muted-foreground font-mono break-words">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button variant="secondary" onClick={() => window.history.back()}>
                                Go back
                            </Button>
                            <Button variant="primary" onClick={() => window.location.reload()}>
                                Refresh page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
