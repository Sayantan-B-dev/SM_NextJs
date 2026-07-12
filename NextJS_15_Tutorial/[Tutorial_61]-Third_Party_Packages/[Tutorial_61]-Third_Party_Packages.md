# Third Party Packages

## Overview

Server components introduce a new paradigm for React. Many third-party npm packages have not yet adopted the `"use client"` directive, meaning they rely on client-side features (browser APIs, state, effects) that server components cannot provide. The solution is to wrap such packages inside your own client components.

---

## The Problem

Packages that use any of the following require a client component environment:

- `useState`, `useEffect`, `useRef`, or other React hooks
- Browser-only APIs (`window`, `document`, `localStorage`)
- DOM manipulation
- Event listeners

When you import such a package directly into a server component, Next.js throws an error because the server cannot execute client-side code.

---

## The Solution: Wrapping in a Client Component

Rather than marking your entire server component with `"use client"` (which would lose server-side benefits like direct database access and access to secret environment variables), create a thin wrapper client component.

### Example: react-slick Carousel

#### 1. Install Dependencies

```bash
npm install react-slick slick-carousel @types/react-slick --force
```

#### 2. Create a Wrapper Client Component

```tsx
"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      <div>
        <img src="https://picsum.photos/800/400?random=1" alt="Slide 1" />
      </div>
      <div>
        <img src="https://picsum.photos/800/400?random=2" alt="Slide 2" />
      </div>
      <div>
        <img src="https://picsum.photos/800/400?random=3" alt="Slide 3" />
      </div>
    </Slider>
  );
}
```

#### 3. Use the Wrapper in a Server Component

```tsx
import { ImageSlider } from "@/components/ImageSlider";

export default function ServerRoute() {
  // Server-side operations still work here
  // e.g., database calls, reading from file system

  return (
    <div>
      <h1>Server Route</h1>
      <ImageSlider />
    </div>
  );
}
```

---

## Architecture Diagram

```
Server Component
  |
  +-- Client Component (wrapper with "use client")
  |     |
  |     +-- Third-party Library (no "use client")
  |
  +-- Server-side logic (database, env vars, file system)
```

---

## Comparison: Direct Import vs Wrapper Pattern

| Approach | Server Component | Client Component | Wrapper Client Component |
|---|---|---|---|
| Mark third-party `"use client"` | Not possible (no control) | Not needed | Not needed |
| Add `"use client"` to consuming component | Loses server benefits | Works fine | Works fine |
| Can use server features (DB, env vars) | Yes | No | Yes |
| Third-party library works | No | Yes | Yes |

---

## Best Practices

1. **Always wrap** third-party packages that use client-side features in a dedicated client component
2. **Keep wrappers minimal** -- only include the logic needed to bridge the third-party library
3. **Do not** add `"use client"` to a server page or layout just to use a client library
4. **Export named components** from wrapper files for clarity
5. **Place wrapper components** in a `components/` directory for reusability

---

## Key Takeaway

> Third-party packages in the React ecosystem are in a transitional phase. Wrap components that need client-side features in your own client components to leverage the npm ecosystem while adhering to the server components model.
