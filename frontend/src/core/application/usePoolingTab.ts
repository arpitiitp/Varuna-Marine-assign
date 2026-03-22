import { useState } from 'react';
import { backendClient } from '../../adapters/infrastructure/backendClient';
import { PoolData } from '../domain/types';

export function usePoolingTab() {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [poolPreview, setPoolPreview] = useState<{ sum: number, isValid: boolean } | null>(null);

  const verifyPool = async (year: number, memberShipIds: string[]) => {
    if (!memberShipIds.length) return;
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      let sum = 0;
      for (const id of memberShipIds) {
        const res = await backendClient.getAdjustedCB(id, year);
        sum += res.adjustedCB;
      }
      setPoolPreview({ sum, isValid: sum >= 0 });
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      setPoolPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const createPool = async (year: number, memberShipIds: string[]) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const pool = await backendClient.createPool(year, memberShipIds);
      setPools([...pools, pool]);
      setSuccessMsg(`Pool created successfully with ID: ${pool.id}`);
      setPoolPreview(null); // reset preview on success
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { pools, loading, error, successMsg, poolPreview, verifyPool, setPoolPreview, createPool };
}
