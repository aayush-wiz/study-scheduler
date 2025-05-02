import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "./mongodb";
import { User } from "@/models/User";
import connectDB from "./db";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};

// Create a helper function for getting server session
export function getAuthSession() {
  return getServerSession(authOptions);
} 