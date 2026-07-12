import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  async function handleLogin(formData: FormData) {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Mock authentication: any non-empty credentials work.
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // In a real app, verify credentials against a database.
    // For this demo, any email/password combination succeeds.

    const cookieStore = await cookies();
    cookieStore.set('session', 'mock-session-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // Redirect back to the originally requested page, or to the dashboard
    redirect((searchParams.redirect as string) || '/dashboard');
  }

  return (
    <div>
      <h1>Login</h1>
      <p>Mock login: any email and password combination works.</p>
      <form action={handleLogin}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.25rem' }}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.25rem' }}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 2rem',
            background: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Log In
        </button>
      </form>
      <p style={{ marginTop: '1rem', color: '#666' }}>
        In production, this would use NextAuth.js, Kinde, or Clerk for authentication.
      </p>
    </div>
  );
}
