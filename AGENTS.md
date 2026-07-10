# Vendis Onboarding Portal

Server-rendered React app for merchant onboarding and payments. Merchants access via token-based URL, fill onboarding form, proceed to payment.

## Tech Stack

| Layer     | Technology                                          |
| --------- | --------------------------------------------------- |
| Framework | TanStack Start (SSR) + TanStack Router (file-based) |
| UI        | React 19, shadcn/ui (Radix Nova), Tailwind CSS v4   |
| Forms     | TanStack Form + Zod v4                              |
| Data      | TanStack Query + Axios                              |
| State     | Zustand                                             |
| Tooling   | Biome 2.4, Vitest + Testing Library, Bun            |
| Deploy    | AWS Amplify (Nitro `aws-amplify` preset)            |

## Project Structure

```
src/
├── components/ui/     # shadcn/ui — DO NOT edit manually, use CLI
├── contexts/          # React contexts (theme, confirm dialog)
├── env/               # Typed env vars — client.ts / server.ts
├── features/<name>/   # Feature modules: components/, hooks/, mutations/, queries/, schemas/, types.ts, index.ts, etc.
├── hooks/             # Global hooks
├── lib/               # cn(), errors/
├── routes/            # File-based routes — routeTree.gen.ts is auto-generated, DO NOT edit
├── server/            # Server-only functions + service layer
├── store/             # Zustand stores
└── styles/            # Global CSS + animations
```

## Critical Rules

- **Package manager:** `bun` only
- **Linter/formatter:** Biome only (`bun run check` before committing) — no ESLint, no Prettier
- **Types:** Strict mode, no `any` — use `unknown` and narrow
- **Secrets:** Never hardcode — use `src/env/server.ts` (Nitro runtimeConfig) or `src/env/client.ts` (VITE\_ prefix)
- **Styling:** Tailwind only, no inline styles, no CSS files per component. Config in `src/styles.css` via `@theme`
- **Error messages:** User-facing text in Spanish. Use typed system in `src/lib/errors/` (`AppError`, `ErrorCode`)
- **Server functions:** Always validate inputs with Zod via `.validator()`, never import in client code
- **Naming:** PascalCase components/types · camelCase functions/vars · kebab-case files

## Commits (Conventional Commits)

`<type>(<scope>): <description>`

**Types:** `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`  
**Scopes:** `onboarding` `pay` `server` `ui` `deps` `config` `release` `any`

Validate: `bunx commitlint --edit <msg>`

## Skills — Load Before Implementing

| Skill                            | When to load                                        |
| -------------------------------- | --------------------------------------------------- |
| `tanstack-start-best-practices`  | Server functions, middleware, SSR, auth, deployment |
| `tanstack-router-best-practices` | Routing, loaders, search params, navigation         |
| `tanstack-query-best-practices`  | Queries, mutations, caching, error handling         |
| `tanstack-form`                  | Form state, validation, submission                  |
| `frontend-design`                | UI components, pages, styling                       |
