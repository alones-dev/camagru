import NextAuth, { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import z from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"

const loginUserSchema = z.object({
    username: z.string().min(3, "Username is too short, minimum 3 characters required"),
    password: z.string().min(6, "Password is too short, minimum 6 characters required"),
});

const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            credentials: {
                username: { type: "text", placeholder: "Username" },
                password: { type: "password", placeholder: "Password" },
            },
            async authorize(credentials, req) {
                const { username, password } = loginUserSchema.parse(credentials);

                const user = await prisma.user.findUnique({
                    where: { username }
                });
                if (!user) return null;

                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) return null;

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                };
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.id = user.id;
            token.username = user.username;
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user.id = token.id as string;
            session.user.username = token.username as string;
          }
          return session;
        },
      },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);