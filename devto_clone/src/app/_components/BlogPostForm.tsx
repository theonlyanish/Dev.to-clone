'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { uploadToS3 } from "~/app/utils/s3";

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode; // Make children optional
}

export default function BlogPostForm({ isNewPost = true, post }: { isNewPost?: boolean; post?: { name?: string; content?: string; tags?: string[] } | null }) {
  const [title, setTitle] = useState(post?.name || "");
  const [content, setContent] = useState(post?.content || "");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit button clicked");
    let coverImageUrl = "";
    if (coverImage) {
      console.log("Uploading cover image");
      try {
        const buffer = await coverImage.arrayBuffer();
        const key = `blog-covers/${Date.now()}-${coverImage.name}`;
        coverImageUrl = await uploadToS3(new Uint8Array(buffer), key);
        console.log("Cover image uploaded successfully:", coverImageUrl);
      } catch (error) {
        console.error("Error uploading cover image:", error);
        alert("Failed to upload cover image. Please try again.");
        return;
      }
    }
    try {
      console.log("Creating post with data:", { title, content, tags: tags.split(',').map(tag => tag.trim()), coverImageUrl });
      await createPost.mutateAsync({ 
        name: title, 
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        coverImageUrl
      });
      console.log("Post created successfully");
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  const handleCoverImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleCoverImageUpload}
            className="mb-4 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            {coverImage ? "Change cover image" : "Add a cover image"}
          </button>
          {coverImage && (
            <img
              src={URL.createObjectURL(coverImage)}
              alt="Cover preview"
              className="mb-4 max-w-xs"
            />
          )}
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
            onClick={() => console.log("Create Post button clicked")}
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
                code: ({ node, inline, className, children, ...props }: CodeBlockProps) => {
                  const match = /language-(\w+)/.exec(className || '');
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
                  );
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
