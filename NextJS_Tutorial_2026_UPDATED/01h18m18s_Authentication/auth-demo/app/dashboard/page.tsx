import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?redirect=/dashboard');
  }

  async function handleLogout() {
    'use server';

    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.name}!</p>
      <p>This is a protected page. You can only see it if you are authenticated.</p>
      <ul>
        <li><strong>User ID:</strong> {session.id}</li>
        <li><strong>Email:</strong> {session.email}</li>
      </ul>
      <form action={handleLogout}>
        <button
          type="submit"
          style={{
            padding: '0.5rem 2rem',
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
      </form>
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
        In production, authentication would be handled by NextAuth.js, Kinde, or Clerk.
        The session check in this page uses a mock cookie-based approach.
      </p>
    </div>
  );
}
