import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/src/app/lib/prisma";

// Define the authentication options
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.usuario.findFirst({
          where: { email: credentials?.email }
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
    signIn: "/login", // Custom sign-in page
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user?.email) {
          console.error("Erro: E-mail do usuário não encontrado.");
          return false;
        }
        
        let existingUser = await prisma.usuario.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          existingUser = await prisma.usuario.create({
            data: {
              nome: user.name,
              email: user.email,
            },
          });
        }

        return true;
      } catch (error) {
        console.error("Erro ao salvar usuário:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      const user = await prisma.usuario.findFirst({
        where: { email: token?.user.email },
      });
      session.user.id = user?.id;
      return session;
    },
  },
};

// Export the NextAuth handler using GET and POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
