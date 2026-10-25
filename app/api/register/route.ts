import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { randomInt } from "crypto"
import { prisma } from "@/lib/prisma"
import { clientIp, isLimited, recordHit } from "@/lib/rate-limit"

function generateCompanyCode(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const digits = "0123456789"
  const prefix = Array.from({ length: 2 }, () => letters[randomInt(letters.length)]).join("")
  const suffix = Array.from({ length: 4 }, () => digits[randomInt(digits.length)]).join("")
  return `${prefix}-${suffix}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { role, firstName, lastName, email, password } = body

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: "Barcha maydonlarni to'ldiring" },
        { status: 400 }
      )
    }

    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return NextResponse.json(
        { error: "Email to'g'ri bo'lishi va parol kamida 8 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email allaqachon ro'yxatdan o'tgan" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    if (role === "DIRECTOR") {
      const { companyName, organizationName } = body

      if (!companyName || !organizationName) {
        return NextResponse.json(
          { error: "Korxona nomi va lavozimni kiriting" },
          { status: 400 }
        )
      }

      let code = generateCompanyCode()
      let exists = await prisma.company.findUnique({ where: { code } })
      while (exists) {
        code = generateCompanyCode()
        exists = await prisma.company.findUnique({ where: { code } })
      }

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          hashedPassword,
          role: "DIRECTOR",
          organizationName,
        },
      })

      await prisma.company.create({
        data: {
          name: companyName,
          code,
          directorId: user.id,
        },
      })

      return NextResponse.json(
        { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", companyCode: code },
        { status: 201 }
      )
    }

    if (role === "USER") {
      const { companyCode, field } = body
      const code = typeof companyCode === "string" ? companyCode.trim() : ""
      const fieldValue = typeof field === "string" && field.trim() ? field.trim() : null
      const ip = clientIp(req)

      // Korxona kodisiz: mustaqil o'quvchi (korxonaga bog'lanmagan, faqat ism-familya)
      if (!code) {
        // Ommaviy ro'yxatdan o'tkazishga qarshi: bitta IP dan soatiga 5 ta
        const indieKey = `indie-reg:${ip}`
        if (await isLimited(indieKey, 5, 60 * 60 * 1000)) {
          return NextResponse.json(
            { error: "Juda ko'p urinish. Keyinroq qayta urinib ko'ring." },
            { status: 429 }
          )
        }
        const indie = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            hashedPassword,
            role: "USER",
            organizationName: "",
            field: fieldValue,
          },
        })
        await recordHit(indieKey, ip)
        return NextResponse.json(
          { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", userId: indie.id },
          { status: 201 }
        )
      }

      // Korxona kodini terib ko'rishni to'xtatish: bitta IP dan 15 daqiqada 10 ta xato kod
      const limitKey = `company-code:${ip}`
      if (await isLimited(limitKey, 10, 15 * 60 * 1000)) {
        return NextResponse.json(
          { error: "Juda ko'p noto'g'ri urinish. Keyinroq qayta urinib ko'ring." },
          { status: 429 }
        )
      }

      const company = await prisma.company.findUnique({
        where: { code: code.toUpperCase() },
      })
      if (!company) {
        await recordHit(limitKey, ip)
        return NextResponse.json(
          { error: "Korxona kodi noto'g'ri" },
          { status: 400 }
        )
      }

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          hashedPassword,
          role: "USER",
          organizationName: company.name,
          field: fieldValue,
          companyId: company.id,
        },
      })

      return NextResponse.json(
        { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", userId: user.id },
        { status: 201 }
      )
    }

    return NextResponse.json({ error: "Noto'g'ri rol" }, { status: 400 })

  } catch (error) {
    console.error("Register xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}