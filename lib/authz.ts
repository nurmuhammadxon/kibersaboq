import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export type Role = "SUPER_ADMIN" | "DIRECTOR" | "USER"

export type AuthUser = {
    id: string
    role: Role
    companyId: string | null
}

type Guard =
    | { user: AuthUser; error?: undefined }
    | { user?: undefined; error: NextResponse }

const deny = (status: 401 | 403) =>
    NextResponse.json({ error: "Ruxsat yo'q" }, { status })

/**
 * Har bir himoyalangan API shu funksiyadan boshlanadi.
 * Rol va bloklanganlik holati JWT dan emas, bazadan olinadi,
 * shuning uchun bloklangan yoki roli o'zgargan foydalanuvchi
 * sessiyasi tugashini kutmasdan darhol to'xtatiladi.
 *
 *   const guard = await requireUser(["SUPER_ADMIN"])
 *   if (guard.error) return guard.error
 *   const { user } = guard
 */
export async function requireUser(roles?: Role[]): Promise<Guard> {
    const session = await auth()
    const id = (session?.user as any)?.id as string | undefined
    if (!id) return { error: deny(401) }

    const dbUser = await prisma.user.findUnique({
        where: { id },
        select: {
            role: true,
            isBlocked: true,
            companyId: true,
            ownedCompany: { select: { id: true } },
        },
    })

    if (!dbUser || dbUser.isBlocked) return { error: deny(401) }

    const role = dbUser.role as Role
    if (roles && !roles.includes(role)) return { error: deny(403) }

    return {
        user: {
            id,
            role,
            companyId: dbUser.ownedCompany?.id ?? dbUser.companyId ?? null,
        },
    }
}
