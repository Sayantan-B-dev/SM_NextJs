// Mock authentication module.
// In a real app, this would use NextAuth.js, Kinde, Clerk, etc.
// This demonstrates the pattern for cookie-based session checking.

import { cookies } from 'next/headers';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

const MOCK_USER: SessionUser = {
  id: '1',
  email: 'user@example.com',
  name: 'Demo User',
};

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  // In a real app, verify the JWT or database session here.
  // For the demo, any non-empty cookie value is considered valid.
  return MOCK_USER;
}

export async function createSession(): Promise<void> {
  // In a real app, create a JWT or database session and set the cookie.
  // The middleware.ts will check for this cookie.
  // This function is intentionally empty -- the cookie is set by the login action.
}

export async function destroySession(): Promise<void> {
  // In a real app, invalidate the session in the database.
  // The cookie will be cleared by the logout action.
}
