export function Footer() {
    return (
        <footer className="border-t border-zinc-800 px-6 py-4">
            <div className="flex items-center justify-between">
                <p className="text-zinc-600 text-xs">
                    © {new Date().getFullYear()} KiberSaboq — Kiber Xavfsizlik Ta'lim Platformasi
                </p>
                <p className="text-zinc-600 text-xs">v1.0.0</p>
            </div>
        </footer>
    )
}