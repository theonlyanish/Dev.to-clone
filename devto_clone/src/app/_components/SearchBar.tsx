'use client';
import { useState, forwardRef } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = forwardRef<HTMLInputElement>((props, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4">
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs"
          className="w-full p-2 rounded-md dark:bg-lyra-dark dark:text-white dark:border-lyra-purple border pl-10"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
    </form>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;