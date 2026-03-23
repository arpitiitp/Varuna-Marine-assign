# AI Agent Workflow Log

## Agents Used
- **Google Antigravity Agent (Gemini)**: Utilized as a specialized assistant for targeted problem-solving, specifically for generating complex CSS/UI boilerplate and verifying mathematical formulas. The core architecture, domain logic, and API wiring were implemented manually.

## Prompts & Outputs
### Example 1: Polishing the UI Design
**Prompt**:
> "Update the design and UI for Dashboard.tsx to make it more attractive. Add glassmorphism to the header and smooth animations to the tabs. Optimize the React imports if possible."

**Action**:
I manually built the React component structure and routing. I then used the agent to generate the Tailwind CSS classes required for the glassmorphism effect (`backdrop-blur-md`, `bg-white/70`) and to implement `React.lazy()` with `<Suspense>` for code-splitting the tabs, saving me time on UI aesthetics.

### Example 2: Mathematical Formula Isolation
**Prompt**:
> "Extract the FuelEU Compliance Balance formula into an isolated, unit-testable TypeScript function taking targetIntensity, actualGhgIntensity, and fuelConsumption as arguments."

**Validation**:
While I built the Hexagonal architecture manually, I used the agent to ensure the FuelEU formulas were mathematically exact according to the regulations. The agent provided a decoupled function, which I then manually integrated into the `core/domain` layer to maintain strict separation of concerns.

### Example 3: Environment Variable Configuration
**Prompt**:
> "Use .env file to store backend url securely in the frontend instead of hardcoding localhost:3001."

**Action**:
The agent generated the `.env` file structure and the `import.meta.env.VITE_API_BASE_URL` ternary logic. I then manually wired this into the `axios.create` client to ensure the networking layer was secure.

## Validation / Corrections
1. **Prisma Config Edge-case**: When implementing the database, the agent suggested generic Prisma boilerplate that didn't fit the strict Hexagonal bounds of this project. 
    - **Correction**: I discarded the agent's suggestion and manually configured the `PrismaRouteRepository` to ensure the Outbound Ports were respected.
2. **Formula Context Limits**: The agent occasionally confused the baseline GHG intensity with the absolute FuelEU 2025 Target Requirement (89.33 gCO2e/MJ) when generating the Compliance Status logic.
    - **Correction**: I manually stepped in and wrote the `CompareTab` validation logic to use the absolute target rather than the relative baseline to determine the Deficit/Surplus status.

## Observations
- **Where agent saved time**: The agent was highly effective at generating Tailwind CSS micro-interactions (hover states, gradients, SVG icons) and writing pure mathematical algorithms, which are traditionally tedious to draft from scratch.
- **Where it failed or hallucinated**: The agent struggled with the strict architectural constraints of the Ports & Adapters pattern. It often attempted to couple the database directly to the controllers. 
- **How I combined tools effectively**: I drove the architecture manually, creating the interfaces and strict boundaries myself. I only called upon the agent when I hit an isolated, difficult problem (like a complex CSS grid or a nested TypeScript generic), turning the agent into a precise tool rather than a blanket code generator.

## Best Practices Followed
- **Manual Core Construction**: Built the `core` domain and application services entirely by hand to ensure the business logic remained untainted by AI hallucinations.
- **Targeted Prompting**: Scoped prompts strictly to single files or single functions (e.g., "Style this specific button," or "Write a test for this specific formula") rather than asking it to build entire features.
