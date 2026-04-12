import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { id } = await params
        const { name, email, password, organizationName } = await req.json()

        const updateData: any = {}
        if (name) updateData.name = name
        if (email) updateData.email = email
        if (organizationName) updateData.organizationName = organizationName
        if (password) updateData.hashedPassword = await bcrypt.hash(password, 12)

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
        }

        const { id } = await params

        await prisma.user.delete({ where: { id } })

        return NextResponse.json({ message: "Foydalanuvchi o'chirildi" })
    } catch (error) {
        console.error("User DELETE xato:", error)
        return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
    }
}