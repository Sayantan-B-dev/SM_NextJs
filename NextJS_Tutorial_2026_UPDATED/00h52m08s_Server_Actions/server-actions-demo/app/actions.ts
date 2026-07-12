'use server';

import { revalidatePath } from 'next/cache';

type Post = {
  id: number;
  title: string;
  content: string;
};

const posts: Post[] = [
  { id: 1, title: 'Getting Started with Next.js', content: 'Next.js is a React framework for production.' },
  { id: 2, title: 'Server Actions Explained', content: 'Server Actions allow you to write server-side logic directly in components.' },
];

export async function getPosts(): Promise<Post[]> {
  return posts;
}

export async function createPost(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !title.trim()) {
    return { error: 'Title is required.' };
  }

  if (!content || !content.trim()) {
    return { error: 'Content is required.' };
  }

  if (title.length > 200) {
    return { error: 'Title must be 200 characters or fewer.' };
  }

  const newPost: Post = {
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    title: title.trim(),
    content: content.trim(),
  };

  posts.push(newPost);
  revalidatePath('/');
  return { success: true };
}

export async function deletePost(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const id = parseInt(formData.get('id') as string, 10);

  if (isNaN(id)) {
    return { error: 'Invalid post ID.' };
  }

  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return { error: 'Post not found.' };
  }

  posts.splice(index, 1);
  revalidatePath('/');
  return { success: true };
}
