import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Collection } from '../types';

export function useCollections(isAuthenticated: boolean) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await api.getCollections();
      setCollections(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [isAuthenticated]);

  const createCollection = async (name: string) => {
    try {
      const newCol = await api.createCollection(name);
      setCollections([newCol, ...collections]);
      return newCol;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create collection');
    }
  };

  return { collections, isLoading, error, fetchCollections, createCollection };
}
