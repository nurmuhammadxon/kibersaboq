import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

function generateCompanyCode(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const digits = "0123456789"
  const prefix = Array.from({ length: 2 }, () => letters[Math.floor(Math.random() * letters.length)]).join("")
  const suffix = Array.from({ length: 4 }, () => digits[Math.floor(Math.random() * digits.length)]).join("")
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

      if (!companyCode || !field) {
        return NextResponse.json(
          { error: "Korxona kodi va yo'nalishni kiriting" },
          { status: 400 }
        )
      }

      const company = await prisma.company.findUnique({ where: { code: companyCode } })
      if (!company) {
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
          field,
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