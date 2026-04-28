import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { headers } from "next/headers"

const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 15 * 60 * 1000

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const ip = (await headers()).get("x-forwarded-for") ?? "unknown"

        const since = new Date(Date.now() - BLOCK_DURATION)

        const attempts = await prisma.loginAttempt.count({
          where: {
            email,
            createdAt: { gte: since },
          },
        })

        if (attempts >= MAX_ATTEMPTS) {
          throw new Error("Juda ko'p urinish. 15 daqiqadan so'ng qayta urinib ko'ring.")
        }

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          await prisma.loginAttempt.create({
            data: { email, ip },
          })
          return null
        }

        if (user.isBlocked) {
          throw new Error("Hisobingiz bloklangan. Admin bilan bog'laning.")
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        )

        if (!isValid) {
          await prisma.loginAttempt.create({
            data: { email, ip },
          })
          return null
        }

        await prisma.loginAttempt.deleteMany({
          where: { email },
        })

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          organizationName: user.organizationName,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.organizationName = (user as any).organizationName
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub!
        ; (session.user as any).role = token.role
        ; (session.user as any).organizationName = token.organizationName
      return session
    },
  },
})