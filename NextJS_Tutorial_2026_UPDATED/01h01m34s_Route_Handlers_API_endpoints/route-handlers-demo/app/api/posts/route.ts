import { NextRequest, NextResponse } from 'next/server';

type Post = {
  id: string;
  title: string;
  content: string;
};

const posts: Post[] = [
  { id: '1', title: 'First Post', content: 'This is the first post.' },
  { id: '2', title: 'Second Post', content: 'This is the second post.' },
];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: 'Title and content are required' },
      { status: 400 }
    );
  }

  const newPost: Post = {
    id: String(posts.length + 1),
    title: body.title,
    content: body.content,
  };

  posts.push(newPost);

  return NextResponse.json(newPost, { status: 201 });
}
