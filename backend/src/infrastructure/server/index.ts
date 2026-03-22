import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaRouteRepository } from '../../adapters/outbound/postgres/PrismaRouteRepository';
import { PrismaBankingRepository } from '../../adapters/outbound/postgres/PrismaBankingRepository';
import { PrismaPoolingRepository } from '../../adapters/outbound/postgres/PrismaPoolingRepository';
import { RouteService } from '../../core/application/RouteService';
import { BankingService } from '../../core/application/BankingService';
import { PoolingService } from '../../core/application/PoolingService';
import { createRoutesRouter } from '../../adapters/inbound/http/routes.controller';
import { createBankingRouter } from '../../adapters/inbound/http/banking.controller';
import { createPoolingRouter } from '../../adapters/inbound/http/pooling.controller';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// === Dependency Injection ===
const routeRepo = new PrismaRouteRepository();
const bankingRepo = new PrismaBankingRepository(); 
const poolingRepo = new PrismaPoolingRepository();

const routeService = new RouteService(routeRepo);
const bankingService = new BankingService(bankingRepo, bankingRepo, routeRepo); // bankingRepo implements both interfaces
const poolingService = new PoolingService(poolingRepo, bankingService);

// === Mount Routers ===
app.use('/routes', createRoutesRouter(routeService));
// banking routes are mounted at root because they include /compliance and /banking
app.use('/', createBankingRouter(bankingService)); 
app.use('/', createPoolingRouter(poolingService)); // /pools

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[FuelEU Backend] Server running on http://localhost:${PORT}`);
});
