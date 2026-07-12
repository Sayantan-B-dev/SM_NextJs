export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>
        Welcome to the Routes & Navigation demo application. This is a
        multi-page Next.js 15 app that demonstrates file-based routing and
        client-side navigation using the Link component.
      </p>
      <p>
        Pages in this app are created by placing page.tsx files inside folders
        within the app directory. The folder structure determines the URL paths.
      </p>
      <ul>
        <li><strong>/ (Home)</strong> -- app/page.tsx</li>
        <li><strong>/about</strong> -- app/about/page.tsx</li>
        <li><strong>/contact</strong> -- app/contact/page.tsx</li>
      </ul>
    </div>
  );
}
