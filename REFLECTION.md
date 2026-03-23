# Reflection Essay: Building FuelEU Maritime with AI Agents

## What I Learned Using AI Agents
Integrating an autonomous AI agent directly into the IDE forces a developer to become highly intentional about *when* and *where* to use automation. Rather than relying on the AI to generate the entire application, I learned that the most effective approach is to manually construct the core foundation and treat the AI as a highly specialized assistant for isolated, complex problems.

When you give an AI agent the prompt to "Build the Pooling Logic," its raw mathematical translation is often remarkably accurate. However, guiding the AI to slot that logic into an isolated Clean Architecture `core/application` bubble often leads to leaky abstractions. By electing to build the Hexagonal Architecture manually, I maintained absolute control over the boundaries, relying on the AI strictly to verify the FuelEU formulas or rapidly draft unit test boilerplates for the math I had placed.

## Efficiency Gains
The most striking efficiency gain was not in scaffolding, but in UI composition and data visualization. Building the core API routes and Postgres adapters manually took time, but it guaranteed stability. However, drafting standard TailwindCSS layouts for tables, glassmorphism headers, and dynamic charts is traditionally tedious. 

By instructing the AI specifically with prompts like "Build a responsive React Table for Route comparisons highlighting compliance deficits in red," or "Generate a CSS bar chart comparing intensities to the target," the complex UI components and micro-interactions were delivered in minutes. This targeted approach allowed me to save hours of pure styling trivia while ensuring the business logic driving that UI was entirely my own.

## Improvements for Next Time
If I were to repeat this assignment, I would:
1. **Contract-First API Design:** I would author an OpenAPI specification first manually, rather than immediately jumping into TypeScript interfaces. This creates an even stronger boundary between the Frontend and Backend adapters that the AI can reference when asked to generate UI components.
2. **Context Masking:** AI agents often lose track of complex regulatory formulas if their context window fills up with Tailwind classes. Next time, I would enforce completely separate, scoped sessions—one purely for mathematically testing the Pool allocations, and a separate session strictly for UI generation.
3. **Targeted Data Mocking:** Use the AI exclusively to generate diverse edge-case datasets (e.g., ships entering a pool with exactly zero CB, boundary absolute target differences of 0.001%) to rigorously battle-test my manually written logic.

In summary, leveraging AI agents elevates development speed, but only when constrained by an order-of-magnitude increase in architectural discipline from the developer.
