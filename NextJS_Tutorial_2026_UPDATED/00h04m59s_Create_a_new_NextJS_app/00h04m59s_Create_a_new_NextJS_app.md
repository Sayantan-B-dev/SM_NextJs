# Create a New Next.js 15 App

## Prerequisites

Before creating a new Next.js app, ensure your development environment is ready:

- **Node.js 18.17 or later** (LTS recommended)
  - Verify: `node --version`
- **npm, yarn, pnpm, or bun** (package manager of your choice)
  - Verify: `npm --version`, `yarn --version`, or `pnpm --version`
- **A code editor** (VS Code recommended with the Tailwind CSS IntelliSense extension if choosing Tailwind)

## Creating the Project

The standard way to create a new Next.js app is via `create-next-app`. In 2026, the command is:

```bash
npx create-next-app@latest my-app
```

Replace `my-app` with your project name. The CLI will guide you through a series of interactive prompts.

## CLI Options (Interactive Prompts)

When you run `create-next-app`, you are asked to choose from the following options:

| Prompt | Options | Recommendation |
|---|---|---|
| **Would you like to use TypeScript?** | Yes / No | **Yes** - TypeScript provides type safety, better autocomplete, and fewer runtime errors. All modern Next.js projects use TypeScript. |
| **Would you like to use ESLint?** | Yes / No | **Yes** - ESLint catches code quality issues early. Next.js ships with `eslint-config-next` with React-specific rules. |
| **Would you like to use Tailwind CSS?** | Yes / No | **Yes** if you want utility-first styling. Tailwind is well-integrated with Next.js and speeds up UI development significantly. |
| **Would you like to use `src/` directory?** | Yes / No | **Optional** - Places app code in `src/` instead of root. Keeps root clean but adds nesting. Recommended for larger projects. |
| **Would you like to use App Router?** (recommended) | Yes / No | **Yes** - The App Router is the future of Next.js. The Pages Router is legacy and not recommended for new projects. |
| **Would you like to use Turbopack?** | Yes / No | **Yes** - Turbopack is the Rust-based bundler, offering significantly faster dev startup and HMR compared to webpack. |
| **Would you like to customize the import alias?** (`@/*` by default) | Default / Custom | **Default** (`@/*` maps to `src/*` or `./*`) is the standard convention. Change only if you have a specific reason. |
| **Would you like to enable AI-related features?** | Yes / No | **Optional** - New in 2026. Creates `.claude/` and `.agents/` config files for AI coding assistants. |

## Non-Interactive Mode

For scripting or CI/CD, you can pass options as flags:

```bash
npx create-next-app@latest my-app \
  --typescript \
  --eslint \
  --tailwind \
  --src-dir \
  --app \
  --turbopack \
  --import-alias="@/*"
```

To see all available flags:

```bash
npx create-next-app@latest --help
```

## Step-by-Step Walkthrough

### Step 1: Run the command

```bash
npx create-next-app@latest my-nextjs-app
```

### Step 2: Answer the prompts

A typical recommended sequence:

```
? Would you like to use TypeScript? » Yes
? Would you like to use ESLint? » Yes
? Would you like to use Tailwind CSS? » Yes
? Would you like to use `src/` directory? » No
? Would you like to use App Router? (recommended) » Yes
? Would you like to use Turbopack? » Yes
? Would you like to customize the import alias? (`@/*` by default) » No
? Would you like to enable AI-related features? » Yes
```

### Step 3: Wait for installation

The CLI installs all dependencies, which may take 1-3 minutes depending on your internet speed.

### Step 4: Start the dev server

```bash
cd my-nextjs-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your new Next.js app.

## What Gets Generated

After running `create-next-app`, the project directory contains:

```
my-nextjs-app/
  .gitignore
  .claude/            # AI agent configuration (if enabled)
    settings.json
  .agents/            # Agent skill definitions (if enabled)
    skill.md
  next.config.ts      # Next.js configuration
  package.json        # Project metadata and dependencies
  tsconfig.json       # TypeScript configuration
  postcss.config.mjs  # PostCSS config (for Tailwind)
  eslint.config.mjs   # ESLint flat config
  next-env.d.ts       # Next.js TypeScript declarations
  tailwind.config.ts  # Tailwind configuration (if selected)
  app/
    globals.css       # Global styles
    layout.tsx        # Root layout (required)
    page.tsx          # Home page (required)
    favicon.ico       # Tab icon
  public/             # Static assets
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `npx` not found | Install Node.js from nodejs.org |
| Command hangs at "Installing..." | Check internet connection, try with `--use-npm` flag |
| Port 3000 already in use | Use `npx next dev -p 3001` or modify the script in package.json |
| ESLint errors on first run | The default config is strict; these are warnings, not blockers |
| TypeScript errors with `@/` alias | The `paths` in `tsconfig.json` are pre-configured; ensure your IDE restarted |

## Next Steps

Now that your project is created, proceed to the next chapter for a detailed look around the file structure.
