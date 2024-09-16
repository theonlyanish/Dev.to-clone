'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from "~/trpc/react";
import BlogPosts from "../_components/BlogPosts";

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const { data: posts, isLoading } = api.post.search.useQuery({ query });

    return (
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : posts && posts.length > 0 ? (
          <BlogPosts posts={posts} />
        ) : (
          <p>No results found.</p>
        )}
      </div>
    );
}

export default function SearchPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    );
}