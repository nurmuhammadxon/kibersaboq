import { prisma } from "@/lib/prisma"

// Sertifikat raqami formati: yangilari CERT-2026-ABCDEF1234, eskilari cuid.
// Faqat harf, raqam va chiziqcha; uzunligi cheklangan.
export const CERT_NUMBER_RE = /^[A-Za-z0-9-]{8,40}$/

/**
 * Ochiq sahifada shaxsiy ma'lumot kam ko'rsatiladi: "Abdullayev A."
 * (Rahbariyat to'liq ism ko'rsatishni tanlasa, shu funksiyani o'zgartirish yetarli.)
 */
export function maskName(firstName: string, lastName: string): string {
    const initial = firstName.trim().charAt(0).toUpperCase()
    return initial ? `${lastName.trim()} ${initial}.` : lastName.trim()
}

export type VerifyResult =
    | { status: "notfound" }
    | {
          status: "valid" | "revoked"
          holder: string
          courseTitle: string
          organization: string
          issuedAt: Date
          number: string
          revokedAt: Date | null
          revokedReason: string | null
      }

export async function lookupCertificate(number: string): Promise<VerifyResult> {
    if (!CERT_NUMBER_RE.test(number)) return { status: "notfound" }

    const cert = await prisma.certificate.findUnique({
        where: { certificateNumber: number },
        select: {
            certificateNumber: true,
            issuedAt: true,
            revokedAt: true,
            revokedReason: true,
            course: { select: { title: true } },
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    organizationName: true,
                    company: { select: { name: true } },
                },
            },
        },
    })
    if (!cert) return { status: "notfound" }

    return {
        status: cert.revokedAt ? "revoked" : "valid",
        holder: maskName(cert.user.firstName, cert.user.lastName),
        courseTitle: cert.course.title,
        organization: cert.user.company?.name ?? cert.user.organizationName,
        issuedAt: cert.issuedAt,
        number: cert.certificateNumber,
        revokedAt: cert.revokedAt,
        revokedReason: cert.revokedReason,
    }
}
