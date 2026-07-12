import Link from "next/link";
import Image from "next/image";

export default function ImagesDemo() {
  return (
    <div>
      <h1 className="page-title">Image Optimization with next/image</h1>
      <p className="page-subtitle">
        The next/image component provides automatic optimization, lazy loading,
        responsive sizes, and priority loading for images.
      </p>

      {/* LOCAL IMAGE WITH PRIORITY */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Local Image (from /public) with priority</h2>
        <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
          Local images are imported or referenced from the <code>/public</code> folder.
          The <code>priority</code> prop tells Next.js to preload this image (skip lazy
          loading) -- useful for above-the-fold content. <code>width</code> and{" "}
          <code>height</code> are required for local images so Next can determine the
          aspect ratio.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            background: "#0f172a",
            padding: "2rem",
            borderRadius: "0.5rem",
            border: "1px solid #334155",
          }}
        >
          <Image
            src="/course-1/logo.svg"
            alt="Course Hub Logo"
            width={200}
            height={200}
            priority
          />
        </div>
      </div>

      {/* REMOTE IMAGE WITH FILL PROP */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Remote Image with fill and objectFit cover</h2>
        <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
          Remote images require the domain to be added to{" "}
          <code>next.config.ts {'->'} images.remotePatterns</code>. The <code>fill</code>{" "}
          prop makes the image fill its parent container. Use{" "}
          <code>objectFit: &quot;cover&quot;</code> to maintain aspect ratio. The parent
          must have <code>position: relative</code> and a defined size.
        </p>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            borderRadius: "0.5rem",
            overflow: "hidden",
            background: "#0f172a",
            border: "1px solid #334155",
          }}
        >
          <Image
            src="https://picsum.photos/seed/course/800/400"
            alt="Random landscape from picsum"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* DIFFERENT SIZES */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2>Different Image Sizes</h2>
        <p style={{ marginBottom: "1rem", color: "#94a3b8" }}>
          You can render the same remote image at different sizes. Next.js
          automatically generates responsive srcsets based on the <code>sizes</code>{" "}
          attribute, delivering the optimal image for the viewport.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <Image
              src="https://picsum.photos/seed/demo1/400/300"
              alt="Small 200x150"
              width={200}
              height={150}
              style={{ borderRadius: "0.375rem" }}
            />
            <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              200 x 150
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <Image
              src="https://picsum.photos/seed/demo2/400/300"
              alt="Medium 300x225"
              width={300}
              height={225}
              style={{ borderRadius: "0.375rem" }}
            />
            <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              300 x 225
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <Image
              src="https://picsum.photos/seed/demo3/400/300"
              alt="Large 400x300"
              width={400}
              height={300}
              style={{ borderRadius: "0.375rem" }}
            />
            <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              400 x 300
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Key next/image Props</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", color: "#94a3b8" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #334155", color: "#f1f5f9" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Prop</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "0.5rem" }}><code>src</code></td>
              <td style={{ padding: "0.5rem" }}>Image path (local or remote URL)</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "0.5rem" }}><code>width</code> / <code>height</code></td>
              <td style={{ padding: "0.5rem" }}>Required for local; sets intrinsic dimensions</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "0.5rem" }}><code>fill</code></td>
              <td style={{ padding: "0.5rem" }}>Fills parent container; use with <code>objectFit</code></td>
            </tr>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "0.5rem" }}><code>priority</code></td>
              <td style={{ padding: "0.5rem" }}>Preloads image; skip lazy loading</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "0.5rem" }}><code>sizes</code></td>
              <td style={{ padding: "0.5rem" }}>Responsive sizes hint for srcset generation</td>
            </tr>
            <tr>
              <td style={{ padding: "0.5rem" }}><code>style</code></td>
              <td style={{ padding: "0.5rem" }}>Inline styles (e.g., borderRadius, objectFit)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link href="/course-1" className="btn" style={{ marginTop: "1.5rem", display: "inline-block" }}>
        Back to Course 1
      </Link>
    </div>
  );
}
