// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/src/app/lib/prisma";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";

// Tipagem estendida para o token
interface CustomToken extends JWT {
  user?: User & { id?: string };
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.usuario.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (user) {
          return {
            id: String(user.id),
            name: user.nome ?? "Usuário",
            email: user.email,
          };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user?.email) return false;

        const existingUser = await prisma.usuario.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.usuario.create({
            data: {
              nome: user.name ?? "Usuário",
              email: user.email,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Erro no signIn:", error);
        return false;
      }
    },

    async jwt({ token, user }: { token: CustomToken; user?: User }) {
      if (user) {
        token.user = {
          ...user,
          id: String((user as any).id ?? ""),
        };
      }
      return token;
    },

    async session({ session, token }: { session: any; token: CustomToken }) {
      if (token.user) {
        session.user = {
          ...token.user,
        };

        const userFromDb = await prisma.usuario.findFirst({
          where: { email: token.user.email ?? "" },
        });

        if (userFromDb) {
          session.user.id = String(userFromDb.id);
        }
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
