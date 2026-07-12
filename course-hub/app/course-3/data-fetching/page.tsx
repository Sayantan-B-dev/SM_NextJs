import { fetchPosts, fetchUsers } from "./lib/api";

export default async function DataFetchingPage() {
  const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()]);
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  return (
    <div>
      <h1 className="page-title">Data Fetching Patterns</h1>
      <p className="page-subtitle">
        Posts and users fetched in parallel using Promise.all.
      </p>
      <div className="grid-2">
        {posts.slice(0, 8).map((post) => {
          const user = userMap[post.userId];
          return (
            <div key={post.id} className="card">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                By {user?.name ?? "Unknown"} ({user?.email ?? ""})
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
