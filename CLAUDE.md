# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## Common Commands

- **Linting**: Use Biome for code formatting and linting: `bunx biome check --write .`
- **Build Workshop App**: `cd apps/workshop && bun run build`
- **Run Workshop Dev Server**: `cd apps/workshop && bun run dev`
- **Run Workshop Storybook**: `cd apps/workshop && bun run storybook`
- **Run Web App Dev Server**: `cd apps/web && bun run dev`
- **Build Web App**: `cd apps/web && bun run build`
- **Run Tests**: `bun test` (tests are located throughout packages with `.test.ts` suffix)
- **Run Single Test**: `bun test <test-file.test.ts>`

## Architecture Overview

This is a monorepo using Bun workspaces with the following structure:

### Core Packages

- **`packages/crdt/`**: Core CRDT (Conflict-free Replicated Data Type) implementation
  - `core/`: Basic CRDT field, merge, and serialization logic
  - `store/`: Higher-level store abstraction with state management
  - `network/`: WebRTC networking and connection management via PeerJS
  - `persistence/`: Storage adapters for different environments (bun/web)
  - `clock/`: Timestamp/clock provider implementations

- **`packages/components/`**: Reusable React components
- **`packages/fn/`**: Utility functions
- **`packages/schema/`**: Data schema definitions  
- **`packages/services/`**: Business logic services

### Applications

- **`apps/workshop/`**: React development environment for testing components and samples
- **`apps/web/`**: Main web application
- **`apps/cli/`**: Command-line interface

### Key Architectural Patterns

**CRDT State Management**: The core architecture uses a Field-based CRDT system where:
- `Field = [Eventstamp, Path, Value]` represents a change at a specific path
- `State = Field[]` represents the complete state as an array of fields
- State merging uses last-write-wins with timestamp resolution

**Store Pattern**: The store provides a high-level API over CRDT operations:
- `set()`: Mutate local state and trigger listeners
- `mergeState()`: Merge remote state (with optional silent mode)  
- `get()`: Materialize current object from CRDT state
- Event listeners for state changes

**Network Synchronization**: WebRTC-based P2P networking with:
- Connection management via PeerJS
- Automatic state synchronization between peers
- Connection lifecycle management

**Component Workshop**: The workshop app uses dynamic module loading to showcase component samples with configurable props and render functions.

## Preferred APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests. Tests use the Bun test runner:

```ts
import { test, expect } from "bun:test";

test("example test", () => {
  expect(1).toBe(1);
});
```

**Note**: The workshop app also uses Vitest for browser testing with Playwright. Run tests with:
- `cd apps/workshop && bun test` for Vitest tests
- `cd apps/workshop && bun run storybook` for Storybook component testing

## Frontend Development

**Web App**: Uses HTML imports with `Bun.serve()`. Don't use `vite`. HTML files can import .tsx/.jsx files directly and Bun's bundler handles transpilation and bundling automatically.
- For development: `bun --hot ./src/index.tsx`
- For build: `bun build ./src/index.html --outdir=dist --sourcemap --target=browser`

**Workshop App**: Uses Vite for development with Storybook for component documentation and testing. This is an exception to the Bun-first approach to leverage Storybook's ecosystem.
- For development: `bun run dev` (uses Vite)
- For component development: `bun run storybook`

## Code Style

- Uses Biome for formatting with tab indentation and double quotes
- TypeScript throughout with strict typing
- ESM modules (`"type": "module"` in package.json)
- Workspace dependencies use `workspace:*` protocol