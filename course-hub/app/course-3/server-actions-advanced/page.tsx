"use client";

import { useActionState, useOptimistic, startTransition } from "react";
import { createTodo, deleteTodo, getTodos, type Todo } from "./lib/actions";
import { useEffect, useState } from "react";

function TodoList({
  todos,
  onDelete,
}: {
  todos: Todo[];
  onDelete: (id: number) => void;
}) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.5rem 0",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <span>{todo.text}</span>
          <button
            onClick={() => onDelete(todo.id)}
            style={{
              background: "#d32f2f",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "0.25rem 0.6rem",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function ServerActionsAdvancedPage() {
  const [serverTodos, setServerTodos] = useState<Todo[]>([]);

  useEffect(() => {
    getTodos().then(setServerTodos);
  }, []);

  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    serverTodos,
    (state, newTodo: Todo) => [...state, newTodo]
  );
  const [optimisticDeletes, addOptimisticDelete] = useOptimistic(
    optimisticTodos,
    (state, id: number) => state.filter((t) => t.id !== id)
  );

  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => {
      const optimisticTodo: Todo = {
        id: Date.now(),
        text: formData.get("text") as string,
      };
      startTransition(() => addOptimisticTodo(optimisticTodo));
      const result = await createTodo(null, formData);
      const updated = await getTodos();
      setServerTodos(updated);
      return result;
    },
    null
  );

  async function handleDelete(id: number) {
    startTransition(() => addOptimisticDelete(id));
    await deleteTodo(id);
    const updated = await getTodos();
    setServerTodos(updated);
  }

  return (
    <div>
      <h1 className="page-title">Server Actions Advanced</h1>
      <p className="page-subtitle">
        useActionState for form validation and useOptimistic for instant UI
        updates.
      </p>

      <div className="card" style={{ maxWidth: 500 }}>
        <form action={formAction}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              name="text"
              type="text"
              placeholder="Add a todo..."
              style={{
                flex: 1,
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            />
            <button type="submit" className="btn" disabled={isPending}>
              {isPending ? "Adding..." : "Add"}
            </button>
          </div>
          {state?.errors?.text && (
            <p style={{ color: "#d32f2f", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              {state.errors.text}
            </p>
          )}
        </form>

        <div style={{ marginTop: "1.5rem" }}>
          <TodoList todos={optimisticDeletes} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

type ActionResult = { success: boolean; errors?: { text?: string } };
