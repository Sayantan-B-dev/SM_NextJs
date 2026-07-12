export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>
        This application was built to demonstrate the core concepts of Next.js
        file-based routing and navigation. It is part of the Next.js 15 Full
        Course 2025 curriculum.
      </p>
      <p>
        The navigation bar at the top is defined in the root layout
        (app/layout.tsx). Because it is placed outside the children prop, it
        persists across all pages without re-rendering.
      </p>
      <p>
        The Link component from next/link handles client-side navigation,
        prefetching pages in the background for instant transitions.
      </p>
    </div>
  );
}
