import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

try {
  const result = await prisma.loginAttempt.deleteMany({})
  // eslint-disable-next-line no-console
  console.log(`Deleted login attempts: ${result.count}`)
} finally {
  await prisma.$disconnect()
}

