export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <p>
        You were redirected here because you tried to access a protected route
        without a valid session cookie.
      </p>
      <p>
        To simulate authentication, set a cookie named <code>session</code> with any value
        in your browser DevTools, then go back to <code>/admin</code>.
      </p>
      <p>In a real app, this page would have a login form.</p>
    </div>
  );
}
