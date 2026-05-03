import { getToken, clearToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const DEFAULT_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 10000);

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

class ApiClient {
    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = getToken();

        const isFormData = options.body instanceof FormData;
        const headers: Record<string, string> = {
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            ...options.headers,
        };
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
            keepalive: true,
        };

        const withTimeout = (ms: number) => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), ms);
            return { controller, timer };
        };

        const maxRetries = 2;
        const baseDelay = 400; // ms

        try {
            let lastError: any = null;
            for (let attemptIndex = 0; attemptIndex <= maxRetries; attemptIndex++) {
                const { controller, timer } = withTimeout(DEFAULT_TIMEOUT_MS);
                try {
                    const response = await fetch(url, { ...config, signal: controller.signal });
                    clearTimeout(timer);

                    if (!response.ok) {
                        if (response.status === 401) {
                            clearToken();
                        }
                        let detail = "";
                        try {
                            const contentType = response.headers.get("content-type") || "";
                            if (contentType.includes("application/json")) {
                                const data: any = await response.json();
                                if (typeof data === "string") {
                                    detail = data;
                                } else if (data?.detail) {
                                    detail = data.detail;
                                } else if (data?.non_field_errors?.length) {
                                    detail = data.non_field_errors[0];
                                } else {
                                    const firstKey = data && typeof data === "object" ? Object.keys(data)[0] : "";
                                    if (firstKey) {
                                        const msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
                                        detail = `${firstKey}: ${msg}`;
                                    }
                                }
                            } else {
                                detail = await response.text();
                            }
                        } catch (e) {
                            /* ignore parse errors */
                        }
                        const suffix = detail ? ` - ${detail}` : "";
                        throw new Error(`API Error: ${response.status} ${response.statusText}${suffix}`);
                    }

                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        return await response.json();
                    }
                    return {} as T;
                } catch (err: any) {
                    clearTimeout(timer);
                    lastError = err;
                    const isAbort = err?.name === 'AbortError';
                    const isNetwork = err?.message?.toLowerCase().includes('failed to fetch') || err?.message?.includes('NetworkError');
                    if ((isAbort || isNetwork) && attemptIndex < maxRetries) {
                        const delay = baseDelay * Math.pow(2, attemptIndex);
                        await new Promise(r => setTimeout(r, delay));
                        continue;
                    }
                    throw err;
                }
            }
            throw lastError ?? new Error('Unknown request failure');
        } catch (error) {
            console.error('Request Failed:', error);
            throw error;
        }
    }

    get<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: any, options?: RequestOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string, options?: RequestOptions) {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const api = new ApiClient();
