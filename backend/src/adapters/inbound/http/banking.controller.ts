import { Router } from 'express';
import { IBankingUseCases } from '../../../core/ports/in/IBankingUseCases';

export function createBankingRouter(bankingService: IBankingUseCases): Router {
  const router = Router();

  // GET /compliance/cb?shipId=...&year=...
  router.get('/compliance/cb', async (req, res) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) return res.status(400).json({ error: "Missing shipId or year" });
      const record = await bankingService.computeCB(shipId as string, parseInt(year as string, 10));
      res.json(record);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // GET /compliance/adjusted-cb?shipId=...&year=...
  router.get('/compliance/adjusted-cb', async (req, res) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) return res.status(400).json({ error: "Missing parameters" });
      const adjustedCB = await bankingService.getAdjustedCB(shipId as string, parseInt(year as string, 10));
      res.json({ shipId, year: Number(year), adjustedCB });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // GET /banking/records?shipId=...&year=...
  router.get('/banking/records', async (req, res) => {
    try {
      const { shipId, year } = req.query;
      if (!shipId || !year) return res.status(400).json({ error: "Missing parameters" });
      const records = await bankingService.getBankRecords(shipId as string, parseInt(year as string, 10));
      res.json(records);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // POST /banking/bank
  router.post('/banking/bank', async (req, res) => {
    try {
      const { shipId, year } = req.body;
      const entry = await bankingService.bankSurplus(shipId, year);
      res.json({ success: true, entry });
    } catch (err: any) { res.status(400).json({ error: err.message }); }
  });

  // POST /banking/apply
  router.post('/banking/apply', async (req, res) => {
    try {
      const { shipId, year, amount } = req.body;
      await bankingService.applyBankedSurplus(shipId, year, amount);
      res.json({ success: true, message: `Applied ${amount} surplus successfully.` });
    } catch (err: any) { res.status(400).json({ error: err.message }); }
  });

  return router;
}
