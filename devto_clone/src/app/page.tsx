import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { ThemeToggle } from "./_components/ThemeToggle";
import AuthButtons from "./_components/AuthButtons";
import { ClientProvider } from "./_components/ClientProvider";
import BlogPosts from "./_components/BlogPosts";
import SearchBar from "./_components/SearchBar";

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
          <aside className="w-64 mr-8">
            <nav>
              <ul className="space-y-2">
                <li className="mb-2">
                  <Link href="/" className="flex items-center text-lg hover:text-lyra-purple">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/tags" className="flex items-center text-lg hover:text-lyra-purple">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    Tags
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Latest posts</h2>
            <BlogPosts />
          </main>
        </div>
      </div>
    </ClientProvider>
  );
}
