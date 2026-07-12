import type { Metadata } from "next";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const user = await fetchUser(userId);

  if (!user) {
    return { title: "User Not Found" };
  }

  return {
    title: `${user.name} -- User Profile`,
    description: `View the profile of ${user.name}. Contact them at ${user.email} or ${user.phone}.`,
    openGraph: {
      title: `${user.name} -- User Profile`,
      description: `Profile of ${user.name} from ${user.company.name}`,
    },
  };
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

      <div className="card">
        <h2>Contact Information</h2>
        <table>
          <tbody>
            <tr>
              <td>Email</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{user.phone}</td>
            </tr>
            <tr>
              <td>Website</td>
              <td>{user.website}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>Company</h2>
        <p>{user.company.name}</p>
      </div>

      <div className="card">
        <h2>Address</h2>
        <p>
          {user.address.street}, {user.address.city} {user.address.zipcode}
        </p>
      </div>
    </div>
  );
}
