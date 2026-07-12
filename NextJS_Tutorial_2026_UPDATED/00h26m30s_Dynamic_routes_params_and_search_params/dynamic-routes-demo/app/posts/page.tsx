import Link from "next/link";

// searchParams is a Promise in Next.js 15
type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function PostsPage({ searchParams }: Props) {
  const { search } = await searchParams;
  const query = search || "";

  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts: { id: number; title: string; body: string }[] =
    await res.json();

  const filtered = query
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      )
    : posts;

  return (
    <div>
      <h1>Posts</h1>

      <form style={{ marginBottom: 16 }}>
        <input
          type="text"
          name="search"
          defaultValue={query}
          placeholder="Search posts by title..."
          style={{ padding: 8, width: 300 }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>
          Search
        </button>
      </form>

      <p>
        {query
          ? `Showing results for "${query}" (${filtered.length} posts)`
          : `Showing all posts (${filtered.length})`}
      </p>

      <ul>
        {filtered.map((post) => (
          <li key={post.id} style={{ marginBottom: 8 }}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
