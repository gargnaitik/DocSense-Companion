import { api } from './api';
import { storage } from './storage';
import { STORAGE_KEYS, DEFAULT_BACKEND_URL } from '../utils/constants';
import type { User } from '../types';

export const auth = {
  async initialize(): Promise<void> {
    api.setBaseUrl(DEFAULT_BACKEND_URL);

    const token = await storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      api.setToken(token);
      try {
        // Validate token
        await api.getMe();
      } catch (error) {
        console.warn('Token invalid or expired', error);
        await this.logout();
      }
    }
  },

  async login(email: string, password: string): Promise<User> {
    const response = await api.login(email, password);
    const token = response.access_token;
    api.setToken(token);
    
    const user = await api.getMe();
    
    await storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
    await storage.set(STORAGE_KEYS.USER, user);
    
    return user;
  },

  async logout(): Promise<void> {
    api.clearToken();
    await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    await storage.remove(STORAGE_KEYS.USER);
  },

  async getToken(): Promise<string | null> {
    return await storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  async getUser(): Promise<User | null> {
    return await storage.get<User>(STORAGE_KEYS.USER);
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
};
