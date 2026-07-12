import { notFound } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
  address: { street: string; city: string; zipcode: string };
}

async function fetchUser(id: string): Promise<User | null> {
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await fetchUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
      <p>
        <strong>Website:</strong> {user.website}
      </p>
      <p>
        <strong>Company:</strong> {user.company.name}
      </p>
      <p>
        <strong>Address:</strong> {user.address.street},{" "}
        {user.address.city} {user.address.zipcode}
      </p>
    </div>
  );
}
