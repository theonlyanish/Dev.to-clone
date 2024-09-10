'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

export default function ProfileComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const { data: userPosts, isLoading: postsLoading } = api.post.getUserPosts.useQuery(
    { userId: session?.user?.id ?? '' },
    { enabled: !!session?.user?.id }
  );

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto mt-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <img
              src={session.user.image || '/default-profile.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">{session.user.name}</h2>
          <p className="text-gray-600 mb-4">{session.user.email}</p>
          {isEditing ? (
            <div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Enter your bio"
              />
              <button
                onClick={() => updateProfile.mutate({ bio })}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2">{bio || 'No bio yet.'}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Edit Bio
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold mt-8 mb-4">Your Posts</h3>
      {postsLoading ? (
        <div>Loading posts...</div>
      ) : (
        <div className="space-y-4">
          {userPosts?.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>{post.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
