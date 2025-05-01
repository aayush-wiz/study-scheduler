import mongoose from "mongoose";

export interface IUser {
  email: string;
  password?: string;
  name?: string;
  image?: string;
  emailVerified?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: false, // Don't include password in queries by default
    },
    name: String,
    image: String,
    emailVerified: Date,
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
