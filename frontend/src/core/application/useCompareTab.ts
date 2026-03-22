import { useState, useEffect, useCallback } from 'react';
import { backendClient } from '../../adapters/infrastructure/backendClient';
import { ComparisonResult } from '../domain/types';

export function useCompareTab() {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    setLoading(true);
    try {
      const data = await backendClient.getComparison();
      setComparison(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      setComparison(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  return { comparison, loading, error, fetchComparison };
}
