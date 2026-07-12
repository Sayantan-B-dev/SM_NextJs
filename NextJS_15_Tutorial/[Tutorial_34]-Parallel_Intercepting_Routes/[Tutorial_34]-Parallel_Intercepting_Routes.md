# Parallel Intercepting Routes

## Overview

Combining parallel routes with intercepting routes creates a powerful pattern for modals and overlays. The modal content renders in a parallel route slot while the main page remains visible underneath. Navigation updates the URL, and direct access shows the full page rather than the modal.

### Demo: Photo Feed with Modal Details

Visiting `/photo-feed` displays an image gallery. Clicking an image opens a modal overlay with the enlarged photo and details (name, photographer, location). The URL updates to `/photo-feed/[id]`. The back/forward browser buttons open and close the modal smoothly. Refreshing or sharing the URL loads the dedicated photo detail page.

## Implementation Steps

### Step 1: Directory Structure

```
app/
  photo-feed/
    layout.tsx
    page.tsx
    @modal/
      default.tsx
      (.)[id]/
        page.tsx
    [id]/
      page.tsx
    photos/
      (image files)
components/
  modal.tsx
lib/
  wonders.ts
```

### Step 2: Data and Images

Store images in `photo-feed/photos/`. Create a TypeScript file to organize the data.

**`lib/wonders.ts`**:

```tsx
import { StaticImageData } from "next/image";
import photo1 from "@/app/photo-feed/photos/1.jpg";
import photo2 from "@/app/photo-feed/photos/2.jpg";
// ... additional imports

export interface Wonder {
  id: string;
  name: string;
  source: StaticImageData;
  photographer: string;
  location: string;
}

export const wonders: Wonder[] = [
  { id: "1", name: "Great Wall of China", source: photo1, photographer: "John Doe", location: "China" },
  { id: "2", name: "Petra", source: photo2, photographer: "Jane Smith", location: "Jordan" },
  // ... additional wonders
];
```

### Step 3: Photo Feed Page

**`photo-feed/page.tsx`**:

```tsx
import Link from "next/link";
import Image from "next/image";
import { wonders } from "@/lib/wonders";

export default function PhotoFeed() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {wonders.map(({ id, name, source }) => (
        <Link key={id} href={`/photo-feed/${id}`}>
          <Image src={source} alt={name} />
        </Link>
      ))}
    </div>
  );
}
```

### Step 4: Dynamic Photo Detail Page

**`photo-feed/[id]/page.tsx`**:

```tsx
import Image from "next/image";
import { wonders } from "@/lib/wonders";

interface PhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { id } = await params;
  const wonder = wonders.find((w) => w.id === id);

  if (!wonder) return <div>Photo not found</div>;

  return (
    <div>
      <h1>{wonder.name}</h1>
      <Image src={wonder.source} alt={wonder.name} />
      <p>Photographer: {wonder.photographer}</p>
      <p>Location: {wonder.location}</p>
    </div>
  );
}
```

### Step 5: Parallel Route for Modal

**`photo-feed/layout.tsx`**:

```tsx
interface PhotoFeedLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function PhotoFeedLayout({ children, modal }: PhotoFeedLayoutProps) {
  return (
    <div>
      {children}
      {modal}
    </div>
  );
}
```

**`photo-feed/@modal/default.tsx`** -- Renders nothing on initial load:

```tsx
export default function Default() {
  return null;
}
```

**`photo-feed/@modal/(.)[id]/page.tsx`** -- Intercepted modal for photo details:

```tsx
import Image from "next/image";
import { wonders } from "@/lib/wonders";
import Modal from "@/components/modal";

interface PhotoModalProps {
  params: Promise<{ id: string }>;
}

export default async function PhotoModal({ params }: PhotoModalProps) {
  const { id } = await params;
  const wonder = wonders.find((w) => w.id === id);

  if (!wonder) return <div>Photo not found</div>;

  return (
    <Modal>
      <Image src={wonder.source} alt={wonder.name} />
      <p>{wonder.name}</p>
      <p>Photographer: {wonder.photographer}</p>
      <p>Location: {wonder.location}</p>
    </Modal>
  );
}
```

### Step 6: Modal Component

**`components/modal.tsx`**:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

export default function Modal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => e.target === overlayRef.current && router.back()}
    >
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        {children}
        <button onClick={() => router.back()}>Close</button>
      </div>
    </div>
  );
}
```

## How It Works

| Action                      | Behavior                                                  |
|-----------------------------|-----------------------------------------------------------|
| Initial load of `/photo-feed` | `@modal` renders `default.tsx` (null); feed page renders |
| Click an image              | `@modal/(.)[id]` intercepts navigation; modal appears with photo details; URL updates to `/photo-feed/[id]` |
| Back / forward buttons      | Modal opens/closes without navigating away from the feed  |
| Page refresh at `/photo-feed/[id]` | `@modal` has no match; `[id]/page.tsx` renders the full detail page |
| Direct URL access           | Same as refresh -- full page renders, no modal            |

## Key Points

- The `@modal` parallel route keeps the feed visible behind the overlay
- Interception `(.)[id]` captures client-side navigation to the photo detail route
- `default.tsx` in the modal slot ensures no empty UI on initial load
- Back/forward navigation works correctly without losing context
- Direct access or refresh bypasses the interception and renders the full page
