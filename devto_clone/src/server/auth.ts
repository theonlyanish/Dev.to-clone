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
import { verifyPassword, hashPassword } from "~/server/auth-utils";

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
  ],
  callbacks: {
    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log("SignIn callback:", { user, account, profile, email });

      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email ?? undefined },
        });

        if (!existingUser) {
          const newUser = await db.user.create({
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
            },
          });

          await db.account.create({
            data: {
              userId: newUser.id,
              type: "oauth",
              provider: account.provider,
              providerAccountId: account.id as string,
              access_token: account.access_token ?? undefined,
              refresh_token: account.refresh_token ?? undefined,
              expires_at: account.expires_at ?? undefined,
              token_type: account.token_type ?? undefined,
              scope: account.scope ?? undefined,
              id_token: account.id_token ?? undefined,
              session_state: account.session_state ?? undefined,
            },
          });
        }
        return "/";
      }

      return true;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request", // Custom verification request page
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);