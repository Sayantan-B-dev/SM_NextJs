import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>All Users</h1>
      <p>Click on a user to view their profile.</p>
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
