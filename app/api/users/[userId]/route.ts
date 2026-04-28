import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { userId } = await params
        const { firstName, lastName, email, password, organizationName } = await req.json()

        const updateData: any = {}
        if (firstName) updateData.firstName = firstName
        if (lastName) updateData.lastName = lastName
        if (email) updateData.email = email
        if (organizationName) updateData.organizationName = organizationName
        if (password) updateData.hashedPassword = await bcrypt.hash(password, 12)

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
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const role = (session.user as any)?.role
        if (role !== "SUPER_ADMIN") {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 })
        }

        const { userId } = await params

        await prisma.user.delete({ where: { id: userId } })

        return NextResponse.json({ message: "Foydalanuvchi o'chirildi" })
    } catch (error) {
        console.error("User DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}