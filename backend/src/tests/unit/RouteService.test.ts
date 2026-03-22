import { RouteService } from '../../core/application/RouteService';
import { IRouteRepository } from '../../core/ports/out/IRouteRepository';

describe('RouteService - ComputeComparison', () => {
  let routeRepoMock: jest.Mocked<IRouteRepository>;
  let service: RouteService;

  beforeEach(() => {
    routeRepoMock = {
      getAllRoutes: jest.fn(),
      getRouteById: jest.fn(),
      getBaselineRoute: jest.fn(),
      setBaselineRoute: jest.fn(),
      createMany: jest.fn(),
    };
    service = new RouteService(routeRepoMock);
  });

  it('should correctly set comparison percentDiff and isCompliant flag', async () => {
    const baseline = { routeId: 'R1', ghgIntensity: 91.0, fuelConsumption: 5000 } as any;
    const compare = { routeId: 'R2', ghgIntensity: 88.0, fuelConsumption: 4800 } as any;
    
    routeRepoMock.getBaselineRoute.mockResolvedValue(baseline);
    routeRepoMock.getAllRoutes.mockResolvedValue([baseline, compare]);

    const result = await service.getComparison();
    expect(result.baselineRoute).toEqual(baseline);
    
    expect(result.comparisonRoutes).toHaveLength(1);
    expect(result.comparisonRoutes[0].percentDiff).toBeLessThan(0); // 88 is less than 91
    expect(result.comparisonRoutes[0].isCompliant).toBe(true); // target is 89.3368, 88 is compliant
  });
});
