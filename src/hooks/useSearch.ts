import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { SearchResponse } from '../types';

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await api.search(query);
        setResults(data);
      } catch (err) {
        console.error('Search failed', err);
        setResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 400); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isSearching };
}
