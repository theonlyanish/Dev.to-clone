'use client';

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  
  console.log("Session:", session);
  console.log("Status:", status);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <img
          src={session.user.image || 'https://byteink.s3.amazonaws.com/default.png'}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
        <Link
          href="/profile"
          className="text-blue-500 hover:text-blue-600"
        >
          Profile
        </Link>
        <Link
          href="/create-post"
          className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-purple-600 dark:hover:bg-purple-700"
        >
          Create Blog
        </Link>
        <button
          onClick={() => signOut()}
          className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Log In
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Sign Up
      </Link>
    </>
  );
}