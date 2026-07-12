# Understanding the File Structure in Next.js 15

## Overview of a Next.js Project Structure

When you create a new Next.js project with `npx create-next-app@latest`, the following file tree is generated:

```
my-app/
├── .next/                  # Build output (auto-generated, gitignored)
├── app/                    # Application routes and layouts
│   ├── favicon.ico         # Browser tab icon
│   ├── globals.css         # Global stylesheet
│   ├── layout.tsx          # Root layout (wraps all pages)
│   └── page.tsx            # Homepage route (/)
├── public/                 # Static assets served at root URL
│   └── file.svg            # Example static file
├── .gitignore
├── eslint.config.mjs       # ESLint configuration
├── next-env.d.ts           # Auto-generated TypeScript declarations
├── next.config.ts          # Next.js configuration (webpack, images, redirects, etc.)
├── package.json            # Project metadata, scripts, dependencies
├── package-lock.json       # Locked dependency versions (auto-generated)
├── postcss.config.mjs      # PostCSS configuration (Tailwind, etc.)
├── README.md               # Project documentation
└── tsconfig.json           # TypeScript configuration
```

---

## Configuration Files (Root Level)

### tsconfig.json

TypeScript configuration that tells the compiler how to process your code.

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
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

| Option | Purpose |
|---|---|
| `strict: true` | Enables all strict type-checking options |
| `target: "ES2017"` | Compiles to modern JavaScript |
| `jsx: "preserve"` | Leaves JSX intact for Next.js to handle |
| `moduleResolution: "bundler"` | Modern resolution for bundlers like Next.js |
| `paths: { "@/*": ["./src/*"] }` | Allows `@/` imports to reference the `src/` directory |
| `plugins: [{ "name": "next" }]` | Enables the Next.js TypeScript plugin for editor support |
| `noEmit: true` | TypeScript does not emit output; Next.js handles compilation |

### package.json

Defines the project, its scripts, and its dependencies.

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "eslint": "^9.x",
    "eslint-config-next": "^15.0.0",
    "@eslint/eslintrc": "^3.x"
  }
}
```

**Scripts:**
- `npm run dev` -- Starts the development server on port 3000 with hot reload
- `npm run build` -- Creates an optimized production build in `.next/`
- `npm start` -- Starts the production server (run after `build`)
- `npm run lint` -- Runs ESLint across the project

**Dependencies (runtime):** next, react, react-dom.

**DevDependencies (development only):** typescript, type definitions, eslint.

### next.config.ts

The configuration file for Next.js behavior. This is where you enable or customize framework features.

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
  redirects: async () => [
    { source: "/old-page", destination: "/new-page", permanent: true },
  ],
  rewrites: async () => [
    { source: "/api/:path*", destination: "https://external-api.com/:path*" },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
      ],
    },
  ],
  env: {
    CUSTOM_KEY: "custom-value",
  },
  experimental: {
    appDir: true,
  },
  // Custom webpack config (merge with default)
  webpack: (config) => {
    config.module.rules.push({ test: /\.svg$/, use: ["@svgr/webpack"] });
    return config;
  },
};

export default nextConfig;
```

**Capabilities:**
- **Images:** Configure allowed image hostname patterns for the `next/image` component
- **Redirects:** Server-side redirects (301/308) before the request reaches the page
- **Rewrites:** Proxy requests to another URL without changing the browser address
- **Headers:** Set custom HTTP response headers (CORS, security, etc.)
- **Environment Variables:** Expose build-time env vars
- **Webpack:** Modify the underlying webpack configuration
- **Experimental:** Opt into experimental features

### postcss.config.mjs

PostCSS configuration. Only relevant when using Tailwind CSS or other PostCSS plugins.

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

### eslint.config.mjs

ESLint configuration for code quality and consistency. Next.js ships with a recommended config.

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

### next-env.d.ts

Auto-generated TypeScript declaration file. **Do not edit manually.**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

It provides TypeScript with type information for Next.js globals and image imports.

### .gitignore

Default ignored files for a Next.js project:

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

# env files
.env*.local

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## The Public Folder

The `public/` directory serves **static files** directly at the root URL path without any processing.

**How it works:**
- A file at `public/logo.svg` is accessible at `http://localhost:3000/logo.svg`
- Files are served as-is, no compilation or optimization

**Typical contents:**
- Images (PNG, JPG, SVG, WebP)
- Font files (WOFF, WOFF2, TTF)
- `robots.txt` -- Instructions for search engine crawlers
- `sitemap.xml` -- SEO sitemap for search engines
- `favicon.ico` -- Browser tab icon (though Next.js 15 places it in `app/`)
- Manifest files for PWA

> **Note:** Do not put pages or components in `public/`. It is only for static assets that need to be served by URL.

---

## The `.next` Folder

Auto-generated build output. Created when you run `dev`, `build`, or `start`. Contains compiled JavaScript, optimized assets, and cached data.

- **Gitignored** -- never committed to source control
- Can be deleted safely; Next.js will regenerate it
- Different content between dev and production builds

---

## The App Folder (The Heart of Next.js)

The `app/` directory is the core of the Next.js App Router. Every file inside contributes to the application's routing and UI.

### Default Files

#### favicon.ico

The browser tab icon. Place your own `.ico` file in `app/` to replace it.

#### globals.css

Global styles applied to the entire application. Imported by the root layout.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* or custom styles */
body {
  font-family: system-ui, sans-serif;
  margin: 0;
  padding: 0;
}
```

#### layout.tsx (Root Layout)

Wraps every page in the application. Defines the outer HTML structure, metadata, fonts, and shared UI (navbars, footers).

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Key points about Layout:**
- The `children` prop receives the currently active route's page component
- Everything rendered **outside** `{children}` persists across all pages (navbars, sidebars, footers)
- `export const metadata` defines SEO meta tags for all pages (can be overridden in child pages)
- There can be nested layouts inside subdirectories

**How `children` changes:**
```
/           -> RootLayout renders <Home />
/about      -> RootLayout renders <AboutPage />
/contact    -> RootLayout renders <ContactPage />
```

#### page.tsx (Home Route)

The main page component for `/`. Any exported default function component works.

```tsx
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Image src="/file.svg" alt="Next.js Logo" width={180} height={38} />
      <h1>Welcome to Next.js</h1>
    </div>
  );
}
```

- The component name (`Home`) is arbitrary; the file name determines the route
- `page.tsx` is the only file that creates a publicly accessible route
- Supports all React features: server components by default, async components, data fetching

---

## Layout in Detail

The root layout is the foundational wrapper for your entire application.

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "My App",
    template: "%s | My App",
  },
  description: "A modern Next.js application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <nav>{/* persistent navigation */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* persistent footer */}</footer>
      </body>
    </html>
  );
}
```

**What can go in a layout:**
- Font loading via `next/font`
- Metadata exports (title, description, open graph)
- Shared UI components (nav, sidebar, footer)
- Global providers (ThemeProvider, AuthProvider, QueryClient)
- `<head>` content via metadata API

---

## Page.tsx Deep Dive

```tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1>Hello World</h1>
      <Image
        src="/logo.svg"
        alt="Company Logo"
        width={100}
        height={100}
        priority
      />
      <p>Welcome to the homepage.</p>
      <Link href="/about">Learn more</Link>
    </div>
  );
}
```

**The `next/image` component:**
- Automatic image optimization (resizing, WebP/AVIF conversion)
- Lazy loading by default (use `priority` for above-the-fold images)
- Requires width and height (or `fill`) for layout stability
- Only allows local files and whitelisted remote hosts (configured in `next.config.ts`)

**File-based routing:**
| File | Route |
|---|---|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/[slug]/page.tsx` | `/blog/post-1` (dynamic) |
| `app/api/route.ts` | `/api` (API endpoint) |
