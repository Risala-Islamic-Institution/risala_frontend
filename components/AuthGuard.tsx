"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { api } from "@/lib/api";

type Role = "STUDENT" | "USTAZ" | "ADMIN";

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const token = getToken();
            if (!token) {
                window.location.href = "/login";
                return;
            }

            if (!allowedRoles) {
                setAuthorized(true);
                return;
            }

            try {
                const user = await api.get<{ primary_role?: string; roles?: { name: string }[] }>('/auth/user/');
                const userRole = (user.primary_role || user.roles?.[0]?.name || '').toUpperCase();

                if (allowedRoles.includes(userRole as Role)) {
                    setAuthorized(true);
                } else {
                    if (userRole === 'USTAZ') window.location.href = '/dashboard/ustaz';
                    else if (userRole === 'STUDENT') window.location.href = '/dashboard/student';
                    else window.location.href = '/login';
                }
            } catch (e) {
                console.error("Auth check failed", e);
                window.location.href = "/login";
            }
        };

        verify();
    }, [allowedRoles]);

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
                    <span
                        aria-hidden
                        className="relative inline-flex h-2.5 w-2.5"
                    >
                        <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                    </span>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        Verifying session
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
