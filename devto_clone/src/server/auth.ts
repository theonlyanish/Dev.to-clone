import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"; 

import { env } from "~/env";
import { db } from "~/server/db";
import { verifyPassword } from "~/server/auth-utils";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: "smtp.mailersend.net",
        port: 587,
        secure: false,
        auth: {
          user: "MS_Ila3ty@trial-pr9084zp30mgw63d.mlsender.net",
          pass: "QqouSTBgd5eTxo8j",
        },
        tls: {
          rejectUnauthorized: false 
        }
      },
      from: "anishkapse@gmail.com",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          return null;
        }
        if (!user.emailVerified) {
          throw new Error("Email not verified");
        }
        const isPasswordValid = await verifyPassword(
          credentials.email,
          credentials.password
        );
        if (!isPasswordValid) {
          return null;
        }
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ]
}