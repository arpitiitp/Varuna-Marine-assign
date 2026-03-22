# FuelEU Maritime Compliance Platform

A full-stack implementation of the FuelEU Maritime regulation modules focusing on Route Management, Emission Comparisons, Banking (Article 20), and Pooling (Article 21).

## Architecture Summary
Both the frontend and backend are meticulously structured using **Hexagonal Architecture (Ports & Adapters)**.

### Backend
- **Core Domain**: Pure TypeScript mathematically calculating Target Intensities and Compliance Balances. Zero dependency on Express or Prisma.
- **Ports**: Inbound Use-cases (`IBankingUseCases`) and Outbound Data access (`IBankingRepository`).
- **Adapters**: Express.js HTTP controllers (Inbound) and Prisma PostgreSQL repositories (Outbound).

### Frontend
- **Core Domain**: Unified typings and stateless formatting.
- **Core Application**: Custom React Hooks (`useBankingTab`, `usePoolingTab`) managing API lifetimes, isolating complex asynchronous operations.
- **Adapters UI**: Pure rendering components styled with TailwindCSS v4.
- **Adapters Infra**: Axios clients implementing the required API interfaces targeting `/api/...`.

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
