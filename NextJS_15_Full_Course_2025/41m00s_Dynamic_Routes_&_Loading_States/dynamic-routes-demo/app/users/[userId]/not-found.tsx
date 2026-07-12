import Link from "next/link";

export default function UserNotFound() {
  return (
    <div>
      <h2>User Not Found</h2>
      <p>The user you are looking for does not exist or has been removed.</p>
      <Link href="/users">Back to Users</Link>
    </div>
  );
}
