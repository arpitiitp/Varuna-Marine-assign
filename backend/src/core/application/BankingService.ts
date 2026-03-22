import { IBankingUseCases } from '../ports/in/IBankingUseCases';
import { IBankingRepository, IComplianceRepository } from '../ports/out/IBankingRepository';
import { IRouteRepository } from '../ports/out/IRouteRepository';
import { ShipComplianceEntity, BankEntryEntity } from '../domain/types';
import { calculateComplianceBalance } from '../domain/FuelEUFormulas';

export class BankingService implements IBankingUseCases {
  constructor(
    private bankingRepo: IBankingRepository,
    private complianceRepo: IComplianceRepository,
    private routeRepo: IRouteRepository
  ) {}

  async computeCB(shipId: string, year: number): Promise<ShipComplianceEntity> {
    // 1. Fetch route data equivalent to the ship for that year (simplified mapping)
    let route = null;
    if (this.routeRepo.findByRouteIdAndYear) {
      route = await this.routeRepo.findByRouteIdAndYear(shipId, year);
    }
    if (!route || route.year !== year) {
        throw new Error(`Data for Ship/Route ${shipId} in year ${year} not found.`);
    }

    // 2. Compute the compliance balance
    const cb = calculateComplianceBalance(route.ghgIntensity, route.fuelConsumption);

    // 3. Save snapshot
    return this.complianceRepo.saveComplianceSnapshot({
      shipId,
      year,
      cbGco2eq: cb
    });
  }

  async getAdjustedCB(shipId: string, year: number): Promise<number> {
    // Current base CB
    let cbRecord = await this.complianceRepo.getComplianceSnapshot(shipId, year);
    if (!cbRecord) {
        cbRecord = await this.computeCB(shipId, year);
    }

    const baseCB = cbRecord.cbGco2eq;
    if (baseCB > 0) return baseCB; // It's a surplus, adjusted is base if we didn't bank it, or depends on semantics

    // If deficit, we see how much banked surplus we applied to this deficit.
    // For simplicity, Article 20 allows borrowing or applying banked surplus.
    // Let's assume the applyBankedSurplus method reduces the negative CB by creating positive BankEntries for this year.
    const yearEntries = await this.bankingRepo.getBankEntries(shipId, year);
    
    // Summing applied surplus (recorded as positive bank entries applied to this year's deficit)
    const appliedSum = yearEntries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
    
    return baseCB + appliedSum;
  }

  async getBankRecords(shipId: string, year: number): Promise<BankEntryEntity[]> {
    return this.bankingRepo.getBankEntries(shipId, year);
  }

  async bankSurplus(shipId: string, year: number): Promise<BankEntryEntity> {
    const cbRecord = await this.complianceRepo.getComplianceSnapshot(shipId, year);
    if (!cbRecord || cbRecord.cbGco2eq <= 0) {
        throw new Error(`Cannot bank: no surplus compliance balance exists for ship ${shipId} in ${year}`);
    }

    // Bank the entire surplus as a positive ledger item
    return this.bankingRepo.createBankEntry({
      shipId,
      year,
      amountGco2eq: cbRecord.cbGco2eq
    });
  }

  async applyBankedSurplus(shipId: string, year: number, amount: number): Promise<void> {
    if (amount <= 0) throw new Error('Applied amount must be positive');
    
    const cbRecord = await this.complianceRepo.getComplianceSnapshot(shipId, year);
    if (!cbRecord) {
      throw new Error('Compliance snapshot not ready for that year.');
    }
    
    // Verify there is a deficit
    if (cbRecord.cbGco2eq >= 0) {
      throw new Error(`Cannot apply banked surplus over a year with no deficit (CB: ${cbRecord.cbGco2eq})`);
    }

    const totalBanked = await this.bankingRepo.getTotalBanked(shipId);
    
    if (totalBanked < amount) {
      throw new Error(`Insufficient banked surplus. Needed: ${amount}, Available: ${totalBanked}`);
    }
    
    const maxNeeded = Math.abs(cbRecord.cbGco2eq);
    if (amount > maxNeeded) {
      throw new Error(`Cannot apply more than the existing deficit (${maxNeeded})`);
    }

    // Debit from bank (we add a negative entry for tracking, and a positive entry to the current year, or just track applied amounts)
    // Here we treat bank as a ledger. Applying surplus means drawing down the global bank balance (negative amount).
    await this.bankingRepo.createBankEntry({
      shipId,
      year: year, // the year it was applied
      amountGco2eq: -amount // representing a withdrawal
    });
  }
}
