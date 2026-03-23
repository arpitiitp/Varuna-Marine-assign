import axios from 'axios';
import { RouteData, ComparisonResult, ShipCompliance, BankEntry, PoolData } from '../../core/domain/types';

// Use environment variable if provided, otherwise default to 3001
const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001' 
});

export const backendClient = {
  getRoutes: async (): Promise<RouteData[]> => {
    const res = await API.get('/routes');
    return res.data;
  },
  
  setBaseline: async (id: string): Promise<void> => {
    await API.post(`/routes/${id}/baseline`);
  },

  getComparison: async (): Promise<ComparisonResult> => {
    const res = await API.get('/routes/comparison');
    return res.data;
  },

  getComplianceCB: async (shipId: string, year: number): Promise<ShipCompliance> => {
    const res = await API.get(`/compliance/cb?shipId=${shipId}&year=${year}`);
    return res.data;
  },

  getAdjustedCB: async (shipId: string, year: number): Promise<{ shipId: string, year: number, adjustedCB: number }> => {
    const res = await API.get(`/compliance/adjusted-cb?shipId=${shipId}&year=${year}`);
    return res.data;
  },

  getBankRecords: async (shipId: string, year: number): Promise<BankEntry[]> => {
    const res = await API.get(`/banking/records?shipId=${shipId}&year=${year}`);
    return res.data;
  },

  bankSurplus: async (shipId: string, year: number): Promise<BankEntry> => {
    const res = await API.post(`/banking/bank`, { shipId, year });
    return res.data.entry;
  },

  applyBanked: async (shipId: string, year: number, amount: number): Promise<void> => {
    await API.post(`/banking/apply`, { shipId, year, amount });
  },

  createPool: async (year: number, members: string[]): Promise<PoolData> => {
    const res = await API.post('/pools', { year, members });
    return res.data.pool;
  }
};
