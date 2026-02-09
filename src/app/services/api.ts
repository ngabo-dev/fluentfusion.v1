// API Service for FluentFusion Backend with Loading States
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
  data: T;
  status: number;
}

// Loading state management
type LoadingCallback = (isLoading: boolean) => void;

class ApiService {
  private token: string | null = null;
  private loadingCallbacks: LoadingCallback[] = [];

  // Register loading state callback
  onLoadingChange(callback: LoadingCallback) {
    this.loadingCallbacks.push(callback);
    return () => {
      this.loadingCallbacks = this.loadingCallbacks.filter(cb => cb !== callback);
    };
  }

  private setLoading(loading: boolean) {
    this.loadingCallbacks.forEach(cb => cb(loading));
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    showLoading: boolean = true
  ): Promise<T> {
    if (showLoading) {
      this.setLoading(true);
    }
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
        throw new Error(error.detail || 'An error occurred');
      }

      const data = await response.json();
      this.setLoading(false);
      return data;
    } catch (error: any) {
      this.setLoading(false);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: {
    username: string;
    email: string;
    password: string;
    user_type: string;
    target_language: string;
    native_language: string;
  }): Promise<any> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(username: string, password: string): Promise<any> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      this.setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      this.setToken(data.access_token);
      return data;
    } catch (error: any) {
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async logout(): Promise<void> {
    try {
      this.setLoading(true);
      await this.request('/auth/logout', {
        method: 'POST',
      }, false);
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed, but continuing with local logout');
    } finally {
      this.setToken(null);
      this.setLoading(false);
    }
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/auth/me');
  }

  async getAllUsers(): Promise<any[]> {
    return this.request('/auth/users');
  }

  // Utility methods
  clearAuth() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const api = new ApiService();

// React hook-style loading state hook for components
export function useApiLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return api.onLoadingChange(setIsLoading);
  }, []);

  return isLoading;
}
