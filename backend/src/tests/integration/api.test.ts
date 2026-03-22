import request from 'supertest';
import express from 'express';
import { createRoutesRouter } from '../../adapters/inbound/http/routes.controller';
import { createPoolingRouter } from '../../adapters/inbound/http/pooling.controller';

// Super simple mock just to fulfill the "Integration — HTTP endpoints via Supertest" requirement
// without spinning up the entire Prisma cluster in tests.
const mockRouteService = {
  getAllRoutes: jest.fn().mockResolvedValue([{ id: 'mock-1', routeId: 'R001' }]),
  setBaseline: jest.fn(),
  getComparison: jest.fn()
};

const mockPoolingService = {
  createPool: jest.fn().mockResolvedValue({ id: 'pool-mock-1', year: 2025 })
};

const app = express();
app.use(express.json());
app.use('/routes', createRoutesRouter(mockRouteService as any));
app.use('/pools', createPoolingRouter(mockPoolingService as any));

describe('Integration Tests - HTTP APIs', () => {
  it('GET /routes returns 200 and data', async () => {
    const res = await request(app).get('/routes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].routeId).toBe('R001');
  });

  it('POST /pools creates a pool successfully', async () => {
    const res = await request(app)
      .post('/pools')
      .send({ year: 2025, members: ['S1', 'S2'] });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pool.id).toBe('pool-mock-1');
  });

  it('POST /pools fails with 400 on missing payload', async () => {
    const res = await request(app).post('/pools').send({ year: 2025 });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Invalid payload");
  });
});
