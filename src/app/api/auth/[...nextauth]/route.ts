import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/src/app/lib/prisma";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Configuração do NextAuth
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: any
      ) {
        const user = await prisma.usuario.findFirst({
          where: {
            email: credentials?.email,
          },
        });
        if (user) {
          return { id: user.id, name: user.nome, email: user.email };
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
  session: { strategy: "jwt" as const },
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user?.email) return false;

        let existingUser = await prisma.usuario.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.usuario.create({
            data: {
              nome: user.name,
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
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as any;
      const user = await prisma.usuario.findFirst({
        where: {
          email: token.user.email,
        },
      });
      session.user.id = user?.id;
      return session;
    },
  },
};

// 👇 Esta é a parte ESSENCIAL: exportar os métodos HTTP para o Next.js reconhecer
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
