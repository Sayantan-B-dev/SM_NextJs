# NextJS Setup

## Prerequisites

Before setting up a Next.js project, ensure you have:

- **Node.js 18.17 or later** -- Download from [nodejs.org](https://nodejs.org/). Verify with `node --version`.
- **A code editor** -- VS Code is recommended.
- **A terminal** -- PowerShell, Terminal, or any command-line interface.

## Creating a Next.js Project

Use the official `create-next-app` CLI tool to scaffold a new project:

```bash
# Create in the current directory
npx create-next-app@latest .

# Create in a named directory
npx create-next-app@latest my-nextjs-app
```

The `@latest` flag ensures you get the most recent stable version (Next.js 15 as of this writing).

## CLI Options Explained

When you run `create-next-app`, it prompts you with a series of configuration options:

| Option | What It Does | Recommendation |
|--------|--------------|----------------|
| **TypeScript** | Adds TypeScript support with a `tsconfig.json` file and type definitions. | Yes |
| **ESLint** | Sets up ESLint configuration for code quality and consistency. | Yes |
| **Tailwind CSS** | Installs and configures Tailwind CSS for utility-first styling. | Yes |
| **`src/` directory** | Places application code inside a `src/` directory instead of the root. | Optional |
| **App Router** | Uses the new `app/` router (recommended over Pages Router). | Yes |
| **Import alias** | Configures `@/*` path alias so imports look like `import Foo from "@/components/Foo"`. | Yes |
| **Turbopack** | Uses Turbopack (Rust-based bundler) for faster local development. | Yes |

These options can also be passed as flags to skip the prompts:

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

## Two Router Systems

Next.js offers two routing systems:

### App Router (Recommended)

- Located in the `app/` directory.
- Introduced in Next.js 13 (stable in Next.js 14+).
- Supports React Server Components by default.
- Nested layouts, loading states, error boundaries, and streaming.
- Uses `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx`.

### Pages Router (Legacy)

- Located in the `pages/` directory.
- The original routing system (Next.js 12 and earlier).
- Uses `index.tsx` and `[param].tsx` files.
- Does not support Server Components natively.
- Still supported but not recommended for new projects.

### Folder Comparison

```
App Router (recommended)          Pages Router (legacy)
----------------------            ---------------------
app/                              pages/
  layout.tsx                        _app.tsx
  page.tsx                          index.tsx
  about/                            about.tsx
    page.tsx                        [slug].tsx
  blog/
    [slug]/
      page.tsx
```

## Project Walkthrough

After the CLI finishes, you will see a success message like:

```text
Success! Created my-app at G:\code\NextJs\my-app
Inside that directory, you can run several commands:

  npm run dev       Starts the development server.
  npm run build     Builds the application for production.
  npm start         Starts a production server (after build).
  npm run lint      Runs ESLint to check code quality.
```

### Default Project Structure

```
my-app/
  app/
    favicon.ico        # Browser tab icon
    globals.css        # Global CSS styles
    layout.tsx         # Root layout component
    page.tsx           # Home page component
  public/
    file.svg           # Static assets (accessible at /file.svg)
    next.svg           # Next.js logo
    vercel.svg         # Vercel logo
  next.config.ts       # Next.js configuration file
  package.json         # Project dependencies and scripts
  tsconfig.json        # TypeScript configuration
  postcss.config.mjs   # PostCSS config (for Tailwind)
  eslint.config.mjs    # ESLint configuration
```

## Running the Development Server

```bash
npm run dev
```

This starts the development server at `http://localhost:3000`. Open this URL in your browser to see the application.

Features of the dev server:

- **Hot Module Replacement (HMR)** -- Changes to files appear instantly in the browser.
- **Turbopack (default)** -- Fast Rust-based bundler for rapid refresh.
- **Error overlay** -- Build errors appear in the browser for easy debugging.

## Post-Setup Steps

1. **Clean up boilerplate** -- Remove default content from `app/page.tsx` and `app/globals.css` to start fresh.
2. **Explore the file structure** -- Understand how `layout.tsx` wraps `page.tsx`.
3. **Create additional routes** -- Add folders and `page.tsx` files under `app/`.
4. **Configure metadata** -- Use the `metadata` export in `layout.tsx` to set title and description.
5. **Set up environment variables** -- Create `.env.local` for local secrets.
6. **Deploy** -- Run `npm run build` then deploy the `out/` or `.next/` folder to a hosting provider.

### Initial Page Example

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Hello, Next.js 15!</h1>
      <p>Get started by editing <code>app/page.tsx</code></p>
    </main>
  );
}
```

## Task: Create Your First Next.js App

A complete, runnable Next.js 15 project has been created in the `tasks/` directory. Navigate to `tasks/first-nextjs-app/` and run:

```bash
cd tasks/first-nextjs-app
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.
