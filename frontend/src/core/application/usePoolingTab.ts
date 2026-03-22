import { useState } from 'react';
import { backendClient } from '../../adapters/infrastructure/backendClient';
import { PoolData } from '../domain/types';

export function usePoolingTab() {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const createPool = async (year: number, memberShipIds: string[]) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const pool = await backendClient.createPool(year, memberShipIds);
      setPools([...pools, pool]);
      setSuccessMsg(`Pool created successfully with ID: ${pool.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { pools, loading, error, successMsg, createPool };
}
