import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Auth Demo</h1>
      <p>
        This is a mock authentication demo. In a real app, you would use
        <strong>NextAuth.js</strong>, <strong>Kinde</strong>, or <strong>Clerk</strong>.
      </p>
      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/dashboard">Dashboard (protected)</Link></li>
      </ul>
    </div>
  );
}
