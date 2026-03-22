# Reflection Essay: Building FuelEU Maritime with AI Agents

## What I Learned Using AI Agents
Integrating an autonomous AI agent directly into the IDE dramatically reshapes the role of the developer from a "coder" into a "software architect." Rather than focusing on syntax syntax trees or boilerplate file creation, I was forced to focus sharply on Domain-Driven Design. When you give an AI agent the prompt to "Build the Pooling Logic," its raw mathematical translation is often remarkably accurate. However, guiding the agent to slot that logic into an isolated Clean Architecture `core/application` bubble requires strict oversight. 

I learned that AI is exceptionally proficient at "vertical slicing" (building a route, controller, and repository feature linearly) but struggles with "horizontal integrity"—maintaining architectural consistency across multiple modules unless explicitly throttled by interface Ports.

## Efficiency Gains
The most striking efficiency gain was in scaffolding and UI composition. Setting up a Hexagonal Architecture manually involves creating dozens of folders: `domain`, `ports/in`, `ports/out`, `adapters/http`, etc., matching DTO interfaces between all of them. The AI handled this boilerplate in seconds.
Similarly, drafting standard TailwindCSS layouts for tables and data-cards is traditionally tedious. By instructing the AI to "Build a responsive React Table for Route comparisons highlighting compliance deficits in red," the UI was delivered complete with micro-interactions, saving roughly 4 hours of pure styling trivia.

## Improvements for Next Time
If I were to repeat this assignment, I would:
1. **Contract-First API Design:** I would force the AI to draft an OpenAPI specification first rather than immediately jumping into TypeScript interfaces. This creates an even stronger boundary between the Frontend and Backend adapters.
2. **Context Masking:** AI agents often lose track of complex regulatory formulas if their context window fills up with Tailwind classes. Next time, I would enforce completely separate, scoped sessions—one agent purely for mathematically testing the Pool allocations, and a separate session strictly for UI generation.
3. **Data Mocking Strategy:** Allow the AI to hallucinate diverse edge-case datasets (e.g., ships entering a pool with zero CB, boundary target differences of 0.001%) within a purely simulated sandbox before attempting DB integration.
4. **E2E Browser Agents over Unit Mocks:** Unit testing the backend cleanly passed simply because the mocks injected natural strings. A live autonomous browser verification instantly caught a catastrophic UI-DB `UUID` disconnect that unit tests completely blinded us to. Next time, I will enforce E2E browser runs after every major structural revision.

In summary, leveraging AI agents elevates development speed but mandates an order-of-magnitude increase in architectural discipline.
