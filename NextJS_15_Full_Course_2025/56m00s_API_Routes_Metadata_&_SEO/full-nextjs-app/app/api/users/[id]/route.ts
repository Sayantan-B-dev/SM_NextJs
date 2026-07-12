import { NextResponse } from "next/server";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// In-memory store (shared across requests in dev mode)
let users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    createdAt: "2025-02-20T14:30:00Z",
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    createdAt: "2025-03-10T09:15:00Z",
  },
];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = users.findIndex((u) => u.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const deletedUser = users.splice(index, 1)[0];

  return NextResponse.json({
    message: "User deleted successfully",
    user: deletedUser,
  });
}
