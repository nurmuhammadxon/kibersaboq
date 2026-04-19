import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password, organizationName } = await req.json()

    if (!name || !email || !password || !organizationName) {
      return NextResponse.json(
        { error: "Barcha maydonlarni to'ldiring" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email allaqachon ro'yxatdan o'tgan" },
        { status: 400 }
      )
    }

    const slug = organizationName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    const organization = await prisma.organization.create({
      data: {
        name: organizationName,
        slug: `${slug}-${Date.now()}`,
      },
    })

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "USER",
        organizationId: organization.id,
        organizationName
      },
    })

    return NextResponse.json(
      { message: "Muvaffaqiyatli ro'yxatdan o'tdingiz", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Xatolik yuz berdi" },
      { status: 500 }
    )
  }
}