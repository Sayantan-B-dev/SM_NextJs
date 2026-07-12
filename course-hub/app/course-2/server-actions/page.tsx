import { createItem, getItems } from "@/lib/actions";
import Counter from "./counter";

export default async function ServerActionsPage() {
  const items = await getItems();

  return (
    <div>
      <h1 className="page-title">Server Actions</h1>
      <p className="page-subtitle">
        Server actions allow form handling and mutations without manually creating API routes.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Interactive Counter</h3>
        <p>This counter is a client component demonstrating the interaction pattern.</p>
        <Counter />
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Add Item</h3>
        <form action={createItem}>
          <input
            type="text"
            name="title"
            placeholder="Enter item title"
            required
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              color: "#e2e8f0",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              width: "100%",
              marginBottom: "0.75rem",
            }}
          />
          <button type="submit" className="btn">
            Add Item
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Items List</h3>
        {items.length === 0 ? (
          <p>No items yet. Add one above!</p>
        ) : (
          <ul style={{ listStyle: "none", marginTop: "0.75rem" }}>
            {items.map((item) => (
              <li
                key={item.id}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #334155",
                }}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
