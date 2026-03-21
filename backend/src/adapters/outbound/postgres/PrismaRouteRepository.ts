import { prisma } from '../../../infrastructure/db/database';
import { IRouteRepository } from '../../../core/ports/out/IRouteRepository';
import { RouteEntity } from '../../../core/domain/types';

export class PrismaRouteRepository implements IRouteRepository {
  async getAllRoutes(): Promise<RouteEntity[]> {
    return prisma.route.findMany();
  }

  async getRouteById(id: string): Promise<RouteEntity | null> {
    return prisma.route.findUnique({ where: { id } });
  }

  async getBaselineRoute(): Promise<RouteEntity | null> {
    return prisma.route.findFirst({ where: { isBaseline: true } });
  }

  async setBaselineRoute(id: string): Promise<void> {
    // 1. Unset any existing baseline
    await prisma.route.updateMany({
      where: { isBaseline: true },
      data: { isBaseline: false }
    });
    
    // 2. Set the new baseline
    await prisma.route.update({
      where: { id },
      data: { isBaseline: true }
    });
  }

  async createMany(routes: Omit<RouteEntity, "id">[]): Promise<void> {
    await prisma.route.createMany({
      data: routes
    });
  }
}
