import { useState, useEffect } from 'react';
import { auth } from '../services/auth';
import type { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Optimistically load cached user to prevent Render cold starts from blocking the UI
        const cachedUser = await auth.getUser();
        if (cachedUser) {
          setUser(cachedUser);
          setIsLoading(false);
        }

        // Initialize and validate token in the background (or foreground if no cache)
        await auth.initialize();
        
        // Update with fresh user (will be null if token was invalid and they were logged out)
        const freshUser = await auth.getUser();
        setUser(freshUser);
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await auth.login(email, password);
      setUser(u);
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return { user, isLoading, error, login, logout, setError };
}
