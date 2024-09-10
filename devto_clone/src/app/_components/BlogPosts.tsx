'use client';

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "./ui/Card";
import Link from "next/link";

export default function BlogPosts() {
  const { data: posts, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!posts || posts.length === 0) return <div>No posts found</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link href={`/post/${post.id}`} key={post.id}>
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={post.createdBy.image || "/default-avatar.png"}
                  alt={post.createdBy.name || "Author"}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{post.createdBy.name}</p>
                  <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{post.name}</h3>
              <div className="mb-4">
                {post.tags.map((tag, index) => (
                  <span key={index} className="mr-2 text-sm text-blue-500">
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{post.content}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}