import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await api.post.getById({ id: parseInt(params.id) });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 bg-white dark:bg-lyra-dark text-black dark:text-white shadow-lyra-purple">
      <Link href="/" className="flex items-center text-lyra-purple hover:underline mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-2">{post.name}</h1>
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link href={`/user/${post.createdBy.id}`}>
          <span className="hover:underline">By {post.createdBy.name}</span>
        </Link>
        <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>
      <div className="mb-6">
        {post.tags.map((tag, index) => (
          <span key={index} className="mr-2 text-sm text-lyra-purple">
            #{tag}
          </span>
        ))}
      </div>
      <div className="prose prose-lg max-w-none dark:prose-invert text-black dark:text-white">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </div>
  );
}
