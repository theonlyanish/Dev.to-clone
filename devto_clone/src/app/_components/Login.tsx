'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
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
        <button type="submit" className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Log In
        </button>
      </form>
      <div className="flex flex-col space-y-2">
        <button
          onClick={() => signIn('github')}
          className="w-full rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          Sign in with GitHub
        </button>
        <button
          onClick={() => signIn('google')}
          className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}