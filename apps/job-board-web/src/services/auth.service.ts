import apiClient from '../lib/api-client';
import {
  LoginCredentials,
  RegisterData,
  AuthToken,
  User,
  UserUpdateData,
} from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const { data } = await apiClient.post<AuthToken>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  async loginWithGoogle(token: string): Promise<AuthToken> {
    const { data } = await apiClient.post<AuthToken>('/auth/google', { token });

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  async register(userData: RegisterData): Promise<User> {
    const { data } = await apiClient.post<User>('/auth/register', userData);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  async updateMe(userData: UserUpdateData): Promise<User> {
    const { data } = await apiClient.put<User>('/auth/me', userData);
    return data;
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  },
};
