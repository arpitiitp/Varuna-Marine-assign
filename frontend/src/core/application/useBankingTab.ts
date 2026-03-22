import { useState } from 'react';
import { backendClient } from '../../adapters/infrastructure/backendClient';
import { ShipCompliance, BankEntry } from '../domain/types';

export function useBankingTab() {
  const [cbRecord, setCbRecord] = useState<ShipCompliance | null>(null);
  const [adjustedCb, setAdjustedCb] = useState<number | null>(null);
  const [bankEntries, setBankEntries] = useState<BankEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadShipData = async (shipId: string, year: number) => {
    setLoading(true);
    setError(null);
    try {
      const cb = await backendClient.getComplianceCB(shipId, year);
      const adj = await backendClient.getAdjustedCB(shipId, year);
      const entries = await backendClient.getBankRecords(shipId, year);
      setCbRecord(cb);
      setAdjustedCb(adj.adjustedCB);
      setBankEntries(entries);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      setCbRecord(null);
      setAdjustedCb(null);
      setBankEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const bankSurplus = async (shipId: string, year: number) => {
    try {
      await backendClient.bankSurplus(shipId, year);
      await loadShipData(shipId, year);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const applyBanked = async (shipId: string, year: number, amount: number) => {
    try {
      await backendClient.applyBanked(shipId, year, amount);
      await loadShipData(shipId, year);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return { cbRecord, adjustedCb, bankEntries, loading, error, loadShipData, bankSurplus, applyBanked };
}
