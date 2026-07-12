# Build a Next.js Blog App

This chapter walks through building a simple blog application with Next.js 15. You will learn how to set up a root layout with shared navigation, create multiple pages (home, blog listing, about), and structure a project for growth.

## Project Planning

The blog app will have these routes:

```
/               -> Home page (hero section)
/blog           -> Blog listing (dummy posts)
/about          -> About page
```

Every page will share:
- A **navbar** with navigation links (Home, Blog, About)
- A **footer** with copyright information
- The same global styling

## Setting Up the Root Layout

The root layout (`app/layout.tsx`) is the top-most wrapper for all pages. It must contain `<html>` and `<body>` tags plus any shared UI.

### Metadata

Next.js uses the `Metadata` object for SEO:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'My Blog',
    template: '%s | My Blog',   // Each page overrides the title via template
  },
  description: 'A simple blog built with Next.js 15',
}
```

### Adding Navbar and Footer

Because `layout.tsx` wraps `children`, we can render navigation and footer here:

```tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'My Blog', template: '%s | My Blog' },
  description: 'A simple blog built with Next.js 15',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
        </nav>
        <main>{children}</main>
        <footer>
          <p>&copy; 2026 My Blog. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
```

Key points:
- `import Link from 'next/link'` enables client-side navigation (no full page reload)
- The `<main>` wrapper around `{children}` gives a target for page-specific styling
- The footer is outside `<main>`, so it stays below page content

## Creating Pages

### Home Page (`app/page.tsx`)

The home page at `/` serves as a welcome landing:

```tsx
export default function Home() {
  return (
    <section>
      <h1>Welcome to My Blog</h1>
      <p>This is a blog built with Next.js 15. Explore articles about web development, React, and modern JavaScript.</p>
    </section>
  )
}
```

### Blog Listing Page (`app/blog/page.tsx`)

The blog page at `/blog` shows a list of dummy posts. In a real app, this data would come from a database or CMS:

```tsx
import Link from 'next/link'

const posts = [
  { id: '1', title: 'Getting Started with Next.js 15', excerpt: 'Learn the basics of Next.js 15 and the App Router.' },
  { id: '2', title: 'Understanding Server Components', excerpt: 'Dive into React Server Components and when to use them.' },
  { id: '3', title: 'Caching in Next.js 15', excerpt: 'A comprehensive guide to the caching revamp in Next.js 15.' },
]

export default function BlogPage() {
  return (
    <section>
      <h1>Blog Posts</h1>
      <div>
        {posts.map(post => (
          <article key={post.id}>
            <Link href={`/blog/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
```

### About Page (`app/about/page.tsx`)

A simple static about page at `/about`:

```tsx
export default function AboutPage() {
  return (
    <section>
      <h1>About This Blog</h1>
      <p>This blog was created as part of a Next.js 15 tutorial. It demonstrates routing, layouts, and basic page structure.</p>
      <h2>Technologies Used</h2>
      <ul>
        <li>Next.js 15</li>
        <li>TypeScript</li>
        <li>CSS Modules / Global CSS</li>
      </ul>
    </section>
  )
}
```

## Styling Approach

For this project, we use a global CSS file (`app/globals.css`) with minimal, clean styling:

```css
body {
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  color: #333;
}

nav {
  background: #1a1a2e;
  padding: 1rem;
  display: flex;
  gap: 1.5rem;
}

nav a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
}

nav a:hover {
  text-decoration: underline;
}

main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

footer {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  margin-top: 3rem;
}

h1 {
  color: #1a1a2e;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

article {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

article h2 {
  margin-top: 0;
}
```

Alternatively, use inline styles or CSS Modules for more localized styling.

## Running the App

```bash
cd blog-app
npm run dev
```

Visit `http://localhost:3000` and navigate between Home, Blog, and About using the navbar. Notice that navigation is instant (client-side) rather than causing full page reloads.

## Project File Structure

```
blog-app/
  .gitignore
  next.config.ts
  package.json
  tsconfig.json
  app/
    globals.css
    layout.tsx
    page.tsx
    blog/
      page.tsx
    about/
      page.tsx
  public/
```

## Expanding the Blog

From here, you can extend the app with:

- **Dynamic blog posts**: `app/blog/[slug]/page.tsx` for individual post pages
- **Database integration**: Use Prisma with PostgreSQL or SQLite
- **Server Actions**: Add a contact form or newsletter signup
- **Image optimization**: Use `next/image` for hero images
- **Metadata per page**: Use `generateMetadata` for dynamic SEO titles

The task project in the `blog-app/` sibling folder contains the complete runnable code.
