import { BookOpen } from "lucide-react"

const modules = [
    {
        title: "Fishing va ijtimoiy muhandislik",
        lessons: ["Fishing nima va u qanday ishlaydi", "Shubhali xat va havolani qanday tanib olish mumkin", "Telefon, SMS va messenjerdagi firibgarlik"],
    },
    {
        title: "Parollar va ikki bosqichli tasdiqlash",
        lessons: ["Yaxshi parol nima", "Parol menejeri va parolni takrorlamaslik", "Ikki bosqichli tasdiqlash (2FA)"],
    },
    {
        title: "Zararli dasturlar va qurilma xavfsizligi",
        lessons: ["Zararli dasturlar: turlari va kirib kelish yo'llari", "Kompyuter va telefonni himoyalash", "USB, fayl va dasturlar bilan ehtiyotkorlik"],
    },
]

export function LandingCurriculum() {
    return (
        <section id="dastur" className="scroll-mt-20 border-t border-border px-4 sm:px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center">Kurs dasturi</h2>
                <p className="text-muted-foreground text-center mt-2 mb-10">
                    "Kiberxavfsizlik asoslari": har modulda 3 ta dars, har darsda test
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modules.map((m, i) => (
                        <div key={m.title} className="bg-card border border-border rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-primary text-xs font-medium mb-3">
                                <BookOpen className="h-4 w-4" />
                                {i + 1}-modul
                            </div>
                            <h3 className="font-semibold leading-snug">{m.title}</h3>
                            <ul className="mt-4 space-y-2 text-sm text-muted-foreground list-disc pl-5">
                                {m.lessons.map((l) => <li key={l}>{l}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-6">
                    Keyingi modullar tayyorlanmoqda: ma'lumotlar bilan ishlash, xavfsiz tarmoq, hodisa yuz bersa nima qilish kerak.
                </p>
            </div>
        </section>
    )
}
