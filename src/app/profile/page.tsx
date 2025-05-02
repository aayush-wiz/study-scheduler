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
  const [imageKey, setImageKey] = useState<number>(Date.now());

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
        // Add timestamp to image URL for cache busting
        const timestamp = new Date().getTime();
        const cacheBustImageUrl = `${data.image}?t=${timestamp}`;
        setPreviewUrl(cacheBustImageUrl);
        setImageKey(timestamp);
        
        // Create a user-specific localStorage key
        const storageKey = `userProfileImage_${
          session?.user?.id || session?.user?.email
        }`;
        // Save to localStorage as a backup in case session update fails
        localStorage.setItem(storageKey, cacheBustImageUrl);
      }

      // Update session with a more forceful approach
      if (session) {
        try {
          // Update the session data first
          await update({
            ...session,
            user: {
              ...session?.user,
              name,
              email,
              image: data.image ? `${data.image}?t=${new Date().getTime()}` : session?.user?.image,
            },
          });
          
          // Set the success state with refresh instructions
          setSuccess("Profile updated successfully! Your profile picture will be fully updated after page refresh.");
          setIsEditingProfile(false);
          
          // Inject the button after the success message
          const successMessageDiv = document.querySelector('.bg-green-50.text-green-700');
          if (successMessageDiv) {
            // Create a container for the button
            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'refresh-button-container';
            successMessageDiv.after(buttonContainer);
            
            // Manually create and add the button
            const button = document.createElement('button');
            button.className = 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mt-2 w-full transition-colors';
            button.innerText = 'Refresh Page to See Changes';
            button.onclick = () => {
              // Force a complete cache refresh
              window.location.href = window.location.href.split('?')[0] + '?t=' + new Date().getTime();
            };
            buttonContainer.appendChild(button);
          }
        } catch (updateError) {
          console.error("Session update error:", updateError);
          // Continue anyway since we have localStorage backup
        }
      }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center">
          <Link 
            href="/" 
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-all font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-6 py-8 sm:p-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="mt-2 text-indigo-100">Manage your personal information and account settings</p>
          </div>
          
          {error && (
            <div className="mx-6 sm:mx-10 mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mx-6 sm:mx-10 mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center justify-start">
                <div className="relative group">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100 shadow-lg ring-4 ring-white">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        key={`${previewUrl}-${imageKey}`}
                        width={160}
                        height={160}
                        unoptimized={true}
                        onError={(e) => {
                          console.error("Failed to load profile image");
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("?v=")) {
                            target.src = `${previewUrl}?v=${new Date().getTime()}`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-20 w-20 text-indigo-300"
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
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  {isEditingProfile && (
                    <div className="mt-4 text-center">
                      <label
                        htmlFor="profilePicture"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full cursor-pointer transition-colors shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4z" />
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        Change Photo
                      </label>
                      <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {profilePicture && (
                        <div className="mt-2 text-xs text-gray-500">
                          Profile picture may take a moment to update after saving
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!isEditingProfile && !isChangingPassword && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        variant="outline"
                        className="rounded-full px-6 transition-all hover:bg-indigo-50"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Forms Section */}
              <div className="lg:col-span-2">
                {isEditingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="pb-2">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                      <div className="space-y-5">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name
                          </label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Your name"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2.5 font-medium shadow-md transition-colors"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : "Save Changes"}
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
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : isChangingPassword ? (
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="pb-2">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
                      <div className="space-y-5">
                        <div>
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
                            className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>

                        <div>
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
                            className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>

                        <div>
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
                            className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2.5 font-medium shadow-md transition-colors"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Changing...
                          </span>
                        ) : "Change Password"}
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
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                      <div className="space-y-5">
                        <div className="border-b border-gray-100 pb-4">
                          <div className="text-sm font-medium text-gray-500 mb-1">Name</div>
                          <div className="text-lg font-medium text-gray-800">
                            {session.user.name || "Not set"}
                          </div>
                        </div>

                        <div className="border-b border-gray-100 pb-4">
                          <div className="text-sm font-medium text-gray-500 mb-1">Email</div>
                          <div className="text-lg font-medium text-gray-800">{session.user.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsChangingPassword(true)}
                        className="bg-white shadow-sm hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg px-6 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="my-8 text-center text-sm text-gray-500">
          Study Scheduler &copy; {new Date().getFullYear()} • All rights reserved
        </div>
      </div>
    </div>
  );
}
