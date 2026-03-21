import { prisma } from '../../../infrastructure/db/database';
import { IBankingRepository, IComplianceRepository } from '../../../core/ports/out/IBankingRepository';
import { ShipComplianceEntity, BankEntryEntity } from '../../../core/domain/types';

export class PrismaBankingRepository implements IBankingRepository, IComplianceRepository {
  async getComplianceSnapshot(shipId: string, year: number): Promise<ShipComplianceEntity | null> {
    const record = await prisma.shipCompliance.findUnique({
      where: {
        shipId_year: { shipId, year }
      }
    });
    return record;
  }

  async saveComplianceSnapshot(entity: Omit<ShipComplianceEntity, 'id'>): Promise<ShipComplianceEntity> {
    return prisma.shipCompliance.upsert({
      where: {
        shipId_year: { shipId: entity.shipId, year: entity.year }
      },
      update: {
        cbGco2eq: entity.cbGco2eq
      },
      create: {
        shipId: entity.shipId,
        year: entity.year,
        cbGco2eq: entity.cbGco2eq
      }
    });
  }

  async getBankEntries(shipId: string, year: number): Promise<BankEntryEntity[]> {
    return prisma.bankEntry.findMany({
      where: { shipId, year }
    });
  }

  async createBankEntry(entity: Omit<BankEntryEntity, 'id'>): Promise<BankEntryEntity> {
    return prisma.bankEntry.create({
      data: {
        shipId: entity.shipId,
        year: entity.year,
        amountGco2eq: entity.amountGco2eq
      }
    });
  }

  async getTotalBanked(shipId: string): Promise<number> {
    const result = await prisma.bankEntry.aggregate({
      where: { shipId },
      _sum: { amountGco2eq: true }
    });
    return result._sum.amountGco2eq || 0;
  }
}
