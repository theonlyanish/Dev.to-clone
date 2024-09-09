'use client';

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Log Out
      </button>
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