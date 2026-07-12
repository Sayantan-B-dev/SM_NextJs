export interface Post {
  id: number;
  title: string;
  content: string;
}

const posts: Post[] = [
  { id: 1, title: "First Post", content: "This is the first post." },
  { id: 2, title: "Second Post", content: "This is the second post." },
];

let nextId = 3;

export const store = {
  getPosts: () => [...posts],
  getPost: (id: number) => posts.find((p) => p.id === id) || null,
  createPost: (title: string, content: string) => {
    const post: Post = { id: nextId++, title, content };
    posts.push(post);
    return post;
  },
  deletePost: (id: number) => {
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    return true;
  },
};
