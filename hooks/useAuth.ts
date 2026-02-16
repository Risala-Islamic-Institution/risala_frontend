import { useState, useEffect, useCallback } from 'react';
import { getToken, clearToken, setToken } from '@/lib/auth';
import { api } from '@/lib/api';

interface User {
    id: string;
    username: string;
    email: string;
    full_name?: string;
    is_student: boolean;
    is_teacher: boolean;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Memoize checkAuth to avoid recreating it on every render
    const checkAuth = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            setIsAuthenticated(false);
            return;
        }

        try {
            const profile = await api.get<User>('/users/profile/');
            setUser(profile);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Auth check failed:', error);
            clearToken();
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = (token: string) => {
        setToken(token);
        checkAuth();
    };

    const logout = () => {
        clearToken();
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/auth/login';
    };

    return {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        refresh: checkAuth,
    };
}
