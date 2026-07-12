# Server Actions

Server Actions allow you to write server-side logic directly in your components without creating separate API routes. They handle form submissions, data mutations, and any server-side operations within the same file or a dedicated actions file.

## The "use server" Directive

The `"use server"` directive marks a function as a Server Action. This function runs exclusively on the server, never on the client.

### Inline Server Action

```typescript
// app/page.tsx
export default function HomePage() {
  async function submitForm(formData: FormData) {
    'use server';

    const name = formData.get('name');
    const email = formData.get('email');

    // Server-side logic here
    console.log(`Form submitted by ${name} (${email})`);
  }

  return (
    <form action={submitForm}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Dedicated Actions File

For better organization, create a dedicated actions file:

```typescript
// lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

interface Post {
  id: number;
  title: string;
  content: string;
}

const posts: Post[] = [];

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  if (!title || !content) {
    throw new Error('Title and content are required');
  }

  const newPost: Post = {
    id: posts.length + 1,
    title,
    content,
  };

  posts.push(newPost);
  revalidatePath('/');
}

export async function deletePost(formData: FormData) {
  const id = parseInt(formData.get('id') as string, 10);

  const index = posts.findIndex((p) => p.id === id);
  if (index !== -1) {
    posts.splice(index, 1);
  }

  revalidatePath('/');
}
```

## Server Actions vs API Routes

| Aspect              | Server Actions                        | API Routes                          |
|---------------------|---------------------------------------|-------------------------------------|
| Location            | In component or actions file          | `app/api/` directory                |
| HTTP Method         | POST (automatically)                  | Any (GET, POST, PUT, DELETE)        |
| URL                 | Same origin (no custom URL)           | Custom endpoint URLs                |
| Form Handling       | Direct `action` attribute             | Manual fetch from client            |
| Progressive Enhancement | Supported (works without JS)      | Requires JavaScript                 |
| Revalidation        | Built-in with `revalidatePath()`      | Manual or via webhooks              |
| Use Case            | Forms, buttons, mutations             | Third-party webhooks, public APIs   |

## Form Action Attribute (Progressive Enhancement)

The `action` attribute on form elements accepts a Server Action directly. This works without JavaScript enabled (progressive enhancement).

```typescript
// app/page.tsx
import { createPost } from '@/lib/actions';

export default function CreatePostForm() {
  return (
    <form action={createPost}>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" required />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" required />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
}
```

When the form is submitted:

1. The browser sends a POST request to the server
2. The Server Action processes the form data
3. The page revalidates and reflects the new data
4. This works even without client-side JavaScript

## Direct Function Calls from Buttons

Server Actions can be called directly from buttons or any event handler using `formAction` attribute:

```typescript
// app/posts/page.tsx
import { deletePost } from '@/lib/actions';

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <form action={deletePost}>
            <input type="hidden" name="id" value={post.id} />
            <button type="submit">Delete</button>
          </form>
        </li>
      ))}
    </ul>
  );
}
```

You can also call Server Actions from `useActionState` (formerly `useFormState`) for pending states:

```typescript
// app/posts/new.tsx
'use client';

import { useActionState } from 'react';
import { createPost } from '@/lib/actions';

const initialState = {
  message: '',
  success: false,
};

export default function CreatePostForm() {
  const [state, formAction, pending] = useActionState(createPost, initialState);

  return (
    <form action={formAction}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create Post'}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

## Revalidating After Mutations

After a mutation, call `revalidatePath()` or `revalidateTag()` to refresh the cached data:

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updatePost(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Update post in database
  await db.post.update({
    where: { id },
    data: { title, content },
  });

  // Revalidate the post page and the posts list
  revalidatePath(`/posts/${id}`);
  revalidatePath('/posts');

  // Optionally redirect
  redirect(`/posts/${id}`);
}
```

## Security Considerations

### Input Validation

Always validate and sanitize inputs on the server:

```typescript
'use server';

import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
});

export async function createPost(formData: FormData) {
  const validated = postSchema.parse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  // Proceed with validated data...
}
```

### Authentication Checks

Verify the user is authenticated before performing mutations:

```typescript
'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Only authenticated users can create posts
  await db.post.create({
    data: {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      authorId: session.user.id,
    },
  });

  revalidatePath('/posts');
}
```

### Authorization Checks

Ensure the user owns the resource they are modifying:

```typescript
'use server';

import { auth } from '@/lib/auth';

export async function deletePost(postId: number) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const post = await db.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.authorId !== session.user.id) {
    throw new Error('Not authorized to delete this post');
  }

  await db.post.delete({ where: { id: postId } });
  revalidatePath('/posts');
}
```

### CSRF Protection

Server Actions are automatically protected against CSRF because they require a specific header and use POST requests internally. You do not need to manually add CSRF tokens.

## Error Handling in Server Actions

### Try-Catch in Action

```typescript
'use server';

import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title) {
      return { error: 'Title is required' };
    }

    if (!content) {
      return { error: 'Content is required' };
    }

    // Simulate database call
    await db.post.create({ data: { title, content } });

    revalidatePath('/posts');
    return { success: true };
  } catch (error) {
    console.error('Failed to create post:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
```

### Error Handling in Client Component

```typescript
'use client';

import { useActionState } from 'react';
import { createPost } from '@/lib/actions';

type FormState = {
  error?: string;
  success?: boolean;
};

const initialState: FormState = {};

export default function CreatePostForm() {
  const [state, formAction] = useActionState(createPost, initialState);

  return (
    <form action={formAction}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit">Create Post</button>
      {state?.error && (
        <p style={{ color: 'red' }}>{state.error}</p>
      )}
      {state?.success && (
        <p style={{ color: 'green' }}>Post created successfully!</p>
      )}
    </form>
  );
}
```

## Best Practices

1. **Organize actions in a dedicated file**: Keep `lib/actions.ts` or `app/actions.ts` for all server actions
2. **Validate all inputs**: Use Zod or similar validation libraries
3. **Check authentication and authorization**: Always verify the user's identity and permissions
4. **Revalidate after mutations**: Use `revalidatePath()` or `revalidateTag()` to keep the UI in sync
5. **Handle errors gracefully**: Return structured error objects instead of throwing
6. **Use `redirect()` after successful mutations**: Redirect to the relevant page
7. **Keep actions pure functions**: Avoid side effects beyond the intended mutation

## Summary

- `"use server"` directive creates server-side functions callable from the client
- Form `action` attribute enables progressive enhancement (works without JS)
- Dedicated actions file (`lib/actions.ts`) keeps code organized
- `revalidatePath()` and `revalidateTag()` refresh cached data after mutations
- Always validate inputs and check authentication on the server
- Handle errors with try-catch and return structured responses
- Server Actions replace the need for separate API routes for form handling
