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

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = posts.find((p) => p.id === params.id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = posts.findIndex((p) => p.id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  posts.splice(index, 1);

  return NextResponse.json({ success: true });
}
