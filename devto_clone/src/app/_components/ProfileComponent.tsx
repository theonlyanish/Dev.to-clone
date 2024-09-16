'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { uploadToS3 } from "~/app/utils/s3";
import { useMutation } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query';
import { Session } from "next-auth";
import Link from 'next/link';

interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
  }
}

interface ProfileComponentProps {
  userId?: string;
}

export default function ProfileComponent({ userId }: ProfileComponentProps) {
  const { data: session, status, update: updateSession } = useSession() as { data: CustomSession | null, status: string, update: () => Promise<CustomSession | null> };
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userPosts, isLoading: postsLoading, refetch: refetchPosts } = api.post.getUserPosts.useQuery(
    { userId: userId ?? session?.user?.id ?? '' },
    { enabled: !!userId || !!session?.user?.id }
  );

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: async () => {
      setIsEditing(false);
      await updateSession();
    },
  });
  
  const deletePostMutation = api.post.delete.useMutation({
    onSuccess: () => {
      // Refetch posts after successful deletion
      refetchPosts();
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
      alert("You are not authorized to delete this post or an error occurred.");
    }
  });

  const archivePostMutation = api.post.archive.useMutation({
    onSuccess: () => {
      refetchPosts();
    },
  });

  const unarchivePostMutation = api.post.unarchive.useMutation({
    onSuccess: () => {
      refetchPosts();
    },
  });

  const deletePost = async (postId: number) => {
    try {
      await deletePostMutation.mutateAsync({ id: postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const archivePost = async (postId: number) => {
    try {
      await archivePostMutation.mutateAsync({ id: postId });
    } catch (error) {
      console.error("Failed to archive post:", error);
    }
  };

  const unarchivePost = async (postId: number) => {
    try {
      await unarchivePostMutation.mutateAsync({ id: postId });
    } catch (error) {
      console.error("Failed to unarchive post:", error);
    }
  };

  const handleProfilePictureUpload = async () => {
    console.log("Environment variables:", {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      hasAccessKeyId: !!process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      hasSecretAccessKey: !!process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });

    console.log("Upload new picture button clicked");
    if (profilePicture) {
      try {
        console.log("Uploading profile picture");
        const buffer = await profilePicture.arrayBuffer();
        const key = `profile-pictures/${session?.user?.id}-${Date.now()}-${profilePicture.name}`;
        console.log("Generated S3 key:", key);
        const imageUrl = await uploadToS3(new Uint8Array(buffer), key);
        console.log("Profile picture uploaded successfully:", imageUrl);
        
        console.log("Updating profile with new image URL");
        await updateProfile.mutateAsync({ image: imageUrl });
        console.log("Profile updated successfully");
        
        console.log("Updating session");
        await updateSession();
        console.log("Session updated successfully");
        
        setProfilePicture(null);
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error in handleProfilePictureUpload:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        alert(`Failed to update profile picture. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      console.log("No profile picture selected");
    }
  };
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.bio) {
      setBio(session.user.bio);
    }
  }, [session?.user?.bio]);

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
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && setProfilePicture(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <img
              src={profilePicture ? URL.createObjectURL(profilePicture) : (session.user.image || 'https://byteink.s3.amazonaws.com/default.png')}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            />
            {profilePicture && (
              <button
                onClick={handleProfilePictureUpload}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Upload New Picture
              </button>
            )}
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
                onClick={() => updateProfile.mutate({ 
                  bio, 
                  image: session.user.image || undefined 
                })}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setBio(session.user.bio || '');
                }}
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
                {post.isArchived && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                    Archived
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <p>{post.content.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
                {session?.user?.id === post.createdById && (
                  <div className="mt-2">
                    <Link
                      href={`/edit-post/${post.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Edit
                    </Link>
                    {post.isArchived ? (
                      <button
                        onClick={() => unarchivePost(post.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Unarchive
                      </button>
                    ) : (
                      <button
                        onClick={() => archivePost(post.id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => deletePost(post.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}