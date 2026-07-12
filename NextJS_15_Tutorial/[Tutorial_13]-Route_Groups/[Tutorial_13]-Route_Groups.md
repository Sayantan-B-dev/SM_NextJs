# Route Groups

## Overview

Route groups allow you to logically organize routes and project files without impacting the URL structure. They are created by wrapping a folder name in parentheses: `(groupName)`. Route groups are also the only way to share a layout between specific routes without affecting the URL path.

## The Problem: Disorganized Routes

Consider authentication routes created as flat folders in the `app` directory:

```
app/
  register/
    page.tsx
  login/
    page.tsx
  forgot-password/
    page.tsx
  dashboard/
    page.tsx
  about/
    page.tsx
```

This works but scatters related routes throughout the project. In a team environment, this becomes difficult to manage.

### Initial Route Files

```tsx
// app/register/page.tsx
export default function Register() {
  return <h1>Register</h1>
}

// app/login/page.tsx
export default function Login() {
  return <h1>Login</h1>
}

// app/forgot-password/page.tsx
export default function ForgotPassword() {
  return <h1>Forgot Password</h1>
}
```

URLs: `/register`, `/login`, `/forgot-password` all work correctly.

## The Wrong Approach: Regular Folders

Simply moving routes into a regular `auth` folder breaks URLs:

```
app/
  auth/
    register/
      page.tsx
    login/
      page.tsx
    forgot-password/
      page.tsx
```

URLs become `/auth/register`, `/auth/login`, `/auth/forgot-password` because the folder name becomes part of the URL path.

## The Solution: Route Groups

Use parentheses to create a route group that organizes files without affecting URLs:

```
app/
  (auth)/
    register/
      page.tsx
    login/
      page.tsx
    forgot-password/
      page.tsx
  (marketing)/
    dashboard/
      page.tsx
    about/
      page.tsx
```

URLs remain: `/register`, `/login`, `/forgot-password`, `/dashboard`, `/about` -- as if the grouping folders do not exist.

## Route Groups with Layouts

Route groups can each have their own layout:

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <nav>Auth Navigation</nav>
      {children}
    </div>
  )
}

// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="marketing-layout">
      <header>Marketing Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  )
}
```

## Key Rules

| Rule | Description |
|------|-------------|
| Syntax | Wrap folder name in parentheses: `(groupName)` |
| URL Impact | Route groups are omitted from the URL path |
| Layout Scope | Layouts inside a route group apply only to routes within that group |
| Multiple Groups | You can have multiple route groups at the same level |
| Naming | Group names have no restrictions (beyond parentheses syntax) |

## Practical Use Case: Authentication vs Main App

```
app/
  (auth)/
    layout.tsx              // Minimal layout for auth pages
    login/
      page.tsx
    register/
      page.tsx
    forgot-password/
      page.tsx
  (main)/
    layout.tsx              // Full layout with header/footer/sidebar
    dashboard/
      page.tsx
    settings/
      page.tsx
    profile/
      page.tsx
```

This pattern lets you apply different layouts to different sections of your application while keeping clean, logical URLs.
