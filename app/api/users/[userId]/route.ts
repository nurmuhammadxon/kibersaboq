import { NextResponse } from "next/server"
import { requireUser } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { userId } = await params
        const { firstName, lastName, email, password, organizationName } = await req.json()

        const updateData: any = {}
        if (firstName) updateData.firstName = firstName
        if (lastName) updateData.lastName = lastName
        if (email) updateData.email = email
        if (organizationName) updateData.organizationName = organizationName
        if (password) {
            if (typeof password !== "string" || password.length < 8) {
                return NextResponse.json(
                    { error: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" },
                    { status: 400 }
                )
            }
            updateData.hashedPassword = await bcrypt.hash(password, 12)
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
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

        return NextResponse.json(user)
    } catch (error) {
        console.error("User PATCH xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}

export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const guard = await requireUser(["SUPER_ADMIN"])
        if (guard.error) return guard.error

        const { userId } = await params

        const target = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, ownedCompany: { select: { id: true } } },
        })
        if (!target) {
            return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 })
        }
        if (target.role === "SUPER_ADMIN") {
            return NextResponse.json({ error: "Admin akkauntini o'chirib bo'lmaydi" }, { status: 403 })
        }
        if (target.ownedCompany) {
            return NextResponse.json(
                { error: "Bu direktorning korxonasi bor. Uni o'chirish o'rniga bloklang." },
                { status: 409 }
            )
        }

        await prisma.user.delete({ where: { id: userId } })

        return NextResponse.json({ message: "Foydalanuvchi o'chirildi" })
    } catch (error) {
        console.error("User DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}