import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { User } from "@/models/User";
import connectDB from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Define Cloudinary upload result type
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

export async function PUT(req: Request) {
  try {
    // Use authOptions to ensure consistent session handling
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be signed in to update your profile" },
        { status: 401 }
      );
    }

    console.log("Session user in profile update:", session.user);

    await connectDB();

    // Find user by email as a fallback if id is not available
    const userLookup = session.user.id
      ? { _id: session.user.id }
      : { email: session.user.email };

    console.log("Looking up user with:", userLookup);

    // First, get the current user to compare with changes
    const currentUser = await User.findOne(userLookup);
    if (!currentUser) {
      console.error("User not found with lookup:", userLookup);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const profilePicture = formData.get("profilePicture") as File | null;

    // Validate email and name
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Only check for email existence if the user is changing their email
    if (email !== currentUser.email) {
      // Check if the new email already exists
      const existingUser = await User.findOne({
        email,
        _id: { $ne: currentUser._id },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
    }

    // Update object
    const updateData: { name: string; email: string; image?: string } = {
      name,
      email,
    };

    // Handle profile picture upload if present
    if (profilePicture) {
      try {
        const bytes = await profilePicture.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique ID for the image
        const uniqueFilename = `${currentUser._id}_profile_${Date.now()}`;

        // Upload to Cloudinary
        const uploadResult = (await uploadToCloudinary(buffer, {
          folder: "study-scheduler/profiles",
          public_id: uniqueFilename,
          transformation: { width: 400, height: 400, crop: "limit" },
        })) as CloudinaryUploadResult;

        if (uploadResult && uploadResult.secure_url) {
          updateData.image = uploadResult.secure_url;
        } else {
          console.error("Failed to upload to Cloudinary:", uploadResult);
          return NextResponse.json(
            { error: "Failed to upload profile picture" },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error("Error processing profile picture:", error);
        return NextResponse.json(
          { error: "Failed to process profile picture" },
          { status: 500 }
        );
      }
    }

    // Update user in database using currentUser._id which we know exists
    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
