import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface AuthButtonsProps {
  session: Session | null;
}

export default function AuthButtons({ session }: AuthButtonsProps) {
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