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
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md w-full">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-gray-500 mb-6 text-sm">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>

                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-left mb-6 overflow-hidden">
                            <p className="text-xs text-red-800 font-mono break-words">{this.state.error?.message}</p>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="rounded-xl"
                            >
                                Go Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => window.location.reload()}
                                className="rounded-xl"
                            >
                                Refresh Page
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
