const posts = [
  { id: 1, title: "Getting Started with Next.js", content: "Learn how to build modern web applications with Next.js, the React framework for production." },
  { id: 2, title: "Server Components Explained", content: "Understand the difference between server and client components and when to use each." },
  { id: 3, title: "Data Fetching Patterns", content: "Explore different strategies for fetching data in Next.js, including SSR, SSG, and ISR." },
];

export const db = {
  post: {
    findMany: async () => [...posts],
    findUnique: async ({ where: { id } }: { where: { id: number } }) =>
      posts.find((p) => p.id === id) || null,
  },
};
