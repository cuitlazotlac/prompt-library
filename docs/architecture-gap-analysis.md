# Prompt Lab V1: architecture and gap analysis

## Current architecture

Prompt Lab is a React 18 + TypeScript Vite SPA styled with Tailwind and reusable Radix-based UI primitives. Routing is client-side (`react-router-dom`) and server state is managed with React Query. Firebase provides Google authentication, Firestore prompt/user/favorite/vote documents, and Storage; a Supabase bridge is used for image storage. PostHog supplies analytics and feature flags. Firebase Hosting deploys the Vite `dist` folder with an SPA rewrite.

The existing product is a public prompt library: the home page reads and filters Firestore `prompts`; prompt detail, voting, favourites, profile, moderation, and create/edit pages all operate on that model. Search currently downloads prompt records and filters them in the browser. There are no automated tests. The repo also contains a tracked nested `prompt-library/` Vite starter; it is not used by the root app or deployment and should be handled as cleanup separately, not changed in this slice.

## Keep

- React/Vite, TypeScript, Tailwind, router, UI primitives, toast feedback, and Firebase Hosting.
- Firebase Auth for the future, voluntary "Save Recipe" step.
- Firestore as the eventual persistence layer and the existing public-read access pattern.

## Adapt

- Make `/` an outcome-oriented Recipe entry point; retain the existing prompt library on `/library` during transition.
- Evolve the prompt document concept into a Recipe document with question metadata and a prompt template.
- Reuse client-side search principles for deterministic recipe matching, but make the matching logic independent and testable.
- Reframe Profile/Create/Edit around personal Recipes in a later slice instead of public submissions.

## Remove or de-emphasize

- The public marketplace framing, AI-model filters, voting, favourites, rankings, ads, and image-oriented prompt authoring should not lead the consumer flow.
- Do not delete those features in this vertical slice; moving the old home to `/library` keeps existing functionality available.

## Build in this slice

1. Recipe and question types, local starter Recipe records, weighted deterministic matcher, and deterministic template generator.
2. A no-auth path: request → matching Recipe → questions → generated prompt → copy/open ChatGPT.
3. A no-match state. AI fallback remains an explicit future adapter, not a paid dependency.

## Decisions and risks

- Starter Recipes are local to guarantee a $0, no-login first experience. Firestore Recipe persistence and rules are intentionally deferred so no unauthenticated writes are introduced.
- Matching uses weighted keyword overlap with a configurable threshold. It is transparent and easy to replace, but needs editorial metadata and tuning as the catalog grows.
- `Save Recipe` deliberately requests sign-in only after generation; persistence is not implemented in this first slice.
- Firebase environment values are required for legacy Firebase-backed pages. The Recipe home itself does not read Firestore.
