import { useState, useEffect } from 'react';
import { 
  Podcast,
  getTrendingPodcasts,
  getPopularPodcasts,
  getPodcastsByCategory,
  searchPodcasts
} from '@/lib/api';

export function useTrendingPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTrendingPodcasts();
        setPodcasts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch trending podcasts'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { podcasts, isLoading, error };
}

export function usePopularPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPopularPodcasts();
        setPodcasts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch popular podcasts'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { podcasts, isLoading, error };
}

export function usePodcastsByCategory(categorySlug: string) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPodcastsByCategory(categorySlug);
        setPodcasts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch podcasts by category'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [categorySlug]);

  return { podcasts, isLoading, error };
}

export function useSearchPodcasts(query: string) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await searchPodcasts(query);
        setPodcasts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to search podcasts'));
      } finally {
        setIsLoading(false);
      }
    }

    if (query.trim()) {
      setIsLoading(true);
      fetchData();
    } else {
      setPodcasts([]);
      setIsLoading(false);
    }
  }, [query]);

  return { podcasts, isLoading, error };
} 