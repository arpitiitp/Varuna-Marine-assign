# FuelEU Maritime Compliance Platform

A full-stack implementation of the FuelEU Maritime regulation modules focusing on Route Management, Emission Comparisons, Banking (Article 20), and Pooling (Article 21).

## Architecture Summary

This platform abandons traditional MVC structures in favor of a strict **Hexagonal Architecture (Ports & Adapters)** pattern. This ensures that the core regulatory business logic (FuelEU formulas) remains 100% framework-agnostic, decoupled from databases, HTTP routers, or UI frameworks.

### Backend Structure

By isolating the mathematical domain, we guarantee that the complex FuelEU compliance formulas are protected from infrastructure changes.

1. **`core/domain` (Entities & Value Objects):** 
   - Contains pure TypeScript representations of `Ship`, `ComplianceBalance`, and `Pool`.
   - Embeds mathematically strictly typed formulas for calculating *Target GHG Intensities* and *Compliance Balances* (e.g., specific `41,000 MJ/t` energy mapping logic). 
   - Absolutely zero dependencies on external libraries (no Express, no Prisma).
2. **`core/ports` (Interfaces):**
   - **Inbound Ports**: Interfaces like `IBankingUseCases` that define exactly what operations the UI is securely permitted to trigger.
   - **Outbound Ports**: Interfaces like `IRouteRepository` that dictate the exact data contract the Core needs to retrieve or save data.
3. **`core/application` (Services):**
   - Implements the mapped Inbound Ports. Example: `PoolingService.ts` handles the granular orchestration of verifying pool members, calculating projected balances, and throwing explicit errors if a pool sum dips beneath `0`.
4. **`adapters/inbound` (Primary Adapters):**
   - Contains the Express.js HTTP Controllers (e.g. `banking.controller.ts`). These adapters simply intercept HTTP request/response payloads, execute them against the pure Inbound Ports, and manage standard REST formatting.
5. **`adapters/outbound` (Secondary Adapters):**
   - Contains the explicit Prisma logic (`PrismaRouteRepository.ts`). This adapter translates the Core's Outbound Port data contracts into live PostgreSQL `SELECT`/`INSERT` queries.

### Frontend Structure

The frontend mirrors the backend's clean architecture entirely to structurally separate UI rendering from React effect lifecycles and HTTP boundaries.

1. **`core/domain`**: 
   - Houses unified TypeScript interfaces (`RouteData`, `ComparisonResult`) that strictly validate the backend DTOs.
2. **`core/application`**: 
   - Custom asynchronous React Hooks (`useBankingTab.ts`, `usePoolingTab.ts`).
   - These hooks act as the Application layer orchestration for the frontend, absorbing API lifetimes, managing complex `loading`/`error` context bounds, and mapping validation states (like the Live Pool Preview checks).
3. **`adapters/infrastructure`**: 
   - Raw Axios clients (`backendClient.ts`) that execute the HTTP network calls. They parse network responses cleanly back into reliable Domain objects.
4. **`adapters/ui`**: 
   - Pure React layout components styled exclusively with TailwindCSS v4. They rely entirely on Application Hooks for logic cascades, meaning the UI is 100% decoupled from the network layer and deeply testable.

## Setup & Run Instructions
**Prerequisites**: Node.js v20+

### Database
Update the `DATABASE_URL` in `backend/.env` with your PostgreSQL instance (e.g. Neon).

### Backend
```bash
cd backend
npm install
npx prisma db push
npx prisma db seed      # Executes the tsx seed script mapped natively in package.json
npm run dev
```
The backend API runs on `http://localhost:3001`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend UI runs on `http://localhost:5173`.

## Testing
The core Hexagonal domain logic is strictly type-checked (`strict: true`) and heavily tested using Jest (`backend`). The UI component adapters are asserted using Vitest and React Testing Library (`frontend`).
```bash
# Backend (Supertest integrations & Jest unit logic)
cd backend
npm test

# Frontend (Vitest JSDOM components)
cd frontend
npm test
```
- Includes mathematically verified validations of the greedy Pool algorithms.
- Includes integration checks leveraging Supertest to isolate constraints (e.g. negative CB banking blocks).

## Sample Requests & Responses

**Get Compliance Balance (Adjusted)**
```bash
curl -X GET "http://localhost:3001/compliance/adjusted-cb?shipId=R001&year=2024"
```
*Response:*
```json
{
  "shipId": "R001",
  "year": 2024,
  "adjustedCB": -12502100
}
```

**Create a Compliance Pool (POST)**
```bash
curl -X POST "http://localhost:3001/pools" \
     -H "Content-Type: application/json" \
     -d '{"year":2024,"members":["R001","R002"]}'
```
*Response:*
```json
{
  "success": true,
  "pool": {
    "id": "e421cd9-33aa-45cc...",
    "year": 2024,
    "members": [
      { "shipId": "R001", "cbBefore": -12502100, "cbAfter": 0 },
      { "shipId": "R002", "cbBefore": 25000000, "cbAfter": 12497900 }
    ]
  }
}
```

## Platform Demonstration

Below is a live recorded walkthrough of the platform interacting with the Routes registry, the isolated Banking execution, and the live Article 21 Pooling simulator evaluating runtime mathematical constraints:

![FuelEU Platform Walkthrough Demo](./docs/fueleu_demo.webp)
