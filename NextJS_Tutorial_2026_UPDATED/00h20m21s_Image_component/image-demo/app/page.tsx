import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      <h1>Image Component Demo</h1>

      <section style={{ marginBottom: 48 }}>
        <h2>Local Image (public/placeholder.svg)</h2>
        <p>This image is served from the <code>public/</code> folder.</p>
        <Image
          src="/placeholder.svg"
          alt="Local placeholder"
          width={400}
          height={200}
        />
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2>Hero Image with Priority</h2>
        <p>
          This image uses <code>priority</code>, which preloads it and skips
          lazy loading. It should appear in the initial HTML response.
        </p>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
          alt="Mountain landscape"
          width={800}
          height={400}
          priority
        />
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2>Remote Image (picsum.photos)</h2>
        <p>
          This is a remote image from picsum.photos, allowed via{" "}
          <code>remotePatterns</code> in next.config.ts.
        </p>
        <Image
          src="https://picsum.photos/seed/nextjs/800/400"
          alt="Random from picsum"
          width={800}
          height={400}
        />
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2>Fill Prop with objectFit: cover</h2>
        <p>
          The image below uses <code>fill</code> and{" "}
          <code>objectFit: &quot;cover&quot;</code> to fill its container.
        </p>
        <div style={{ position: "relative", width: "100%", height: 300, border: "1px solid #ccc" }}>
          <Image
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
            alt="Nature"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>
    </div>
  );
}
