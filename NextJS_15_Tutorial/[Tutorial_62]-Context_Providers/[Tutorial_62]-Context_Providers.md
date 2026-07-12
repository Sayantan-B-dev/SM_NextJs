# Context Providers

## Overview

React Context is not supported in server components. If you try to create or use context directly in a server component, you will get an error. The solution is to create a dedicated client component that renders the context provider and wrap your application with it.

---

## The Problem

```tsx
// app/layout.tsx -- This WILL fail
import { createContext } from "react";

type Theme = {
  colors: {
    primary: string;
    secondary: string;
  };
};

const defaultTheme: Theme = {
  colors: {
    primary: "#0070f3",
    secondary: "#6b7280",
  },
};

const ThemeContext = createContext<Theme>(defaultTheme);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value={defaultTheme}>
          {children}
        </ThemeContext.Provider>
      </body>
    </html>
  );
}
```

This produces an error: `"createContext" only works in a Client Component`.

---

## The Solution: Dedicated Provider Component

Create a separate client component that contains all context logic.

### Step 1: Create the Provider Component

```tsx
// components/ThemeProvider.tsx
"use client";

import { createContext, useContext } from "react";

type Theme = {
  colors: {
    primary: string;
    secondary: string;
  };
};

type ThemeContextType = Theme | undefined;

const defaultTheme: Theme = {
  colors: {
    primary: "#0070f3",
    secondary: "#6b7280",
  },
};

const ThemeContext = createContext<ThemeContextType>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

### Step 2: Use the Provider in the Layout

```tsx
// app/layout.tsx (server component)
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### Step 3: Consume the Context in a Client Component

```tsx
// app/page.tsx (client component)
"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ClientRoute() {
  const theme = useTheme();

  return (
    <h1 style={{ color: theme.colors.primary }}>
      Client Route Page
    </h1>
  );
}
```

---

## Important: Client Component Boundary Does Not Propagate Downward

Even though `ThemeProvider` is a client component (it has `"use client"`), the children passed to it (server components further down the tree) **remain server components**. This is a critical concept:

```
RootLayout (server component)
  |
  +-- ThemeProvider (client component -- boundary)
        |
        +-- Page (server component)
        +-- Other server components
```

The `"use client"` directive only affects the file where it is declared and any modules it directly imports -- not the children passed via the `children` prop.

---

## React 19: Simplified Provider Syntax

In React 19, you can render context providers without `.Provider`:

```tsx
// React 19
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext value={defaultTheme}>
      {children}
    </ThemeContext>
  );
}
```

---

## Best Practices

| Practice | Recommendation |
|---|---|
| Provider location | Create in `components/` directory |
| Directive | Always add `"use client"` at the top |
| Export hooks | Export custom hooks (`useTheme`) alongside providers |
| Keep layout pure | Do not add `"use client"` to `layout.tsx` |
| React 19 | Use simplified provider syntax if available |

---

## Key Takeaway

> Instead of converting your server component layout to a client component, create a new client component for the context provider and use it within your server component via the `children` prop. Server components further down the tree stay as server components.
