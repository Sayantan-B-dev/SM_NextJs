import Image from "next/image";

const galleryImages = [
  {
    src: "https://i0.wp.com/picjumbo.com/wp-content/uploads/picnic-with-a-gorgeous-view-free-photo.jpeg?w=600&quality=80",
    alt: "Picnic with a gorgeous sunset view over the mountains",
    width: 600,
    height: 400,
    title: "Picnic with a View",
    source: "picjumbo.com",
    priority: true,
  },
  {
    src: "https://pixabay.com/images/download/x-10365820_1920.jpg",
    alt: "Abstract artistic design with vibrant colors",
    width: 800,
    height: 533,
    title: "Abstract Art",
    source: "pixabay.com",
    priority: false,
  },
  {
    src: "https://gratisography.com/wp-content/uploads/2025/05/gratisography-moon-robot-800x525.jpg",
    alt: "A whimsical robot standing on the moon surface",
    width: 800,
    height: 525,
    title: "Moon Robot",
    source: "gratisography.com",
    priority: false,
  },
  {
    src: "https://cdn.stocksnap.io/img-thumbs/280h/calm-water_HIZQN4OYDX.jpg",
    alt: "Calm water surface with gentle ripples at sunset",
    width: 445,
    height: 280,
    title: "Calm Water",
    source: "stocksnap.io",
    priority: false,
  },
];

export default function HomePage() {
  return (
    <main className="container">
      <h1 className="page-title">Image Gallery</h1>
      <p className="page-subtitle">
        Demonstrating next/image with remote images, priority loading, and lazy
        loading
      </p>

      <div className="gallery-grid">
        {galleryImages.map((img, index) => (
          <div key={index} className="gallery-card">
            <div className="image-wrapper">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                style={{ objectFit: "cover" }}
                priority={img.priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="card-body">
              <h2 className="card-title">{img.title}</h2>
              <p className="card-source">Source: {img.source}</p>
              <div className="card-badges">
                <span className={`badge ${img.priority ? "badge-priority" : "badge-lazy"}`}>
                  {img.priority ? "Priority" : "Lazy Loaded"}
                </span>
                <span className="badge badge-fill">fill + objectFit: cover</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
