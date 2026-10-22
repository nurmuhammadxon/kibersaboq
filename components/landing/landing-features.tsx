import { features } from "@/lib/constants"

export function LandingFeatures() {
    return (
        <section id="imkoniyatlar" className="scroll-mt-20 border-t border-border px-4 sm:px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-center">Imkoniyatlar</h2>
                <p className="text-muted-foreground text-center mt-2 mb-10">O'qitish uchun kerak bo'lgan hamma narsa bir joyda</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {features.map((f) => (
                        <div key={f.title} className="flex flex-col gap-3 bg-card border border-border rounded-2xl p-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                                <f.icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold">{f.title}</h3>
                            <p className="text-sm text-muted-foreground">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
