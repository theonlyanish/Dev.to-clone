import { ClientProvider } from "../../_components/ClientProvider";
import BlogPostForm from "../../_components/BlogPostForm";
import { api } from "~/trpc/server";

export default async function EditPost({ params }: { params: { id: string } }) {
  const post = await api.post.getById({ id: parseInt(params.id) });

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <ClientProvider>
      <BlogPostForm isNewPost={false} post={post} />
    </ClientProvider>
  );
}
