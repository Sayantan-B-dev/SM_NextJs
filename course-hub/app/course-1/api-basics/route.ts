import { NextRequest, NextResponse } from "next/server";

interface Item {
  id: number;
  name: string;
  description: string;
}

const items: Item[] = [
  { id: 1, name: "Learn Next.js", description: "Server components and routing" },
  { id: 2, name: "Build an App", description: "Put concepts into practice" },
  { id: 3, name: "Deploy to Vercel", description: "Ship your application" },
];

// GET /course-1/api-basics
// Returns the list of demo items as JSON
export async function GET() {
  return NextResponse.json(items);
}

// POST /course-1/api-basics
// Accepts a JSON body with { name: string, description: string }
// Returns the created item with a 201 status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Input validation
    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 }
      );
    }
    if (
      !body.description ||
      typeof body.description !== "string" ||
      body.description.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Description is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const newItem: Item = {
      id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      name: body.name.trim(),
      description: body.description.trim(),
    };

    items.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
