const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function fetchPosts() {
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json() as Promise<Array<{ id: number; title: string; body: string; userId: number }>>;
}

export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json() as Promise<Array<{ id: number; name: string; email: string }>>;
}
