import { ClientProvider } from "../_components/ClientProvider";
import NewBlogPostForm from "../_components/NewBlogPostForm";

export default function NewBlogPost() {
  return (
    <ClientProvider>
      <NewBlogPostForm />
    </ClientProvider>
  );
}