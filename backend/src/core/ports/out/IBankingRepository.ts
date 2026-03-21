import { BankEntryEntity, ShipComplianceEntity } from '../../domain/types';

export interface IComplianceRepository {
  getComplianceSnapshot(shipId: string, year: number): Promise<ShipComplianceEntity | null>;
  saveComplianceSnapshot(entity: Omit<ShipComplianceEntity, 'id'>): Promise<ShipComplianceEntity>;
}

export interface IBankingRepository {
  getBankEntries(shipId: string, year: number): Promise<BankEntryEntity[]>;
  createBankEntry(entity: Omit<BankEntryEntity, 'id'>): Promise<BankEntryEntity>;
  getTotalBanked(shipId: string): Promise<number>;
}
