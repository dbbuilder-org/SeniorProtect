import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const DEV_URL = 'http://localhost:3000';
const PROD_URL = process.env.EXPO_PUBLIC_API_URL || DEV_URL;

const BASE_URL = __DEV__ ? DEV_URL : PROD_URL;

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

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('accessToken');
    } catch {
      return null;
    }
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  }

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('refreshToken');
    } catch {
      return null;
    }
  }

  async fetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = true } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (auth) {
      const token = await this.getToken();
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

    if (response.status === 401 && auth) {
      // Try refresh
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        const newToken = await this.getToken();
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        if (!retryResponse.ok) {
          const error = await retryResponse.json();
          throw new ApiError(error.message || 'Request failed', retryResponse.status);
        }
        return retryResponse.json();
      }
      throw new ApiError('Session expired. Please log in again.', 401);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new ApiError(error.message || 'Request failed', response.status);
    }

    return response.json();
  }

  private async refreshTokens(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      await this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  // Auth methods
  async register(email: string, password: string, displayName: string) {
    return this.fetch<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      '/api/v1/auth/register',
      { method: 'POST', body: { email, password, displayName }, auth: false }
    );
  }

  async login(email: string, password: string) {
    return this.fetch<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      '/api/v1/auth/login',
      { method: 'POST', body: { email, password }, auth: false }
    );
  }

  async logout() {
    const refreshToken = await this.getRefreshToken();
    try {
      await this.fetch('/api/v1/auth/logout', { method: 'POST', body: { refreshToken } });
    } finally {
      await this.clearTokens();
    }
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
