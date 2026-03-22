import { PoolingService } from '../../core/application/PoolingService';
import { IPoolingRepository } from '../../core/ports/out/IPoolingRepository';
import { IBankingUseCases } from '../../core/ports/in/IBankingUseCases';

describe('PoolingService', () => {
  let poolingRepoMock: jest.Mocked<IPoolingRepository>;
  let bankingMock: jest.Mocked<IBankingUseCases>;
  let service: PoolingService;

  beforeEach(() => {
    poolingRepoMock = {
      createPool: jest.fn(),
      getPoolsByYear: jest.fn()
    };
    bankingMock = {
      computeCB: jest.fn(),
      getAdjustedCB: jest.fn(),
      getBankRecords: jest.fn(),
      bankSurplus: jest.fn(),
      applyBankedSurplus: jest.fn()
    };
    service = new PoolingService(poolingRepoMock, bankingMock);
  });

  it('should create pool successfully when sum > 0', async () => {
    // Ship 1: Surplus +500
    // Ship 2: Deficit -300
    bankingMock.getAdjustedCB.mockImplementation(async (shipId) => {
      if (shipId === 'S1') return 500;
      if (shipId === 'S2') return -300;
      return 0;
    });

    poolingRepoMock.createPool.mockResolvedValue({ id: 'pool1' } as any);

    const pool = await service.createPool(2025, ['S1', 'S2']);
    
    expect(pool).toBeDefined();
    expect(poolingRepoMock.createPool).toHaveBeenCalledWith(2025, expect.arrayContaining([
      expect.objectContaining({ shipId: 'S1', cbBefore: 500, cbAfter: 200 }),
      expect.objectContaining({ shipId: 'S2', cbBefore: -300, cbAfter: 0 })
    ]));
  });

  it('should reject pool if sum of CB is negative', async () => {
    // Ship 1: Surplus +100
    // Ship 2: Deficit -300
    bankingMock.getAdjustedCB.mockImplementation(async (shipId) => {
      if (shipId === 'S1') return 100;
      if (shipId === 'S2') return -300;
      return 0;
    });

    await expect(service.createPool(2025, ['S1', 'S2'])).rejects.toThrow(/Sum of adjusted CB must be >= 0/);
  });
});
