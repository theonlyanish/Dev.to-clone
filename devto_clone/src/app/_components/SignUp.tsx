'use client';

import React from 'react';
import { useAuthForm } from '../hook/useAuthForm';
import { signIn } from 'next-auth/react';

export default function SignUp() {
  const { email, setEmail, password, setPassword, name, setName, error, handleSubmit } = useAuthForm();

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="w-full rounded border p-2 text-black"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full rounded border p-2 text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full rounded border p-2 text-black"
        />
        <button type="submit" className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
          Sign Up
        </button>
      </form>
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => signIn('github')}
          className="w-full rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          Sign up with GitHub
        </button>
        <button
          onClick={() => signIn('google')}
          className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Sign up with Google
        </button>
      </div>
    </div>
  );
}