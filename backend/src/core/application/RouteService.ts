import { IRouteRepository } from '../ports/out/IRouteRepository';
import { IRoutesService, ComparisonResult } from '../ports/in/IRoutesService';
import { RouteEntity } from '../domain/types';
import { calculatePercentageDifference, calculateComplianceBalance } from '../domain/FuelEUFormulas';

export class RouteService implements IRoutesService {
  constructor(private routeRepo: IRouteRepository) {}

  async getAllRoutes(): Promise<RouteEntity[]> {
    return this.routeRepo.getAllRoutes();
  }

  async setBaseline(routeId: string): Promise<void> {
    const route = await this.routeRepo.getRouteById(routeId);
    if (!route) {
      throw new Error(`Route with ID ${routeId} not found.`);
    }
    await this.routeRepo.setBaselineRoute(routeId);
  }

  async getComparison(): Promise<ComparisonResult> {
    const baseline = await this.routeRepo.getBaselineRoute();
    if (!baseline) {
      throw new Error('No baseline route has been set.');
    }

    const allRoutes = await this.routeRepo.getAllRoutes();
    
    const comparisonRoutes = allRoutes
      .filter(r => r.routeId !== baseline.routeId)
      .map(route => {
        const percentDiff = calculatePercentageDifference(route.ghgIntensity, baseline.ghgIntensity);
        // Is Compliant if CB is >= 0
        const cb = calculateComplianceBalance(route.ghgIntensity, route.fuelConsumption);
        return {
          route,
          percentDiff,
          isCompliant: cb >= 0
        };
      });

    return {
      baselineRoute: baseline,
      comparisonRoutes
    };
  }
}
