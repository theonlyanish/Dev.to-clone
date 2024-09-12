'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { uploadToS3 } from "~/app/utils/s3";
import { useMutation } from '@tanstack/react-query';
import { UseMutationOptions } from '@tanstack/react-query';

export default function ProfileComponent() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userPosts, isLoading: postsLoading, refetch: refetchPosts } = api.post.getUserPosts.useQuery(
    { userId: session?.user?.id ?? '' },
    { enabled: !!session?.user?.id }
  );

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
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

  const deletePost = async (postId: number) => {
    try {
      await deletePostMutation.mutateAsync({ id: postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleProfilePictureUpload = async () => {
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
                {session?.user?.id === post.createdById && (
                  <button
                    onClick={() => deletePost(post.id)}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}