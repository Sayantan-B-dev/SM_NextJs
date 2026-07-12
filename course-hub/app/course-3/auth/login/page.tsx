import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function loginAction(formData: FormData) {
  "use server";

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === "admin" && password === "password") {
    (await cookies()).set("session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    redirect("/course-3/auth/dashboard");
  }
}

export default function LoginPage() {
  return (
    <div>
      <h1 className="page-title">Login</h1>
      <p className="page-subtitle">
        Use username &quot;admin&quot; and password &quot;password&quot;.
      </p>
      <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
        <form action={loginAction}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="username"
              style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: 4,
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: 4,
                boxSizing: "border-box",
              }}
            />
          </div>
          <button type="submit" className="btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
