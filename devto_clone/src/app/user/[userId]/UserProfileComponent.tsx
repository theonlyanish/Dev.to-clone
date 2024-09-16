'use client'
import { useState, useEffect } from 'react';
import { api } from '~/trpc/react';
import { Card, CardContent, CardHeader, CardTitle } from "../../_components/ui/Card";
import { useSession } from 'next-auth/react';

interface UserProfileProps {
  userId: string;
}

export default function UserProfileComponent({ userId }: UserProfileProps) {
  const { data: session } = useSession();
  const { data: user, isLoading: userLoading } = api.user.getById.useQuery({ id: userId });
  const { data: userPosts, isLoading: postsLoading } = api.post.getUserPosts.useQuery({ userId });

  if (userLoading || postsLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const isOwnProfile = session?.user?.id === userId;

  return (
    <div className="container mx-auto mt-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <img
              src={user.image || 'https://byteink.s3.amazonaws.com/default.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
          <p className="text-gray-600 mb-4">{user.email}</p>
          <p className="mb-2">{user.bio || 'No bio yet.'}</p>
        </CardContent>
      </Card>

      <h3 className="text-xl font-bold mt-8 mb-4">Posts</h3>
      {userPosts?.map((post) => (
        (!post.isArchived || isOwnProfile) && (
          <Card key={post.id} className="relative mb-4">
            {post.isArchived && (
              <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs z-10">
                Archived
              </span>
            )}
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
        )
      ))}
    </div>
  );
}