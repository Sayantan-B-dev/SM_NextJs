import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Users",
  description: "Browse all registered users",
};

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <p>Click on a user to view their full profile.</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>
              <strong>{user.name}</strong>
              <br />
              <span>{user.email}</span>
              <br />
              <small>{user.company.name}</small>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
