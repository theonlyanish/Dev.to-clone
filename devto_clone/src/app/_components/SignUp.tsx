'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log("Submitting signup form with data:", { email, password, name });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      console.log("Signup response:", response);

      if (response.ok) {
        console.log("Signup successful, attempting to sign in");
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        console.log("Sign in result:", result);
        if (result?.error) {
          setError('Error signing in after registration');
        } else {
          router.push('/');
        }
      } else {
        const data = await response.json();
        console.error("Signup error response:", data);
        setError(data.error || 'Error creating user');
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
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