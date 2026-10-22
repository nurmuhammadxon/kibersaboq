import { ChevronDown } from "lucide-react"

const faqs = [
    {
        q: "Platforma kimlar uchun?",
        a: "Xodimlariga kiberxavfsizlik asoslarini o'rgatmoqchi bo'lgan tashkilotlar uchun. Direktor tashkilotni ro'yxatdan o'tkazadi, xodimlar esa o'qiydi.",
    },
    {
        q: "Xodim qanday qo'shiladi?",
        a: "Direktor ro'yxatdan o'tganda korxona kodi beriladi (masalan, AB-1234). Xodim ro'yxatdan o'tishda shu kodni kiritadi va tashkilotga qo'shiladi.",
    },
    {
        q: "Kurs qanday o'tiladi?",
        a: "Darslar matn ko'rinishida. Har darsda test bor, o'tish uchun kamida 70 foiz to'g'ri javob kerak. Darsni yakunlash uchun belgilangan minimal vaqt o'qish talab qilinishi mumkin.",
    },
    {
        q: "Sertifikat qachon beriladi?",
        a: "Kursning barcha darslari va testlari tugagach sertifikat avtomatik beriladi va PDF qilib yuklab olinadi.",
    },
    {
        q: "Sertifikat haqiqiyligini qanday tekshiramiz?",
        a: "Sertifikatdagi QR kodni telefon bilan skaner qiling yoki \"Sertifikatni tekshirish\" sahifasiga raqamni kiriting. Sahifada kirish talab qilinmaydi. Bekor qilingan sertifikat shunday deb ko'rsatiladi.",
    },
    {
        q: "Direktor nimalarni ko'ra oladi?",
        a: "O'z xodimlarining ro'yxatini, kurs bo'yicha jarayonini, test natijalarini va sertifikatlarini. Hisobotni CSV yoki PDF qilib yuklab olish mumkin.",
    },
    {
        q: "Ma'lumotlarim himoyalanganmi?",
        a: "Parollar shifrlangan holda saqlanadi, kirish rollar bo'yicha cheklangan: direktor faqat o'z tashkiloti xodimlarini ko'radi. Sertifikat tekshirish sahifasida ism qisqartirib ko'rsatiladi.",
    },
    {
        q: "Parolni unutsam nima qilaman?",
        a: "Kirish sahifasidagi \"Unutdingizmi?\" havolasi orqali emailingizga tiklash havolasi yuboriladi.",
    },
]

export function LandingFaq() {
    return (
        <section id="faq" className="scroll-mt-20 border-t border-border px-4 sm:px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center">Ko'p beriladigan savollar</h2>
                <div className="space-y-3">
                    {faqs.map((f) => (
                        <details key={f.q} className="group bg-card border border-border rounded-xl open:border-primary/40">
                            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                                {f.q}
                                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    )
}
