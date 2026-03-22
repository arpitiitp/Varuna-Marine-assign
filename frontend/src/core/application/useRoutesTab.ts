import { useState, useEffect } from 'react';
import { backendClient } from '../../adapters/infrastructure/backendClient';
import { RouteData } from '../domain/types';

export function useRoutesTab() {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const data = await backendClient.getRoutes();
      setRoutes(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (id: string) => {
    try {
      await backendClient.setBaseline(id);
      await fetchRoutes(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return { routes, loading, error, setBaseline, fetchRoutes };
}
