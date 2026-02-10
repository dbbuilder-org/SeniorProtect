const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

/** Called by AuthContext to wire Clerk's getToken into API requests */
export function setTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

interface ApiOptions {
  method?: string;
  body?: any;
  auth?: boolean;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = true } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (auth && tokenGetter) {
      const token = await tokenGetter();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new ApiError(error.message || 'Request failed', response.status);
    }

    return response.json();
  }

  // Check methods
  async checkEmail(content: string, metadata?: { sender?: string; subject?: string }) {
    return this.fetch('/api/v1/check/email', { method: 'POST', body: { content, metadata } });
  }

  async checkText(content: string, metadata?: { sender?: string }) {
    return this.fetch('/api/v1/check/text', { method: 'POST', body: { content, metadata } });
  }

  async checkUrl(content: string) {
    return this.fetch('/api/v1/check/url', { method: 'POST', body: { content } });
  }

  // Sites
  async getSites(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.fetch<any[]>(`/api/v1/sites${query}`);
  }

  async addTrustedSite(name: string, domain: string, category: string, description?: string) {
    return this.fetch('/api/v1/sites', {
      method: 'POST',
      body: { name, domain, category, description: description || '' },
    });
  }

  async searchSites(q: string, category?: string) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    return this.fetch<any[]>(`/api/v1/sites/search?${params.toString()}`);
  }

  // User dashboard
  async getRecentChecks(limit = 5) {
    return this.fetch<any[]>(`/api/v1/user/checks?limit=${limit}`);
  }

  async getUserStats() {
    return this.fetch<{
      total: number;
      safe: number;
      caution: number;
      danger: number;
      threatsCaught: number;
    }>('/api/v1/user/statistics');
  }
}

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export const api = new ApiClient(BASE_URL);
