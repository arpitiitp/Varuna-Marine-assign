import { PoolEntity, PoolMemberEntity } from '../../domain/types';

export interface IPoolingRepository {
  createPool(year: number, members: Omit<PoolMemberEntity, 'poolId'>[]): Promise<PoolEntity>;
  getPoolsByYear(year: number): Promise<PoolEntity[]>;
}
