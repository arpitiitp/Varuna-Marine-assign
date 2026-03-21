import { PoolEntity } from '../../domain/types';

export interface IPoolingUseCases {
  /**
   * Implements Fuel EU Article 21 - Pooling
   * 
   * Rules:
   * 1. Sum(adjustedCB) >= 0
   * 2. Deficit ship cannot exit worse
   * 3. Surplus ship cannot exit negative
   */
  createPool(year: number, shipIds: string[]): Promise<PoolEntity>;
}
