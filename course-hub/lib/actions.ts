"use server";

import { revalidatePath } from "next/cache";

interface Item {
  id: number;
  title: string;
}

const items: Item[] = [];
let nextId = 1;

export async function createItem(formData: FormData) {
  const title = formData.get("title") as string;
  if (!title || title.trim() === "") {
    throw new Error("Title is required");
  }
  items.push({ id: nextId++, title: title.trim() });
  revalidatePath("/course-2/server-actions");
}

export async function getItems() {
  return [...items];
}
