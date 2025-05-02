"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");

      // Check for image in this priority: session -> localStorage -> none
      if (session.user.image) {
        setPreviewUrl(session.user.image);
      } else {
        // Create a user-specific localStorage key
        const storageKey = `userProfileImage_${
          session.user.id || session.user.email
        }`;
        // Check localStorage as a backup
        const savedImage = localStorage.getItem(storageKey);
        if (savedImage) {
          setPreviewUrl(savedImage);
          // Don't update session in useEffect - causes infinite loops
        }
      }
    }
  }, [session, status, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await fetch("/api/profile/update", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Profile update failed:", data);
        throw new Error(data.error || "Failed to update profile");
      }

      console.log("Profile update successful:", data);

      // Force image refresh by updating the preview immediately
      if (data.image) {
        setPreviewUrl(data.image);
        // Create a user-specific localStorage key
        const storageKey = `userProfileImage_${
          session?.user?.id || session?.user?.email
        }`;
        // Save to localStorage as a backup in case session update fails
        localStorage.setItem(storageKey, data.image);
      }

      // Update session manually without triggering a refresh
      try {
        const updateResult = await update({
          ...session,
          user: {
            ...session?.user,
            name,
            email,
            image: data.image || session?.user?.image,
          },
        });
        console.log("Session update result:", updateResult);
      } catch (updateError) {
        console.error("Session update error:", updateError);
        // Continue anyway since we have localStorage backup
      }

      setSuccess("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Password change error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="mb-2 text-gray-500">Loading profile data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-normal text-gray-800">My Profile</h1>
              {!isEditingProfile && !isChangingPassword && (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  variant="secondary"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                {success}
              </div>
            )}

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      key={previewUrl}
                      width={128}
                      height={128}
                      onError={(e) => {
                        console.error("Failed to load profile image");
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("?v=")) {
                          target.src = `${previewUrl}?v=${new Date().getTime()}`;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {isEditingProfile && (
                  <div className="text-center">
                    <label
                      htmlFor="profilePicture"
                      className="text-sm font-medium text-black hover:text-gray-500 cursor-pointer"
                    >
                      Change Photo
                    </label>
                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              <div className="md:w-2/3 md:pl-8">
                {isEditingProfile ? (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setName(session.user.name || "");
                          setEmail(session.user.email || "");
                          setProfilePicture(null);
                          if (session.user.image) {
                            setPreviewUrl(session.user.image);
                          } else {
                            setPreviewUrl(null);
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : isChangingPassword ? (
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-4">
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Changing..." : "Change Password"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="text-lg">
                        {session.user.name || "Not set"}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="text-lg">{session.user.email}</div>
                    </div>

                    <div>
                      <Button
                        variant="outline"
                        onClick={() => setIsChangingPassword(true)}
                      >
                        Change Password
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
