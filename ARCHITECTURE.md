# Architecture

## Project Overview

Onboarding portal for Vendis merchants. Built with TanStack Start (React 19) and deployed on AWS Amplify.

---

## Directory Structure

```text
.
├── .amplify-hosting/        # Build output for AWS Amplify (generated, gitignored)
├── .github/workflows/       # CI/CD: semantic-release on pushes to main
├── .husky/                  # Git hooks: commitlint, lint-staged (pre-commit), build (pre-push)
├── public/                  # Static assets (favicon, logos, manifest, robots.txt)
├── src/
│   ├── assets/              # Static data (country-region-data.json)
│   ├── components/          # Global reusable components
│   ├── contexts/            # React contexts (theme, confirm dialog)
│   ├── env/                 # Typed environment variables with @t3-oss/env-core (client/server)
│   ├── features/            # Feature-based modules
│   ├── hooks/               # Global custom hooks (useMobile, useTheme, etc.)
│   ├── integrations/        # External library configuration
│   │   └── tanstack-query/  # QueryClient + MutationCache with automatic toast notifications
│   ├── lib/                 # Global utilities
│   │   ├── errors/          # Typed error system (AppError, handlers, messages)
│   │   ├── utils.ts         # Utility functions (cn, etc.)
│   │   └── vendis-client.ts # Preconfigured HTTP client (Axios)
│   ├── routes/              # File-based routing (TanStack Router)
│   ├── server/              # Server functions (TanStack Start)
│   │   └── onboarding/      # Onboarding API endpoints
│   ├── store/               # Global state management with Zustand
│   └── styles/              # Global styles (Tailwind CSS + animations)
├── amplify.yml              # AWS Amplify build specification
├── biome.json               # Biome configuration (linter + formatter)
├── commitlint.config.js     # Conventional Commits configuration
├── components.json          # shadcn/ui configuration
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite + TanStack Start + Nitro + Tailwind
└── tsconfig.json            # TypeScript configuration
```

---

## Feature-Based Modules

Each feature is self-contained and follows its own structure:

```text
src/features/<name>/
├── components/     # Feature UI components
├── hooks/          # Feature-specific hooks
├── lib/            # Business logic
├── mutations/      # TanStack Query mutations
├── queries/        # TanStack Query queries
├── schemas/        # Validation schemas (Zod)
├── pages/          # Page components (when file-based routing is not used)
├── index.ts        # Public barrel export
└── types.ts        # Local types
```

---

## Routing

File-based routing powered by TanStack Router. Routes are defined as files inside `src/routes/`, and the route tree is automatically generated in `src/routeTree.gen.ts`.

```text
src/routes/
├── __root.tsx         # Root layout (providers, header, scripts)
├── index.tsx          # / → redirect or landing page
├── dev/playground.tsx # /dev/playground → development/testing
├── pay/$token.tsx     # /pay/:token → payment screen
└── start/$token.tsx   # /start/:token → onboarding form
```

---

## Server Functions

Server functions (TanStack Start) live under `src/server/` and run on the server side. They communicate with the Vendis API.

```text
src/server/*
```

---

## Styling

- **Tailwind CSS v4** with the `@tailwindcss/vite` plugin
- **shadcn/ui** components located in `src/components/ui/` (Radix Nova style)
- Light and dark themes powered by `next-themes` and `src/contexts/theme-provider.tsx`

---

## Linting & Formatting

- **Biome** as both linter and formatter (tab indentation, double quotes)
- Husky runs `lint-staged` on pre-commit (`biome check --write`)
- Pre-push hook runs `bun run build`

---

## Commits & Releases

- **Conventional Commits** with Commitizen (`bun run commit`)
- **Commitlint** validates commit messages through the `commit-msg` hook
- **semantic-release** runs in GitHub Actions (on pushes to `main`) to generate changelogs, tags, and GitHub releases

---

## Deployment

AWS Amplify with the Nitro preset:

1. `amplify.yml` installs Bun, copies environment variables, builds the application, and outputs artifacts to `.amplify-hosting/`
2. Nitro generates a serverless bundle using the `aws-amplify` preset
3. Static assets are served through a CDN, while the compute layer runs on Node.js 20.x Lambda

Local production build:

```bash
bun run build
```

---

## Environment Variables

| Variable         | Scope  | Description                     |
| ---------------- | ------ | ------------------------------- |
| `VENDIS_API_URL` | server | Base URL of the Vendis API      |
| `VENDIS_API_KEY` | server | API key used for authentication |

Defined with strict typing via `@t3-oss/env-core` inside `src/env/`.
