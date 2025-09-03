# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `bun dev` - Start the development server with Vite
- `bun build` - Type check with TypeScript and build for production
- `bun check` - Format and lint code with Biome (includes --write flag)
- `bun preview` - Preview the production build locally
- `bun deploy` - Run checks and deploy to Cloudflare Workers

## Project Architecture

This is a React + TypeScript journal application with a custom CRDT (Conflict-free Replicated Data Type) system for distributed data synchronization.

### Core Structure

**Frontend (`client/`)**
- React 19 app using Vite, TypeScript, and Tailwind CSS
- Three-page horizontal scroll layout: Past Entries | Today | Network
- Context providers for repository and peer connections
- Entry management with create/edit dialogs and bookmarking

**CRDT System (`crdt/`)**
- `core/` - CRDT merge algorithms and serialization
- `state/` - Store implementation for managing CRDT state
- `repo/` - Repository pattern with PeerJS networking
- `persistence/` - IndexedDB persistence layer
- `networking/` - PeerJS-based peer-to-peer networking

### Key Concepts

- **Entities**: All data objects have `$id` field for CRDT identification
- **Repository Pattern**: Each collection (e.g., entries) gets its own repository instance
- **Real-time Sync**: Changes automatically propagate to connected peers via PeerJS
- **Offline-first**: Data persists locally in IndexedDB, syncs when connected

### Path Aliases

- `@` → `./client/`
- `@crdt` → `./crdt/`

### Tooling

- **Biome**: Used for formatting and linting (tabs, double quotes)
- **Cloudflare Workers**: Deployment target
- **PeerJS**: WebRTC peer-to-peer networking
- **IndexedDB**: Local data persistence