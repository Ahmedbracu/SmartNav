/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// Build providers list dynamically
const providers: any[] = [];

// Only add Google if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Missing credentials");
      }

      await connectToDatabase();
      
      // Find user by email
      const user = await User.findOne({ email: credentials.email });
      if (!user || !user.password_hash) {
        throw new Error("Invalid credentials");
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password_hash);
      
      if (!isPasswordValid) {
        const passStr = credentials.password as string;
        // Migration fallback: if raw match, update to bcrypt
        if (passStr === user.password_hash) {
          const hashed = await bcrypt.hash(passStr, 10);
          await User.findByIdAndUpdate(user._id, { password_hash: hashed });
        } else {
          throw new Error("Invalid credentials");
        }
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      };
    }
  })
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      // Handle Google Sign-in: save to DB if doesn't exist
      if (account?.provider === "google" && profile?.email) {
        await connectToDatabase();
        let dbUser = await User.findOne({ email: profile.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: profile.name,
            email: profile.email,
            password_hash: "google_oauth_no_password",
            role: "user",
          });
        }
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "default_secret_change_in_production",
});
