# AI Agent Workflow Log

## Agents Used
- **Google Antigravity Agent (Gemini)**: Acted as the primary coding sidekick, executing tool calls, scaffolding directories, and generating boilerplate code.


## Prompts & Outputs
### Example 1: Scaffolding the Hexagonal Architecture
**Prompt (System Thought / Intention)**:
> "Setup the directory structure for both the backend and frontend applying strict Hexagonal Architecture / Ports and Adapters."

**Generated Snippet / Action**:
The agent automatically created `backend/src/core/domain`, `backend/src/core/application`, `backend/src/adapters/inbound/http`, and parallel structures for the frontend, ensuring the separation of concerns between raw Express routing and domain pure mathematics.

### Example 2: Implementing the FuelEU Formulas
**Refinement Process**:
Initially, I asked the agent to implement the core Compliance Balance formulas. The agent generated:
```typescript
const cb = (targetIntensity - actualGhgIntensity) * fuelConsumption * 41000;
```
**Correction**: While mathematically sound, the Clean Architecture principle necessitates decoupling. The agent was guided to extract the energy mapping (`41,000 MJ/t`) into a configuration constant and abstract the `calculateEnergyInScope` into an isolated, unit-testable formula.

## Validation / Corrections
1. **Prisma Config Edge-case**: Prisma v6 introduces a `prisma.config.ts` dynamically. The AI agent blindly attempted to push `npx prisma generate` which broke due to unresolved `tsx` dependencies in raw environments.
    - **Correction**: Directed the agent to securely catch the error, remove the dynamic config file, and re-run.
2. **Neon Database Seeding**: Initially drafted to use `sqlite` for frictionless reviewertesting, but the brief demanded PostgreSQL.
    - **Correction**: Pushed the agent to pause execution, request the proper Neon PostgreSQL URI, and re-deploy the seed.
3. **Implicit Framework Execution Fails**: The agent attempted to run `npx prisma db seed` which exited with `0` but failed to seed due to Prisma v6 requiring strict TSX bindings in `package.json`.
    - **Correction**: Guided the agent to parse `package.json` natively and inject the execution mapping.

### Example 3: E2E Verification & UI-Backend Contract Disconnects
**Workflow**: After unit testing the core services, the `Pooling` and `Banking` tabs were manually invoked by an autonomous browser agent. The agent discovered an immediate 404 because the React UI passed natural strings (e.g. `R001`) into Prisma's `getRouteById` expectation of a raw PostgreSQL UUID.
**Correction**: The agent rapidly re-architected the `PrismaRouteRepository` to strictly map natural keys utilizing `findByRouteIdAndYear()`, cleanly bypassing the UUID requirement while preserving Hexagonal Isolation. Vitest JS-DOM testing was subsequently instantiated to ensure UI components accurately exposed the mapped attributes.

## Observations
- **Where agent saved time**: The agent was invaluable at setting up the 15+ boilerplate directories required by Hexagonal Architecture simultaneously, along with wiring up React Tailwind classes effortlessly.
- **Where it failed or hallucinated**: The agent blindly attempted to execute generic database seeds through dynamic wrappers and failed to account for Node execution contexts (e.g., TSX missing maps). It also repeatedly struggled with mapping DOM strings into precise React Router UUID lookups gracefully.
- **How I combined tools effectively**: Utilizing autonomous bash scripting internally alongside file-writers allowed the agent to install testing dependencies, run Vitest migrations, and immediately verify the generated code without human intervention.

## Best Practices Followed
- **Utilized gemini's `tasks.md` for generation**: Maintained a strict `task.md` execution list to prevent the agent from context switching and kept its focus purely scoped.
- **Agentic Testing Control**: The agent wasn't given free rein. It was explicitly locked into Test-Driven AI, crafting Unit Tests for `PoolingService` and `BankingService` *before* touching React, proving the math first.
