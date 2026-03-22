import { RouteEntity } from '../../domain/types';

export interface IRouteRepository {
  getAllRoutes(): Promise<RouteEntity[]>;
  getRouteById(id: string): Promise<RouteEntity | null>;
  getBaselineRoute(): Promise<RouteEntity | null>;
  setBaselineRoute(id: string): Promise<void>;
  createMany(routes: Omit<RouteEntity, "id">[]): Promise<void>;
  findByRouteIdAndYear?(routeId: string, year: number): Promise<RouteEntity | null>;
}
