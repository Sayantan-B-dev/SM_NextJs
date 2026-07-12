export default function Home() {
  return (
    <section>
      <h1>Next.js 15 Routing Demo</h1>
      <p>
        This project demonstrates the App Router file-based routing system.
        Each page in this app lives in its own folder with a <code>page.tsx</code> file.
      </p>
      <h2>Routes in This Demo</h2>
      <ul>
        <li><code>/</code> - Home page (this page)</li>
        <li><code>/about</code> - About page (static route)</li>
        <li><code>/blog</code> - Blog listing page</li>
        <li><code>/blog/hello-world</code> - Dynamic route example (try any slug)</li>
      </ul>
      <h2>How Routing Works</h2>
      <p>
        Every folder inside <code>app/</code> maps to a URL segment.
        A <code>page.tsx</code> file makes that route accessible.
        Dynamic segments use <code>[param]</code> square bracket notation.
      </p>
    </section>
  )
}
