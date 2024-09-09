import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { ThemeToggle } from "./_components/ThemeToggle";
import AuthButtons from "./_components/AuthButtons";
import { ClientProvider } from "./_components/ClientProvider";
import BlogPosts from "./_components/BlogPosts";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <ClientProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4">
          <h1 className="text-2xl font-bold">ByteInk</h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AuthButtons />
          </div>
        </header>
        <main className="container mx-auto mt-8 px-4">
          <BlogPosts />
        </main>
      </div>
    </ClientProvider>
  );
}