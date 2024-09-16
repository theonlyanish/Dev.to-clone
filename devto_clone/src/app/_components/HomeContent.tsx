'use client';

import { useRef } from 'react';
import SearchBar from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import AuthButtons from './AuthButtons';
import Sidebar from './Sidebar';
import BlogPosts from './BlogPosts';

export default function HomeContent() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-lyra-dark text-black dark:text-white">
      <header className="flex items-center justify-between bg-white dark:bg-lyra-dark p-4 border-b border-gray-200 dark:border-lyra-purple shadow-lyra-purple">
        <h1 className="text-2xl font-bold">ByteInk</h1>
        <SearchBar ref={searchInputRef} />
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <AuthButtons />
        </div>
      </header>
      <div className="container mx-auto mt-8 px-4 flex">
        <Sidebar searchInputRef={searchInputRef} />
        <main className="flex-1">
          <h2 className="text-3xl font-bold mb-6">Latest posts</h2>
          <BlogPosts />
        </main>
      </div>
    </div>
  );
}
