import { BankingService } from '../../core/application/BankingService';
import { IBankingRepository, IComplianceRepository } from '../../core/ports/out/IBankingRepository';
import { IRouteRepository } from '../../core/ports/out/IRouteRepository';

describe('BankingService', () => {
  let bankingRepoMock: jest.Mocked<IBankingRepository>;
  let complianceRepoMock: jest.Mocked<IComplianceRepository>;
  let routeRepoMock: jest.Mocked<IRouteRepository>;
  let service: BankingService;

  beforeEach(() => {
    bankingRepoMock = {
      getBankEntries: jest.fn(),
      createBankEntry: jest.fn(),
      getTotalBanked: jest.fn()
    };
    complianceRepoMock = {
      getComplianceSnapshot: jest.fn(),
      saveComplianceSnapshot: jest.fn()
    };
    routeRepoMock = {
      getAllRoutes: jest.fn(),
      getRouteById: jest.fn(),
      getBaselineRoute: jest.fn(),
      setBaselineRoute: jest.fn(),
      createMany: jest.fn()
    };
    service = new BankingService(bankingRepoMock, complianceRepoMock, routeRepoMock);
  });

  it('should BankSurplus when CB is positive', async () => {
    complianceRepoMock.getComplianceSnapshot.mockResolvedValue({ cbGco2eq: 1000 } as any);
    bankingRepoMock.createBankEntry.mockResolvedValue({} as any);

    await service.bankSurplus('S1', 2024);
    expect(bankingRepoMock.createBankEntry).toHaveBeenCalledWith(expect.objectContaining({ amountGco2eq: 1000 }));
  });

  it('should not BankSurplus when CB is deficit', async () => {
    complianceRepoMock.getComplianceSnapshot.mockResolvedValue({ cbGco2eq: -50 } as any);
    await expect(service.bankSurplus('S1', 2024)).rejects.toThrow();
  });

  it('should ApplyBanked to a deficit if enough balance exists', async () => {
    complianceRepoMock.getComplianceSnapshot.mockResolvedValue({ cbGco2eq: -500 } as any);
    bankingRepoMock.getTotalBanked.mockResolvedValue(1000);

    await service.applyBankedSurplus('S1', 2025, 500);
    // Should create a negative bank entry to debit
    expect(bankingRepoMock.createBankEntry).toHaveBeenCalledWith(expect.objectContaining({ amountGco2eq: -500 }));
  });

  it('should fail ApplyBanked if insufficient total banked', async () => {
    complianceRepoMock.getComplianceSnapshot.mockResolvedValue({ cbGco2eq: -500 } as any);
    bankingRepoMock.getTotalBanked.mockResolvedValue(200);

    await expect(service.applyBankedSurplus('S1', 2025, 500)).rejects.toThrow(/Insufficient banked surplus/);
  });
});
