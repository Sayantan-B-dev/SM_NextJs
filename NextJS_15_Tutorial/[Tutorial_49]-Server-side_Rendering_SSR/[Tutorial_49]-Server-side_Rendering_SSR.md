# Server-side Rendering (SSR)

## Introduction

Server-Side Rendering (SSR) addresses the two main drawbacks of Client-Side Rendering (CSR): poor SEO and slow initial content visibility. Instead of sending a bare HTML shell, the server generates the complete HTML for each request and sends it to the browser.

## How SSR Works

### SSR Flow

```
Server                                Browser
  |                                     |
  |-- Fetch data from DB/API            |
  |-- Render React components to HTML   |
  |-- Send complete HTML --------------->|
  |   <!DOCTYPE html>                  |
  |   <html>                           |
  |   <body>                           |
  |     <header>...</header>           |
  |     <main>...</main>               |
  |   </body>                          |
  |   </html>                          |
  |                                     |-- Parse & display HTML immediately
  |                                     |-- Download JS bundle (in background)
  |                                     |-- Hydrate components
  |                                     |-- Full interactivity
```

### What the Server Sends

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My App</title>
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
    <main>
      <h1>Welcome, User</h1>
      <p>This content was rendered on the server.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </main>
    <script src="/static/js/bundle.js"></script>
  </body>
</html>
```

## Benefits of SSR

### 1. Improved SEO

Search engine crawlers can now read the fully rendered HTML directly from the server response.

```
Crawler requests page
        |
        v
Receives: Complete HTML with all content
        |
        v
Successfully indexes headings, links, text
        |
        v
Better search rankings
```

### 2. Faster Initial Paint

Users see meaningful content immediately instead of a blank screen.

```
Time --> |--- Server Render ---|--- Network ---|--- Parse HTML ---|
         |                      |              |
         |  Server generates    |  Sends HTML  |  Browser displays |
         |  complete HTML       |              |  content instantly|
         |<---- Content visible immediately --->|
```

## Hydration

While SSR makes content visible faster, the page cannot become fully interactive until JavaScript loads and hydrates the components.

### The Hydration Process

```
1. Server sends complete static HTML
2. Browser displays HTML (content is visible)
3. Browser downloads JS bundle (React + app code)
4. React takes control in the browser
5. React "hydrates" the HTML:
   - Reconstructs the component tree in memory
   - Uses server-rendered HTML as a blueprint
   - Maps interactive elements to their positions
   - Hooks up JavaScript logic:
     - Initializes application state
     - Attaches click and mouseover handlers
     - Sets up effects and event listeners
6. Page becomes fully interactive
```

### Hydration Diagram

```
Before Hydration:
  <button>Click me</button>
  (Looks like a button, does nothing on click)

During Hydration:
  React scans DOM
  Matches nodes to components
  Attaches event listeners
  Initializes state

After Hydration:
  <button>Click me</button>
  (Full interactivity)
```

## SSR Drawbacks

Despite solving CSR's main issues, SSR introduces its own challenges:

| Issue | Description |
|---|---|
| **All-or-Nothing** | Server must fetch all data and render all HTML before sending anything |
| **Larger HTML payload** | Server-rendered HTML is larger than CSR's bare shell |
| **Hydration bottleneck** | Page can't be interactive until all JS loads and hydrates |
| **Server load** | Every request triggers full server-side rendering |
| **TTI delay** | Time to Interactive can lag behind First Contentful Paint |

### The SSR Waterfall

```
Request arrives
      |
      v
Fetch ALL required data ---------> Wait for slowest query
      |
      v
Render ALL components to HTML -----> Wait for slowest component
      |
      v
Send complete HTML
      |
      v
Client displays HTML (content visible)
      |
      v
Download ALL JavaScript ---------> Wait for full bundle
      |
      v
Hydrate ALL components ---------> Wait for full hydration
      |
      v
Page is interactive
```

## SSR vs CSR Comparison

| Aspect | CSR | SSR |
|---|---|---|
| Initial HTML | Bare `<div id="root">` | Complete rendered HTML |
| SEO | Poor | Good |
| First Contentful Paint | Slow (wait for JS) | Fast (server HTML) |
| Time to Interactive | Same as FCP | Delayed by hydration |
| Server load | Minimal | Higher |
| JavaScript dependency | Full | Still required for interactivity |

## Key Points

- SSR generates complete HTML on the server for each request
- Solves CSR's SEO and initial paint problems
- Hydration is required to make the page interactive
- TTI (Time to Interactive) can lag behind FCP (First Contentful Paint)
- SSR is an all-or-nothing process -- everything must finish before anything is sent
- Modern frameworks like Next.js implement SSR out of the box

## Related Topics

- Client-side Rendering (CSR)
- Suspense SSR
- React Server Components
