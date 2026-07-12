export default function AdminPage() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome! You have a valid session cookie and can access this protected page.</p>
      <p>
        If you did not set a session cookie, the middleware would have redirected you to <code>/login</code>.
      </p>
    </div>
  );
}
