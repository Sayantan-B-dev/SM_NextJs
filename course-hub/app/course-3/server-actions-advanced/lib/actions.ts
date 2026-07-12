"use server";

import { revalidatePath } from "next/cache";

let todos: Array<{ id: number; text: string }> = [
  { id: 1, text: "Learn server actions" },
  { id: 2, text: "Build a demo" },
];
let nextId = 3;

export type Todo = { id: number; text: string };
export type ActionResult = { success: boolean; errors?: { text?: string } };
export type DeleteResult = { success: boolean };

export async function createTodo(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const text = formData.get("text") as string;

  if (!text || text.trim().length === 0) {
    return { success: false, errors: { text: "Todo text is required" } };
  }
  if (text.trim().length < 3) {
    return { success: false, errors: { text: "Must be at least 3 characters" } };
  }

  todos.push({ id: nextId++, text: text.trim() });
  revalidatePath("/course-3/server-actions-advanced");
  return { success: true };
}

export async function deleteTodo(
  id: number
): Promise<DeleteResult> {
  todos = todos.filter((t) => t.id !== id);
  revalidatePath("/course-3/server-actions-advanced");
  return { success: true };
}

export async function getTodos(): Promise<Todo[]> {
  return todos;
}
