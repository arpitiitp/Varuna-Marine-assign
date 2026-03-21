import { BankEntryEntity, ShipComplianceEntity } from '../../domain/types';

export interface IBankingUseCases {
  // Calculates CB based on routing data and caches snapshot
  computeCB(shipId: string, year: number): Promise<ShipComplianceEntity>;
  
  // Gets current CB taking banked/applied entries into account
  getAdjustedCB(shipId: string, year: number): Promise<number>;
  
  getBankRecords(shipId: string, year: number): Promise<BankEntryEntity[]>;
  
  // Implements Fuel EU Article 20: Bank positive CB
  bankSurplus(shipId: string, year: number): Promise<BankEntryEntity>;
  
  // Validates amount <= banked, applies to a deficit year
  applyBankedSurplus(shipId: string, year: number, amount: number): Promise<void>;
}
