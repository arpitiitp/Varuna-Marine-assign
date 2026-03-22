import { Router } from 'express';
import { IPoolingUseCases } from '../../../core/ports/in/IPoolingUseCases';

export function createPoolingRouter(poolingService: IPoolingUseCases): Router {
  const router = Router();

  // POST /pools
  router.post('/pools', async (req, res) => {
    try {
      const { year, members } = req.body; 
      // members should be an array of shipIds
      if (!year || !Array.isArray(members)) {
        return res.status(400).json({ error: "Invalid payload: year and members array required." });
      }

      const pool = await poolingService.createPool(year, members);
      res.json({ success: true, pool });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
