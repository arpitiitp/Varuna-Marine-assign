import { Router } from 'express';
import { IRoutesService } from '../../../core/ports/in/IRoutesService';

export function createRoutesRouter(routeService: IRoutesService): Router {
  const router = Router();

  // GET /routes
  router.get('/', async (req, res) => {
    try {
      const routes = await routeService.getAllRoutes();
      res.json(routes);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /routes/:id/baseline
  router.post('/:id/baseline', async (req, res) => {
    try {
      await routeService.setBaseline(req.params.id);
      res.json({ success: true, message: 'Baseline route updated' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // GET /routes/comparison
  router.get('/comparison', async (req, res) => {
    try {
      const comparison = await routeService.getComparison();
      res.json(comparison);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
