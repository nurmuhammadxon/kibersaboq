import { features } from "@/lib/constants"

export function LandingFeatures() {
    return (
        <section className="border-t border-border px-6 py-16">
            <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8">
                {features.map((f) => (
                    <div key={f.title} className="flex flex-col gap-3 items-center">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <f.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">{f.title}</h3>
                        <p className="text-sm text-muted-foreground text-center">{f.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}