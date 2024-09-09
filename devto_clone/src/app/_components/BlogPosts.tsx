'use client';

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Skeleton } from "./ui/Skeleton";

export default function BlogPosts() {
  const { data: posts, isLoading, refetch } = api.post.getAll.useQuery();
  const { data: session } = useSession();
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (isLoading) return <PostFeedSkeleton />;
  if (!posts || posts.length === 0) return <NoBlogsMessage />;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden border-0 bg-white shadow-none dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-xl font-bold">{post.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{post.content}</p>
            <div className="mt-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="mr-2 text-sm text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              By {post.createdBy.name} on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {session && session.user.id === post.createdById && (
              <button
                onClick={() => deletePost.mutate({ id: post.id })}
                className="mt-2 bg-red-500 text-white p-1 rounded text-sm"
              >
                Delete
              </button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PostFeedSkeleton({ number = 3 }: { number?: number }) {
  return (
    <>
      {Array(number).fill(0).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </>
  );
}

function PostSkeleton() {
  return (
    <Card className="mb-4 overflow-hidden border-0 bg-white shadow-none dark:bg-zinc-900">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-4">
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardContent>
    </Card>
  );
}

function NoBlogsMessage() {
  return (
    <Card className="text-center p-6">
      <CardContent>
        <h2 className="text-xl font-bold mb-2">No Blogs Yet</h2>
        <p>Be the first to create a blog post!</p>
      </CardContent>
    </Card>
  );
}