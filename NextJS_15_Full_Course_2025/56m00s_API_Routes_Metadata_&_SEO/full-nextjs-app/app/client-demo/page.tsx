"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function ClientDemoPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function fetchUser(id: number) {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      setSelectedUser(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSelectedUser(null);
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setFormMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create user");
      }

      const newUser = await res.json();
      setFormMessage(`User "${newUser.name}" created with ID ${newUser.id}`);
      setName("");
      setEmail("");
      await fetchUsers();
    } catch (err) {
      setFormMessage(
        err instanceof Error ? err.message : "An error occurred"
      );
    }
  }

  async function deleteUser(id: number) {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setFormMessage(`User deleted successfully`);
      if (selectedUser?.id === id) setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      setFormMessage(err instanceof Error ? err.message : "An error occurred");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Client Component API Demo</h1>
      <p>
        This page is a <strong>client component</strong> (has &quot;use
        client&quot;) that interacts with the in-memory API routes using
        relative URLs.
      </p>

      <div className="card">
        <h2>Create a New User</h2>
        <form onSubmit={createUser}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <button type="submit">Create User</button>
        </form>
        {formMessage && (
          <p
            style={{
              color: formMessage.includes("error") ? "#dc3545" : "#28a745",
              marginTop: "0.75rem",
            }}
          >
            {formMessage}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div className="card">
            <h2>All Users</h2>
            <button
              onClick={fetchUsers}
              className="secondary"
              style={{ marginBottom: "1rem" }}
            >
              Refresh List
            </button>

            {loading && <p>Loading users...</p>}
            {error && <p style={{ color: "#dc3545" }}>{error}</p>}

            {!loading && !error && (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>
                        <button
                          onClick={() => fetchUser(user.id)}
                          style={{ marginRight: "0.5rem", fontSize: "0.85rem" }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          style={{
                            background: "#dc3545",
                            fontSize: "0.85rem",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <div className="card">
            <h2>Selected User</h2>
            {selectedUser ? (
              <div>
                <p>
                  <strong>ID:</strong> {selectedUser.id}
                </p>
                <p>
                  <strong>Name:</strong> {selectedUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>Click &quot;View&quot; on a user to see details here.</p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>API Interaction Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Method</th>
              <th>Endpoint</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>List all users</td>
              <td>GET</td>
              <td>
                <code>/api/users</code>
              </td>
            </tr>
            <tr>
              <td>Get single user</td>
              <td>GET</td>
              <td>
                <code>/api/users/{`{id}`}</code>
              </td>
            </tr>
            <tr>
              <td>Create user</td>
              <td>POST</td>
              <td>
                <code>/api/users</code>
              </td>
            </tr>
            <tr>
              <td>Delete user</td>
              <td>DELETE</td>
              <td>
                <code>/api/users/{`{id}`}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
