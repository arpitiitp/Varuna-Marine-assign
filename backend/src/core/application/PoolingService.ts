import { IPoolingUseCases } from '../ports/in/IPoolingUseCases';
import { IPoolingRepository } from '../ports/out/IPoolingRepository';
import { IBankingUseCases } from '../ports/in/IBankingUseCases';
import { PoolEntity, PoolMemberEntity } from '../domain/types';

export class PoolingService implements IPoolingUseCases {
  constructor(
    private poolingRepo: IPoolingRepository,
    private bankingUseCases: IBankingUseCases
  ) {}

  async createPool(year: number, shipIds: string[]): Promise<PoolEntity> {
    if (shipIds.length === 0) {
      throw new Error('Pool must have at least one member');
    }

    // 1. Fetch adjusted CB for each ship
    const membersWithInitialCB = await Promise.all(
      shipIds.map(async (shipId) => {
        const adjustedCb = await this.bankingUseCases.getAdjustedCB(shipId, year);
        return { shipId, cbBefore: adjustedCb, cbAfter: adjustedCb };
      })
    );

    // 2. Validate Sum(adjustedCB) >= 0
    const poolSum = membersWithInitialCB.reduce((sum, m) => sum + m.cbBefore, 0);
    if (poolSum < 0) {
      throw new Error(`Invalid Pool: Sum of adjusted CB must be >= 0. Current sum is ${poolSum}`);
    }

    // 3. Greedy allocation transfer
    // Sort descending by CB (surplus ships first)
    const sortedMembers = [...membersWithInitialCB].sort((a, b) => b.cbBefore - a.cbBefore);
    
    let totalSurplusToDistribute = sortedMembers
        .filter(m => m.cbBefore > 0)
        .reduce((sum, m) => sum + m.cbBefore, 0);

    // Deficit ships are at the end
    for (let i = sortedMembers.length - 1; i >= 0; i--) {
      const ship = sortedMembers[i];
      if (ship.cbBefore < 0) {
        const deficit = Math.abs(ship.cbBefore);
        // Supply deficit from the pool's total surplus
        if (totalSurplusToDistribute >= deficit) {
          ship.cbAfter = 0; // deficit covered fully
          totalSurplusToDistribute -= deficit;
        } else {
          ship.cbAfter = ship.cbBefore + totalSurplusToDistribute; // covered partially
          totalSurplusToDistribute = 0;
        }
      }
    }

    // Subtract the distributed amount from the surplus ships so they don't exit negative
    // Note: The total distributed = sum of deficits covered.
    let remainingSurplusDeficitToDeduct = membersWithInitialCB
        .filter(m => m.cbBefore < 0)
        .reduce((sum, m) => sum + (Math.abs(m.cbBefore) - Math.abs(m.cbAfter)), 0);

    for (let i = 0; i < sortedMembers.length; i++) {
        const ship = sortedMembers[i];
        if (ship.cbBefore > 0 && remainingSurplusDeficitToDeduct > 0) {
            if (ship.cbBefore >= remainingSurplusDeficitToDeduct) {
                ship.cbAfter = ship.cbBefore - remainingSurplusDeficitToDeduct;
                remainingSurplusDeficitToDeduct = 0;
            } else {
                ship.cbAfter = 0;
                remainingSurplusDeficitToDeduct -= ship.cbBefore;
            }
        }
    }

    // 4. Final Verification
    for (const m of sortedMembers) {
      if (m.cbBefore < 0 && m.cbAfter < m.cbBefore) {
        throw new Error(`Enforcement failed: Deficit ship ${m.shipId} exited worse.`);
      }
      if (m.cbBefore > 0 && m.cbAfter < 0) {
        throw new Error(`Enforcement failed: Surplus ship ${m.shipId} exited negative.`);
      }
    }

    // 5. Build final array mapped correctly
    const finalMembers: Omit<PoolMemberEntity, 'poolId'>[] = sortedMembers.map(m => ({
      shipId: m.shipId,
      cbBefore: m.cbBefore,
      cbAfter: m.cbAfter
    }));

    return this.poolingRepo.createPool(year, finalMembers);
  }
}
