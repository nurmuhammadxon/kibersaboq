/**
 * Birinchi SUPER_ADMIN akkauntini yaratadi. Email va parol muhit
 * o'zgaruvchilaridan olinadi (kodda parol yo'q).
 *
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx prisma/create-admin.ts
 *
 * Docker'da: docker compose run --rm tools npx tsx prisma/create-admin.ts
 */
import "dotenv/config"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { pgOptions } from "../lib/pg-options"

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) throw new Error("ADMIN_EMAIL va ADMIN_PASSWORD kerak")
  if (password.length < 12) throw new Error("ADMIN_PASSWORD kamida 12 ta belgi bo'lsin")
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL topilmadi")

  const prisma = new PrismaClient({
    adapter: new PrismaPg(pgOptions(process.env.DATABASE_URL)),
  })
  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      console.log("Bu email bilan foydalanuvchi allaqachon bor. Hech narsa o'zgarmadi.")
      return
    }
    await prisma.user.create({
      data: {
        firstName: process.env.ADMIN_FIRST_NAME || "Admin",
        lastName: process.env.ADMIN_LAST_NAME || "KiberSaboq",
        email,
        hashedPassword: await bcrypt.hash(password, 12),
        role: "SUPER_ADMIN",
        organizationName: "KiberSaboq",
      },
    })
    console.log(`Admin yaratildi: ${email}`)
    console.log("Endi ADMIN_PASSWORD ni .env faylidan o'chirib tashlang.")
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
