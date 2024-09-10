import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await api.post.getById({ id: parseInt(params.id) });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Link href="/" className="flex items-center text-blue-500 hover:underline mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">{post.name}</h1>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>By {post.createdBy.name}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mb-6">
        {post.tags.map((tag, index) => (
          <span key={index} className="mr-2 text-sm text-blue-500">
            #{tag}
          </span>
        ))}
      </div>
      <div className="prose prose-lg max-w-none">
        {post.content}
      </div>
    </div>
  );
}
