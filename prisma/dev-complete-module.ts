/**
 * SINOV UCHUN: berilgan xodimning bitta modulini tugatilgan qilib belgilaydi
 * (kursga yozadi, testlardan o'tgan va darslarni yakunlagan qilib yozadi).
 * Hisobotlar, progress va dashboardni tekshirish uchun qulay.
 *
 *   npx tsx prisma/dev-complete-module.ts <email> <modul-raqami>
 *   masalan: npx tsx prisma/dev-complete-module.ts muhiddinov@gmail.com 1
 *
 * Kursning hamma darslari tugasa, sertifikat ham beriladi.
 * Bu SOXTA ma'lumot yaratadi, haqiqiy o'qish emas. Faqat lokal bazada ishlaydi.
 * (Boshqa bazada ishlatish uchun --force, lekin ishlab chiqarishda ishlatmang.)
 */
import "dotenv/config"
import { randomBytes } from "crypto"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { pgOptions } from "../lib/pg-options"

const COURSE_TITLE = "Kiberxavfsizlik asoslari"

async function main() {
  const [email, moduleArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"))
  const force = process.argv.includes("--force")
  const moduleOrder = Number(moduleArg)

  if (!email || !Number.isInteger(moduleOrder) || moduleOrder < 1) {
    console.log("Ishlatish: npx tsx prisma/dev-complete-module.ts <email> <modul-raqami>")
    process.exit(1)
  }

  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL topilmadi (.env faylini tekshiring)")
  if (!force && !/@(localhost|127\.0\.0\.1)[:/]/.test(url)) {
    console.error("Baza lokal emas. Xavfsizlik uchun to'xtatildi (kerak bo'lsa --force).")
    process.exit(1)
  }

  const prisma = new PrismaClient({ adapter: new PrismaPg(pgOptions(url)) })
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error(`Foydalanuvchi topilmadi: ${email}`)
    if (user.role !== "USER") throw new Error("Bu skript faqat oddiy xodim (USER) uchun")

    const course = await prisma.course.findFirst({
      where: { title: COURSE_TITLE },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: { lessons: { orderBy: { order: "asc" }, include: { quizzes: true } } },
        },
      },
    })
    if (!course) throw new Error(`"${COURSE_TITLE}" kursi topilmadi. Avval seed-content skriptini ishga tushiring.`)

    const mod = course.modules.find((m) => m.order === moduleOrder)
    if (!mod) throw new Error(`${moduleOrder}-modul topilmadi (kursda ${course.modules.length} ta modul bor)`)

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      update: {},
      create: { userId: user.id, courseId: course.id },
    })

    const now = new Date()
    const started = new Date(now.getTime() - 10 * 60 * 1000)

    for (const lesson of mod.lessons) {
      for (const quiz of lesson.quizzes) {
        const passed = await prisma.quizResult.findFirst({
          where: { userId: user.id, quizId: quiz.id, passed: true },
        })
        if (!passed) {
          await prisma.quizResult.create({
            data: { userId: user.id, quizId: quiz.id, score: 100, passed: true },
          })
        }
      }
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
        update: { completedAt: now },
        create: { userId: user.id, lessonId: lesson.id, startedAt: started, completedAt: now },
      })
    }

    // Kursning barcha darslari tugagan bo'lsa, haqiqiy jarayondagidek
    // obunani yakunlaymiz va sertifikat beramiz.
    const allLessons = course.modules.flatMap((m) => m.lessons)
    const done = await prisma.progress.count({
      where: {
        userId: user.id,
        completedAt: { not: null },
        lessonId: { in: allLessons.map((l) => l.id) },
      },
    })
    let certificateNumber: string | null = null
    if (allLessons.length > 0 && done === allLessons.length) {
      await prisma.enrollment.update({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
        data: { completedAt: now },
      })
      const cert = await prisma.certificate.upsert({
        where: { userId_courseId: { userId: user.id, courseId: course.id } },
        update: {},
        create: {
          userId: user.id,
          courseId: course.id,
          certificateNumber: `CERT-${now.getFullYear()}-${randomBytes(5).toString("hex").toUpperCase()}`,
        },
      })
      certificateNumber = cert.certificateNumber
    }

    console.log(
      `Tayyor: ${user.firstName} ${user.lastName} - "${mod.title}" moduli tugatilgan (${mod.lessons.length} dars).`
    )
    if (certificateNumber) {
      console.log(`Kurs to'liq tugagan, sertifikat berildi: ${certificateNumber}`)
    }
    if (!course.isPublished) {
      console.log("Eslatma: kurs hali nashr qilinmagan, xodim uni o'z panelida ko'rmaydi. Admin panelda nashr qiling.")
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
