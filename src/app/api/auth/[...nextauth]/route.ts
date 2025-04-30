import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/src/app/lib/prisma";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { RequestInternal } from "next-auth";

// Definindo o tipo User esperado pelo NextAuth
interface User {
  id: string;
  name: string;
  email: string;
}

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
        req: Pick<RequestInternal, "method" | "query" | "body" | "headers">
      ): Promise<User | null> {
        const user = await prisma.usuario.findFirst({
          where: {
            email: credentials?.email,
          },
        });

        if (user) {
          return { id: String(user.id), name: user.nome, email: user.email };
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
    // Tipando explicitamente o parâmetro `user`
    async signIn({ user }: { user: User }) {
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
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Fazendo o type assertion para garantir que token.user seja do tipo User
      const user = token.user as User;
      
      session.user = user;
      const userFromDb = await prisma.usuario.findFirst({
        where: {
          email: user.email,
        },
      });
      session.user.id = userFromDb?.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };