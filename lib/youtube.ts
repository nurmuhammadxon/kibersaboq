/**
 * Faqat YouTube havolalarini qabul qiladi. Boshqa har qanday qiymat
 * (jumladan `javascript:` havolalari) bo'sh qator qaytaradi, shuning uchun
 * <iframe src> orqali kod bajarilishi mumkin emas.
 */
export function getYoutubeEmbedUrl(raw: string): string {
    try {
        const u = new URL(raw.trim())
        if (u.protocol !== "https:" && u.protocol !== "http:") return ""
        const host = u.hostname.replace(/^www\./, "")

        let id: string | null = null
        if (host === "youtu.be") id = u.pathname.slice(1)
        else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
            if (u.pathname === "/watch") id = u.searchParams.get("v")
            else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/")[2]
        }

        return id && /^[A-Za-z0-9_-]{6,20}$/.test(id)
            ? `https://www.youtube.com/embed/${id}`
            : ""
    } catch {
        return ""
    }
}
