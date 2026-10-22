import { Building2, UserPlus, Award } from "lucide-react"

const steps = [
    {
        icon: Building2,
        title: "Direktor tashkilot yaratadi",
        text: "Ro'yxatdan o'tganda tashkilotingiz uchun noyob korxona kodi beriladi.",
    },
    {
        icon: UserPlus,
        title: "Xodimlar kod bilan qo'shiladi",
        text: "Xodim shu kod orqali ro'yxatdan o'tadi, darslarni o'qiydi va testlarni topshiradi.",
    },
    {
        icon: Award,
        title: "Sertifikat va hisobot",
        text: "Kursni tugatgan xodim sertifikat oladi. Direktor kim qayerda ekanini hisobotda ko'radi.",
    },
]

export function LandingHow() {
    return (
        <section id="qanday-ishlaydi" className="scroll-mt-20 border-t border-border px-4 sm:px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center">Qanday ishlaydi</h2>
                <p className="text-muted-foreground text-center mt-2 mb-10">Uch qadamda ishga tushadi</p>
                <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {steps.map((s, i) => (
                        <li key={s.title} className="relative bg-card border border-border rounded-2xl p-6">
                            <span className="absolute top-4 right-5 text-5xl font-bold text-primary/15 select-none">{i + 1}</span>
                            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4">
                                <s.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">{s.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{s.text}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
