import { prisma } from '../../../infrastructure/db/database';
import { IPoolingRepository } from '../../../core/ports/out/IPoolingRepository';
import { PoolEntity, PoolMemberEntity } from '../../../core/domain/types';

export class PrismaPoolingRepository implements IPoolingRepository {
  async createPool(year: number, members: Omit<PoolMemberEntity, 'poolId'>[]): Promise<PoolEntity> {
    // Uses Prisma interactive transaction to guarantee atomic pool creation
    return prisma.$transaction(async (tx) => {
      const pool = await tx.pool.create({
        data: {
          year
        }
      });

      const poolMembersData = members.map(m => ({
        poolId: pool.id,
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter
      }));

      await tx.poolMember.createMany({
        data: poolMembersData
      });

      return pool;
    });
  }

  async getPoolsByYear(year: number): Promise<PoolEntity[]> {
    return prisma.pool.findMany({
      where: { year },
      include: {
        members: true
      }
    });
  }
}
