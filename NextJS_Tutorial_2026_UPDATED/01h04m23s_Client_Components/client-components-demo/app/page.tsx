// This is a Server Component -- no "use client" directive.
// It safely fetches data and passes it to a Client Component.
import { UpvoteSection } from './upvote-section';

type Post = {
  id: string;
  title: string;
  votes: number;
};

async function getPosts(): Promise<Post[]> {
  // Simulate database fetch (runs only on the server)
  return [
    { id: '1', title: 'Understanding Server Components', votes: 12 },
    { id: '2', title: 'Client Components in Next.js', votes: 8 },
    { id: '3', title: 'The Composition Pattern', votes: 15 },
  ];
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Client Components Demo</h1>
      <p>
        This page is a <strong>Server Component</strong>. It fetches data and passes it
        to a <strong>Client Component</strong> (UpvoteSection) that handles interactivity.
        The <code>&quot;use client&quot;</code> boundary is pushed as deep as possible.
      </p>

      <h2>Posts</h2>
      <UpvoteSection posts={posts} />
    </div>
  );
}
