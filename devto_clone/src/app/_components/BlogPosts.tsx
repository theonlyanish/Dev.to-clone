'use client';

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "./ui/Card";
import Link from "next/link";
import ReactMarkdown from "react-markdown";


export default function BlogPosts() {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!posts || posts.length === 0) return <div>No posts found</div>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id}>
          <Card className="hover:shadow-lg transition-shadow duration-200 dark:bg-lyra-dark dark:border-lyra-purple shadow-lyra-purple mb-4">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={post.createdBy.image || "/default-avatar.png"}
                  alt={post.createdBy.name || "Author"}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{post.createdBy.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{post.name}</h3>
              <div className="mb-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="mr-2 text-sm text-lyra-purple">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3"><ReactMarkdown>{post.content}</ReactMarkdown></p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}