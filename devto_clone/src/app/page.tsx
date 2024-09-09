import Link from "next/link";
import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { ThemeToggle } from "./_components/ThemeToggle";
import AuthButtons from "./_components/AuthButtons";
import { ClientProvider } from "./_components/ClientProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  void api.post.getLatest.prefetch();

  return (
    <ClientProvider>
      <HydrateClient>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
          <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4">
            <h1 className="text-2xl font-bold">ByteInk</h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AuthButtons />
              {session && (
                <Link
                  href="/new"
                  className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                >
                  Create a new blog
                </Link>
              )}
            </div>
          </header>
          <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-200 dark:from-gray-900 dark:to-purple-900">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                Create <span className="text-blue-500 dark:text-purple-400">T3</span> App
              </h1>
              {session ? (
                <div>
                  <p>Welcome, {session.user?.name}!</p>
                  <p>Email: {session.user?.email}</p>
                </div>
              ) : (
                <p>Please sign in to see your information.</p>
              )}
            </div>
          </main>
        </div>
      </HydrateClient>
    </ClientProvider>
  );
}
