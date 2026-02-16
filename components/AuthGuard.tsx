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
                const userRole = (user.primary_role || user.roles?.[0]?.name || '').toUpperCase(); // USTAZ or STUDENT

                if (allowedRoles.includes(userRole as Role)) {
                    setAuthorized(true);
                } else {
                    // Redirect to correct dashboard if logged in but wrong role
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
