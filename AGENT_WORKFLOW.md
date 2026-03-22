# AI Agent Workflow Log

## Agents Used
- **Google DeepMind Antigravity Agent (Gemini)**: Acted as the primary coding sidekick, executing tool calls, scaffolding directories, and generating boilerplate code.
- **Claude Code / Cursor**: Used implicitly via standard IDE environments as the guiding architect.

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
2. **Neon Database Seeding**: Initially drafted to use `sqlite` for frictionless reviewer testing, but the brief demanded PostgreSQL.
    - **Correction**: Pushed the agent to pause execution, request the proper Neon PostgreSQL URI, and re-deploy the seed.

## Observations
- **Time Saving**: The agent was invaluable at setting up the 15+ boilerplate directories required by Hexagonal Architecture simultaneously, along with wiring up React Tailwind classes seamlessly. It also rapidly constructed the basic Unit test skeletons in Jest.
- **Hallucinations**: The agent assumed `@types/node` was not present in the Vite scaffolding configuration initially and attempted to double-install it.
- **Combining Tools**: Utilizing Bash scripting internally alongside file-writers allowed the agent to install dependencies, run migrations, and immediately verify the generated code without human intervention.

## Best Practices Followed
- **Architectural Control**: The agent wasn't given free rein to write the whole app in a single file or a traditional MVC setup. It was explicitly locked into creating `Ports/in` and `Ports/out` to map dependencies backwards.
- **Test-Driven AI**: The agent was instructed to craft Unit Tests for `PoolingService` and `BankingService` *before* moving to the React Frontend, proving the core domain logic mathematically.
