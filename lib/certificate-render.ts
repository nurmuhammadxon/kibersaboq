/**
 * Sertifikatni brauzerda (canvas) chizadi. Bir xil funksiya PDF yuklab olishda
 * ham, sahifadagi ko'rinishda ham ishlatiladi.
 * Grafika (ramka, logotip, chiziqlar) /certificate-template.png ichida;
 * matn va QR kod shu yerda chiziladi. Joylashuvlar shablon o'lchamiga nisbatan.
 */

export interface CertificateData {
    userName: string
    courseTitle: string
    issuedAt: string
    certificateNumber: string
}

const SANS = '"Segoe UI", Inter, Arial, sans-serif'

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(/\s+/)
    const lines: string[] = []
    let line = ""
    for (const w of words) {
        const test = line ? `${line} ${w}` : w
        if (line && ctx.measureText(test).width > maxWidth) {
            lines.push(line)
            line = w
        } else {
            line = test
        }
    }
    if (line) lines.push(line)
    return lines
}

function drawLines(
    ctx: CanvasRenderingContext2D,
    lines: string[],
    x: number,
    y: number,
    lineHeight: number
): number {
    for (const l of lines) {
        ctx.fillText(l, x, y)
        y += lineHeight
    }
    return y
}

export function verifyBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, "")
}

export async function renderCertificateCanvas(data: CertificateData): Promise<HTMLCanvasElement> {
    const img = await loadImage("/certificate-template.png")
    const W = img.naturalWidth
    const H = img.naturalHeight

    const canvas = document.createElement("canvas")
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0, W, H)
    ctx.textBaseline = "alphabetic"

    const base = verifyBaseUrl()
    const verifyUrl = `${base}/verify/${encodeURIComponent(data.certificateNumber)}`

    ctx.textAlign = "center"
    const titleSize = W * 0.07
    ctx.font = `800 ${titleSize}px ${SANS}`
    const grad = ctx.createLinearGradient(W * 0.28, 0, W * 0.72, 0)
    grad.addColorStop(0, "#0B2A66")
    grad.addColorStop(1, "#1350C4")
    ctx.fillStyle = grad
    const spaced = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
    spaced.letterSpacing = `${W * 0.004}px`
    ctx.fillText("SERTIFIKAT", W * 0.5, H * 0.296)
    spaced.letterSpacing = "0px"

    ctx.font = `400 ${W * 0.0155}px ${SANS}`
    ctx.fillStyle = "#64748B"
    ctx.fillText("ushbu sertifikat quyidagi shaxsga topshiriladi", W * 0.5, H * 0.362)

    let nameSize = W * 0.036
    ctx.font = `600 ${nameSize}px ${SANS}`
    while (ctx.measureText(data.userName).width > W * 0.58 && nameSize > W * 0.02) {
        nameSize -= 2
        ctx.font = `600 ${nameSize}px ${SANS}`
    }
    ctx.fillStyle = "#0E78C0"
    ctx.fillText(data.userName, W * 0.5, H * 0.463)

    const maxW = W * 0.64
    ctx.fillStyle = "#1E293B"
    ctx.font = `400 ${W * 0.0168}px ${SANS}`
    const uz = wrapLines(
        ctx,
        `"${data.courseTitle}" kursi dasturini to'liq o'zlashtirgani va yakuniy testlardan muvaffaqiyatli o'tgani tasdiqlanadi.`,
        maxW
    )
    const y = drawLines(ctx, uz, W * 0.5, H * 0.543, W * 0.0268)

    ctx.fillStyle = "#475569"
    ctx.font = `italic 400 ${W * 0.0158}px ${SANS}`
    const en = wrapLines(
        ctx,
        `This certificate confirms the successful completion of the "${data.courseTitle}" course and its final tests.`,
        maxW
    )
    drawLines(ctx, en, W * 0.5, y + H * 0.012, W * 0.0252)

    ctx.textAlign = "left"
    ctx.fillStyle = "#0F172A"
    ctx.font = `600 ${W * 0.0125}px ${SANS}`
    ctx.fillText(data.certificateNumber, W * 0.7545, H * 0.1535)

    ctx.fillStyle = "#475569"
    ctx.font = `400 ${W * 0.0122}px ${SANS}`
    const noteW = W * 0.5
    drawLines(
        ctx,
        wrapLines(
            ctx,
            "Sertifikat faqat veb-sayt orqali tekshirilgandagina haqiqiy hisoblanadi. Har qanday nusxa ko'chirish yoki o'zgartirish qonunga binoan ta'qib qilinadi.",
            noteW
        ),
        W * 0.14,
        H * 0.7845,
        W * 0.0172
    )
    ctx.font = `italic 400 ${W * 0.0116}px ${SANS}`
    drawLines(
        ctx,
        wrapLines(
            ctx,
            "The certificate is considered valid only when verified through the website. Any copying or modification is punishable by law.",
            noteW
        ),
        W * 0.14,
        H * 0.8545,
        W * 0.0164
    )

    const { default: QRCode } = await import("qrcode")
    const qrSize = Math.round(W * 0.115)
    const qrCanvas = document.createElement("canvas")
    await QRCode.toCanvas(qrCanvas, verifyUrl, {
        width: qrSize,
        margin: 0,
        errorCorrectionLevel: "M",
        color: { dark: "#0B1B3A", light: "#FFFFFF" },
    })
    ctx.drawImage(qrCanvas, 1774, 1167, qrSize, qrSize)

    ctx.textAlign = "right"
    ctx.fillStyle = "#475569"
    ctx.font = `400 ${W * 0.0125}px ${SANS}`
    ctx.fillText("Tekshirish uchun:", 1730, 1290)
    ctx.fillStyle = "#0B2A66"
    ctx.font = `700 ${W * 0.0125}px ${SANS}`
    const host = base.replace(/^https?:\/\//, "")
    ctx.fillText(`${host}/verify`, 1730, 1326)

    return canvas
}
