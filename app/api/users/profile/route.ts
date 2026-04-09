import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { name, email, currentPassword, newPassword } = await req.json()

        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
        })

        if (!user) {
            return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 })
        }

        const updateData: any = { name }

        if (email && user.role === "SUPER_ADMIN") {
            const existingEmail = await prisma.user.findUnique({
                where: { email },
            })
            if (existingEmail && existingEmail.id !== user.id) {
                return NextResponse.json(
                    { error: "Bu email allaqachon mavjud" },
                    { status: 400 }
                )
            }
            updateData.email = email
        }

        if (currentPassword && newPassword) {
            const isValid = await bcrypt.compare(currentPassword, user.hashedPassword)
            if (!isValid) {
                return NextResponse.json(
                    { error: "Joriy parol noto'g'ri" },
                    { status: 400 }
                )
            }
            if (newPassword.length < 6) {
                return NextResponse.json(
                    { error: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak" },
                    { status: 400 }
                )
            }
            updateData.hashedPassword = await bcrypt.hash(newPassword, 12)
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        })

        return NextResponse.json({
            message: "Profil yangilandi",
            user: updatedUser
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}