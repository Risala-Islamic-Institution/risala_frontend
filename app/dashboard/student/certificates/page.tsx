"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

interface CertificateItem {
    id: string;
    enrollment: string;
    issued_at: string;
    code: string;
    course_title?: string;
    course_slug?: string;
}

export default function CertificatesPage() {
    const [loading, setLoading] = useState(true);
    const [certs, setCerts] = useState<CertificateItem[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const run = async () => {
            try {
                const res = await api.get<CertificateItem[]>("/certificates/");
                setCerts(res);
            } catch (e) {
                setError("Failed to load certificates.");
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-sm text-muted-foreground">Loading certificates...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard/student" aria-label="Back to dashboard">
                        <BrandMark />
                    </Link>
                    <Link
                        href="/dashboard/student"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        &larr; Back to dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
                <div className="mb-10 md:mb-12">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                        Achievements
                    </p>
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight">
                        Your certificates
                    </h1>
                    <p className="text-muted-foreground mt-3 max-w-2xl">
                        Courses you have completed in full.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md text-sm">
                        {error}
                    </div>
                )}

                {certs.length === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <p className="font-serif text-lg text-foreground">No certificates yet</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Complete a course to earn your first certificate.
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {certs.map((c) => (
                            <Card key={c.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-accent mb-2">
                                        Certificate of completion
                                    </p>
                                    <h2 className="font-serif text-xl text-foreground leading-tight">
                                        {c.course_title || "Course"}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Issued {new Date(c.issued_at).toLocaleString()}
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground mt-2">
                                        ID: {c.code}
                                    </p>
                                </div>
                                {c.course_slug && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            window.location.href = `/dashboard/student/courses/${c.course_slug}`;
                                        }}
                                    >
                                        Open course
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
