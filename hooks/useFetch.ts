import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface FetchState<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
}

export function useFetch<T>(endpoint: string | null, options?: any) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        error: null,
        loading: !!endpoint,
    });

    const fetchData = useCallback(async () => {
        if (!endpoint) return;

        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await api.get<T>(endpoint, options);
            setState({ data, error: null, loading: false });
        } catch (err: any) {
            setState({ data: null, error: err, loading: false });
        }
    }, [endpoint, JSON.stringify(options)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { ...state, mutate: fetchData };
}
