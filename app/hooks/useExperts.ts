import { useState, useEffect } from 'react';
import { Expert } from '../types/expert';
import expertsData from '../data/experts.json';

export const useFeaturedExperts = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExperts(expertsData.experts);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchExperts();
  }, []);

  return { experts, isLoading, error };
}; 