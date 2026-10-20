import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { headers } from "next/headers"

const BLOCK_DURATION = 15 * 60 * 1000
const MAX_PER_EMAIL_IP = 5
const MAX_PER_IP = 30
const MAX_PER_EMAIL = 50

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const ip =
          (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"

        const since = new Date(Date.now() - BLOCK_DURATION)

        const [byEmailIp, byIp, byEmail] = await Promise.all([
          prisma.loginAttempt.count({ where: { email, ip, createdAt: { gte: since } } }),
          prisma.loginAttempt.count({ where: { ip, createdAt: { gte: since } } }),
          prisma.loginAttempt.count({ where: { email, createdAt: { gte: since } } }),
        ])

        if (byEmailIp >= MAX_PER_EMAIL_IP || byIp >= MAX_PER_IP || byEmail >= MAX_PER_EMAIL) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            ownedCompany: { select: { id: true } },
          },
        })
        if (!user) {
          await prisma.loginAttempt.create({ data: { email, ip } })
          return null
        }

        if (user.isBlocked) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        )

        if (!isValid) {
          await prisma.loginAttempt.create({ data: { email, ip } })
          return null
        }

        await prisma.loginAttempt.deleteMany({ where: { email, ip } })

        return {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          organizationName: user.organizationName,
          companyId: user.ownedCompany?.id ?? user.companyId ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.organizationName = (user as any).organizationName
        token.companyId = (user as any).companyId
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub!
        ; (session.user as any).role = token.role
        ; (session.user as any).organizationName = token.organizationName
        ; (session.user as any).companyId = token.companyId
      return session
    },
  },
})