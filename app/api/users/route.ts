import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const guard = await requireUser(["SUPER_ADMIN"])
    if (guard.error) return guard.error

    const users = await prisma.user.findMany({
      where: { role: { in: ["USER", "DIRECTOR"] } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        organizationName: true,
        createdAt: true,
        isBlocked: true,
        // Direktorning korxonasi (ownedCompany) yoki xodim qo'shilgan korxona (company)
        ownedCompany: { select: { code: true } },
        company: { select: { code: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      users.map(({ ownedCompany, company, ...u }) => ({
        ...u,
        companyCode: ownedCompany?.code ?? company?.code ?? null,
      }))
    )
  } catch (error) {
    console.error("Users GET xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireUser(["SUPER_ADMIN"])
    if (guard.error) return guard.error

    const { firstName, lastName, email, password, organizationName } = await req.json()

    if (!firstName || !lastName || !email || !password || !organizationName) {
      return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 })
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Bu email allaqachon mavjud" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        hashedPassword,
        role: "USER", 
        organizationName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        organizationName: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Users POST xato:", error)
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}