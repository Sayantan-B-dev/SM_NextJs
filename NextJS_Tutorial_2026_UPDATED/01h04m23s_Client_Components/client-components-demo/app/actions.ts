'use server';

import { revalidatePath } from 'next/cache';

export async function upvotePost(postId: string) {
  // In a real app, update the database
  // await db.post.update({ where: { id: postId }, data: { votes: { increment: 1 } } });
  console.log(`Upvoted post ${postId}`);

  revalidatePath('/');
}
