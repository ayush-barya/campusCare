import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        
        // ADMIN FLOW
        if (credentials.role === "ADMIN") {
          if (credentials.email === "ayush@gmail.com" && credentials.password === "ayush") {
            let adminUser = await prisma.user.findUnique({
              where: { email: "ayush@gmail.com" }
            });

            if (!adminUser) {
              adminUser = await prisma.user.create({
                data: {
                  email: "ayush@gmail.com",
                  name: "Ayush (Admin)",
                  role: "ADMIN"
                }
              });
            }

            return {
              id: adminUser.id,
              name: adminUser.name,
              email: adminUser.email,
              role: "ADMIN"
            };
          }
          throw new Error("Invalid admin credentials");
        }

        // STUDENT FLOW
        if (credentials.role === "STUDENT") {
          if (!credentials.email.endsWith("@iiml.ac.in")) {
            throw new Error("Students must use an @iiml.ac.in address");
          }

          const dbUser = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!dbUser) {
            throw new Error("Account not found. Please sign up first.");
          }

          if (dbUser.password !== credentials.password) {
            throw new Error("Incorrect password");
          }

          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: "STUDENT"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/', 
  },
  session: { strategy: "jwt" }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
