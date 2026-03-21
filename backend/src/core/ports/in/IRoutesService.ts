import { RouteEntity } from '../../domain/types';

export interface ComparisonResult {
  baselineRoute: RouteEntity;
  comparisonRoutes: {
    route: RouteEntity;
    percentDiff: number;
    isCompliant: boolean;
  }[];
}

export interface IRoutesService {
  getAllRoutes(): Promise<RouteEntity[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<ComparisonResult>;
}
