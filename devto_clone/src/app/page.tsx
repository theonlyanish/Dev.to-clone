import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { ThemeToggle } from "./_components/ThemeToggle";
import AuthButtons from "./_components/AuthButtons";
import { ClientProvider } from "./_components/ClientProvider";
import BlogPosts from "./_components/BlogPosts";
import SearchBar from "./_components/SearchBar";
import Sidebar from "./_components/Sidebar";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <ClientProvider>
      <div className="min-h-screen bg-white dark:bg-lyra-dark text-black dark:text-white">
        <header className="flex items-center justify-between bg-white dark:bg-lyra-dark p-4 border-b border-gray-200 dark:border-lyra-purple shadow-lyra-purple">
          <h1 className="text-2xl font-bold">ByteInk</h1>
          <SearchBar />
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <AuthButtons />
          </div>
        </header>
        <div className="container mx-auto mt-8 px-4 flex">
          <Sidebar />
          <main className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Latest posts</h2>
            <BlogPosts />
          </main>
        </div>
      </div>
    </ClientProvider>
  );
}