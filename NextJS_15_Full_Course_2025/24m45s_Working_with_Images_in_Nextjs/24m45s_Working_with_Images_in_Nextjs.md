# Working with Images in Next.js

Next.js provides a powerful built-in Image component via `next/image` that extends the HTML `<img>` element with automatic image optimization. It is the recommended way to serve images in Next.js applications.

---

## The Next.js Image Component (`next/image`)

The `next/image` component is a drop-in replacement for `<img>` that automatically optimizes images for performance. It resizes, compresses, and serves images in modern formats (WebP, AVIF) — all without any manual configuration.

### Why It Matters

- Delivers responsive images based on viewport size
- Serves optimized formats automatically
- Prevents layout shift (Cumulative Layout Shift / CLS)
- Lazy loads images by default
- Reduces bandwidth usage significantly

---

## Key Features

### Automatic Size Optimization

The Image component automatically generates multiple sizes of each image and serves the most appropriate one based on the device's screen width. It converts images to modern formats like WebP and AVIF when the browser supports them.

### Lazy Loading by Default

Images are lazy-loaded by default using the native `loading="lazy"` attribute. The image only loads when it enters the viewport, saving bandwidth and improving initial page load performance.

### Priority Loading

For above-the-fold images (hero banners, LCP candidates), use the `priority` prop. This bypasses lazy loading and preloads the image using a `<link rel="preload">` tag.

```tsx
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
```

### Placeholder Support

- `placeholder="blur"` — Shows a blurred, low-resolution version of the image while the full image loads. Requires the image to be imported statically (for local images) or a `blurDataURL` to be provided.
- `placeholder="empty"` — No placeholder (default).

### Stable Layout (Prevents CLS)

By requiring explicit `width` and `height` (or using the `fill` prop with a sized container), the Image component reserves space for the image before it loads, preventing layout shifts.

---

## Using Local Images (from `public/` folder)

Images stored in the `public/` folder can be referenced directly by path. Width and height are required (or use `fill`).

```tsx
import Image from "next/image";

export default function Page() {
  return (
    <Image
      src="/logo.png"
      alt="Company Logo"
      width={200}
      height={200}
      priority
    />
  );
}
```

You can also import local images directly (works only for images in the `public/` folder or imported statically):

```tsx
import Image from "next/image";
import profilePic from "../public/profile.jpg";

export default function Page() {
  return <Image src={profilePic} alt="Profile" placeholder="blur" />;
}
```

When importing statically, `width`, `height`, and `blurDataURL` are automatically provided.

---

## Image Props Explained

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `src` | `string \| StaticImport` | Yes | Image path (local or remote URL) |
| `alt` | `string` | Yes | Accessibility text |
| `width` | `number` | Required (unless `fill`) | Intrinsic width in pixels |
| `height` | `number` | Required (unless `fill`) | Intrinsic height in pixels |
| `priority` | `boolean` | No | Bypasses lazy loading, preloads the image |
| `className` | `string` | No | CSS class for styling |
| `quality` | `number` | No | Image quality (1-100), default 75 |
| `fill` | `boolean` | No | Makes image fill parent container |
| `placeholder` | `"blur" \| "empty"` | No | Placeholder type |
| `style` | `object` | No | Inline styles |
| `sizes` | `string` | No | Media query based responsive sizes |

### The `fill` Prop

When `fill` is `true`, the image stretches to fill its parent container. The parent must have `position: relative` (or `absolute`/`fixed`) and defined dimensions.

```tsx
<div style={{ position: "relative", width: "100%", height: "400px" }}>
  <Image src="/hero.jpg" alt="Hero" fill style={{ objectFit: "cover" }} />
</div>
```

Combine `fill` with `objectFit` (via CSS) to control how the image covers the area:
- `object-fit: cover` — Scales to cover the area, may crop
- `object-fit: contain` — Scales to fit within, may leave space
- `object-position` — Adjusts the focus point

---

## Using Remote Images

Remote images require configuration in `next.config.ts` to whitelist allowed hostnames. This is a security measure.

### Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

Each entry in `remotePatterns` supports:
- `protocol` — `http` or `https`
- `hostname` — The domain (supports wildcards: `**.example.com`)
- `port` — Optional port restriction
- `pathname` — Optional path pattern (`/**` for all paths)

### Usage

Once configured, use remote images with `width` and `height` (or `fill`):

```tsx
<Image
  src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b"
  alt="Mountain"
  width={800}
  height={600}
/>
```

---

## Complete Gallery Example

```tsx
import Image from "next/image";

const images = [
  { src: "/gallery/photo1.jpg", alt: "Sunset", width: 600, height: 400 },
  { src: "/gallery/photo2.jpg", alt: "Ocean", width: 800, height: 600 },
];

export default function Gallery() {
  return (
    <div className="gallery">
      {images.map((img, i) => (
        <div key={i} className="gallery-item">
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            className="rounded-image"
          />
          <p className="caption">{img.alt}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Best Practices

1. **Always provide `alt` text** — It is required by the Image component and critical for accessibility.
2. **Use `priority` for LCP images** — Hero banners and above-the-fold images should use `priority`.
3. **Use `sizes` for responsive images** — Helps the browser select the right image size.
4. **Use `fill` with `objectFit: "cover"`** — For full-width banners and background-style images.
5. **Set width and height** — Prevents layout shift even when using `fill` (via parent sizing).
6. **Configure `remotePatterns`** — Always whitelist remote image sources explicitly.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Remote image not loading | Add hostname to `remotePatterns` in `next.config.ts` |
| Image too large | Use `quality` prop (lower values = smaller files) |
| Layout shift | Always specify `width` and `height` (or use `fill` with sized parent) |
| Slow above-the-fold images | Add `priority` prop |
