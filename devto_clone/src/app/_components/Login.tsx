'use client';

import React from 'react';
import { useAuthForm } from '../hook/useAuthForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { email, setEmail, password, setPassword, error, handleSubmit } = useAuthForm();
  const router = useRouter();

  const handleBypass = async () => {
    const response = await fetch('/api/bypass', {
      method: 'POST',
    });

    if (response.ok) {
      const result = await signIn('credentials', {
        email: 'mockuser@example.com',
        password: 'mockpassword',
        redirect: false,
      });

      if (result?.error) {
        console.error('Error signing in mock user:', result.error);
      } else {
        router.push('/profile');
      }
    } else {
      console.error('Error creating mock user:', await response.json());
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
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
        <button
          onClick={handleBypass}
          className="w-full rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
        >
          Bypass
        </button>
      </div>
    </div>
  );
}