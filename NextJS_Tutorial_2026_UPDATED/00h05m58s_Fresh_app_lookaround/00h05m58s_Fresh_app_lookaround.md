# Fresh App Lookaround: Understanding Every File in a New Next.js 15 Project

After running `npx create-next-app@latest`, you get a set of files and folders. This chapter explains every one, what it does, and why it exists.

## Project Root Structure

```
my-nextjs-app/
  .gitignore
  .claude/
  .agents/
  next.config.ts
  package.json
  tsconfig.json
  postcss.config.mjs
  eslint.config.mjs
  next-env.d.ts
  tailwind.config.ts          (if Tailwind was selected)
  public/
  app/
  node_modules/
  .next/                      (generated after first build)
```

## Configuration Files

### `.gitignore`

Controls which files Git should ignore. The default Next.js `.gitignore` includes:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

Note: `next-env.d.ts` is in the gitignore because it is auto-generated and should not be committed.

### `next.config.ts`

The main configuration file for Next.js. It uses TypeScript and the `withConfig` pattern:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Common options:
  logging: {
    fetches: { fullUrl: true },    // Log fetch URLs in dev
  },
  experimental: {
    ppr: 'incremental',            // Enable Partial Prerendering
  },
  images: {
    remotePatterns: [],            // Allow external image domains
  },
}

export default nextConfig
```

Key properties you'll commonly configure:

| Property | Purpose |
|---|---|
| `logging.browserToTerminal` | Forward browser logs to terminal (dev) |
| `experimental.ppr` | Enable Partial Prerendering |
| `images.remotePatterns` | Allow external image URLs in `next/image` |
| `redirects()` | Server-side redirect rules |
| `rewrites()` | Server-side rewrite rules |
| `headers()` | Custom response headers |

### `package.json`

Defines project metadata, scripts, and dependencies:

```json
{
  "name": "my-nextjs-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",    // Development server with Turbopack
    "build": "next build",            // Production build
    "start": "next start",            // Start production server
    "lint": "next lint"               // Run ESLint
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^22.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "postcss": "^8.x",
    "tailwindcss": "^4.x",
    "eslint": "^9.x",
    "eslint-config-next": "^15.0.0",
    "@eslint/eslintrc": "^3.x"
  }
}
```

**Scripts explained:**

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | Starts dev server with HMR | Develop locally |
| `npm run build` | Builds for production | Generate optimized output |
| `npm start` | Starts production server | Run built app |
| `npm run lint` | Runs ESLint on all files | Check code quality |

### `tsconfig.json`

TypeScript configuration. The generated file includes path aliases:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]           // Import alias: `import X from '@/...'`
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `postcss.config.mjs`

PostCSS configuration. When Tailwind is selected, this is pre-configured to process Tailwind directives:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### `eslint.config.mjs`

ESLint flat config (ESLint 9+). Includes Next.js recommended rules:

```js
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [...compat.extends('next/core-web-vitals')]

export default eslintConfig
```

### `next-env.d.ts`

Auto-generated TypeScript declarations. You should **not** edit this file. It declares Next.js types and is regenerated on each build.

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

### `tailwind.config.ts` (if Tailwind was selected)

Configures Tailwind to scan relevant files:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
}

export default config
```

## AI-Related Files (New in 2026)

### `.claude/settings.json`

Configuration for Claude AI coding assistant (from Anthropic). This file tells the AI agent about your project's conventions:

```json
{
  "name": "My Next.js App",
  "description": "A web application built with Next.js 15",
  "model": "claude-sonnet-4-20260514",
  "tools": ["read", "write", "edit", "bash", "glob", "grep"],
  "instructions": "You are building a Next.js 15 application..."
}
```

### `.agents/skill.md`

Defines reusable agent skills for AI coding assistants. These are modular instructions that agents can reference:

```markdown
# Next.js 15 Development Skill

## Conventions
- Use App Router with file-based routing
- Default to Server Components
- Use `@/` import alias for project files
...
```

### `DESIGN.md` (if created)

A design decisions document that AI agents read to understand architectural choices before making changes.

## Folders

### `app/`

The application source directory. This is where all your route pages, layouts, API routes, and styles live.

```
app/
  layout.tsx       - Root layout (required)
  page.tsx         - Home page (required)
  globals.css      - Global stylesheet
  favicon.ico      - Browser tab icon
```

### Layout Breakdown

#### `app/layout.tsx` (Root Layout)

The root layout wraps every page in your app. It must define `<html>` and `<body>` tags:

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

#### `app/page.tsx` (Home Page)

The home page for the root route `/`:

```tsx
export default function Home() {
  return <h1>Welcome to Next.js!</h1>
}
```

#### `app/globals.css`

Global CSS that applies to all pages. With Tailwind, it contains the `@tailwind` directives:

```css
@import 'tailwindcss';
```

### `public/`

Static assets directory. Files placed here are served at the root URL:

```
public/
  file.svg      -> http://localhost:3000/file.svg
  globe.svg
  next.svg
  vercel.svg
  window.svg
```

Use `public/` for: favicons, robots.txt, sitemaps, images that don't need optimization.

### `node_modules/`

Installed project dependencies. **Never edit files here.** This directory should always be in `.gitignore`.

### `.next/`

Build output directory. Created after running `npm run build` or `npm run dev`. Contains:

- Compiled JavaScript bundles
- Rendered HTML (static routes)
- RSC payload files
- Cache data

**Never commit this folder** (it is in `.gitignore`).

## Running the App

To verify everything works:

```bash
cd my-nextjs-app
npm run dev
```

You should see output similar to:

```
▲ next dev (Turbopack)
- Local: http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

Visit `http://localhost:3000` to see the default Next.js welcome page.

## Next Steps

Now that you understand the project structure, you can start customizing pages, adding layouts, and building your application. The next chapters will cover routing, components, data fetching, and more.
