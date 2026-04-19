/** HTML `type="date"` uchun `YYYY-MM-DD` (UTC kun kesimi). */
export function formatDateInput(d: Date): string {
    return d.toISOString().slice(0, 10)
}

export function defaultReportDateRange(): { from: string; to: string } {
    const to = new Date()
    const from = new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000)
    return { from: formatDateInput(from), to: formatDateInput(to) }
}
