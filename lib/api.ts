import { getToken, clearToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

class ApiClient {
    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                if (response.status === 401) {
                    clearToken();
                }
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return await response.json();
            }
            return {} as T;

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
