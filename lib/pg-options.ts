/**
 * PrismaPg (pg) sozlamalari. Bir joyda turadi: ilova ham, skriptlar ham ishlatadi.
 *
 * - Lokal baza (localhost yoki docker-compose dagi "db"): SSL yo'q.
 * - Masofadagi baza (Supabase va h.k.): SSL yoqiladi. DATABASE_URL ichiga
 *   `sslmode=` yozmang, u shu sozlamani bekor qilib yuboradi.
 * - Vercel (serverless): har bir funksiya nusxasi uchun 1 ta ulanish,
 *   aks holda baza ulanishlari tez tugab qoladi.
 */
export function pgOptions(connectionString = process.env.DATABASE_URL) {
  const isLocal = /@(localhost|127\.0\.0\.1|db)[:/]/.test(connectionString ?? "")
  return {
    connectionString,
    max: process.env.VERCEL ? 1 : 10,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  }
}
