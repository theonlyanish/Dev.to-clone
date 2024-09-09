'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}
export default function BlogPostForm({ isNewPost = true, post }: { isNewPost?: boolean; post?: { name?: string; content?: string; tags?: string[] } | null }) {
  const [title, setTitle] = useState(post?.name || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({ 
      name: title, 
      content,
      tags: tags.split(',').map(tag => tag.trim())
    });
  };

  const handleCoverImageUpload = () => {
    // Implement image upload functionality here
    console.log("Cover image upload clicked");
  };

  const insertFormatting = (startChars: string, endChars: string = startChars) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${startChars}${selectedText}${endChars}`;
    setContent(
      content.substring(0, start) + replacement + content.substring(end)
    );
  };
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto mt-8 max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">{isNewPost ? "Create a New Blog Post" : "Edit Blog Post"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <button
            type="button"
            onClick={handleCoverImageUpload}
            className="mb-4 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Add a cover image
          </button>
        </div>
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-bold">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-2 text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="tags" className="mb-2 block text-sm font-bold">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded border p-2 text-black"
            placeholder="e.g. javascript, react, webdev"
          />
        </div>
        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-bold">
            Content
          </label>
          <div className="mb-2 flex space-x-2">
            <button type="button" onClick={() => insertFormatting("**")} className="rounded bg-gray-200 px-2 py-1 text-sm">Bold</button>
            <button type="button" onClick={() => insertFormatting("*")} className="rounded bg-gray-200 px-2 py-1 text-sm">Italic</button>
            <button type="button" onClick={() => insertFormatting("- ")} className="rounded bg-gray-200 px-2 py-1 text-sm">Bullet</button>
            <button type="button" onClick={() => insertFormatting("1. ")} className="rounded bg-gray-200 px-2 py-1 text-sm">Number</button>
            <button type="button" onClick={() => insertFormatting("```\n", "\n```")} className="rounded bg-gray-200 px-2 py-1 text-sm">Code</button>
          </div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-64 w-full rounded border p-2 text-black"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={createPost.isPending}
          >
            {createPost.isPending ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
      {showPreview && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Preview</h2>
          <div className="prose prose-invert max-w-none rounded border p-4">
            <ReactMarkdown
              components={{
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}