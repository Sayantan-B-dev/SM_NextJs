import { NextResponse } from "next/server";

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

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

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: body.name,
      email: body.email,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
