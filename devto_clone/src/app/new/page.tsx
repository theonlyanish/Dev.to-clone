import { ClientProvider } from "../_components/ClientProvider";
import BlogPostForm from "../_components/BlogPostForm";

export default function NewBlogPost() {
  return (
    <ClientProvider>
      <BlogPostForm isNewPost={true} />
    </ClientProvider>
  );
}