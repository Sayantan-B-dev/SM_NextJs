export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>
      <p>
        This link has <code>prefetch={false}</code>. In DevTools, hover over the
        About link in the navbar -- no prefetch request is made. Compare with the
        default prefetch behavior on the Home and Posts links.
      </p>
    </div>
  );
}
