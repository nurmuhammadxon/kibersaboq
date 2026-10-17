import type { DirectorReportsData } from "@/hooks/use-director-reports"

function csvCell(v: string | number | null | undefined) {
    if (v === null || v === undefined) return ""
    const s = String(v)
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function csvRow(cells: (string | number | null | undefined)[]) {
    return cells.map(csvCell).join(",")
}

function download(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}

const day = (iso: string) => iso.slice(0, 10)

/** Excel ochadigan CSV (UTF-8 BOM bilan) */
export function downloadDirectorReportCsv(data: DirectorReportsData) {
    const { company, stats } = data
    const from = day(data.range.from)
    const to = day(data.range.to)

    const lines = [
        csvRow(["Korxona", company.name]),
        csvRow(["Korxona kodi", company.code]),
        csvRow(["Davr", `${from} — ${to}`]),
        "",
        csvRow(["Jami xodimlar", stats.totalEmployees]),
        csvRow(["Faol xodimlar", stats.activeEmployees]),
        csvRow(["Yozilishlar", stats.enrollmentsStarted]),
        csvRow(["Yakunlangan kurslar", stats.enrollmentsCompleted]),
        csvRow(["Tugatilgan darslar", stats.lessonsCompleted]),
        csvRow(["Sertifikatlar", stats.certificatesIssued]),
        csvRow(["O'rtacha test balli (%)", stats.avgQuizScore]),
        "",
        "XODIMLAR BO'YICHA",
        csvRow(["Ism", "Familiya", "Email", "Yo'nalish", "Yozilgan", "Yakunlangan", "Darslar", "Sertifikatlar", "O'rtacha ball (%)", "Holat"]),
        ...data.employees.map((e) =>
            csvRow([
                e.firstName,
                e.lastName,
                e.email,
                e.field ?? "",
                e.enrollments,
                e.completed,
                e.lessons,
                e.certificates,
                e.avgScore,
                e.isBlocked ? "Bloklangan" : "Faol",
            ])
        ),
        "",
        "KURSLAR BO'YICHA",
        csvRow(["Kurs", "Yozilishlar", "Yakunlangan", "Sertifikatlar", "O'rtacha ball (%)"]),
        ...data.courses.map((c) =>
            csvRow([c.title, c.enrollments, c.completed, c.certificates, c.avgScore])
        ),
        "",
        data.bucketSize === 1 ? "FAOLLIK (kunlik)" : "FAOLLIK (haftalik, hafta boshlanish sanasi)",
        csvRow(["Sana", "Tugatilgan darslar", "Yakunlangan kurslar", "Sertifikatlar"]),
        ...data.activity.map((a) =>
            csvRow([a.date, a.lessons, a.completions, a.certificates])
        ),
    ]

    download(
        new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" }),
        `hisobot-${company.code}-${from}-${to}.csv`
    )
}

// jsPDF standart shriftlari faqat Latin-1 ni qo'llaydi
function safe(v: string | number | null | undefined) {
    if (v === null || v === undefined || v === "") return "-"
    return String(v)
        .replace(/[\u02BB\u02BC\u2018\u2019\u0060\u00B4]/g, "'")
        .replace(/[^\u0020-\u00FF]/g, "?")
}

export async function downloadDirectorReportPdf(data: DirectorReportsData) {
    const { default: jsPDF } = await import("jspdf")
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

    const PAGE_W = pdf.internal.pageSize.getWidth()
    const PAGE_H = pdf.internal.pageSize.getHeight()
    const M = 14
    let y = M

    const from = day(data.range.from)
    const to = day(data.range.to)

    const ensure = (h: number) => {
        if (y + h > PAGE_H - M) {
            pdf.addPage()
            y = M
        }
    }

    const heading = (text: string) => {
        ensure(12)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12)
        pdf.setTextColor(30, 41, 59)
        pdf.text(safe(text), M, y)
        y += 6
    }

    const table = (
        head: string[],
        rows: (string | number | null)[][],
        widths: number[]
    ) => {
        const total = widths.reduce((s, w) => s + w, 0)
        const scale = (PAGE_W - M * 2) / total
        const w = widths.map((x) => x * scale)
        const rowH = 7

        const drawHead = () => {
            ensure(rowH + 2)
            pdf.setFillColor(30, 64, 175)
            pdf.rect(M, y - 5, PAGE_W - M * 2, rowH, "F")
            pdf.setFont("helvetica", "bold")
            pdf.setFontSize(9)
            pdf.setTextColor(255, 255, 255)
            let x = M
            head.forEach((h, i) => {
                pdf.text(safe(h), x + 2, y)
                x += w[i]
            })
            y += rowH
        }

        drawHead()
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(30, 41, 59)

        rows.forEach((row, ri) => {
            if (y + rowH > PAGE_H - M) {
                pdf.addPage()
                y = M + 5
                drawHead()
                pdf.setFont("helvetica", "normal")
                pdf.setTextColor(30, 41, 59)
            }
            if (ri % 2 === 1) {
                pdf.setFillColor(241, 245, 249)
                pdf.rect(M, y - 5, PAGE_W - M * 2, rowH, "F")
            }
            pdf.setFontSize(9)
            let x = M
            row.forEach((cell, i) => {
                const maxChars = Math.floor(w[i] / 1.9)
                const text = safe(cell)
                pdf.text(
                    text.length > maxChars ? text.slice(0, maxChars - 2) + ".." : text,
                    x + 2,
                    y
                )
                x += w[i]
            })
            y += rowH
        })
        y += 6
    }

    // ── Sarlavha ──
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(18)
    pdf.setTextColor(30, 64, 175)
    pdf.text("KiberSaboq - Hisobot", M, y + 2)
    y += 10

    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(10)
    pdf.setTextColor(71, 85, 105)
    pdf.text(`Korxona: ${safe(data.company.name)}`, M, y)
    pdf.text(`Korxona kodi: ${safe(data.company.code)}`, M + 110, y)
    y += 5
    pdf.text(`Davr: ${from} - ${to}`, M, y)
    pdf.text(`Yaratilgan: ${new Date().toISOString().slice(0, 10)}`, M + 110, y)
    y += 9

    // ── Umumiy ──
    heading("Umumiy ko'rsatkichlar")
    const s = data.stats
    table(
        ["Xodimlar", "Faol xodimlar", "Yozilishlar", "Yakunlangan", "Darslar", "Sertifikatlar", "O'rtacha ball"],
        [[
            s.totalEmployees,
            s.activeEmployees,
            s.enrollmentsStarted,
            s.enrollmentsCompleted,
            s.lessonsCompleted,
            s.certificatesIssued,
            `${s.avgQuizScore}%`,
        ]],
        [1, 1, 1, 1, 1, 1, 1]
    )

    // ── Xodimlar ──
    heading("Xodimlar bo'yicha")
    table(
        ["Xodim", "Email", "Yo'nalish", "Yozilgan", "Yakunlangan", "Darslar", "Sertif.", "Ball", "Holat"],
        data.employees.map((e) => [
            `${e.firstName} ${e.lastName}`,
            e.email,
            e.field,
            e.enrollments,
            e.completed,
            e.lessons,
            e.certificates,
            e.avgScore != null ? `${e.avgScore}%` : null,
            e.isBlocked ? "Bloklangan" : "Faol",
        ]),
        [3, 4, 2.5, 1.4, 1.7, 1.3, 1.3, 1.1, 1.8]
    )

    // ── Kurslar ──
    heading("Kurslar bo'yicha")
    table(
        ["Kurs", "Yozilishlar", "Yakunlangan", "Sertifikatlar", "O'rtacha ball"],
        data.courses.map((c) => [
            c.title,
            c.enrollments,
            c.completed,
            c.certificates,
            c.avgScore != null ? `${c.avgScore}%` : null,
        ]),
        [5, 1.5, 1.5, 1.5, 1.5]
    )

    // ── Sahifa raqamlari ──
    const pages = pdf.getNumberOfPages()
    for (let i = 1; i <= pages; i++) {
        pdf.setPage(i)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(8)
        pdf.setTextColor(148, 163, 184)
        pdf.text(`${i} / ${pages}`, PAGE_W - M, PAGE_H - 6, { align: "right" })
    }

    pdf.save(`hisobot-${data.company.code}-${from}-${to}.pdf`)
}