# Project Structure

When you create a Next.js application, the generated project contains four folders and several configuration files at the root level.

## Root-Level Files

### `package.json`

Lists project dependencies and scripts:

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

Additional dependencies may include TypeScript types, Tailwind CSS with PostCSS, and ESLint packages based on your setup choices.

### Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js settings |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.js` | ESLint configuration |
| `tailwind.config.ts` / `postcss.config.mjs` | Tailwind CSS setup |

### Other Root Files

| File | Purpose |
|------|---------|
| `package-lock.json` | Ensures consistent dependency installation |
| `.gitignore` | Version control exclusions |
| `README.md` | Instructions for running, building, and deploying |
| `next-env.d.ts` | TypeScript declarations for Next.js |

## Root-Level Folders

### `.next/`

Created when running `dev` or `build` scripts. This is where the application is served from. It is git-ignored and should not be modified manually.

### `node_modules/`

Contains all installed dependencies. Created automatically when running `npm install` or the `dev` script.

### `public/`

Stores static assets such as images, SVGs, and fonts. Files placed here are served at the root URL path.

### `src/` (Source Directory)

This is the main development directory. Inside it, the `app/` folder contains the App Router code.

## The `src/app/` Folder

This is where most of your development work happens. It currently contains:

| File | Purpose |
|------|---------|
| `favicon.ico` | Browser tab icon |
| `globals.css` | Application-wide styles |
| `layout.tsx` | Root layout -- shared UI across all pages |
| `page.tsx` | Home page component rendered at `/` |

### How It All Works Together

When you run `npm run dev`:

1. Execution starts from `package.json` scripts
2. `layout.tsx` renders the root layout component
3. For the URL **http://localhost:3000**, Next.js looks for `page.tsx` in the `app` folder
4. The `Home` component from `page.tsx` renders inside the root layout as the `children` prop

```typescript
// src/app/layout.tsx (simplified)
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

```typescript
// src/app/page.tsx
export default function Home() {
  return <h1>Welcome Home</h1>;
}
```

The `children` prop in `layout.tsx` receives the content from `page.tsx`, creating the complete UI for the route.

## Next Steps

Now that we understand the project structure, we need to cover an important React concept -- Server Components -- before diving into routing.
