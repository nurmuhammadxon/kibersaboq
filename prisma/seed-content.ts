/**
 * Kurs mazmunini (kurs, modullar, darslar, test savollari) bazaga kiritadi.
 *
 *   npx tsx prisma/seed-content.ts              yangi kurs yaratadi (nashr qilinmagan holda)
 *   npx tsx prisma/seed-content.ts --publish    yaratib, darrov nashr qiladi
 *   npx tsx prisma/seed-content.ts --replace    shu nomli kurs bo'lsa, o'chirib qayta yaratadi
 *
 * Ma'lumotlar prisma/seed-data/cybersecurity-course.json faylida; matnni
 * tahrirlab, skriptni --replace bilan qayta ishga tushirish mumkin.
 * DIQQAT: --replace kursning obuna, progress va sertifikatlarini ham o'chiradi.
 */
import "dotenv/config"
import { readFileSync } from "fs"
import { join } from "path"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { cleanLessonHtml } from "../lib/sanitize-html"

type SeedOption = { text: string; isCorrect: boolean }
type SeedQuestion = { text: string; options: SeedOption[] }
type SeedLesson = {
  title: string
  order: number
  minDuration: number | null
  content: string
  quiz: SeedQuestion[]
}
type SeedModule = { title: string; order: number; lessons: SeedLesson[] }
type SeedCourse = {
  title: string
  description: string
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  modules: SeedModule[]
}

async function main() {
  const publish = process.argv.includes("--publish")
  const replace = process.argv.includes("--replace")

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL topilmadi (.env faylini tekshiring)")

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  })

  try {
    const course: SeedCourse = JSON.parse(
      readFileSync(join(__dirname, "seed-data", "cybersecurity-course.json"), "utf-8")
    )

    const existing = await prisma.course.findFirst({ where: { title: course.title } })
    if (existing && !replace) {
      console.log(`"${course.title}" kursi allaqachon bor. Hech narsa o'zgarmadi.`)
      console.log("Qayta yaratish uchun: npx tsx prisma/seed-content.ts --replace")
      return
    }
    if (existing && replace) {
      await prisma.course.delete({ where: { id: existing.id } })
      console.log("Eski kurs o'chirildi.")
    }

    await prisma.$transaction(
      async (tx) => {
        const created = await tx.course.create({
          data: {
            title: course.title,
            description: course.description,
            level: course.level,
            isPublished: publish,
          },
        })

        for (const mod of course.modules) {
          const m = await tx.module.create({
            data: { title: mod.title, order: mod.order, courseId: created.id },
          })
          for (const lesson of mod.lessons) {
            await tx.lesson.create({
              data: {
                title: lesson.title,
                order: lesson.order,
                type: "TEXT",
                content: cleanLessonHtml(lesson.content),
                minDuration: lesson.minDuration,
                moduleId: m.id,
                quizzes: {
                  create: {
                    questions: {
                      create: lesson.quiz.map((q) => ({
                        text: q.text,
                        options: { create: q.options },
                      })),
                    },
                  },
                },
              },
            })
          }
        }
      },
      { timeout: 60_000 }
    )

    const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0)
    const questions = course.modules.reduce(
      (n, m) => n + m.lessons.reduce((k, l) => k + l.quiz.length, 0),
      0
    )
    console.log(
      `Tayyor: "${course.title}" - ${course.modules.length} modul, ${lessons} dars, ${questions} savol.`
    )
    console.log(
      publish
        ? "Kurs nashr qilindi."
        : "Kurs hozircha nashr qilinmagan. Admin panelda tekshirib, \"Nashr qilish\"ni yoqing."
    )
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
