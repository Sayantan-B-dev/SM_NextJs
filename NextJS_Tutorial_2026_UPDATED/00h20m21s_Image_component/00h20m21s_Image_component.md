# Image Component in Next.js

The `next/image` component is a powerful extension of the HTML `<img>` element, optimized for modern web performance. It provides automatic image optimization, lazy loading, responsive sizing, and priority loading.

## Key Features

| Feature | Description |
|---|---|
| **Automatic Optimization** | Images are resized, compressed, and converted to modern formats (WebP, AVIF) on-the-fly |
| **Lazy Loading** | Images load only when they enter the viewport, reducing initial page weight |
| **Priority Loading** | Hero images above the fold can skip lazy loading with the `priority` attribute |
| **Responsive Sizes** | Automatically generates multiple sizes and serves the best fit for the device |
| **Stable Layout** | Prevents layout shift by reserving space based on `width` and `height` |
| **Remote Images** | Supports external images with configurable domain allowlists |

## Basic Usage

```tsx
import Image from "next/image";

// Local image from public folder
<Image
  src="/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={600}
/>

// Remote image
<Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
/>
```

## Props Reference

| Prop | Type | Required | Description |
|---|---|---|---|
| `src` | string | Yes | Path to image (local in `public/` or remote URL) |
| `alt` | string | Yes | Accessible description of the image |
| `width` | number | Required for static images | Intrinsic width in pixels |
| `height` | number | Required for static images | Intrinsic height in pixels |
| `priority` | boolean | No | When true, preloads the image and skips lazy loading |
| `fill` | boolean | No | Makes image fill its parent container (requires `sizes`) |
| `quality` | number (1-100) | No | Image compression quality, defaults to 75 |
| `sizes` | string | No | Responsive sizes attribute for `fill` images |
| `className` | string | No | CSS class for styling |
| `placeholder` | "blur" \| "empty" | No | Shows blur-up placeholder while loading |

## Local Images from `public/`

Place images in the `public/` folder and reference them with a leading slash:

```
public/
  hero.jpg
  logo.png
  avatar.webp
```

```tsx
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} />
```

For local images, you can omit `width` and `height` if you use `import`:

```tsx
import heroImage from "@/public/hero.jpg";

<Image src={heroImage} alt="Hero" />
```

## Remote Images and `remotePatterns`

To serve remote images, you must configure `remotePatterns` in `next.config.ts` to allowlist external hosts:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
```

```tsx
<Image
  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
  alt="Mountain landscape"
  width={800}
  height={400}
/>
```

## The `fill` Prop with `objectFit`

When using `fill`, the image expands to fill its parent container. You must set the parent to `position: relative` and specify `sizes` for responsive behavior.

```tsx
<div style={{ position: "relative", width: "100%", height: 400 }}>
  <Image
    src="/banner.jpg"
    alt="Banner"
    fill
    sizes="100vw"
    style={{ objectFit: "cover" }}
  />
</div>
```

Common `objectFit` values:
- `"cover"` - Covers the container, may crop
- `"contain"` - Fits within the container, may leave space
- `"fill"` - Stretches to fill exactly
- `"none"` - No scaling
- `"scale-down"` - Acts as `none` or `contain`, whichever is smaller

## The `priority` Prop

The `priority` attribute should be used on the largest above-the-fold image (hero image). It skips lazy loading and preloads the image, improving Largest Contentful Paint (LCP).

```tsx
<Image
  src="/hero.jpg"
  alt="Hero banner"
  width={1200}
  height={600}
  priority
/>
```

## The `quality` Prop

Control the compression quality. Lower values reduce file size at the cost of visual fidelity.

```tsx
<Image src="/photo.jpg" alt="Photo" width={800} height={600} quality={90} />
```

## The `sizes` Prop

For responsive images using `fill`, the `sizes` attribute tells the browser which image size to load based on viewport width.

```tsx
<Image
  src="/responsive.jpg"
  alt="Responsive image"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: "cover" }}
/>
```

## Best Practices

1. **Always provide `alt` text** for accessibility.
2. **Use `priority` on hero images** to skip lazy loading and improve LCP.
3. **Configure `remotePatterns`** for all external image domains.
4. **Use `fill` + `sizes` + `objectFit`** for fully responsive background-style images.
5. **Optimize before importing** -- Next.js handles optimization but smaller source images reduce build times.
6. **Avoid layout shift** by always specifying `width` and `height` or using `fill`.
7. **Use modern formats** -- Next.js automatically converts to WebP and AVIF when supported by the browser.
