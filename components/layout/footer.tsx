export function Footer() {
    return (
        <footer className="border-t border-border px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-5">
                <p className="text-muted-foreground text-[10px] sm:text-xs text-center">
                    © {new Date().getFullYear()} KiberSaboq — Kiber Xavfsizlik Ta'lim Platformasi
                </p>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30" />
                <p className="text-muted-foreground text-[10px] sm:text-xs font-medium">
                    v1.0.0
                </p>
            </div>
        </footer>
    )
}