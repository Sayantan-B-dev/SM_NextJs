# Hello World

## Prerequisites

Before creating a Next.js application, ensure your development environment is set up:

1. **Node.js** -- Download and install the latest stable release from [nodejs.org](https://nodejs.org). Next.js requires **Node.js version 18.18 or later**.
2. **Text Editor** -- VS Code is recommended. Download from [code.visualstudio.com](https://code.visualstudio.com).

## Creating a New Next.js Project

Open a terminal in your workspace folder and run:

```bash
npx create-next-app@latest
```

You will be prompted with the following configuration choices:

```text
Project name: hello-world
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
Source directory: Yes (src/)
App Router: Yes
Turbopack: No (opt out)
Import alias: Default
```

After the command completes, a new folder called `hello-world` is created with your Next.js application.

## Running the Development Server

```bash
cd hello-world
npm run dev
```

The development server starts on **http://localhost:3000**. You will see the default Next.js welcome page.

## Your First Edit

Open `src/app/page.tsx` and modify the component:

```typescript
// src/app/page.tsx
export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
```

Save the file. The browser automatically refreshes with hot module replacement (HMR) and displays your changes instantly.

## Project Initialization Summary

| Step | Command / Action |
|------|-----------------|
| Create project | `npx create-next-app@latest` |
| Navigate to project | `cd hello-world` |
| Start dev server | `npm run dev` |
| Edit page | Modify `src/app/page.tsx` |

Now that our application is running, let's explore the project structure in the next tutorial.
