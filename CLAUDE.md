# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Journal by Early Bird** is a local-first, privacy-focused journaling web application. The core philosophy: each entry is an immutable snapshot in time to encourage authentic self-expression without self-censorship. Instead of editing entries, users can reflect on them later by adding comments.

All data is stored client-side in IndexedDB with no server-side persistence, ensuring complete privacy.

## Development Commands

```bash
bun dev          # Start development server with HMR at localhost:3000
bun run build    # Build for production (outputs to /dist)
bun start        # Run production server
bun check        # Lint and format code with Biome
```

## Architecture

- **Runtime & Build**: Bun (replaces Node.js, Vite)
- **Frontend**: React 19 + TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **Database**: Starling ORM with IndexedDB plugin
- **UI Components**: Ark UI (accessible primitives)
- **Styling**: Tailwind CSS 4 with custom theme
- **Validation**: Zod schemas
- **Code Quality**: Biome (linting & formatting)

## Bun Usage

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.

## Database & Data Layer

The application uses **Starling** ORM with the IndexedDB plugin for client-side data persistence.

### Schema

Two core entities defined with Zod in `src/schemas/`:

**Entry** (`src/schemas/entry.ts`):
- `id`: UUID (auto-generated)
- `content`: String
- `createdAt`: ISO 8601 timestamp (auto-set)

**Comment** (`src/schemas/comment.ts`):
- `id`: UUID (auto-generated)
- `entryId`: UUID (references Entry)
- `content`: String
- `createdAt`: ISO 8601 timestamp (auto-set)

### Database Setup

Database initialization in `src/database/db.ts`:
```ts
export const db = createDatabase({
  name: "journal",
  schema: {
    entries: { schema: EntrySchema, getId: (entry) => entry.id },
    comments: { schema: CommentSchema, getId: (comment) => comment.id },
  },
}).use(idbPlugin({ version: 1, useBroadcastChannel: true }));
```

**Cross-tab sync**: Enabled via `useBroadcastChannel: true` - changes in one browser tab automatically sync to other tabs.

### Custom Hooks

- **`useEntries()`** - Fetches all entries with their associated comments, maintains reactive state
- **`useComments(entryId)`** - Manages comments for a specific entry
- **`useCurrentDate()`** - Tracks current date, updates at midnight
- **`useKeyboardHeight()`** - Detects mobile virtual keyboard height, sets CSS variables for safe areas

## Component Organization

Components follow a hierarchical structure:

- **`/src/components/shared/entries/`** - Entry-specific components (list, item, dialogs, comments)
- **`/src/components/shared/shared/`** - Generic UI components (button, dialog, popover, menu, tooltip)
- **`/src/components/shared/layouts/`** - Layout components
- **`/src/components/`** (root) - Page-level composition components (nav-bar, today-entries, past-entries)

All components use the compound component pattern (see Design Patterns section).

## Design Patterns

### Compound Components

Use the compound component pattern for organizing related UI components. Group components as properties of a single exported object using dot notation:

```tsx
const Root = (props: ComponentProps<"div">) => (
  <div {...props} className={cx("base-styles", props.className)} />
);

const Header = (props: ComponentProps<"header">) => (
  <header {...props} className={cx("header-styles", props.className)} />
);

const Content = (props: ComponentProps<"main">) => (
  <main {...props} className={cx("content-styles", props.className)} />
);

export const Layout = {
  Root,
  Header,
  Content,
};
```

Usage:
```tsx
<Layout.Root>
  <Layout.Header>Header content</Layout.Header>
  <Layout.Content>Main content</Layout.Content>
</Layout.Root>
```

Benefits:
- Clear component relationships and hierarchy
- Better discoverability via IDE autocomplete
- Avoids namespace pollution
- Flexible composition while maintaining semantic structure

#### Internal Compound Components

For components that capture business logic, use internal compound components. Keep the compound structure for code organization but export a single assembled component:

```tsx
const Root = (props: ComponentProps<"article">) => (
  <article {...props} className={cx("base-styles", props.className)} />
);

const Header = (props: ComponentProps<"header">) => (
  <header {...props} className={cx("header-styles", props.className)} />
);

const Content = (props: ComponentProps<"div">) => (
  <div {...props} className={cx("content-styles", props.className)} />
);

export const EntryCard = (props: { entry: Entry }) => {
  return (
    <Root>
      <Header>{entry.title}</Header>
      <Content>{entry.content}</Content>
    </Root>
  );
};
```

This pattern provides internal organization benefits while keeping a simple public API for consumers.

**Note**: Don't over-engineer compound components. Use vanilla HTML elements when they don't need styling, logic, or props forwarding. Only create compound components when they add meaningful value through styling, behavior, or semantic structure.

## File Naming

All files and directories should use lowercase and kebab-case naming:

- **Files**: `user-profile.tsx`, `data-menu.tsx`, `entry-list.stories.tsx`
- **Directories**: `entry-comment-item/`, `shared/`, `layouts/`
- **Components**: Export names remain PascalCase (e.g., `UserProfile`, `DataMenu`) but files are kebab-case

Examples:
```
✅ Good:
- components/user-profile/user-profile.tsx
- components/data-menu/data-menu.stories.tsx
- layouts/aside-layout.tsx

❌ Avoid:
- components/UserProfile/UserProfile.tsx
- components/DataMenu/DataMenu.stories.tsx
- layouts/AsideLayout.tsx
```

This convention:
- Ensures consistency across the codebase
- Avoids case-sensitivity issues on different filesystems
- Improves readability and maintainability
- Follows modern web development best practices

## Code Style

### TypeScript

- NEVER use `any` type. Always use proper TypeScript types.
- Prefer explicit typing over type inference when it improves code clarity.

### Type vs Interface

Prefer `type` over `interface` for type definitions.

```ts
// Preferred: type
type DataMenuProps = {
	onExport?: () => void;
	onImport?: () => void;
};

// Avoid: interface
interface DataMenuProps {
	onExport?: () => void;
	onImport?: () => void;
}
```

### Guard Clauses

Prefer guard clauses with early returns over nested if-else statements. This improves readability and reduces cognitive load.

```ts
// Preferred: Guard clauses
function processData(input: unknown) {
  if (!input) {
    console.error("No input provided");
    return undefined;
  }

  if (typeof input !== "string") {
    console.error("Input must be a string");
    return undefined;
  }

  // Happy path logic here
  return input.toUpperCase();
}

// Avoid: Nested conditions
function processData(input: unknown) {
  if (input) {
    if (typeof input === "string") {
      // Happy path logic here
      return input.toUpperCase();
    } else {
      console.error("Input must be a string");
      return undefined;
    }
  } else {
    console.error("No input provided");
    return undefined;
  }
}
```
