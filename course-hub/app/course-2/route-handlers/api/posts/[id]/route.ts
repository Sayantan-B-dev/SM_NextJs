import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  const post = store.getPost(id);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  const deleted = store.deletePost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Post deleted" });
}
