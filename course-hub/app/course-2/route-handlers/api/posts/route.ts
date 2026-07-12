import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  return NextResponse.json(store.getPosts());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 }
    );
  }
  const post = store.createPost(body.title, body.content);
  return NextResponse.json(post, { status: 201 });
}
