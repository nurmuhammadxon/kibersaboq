type Role = "USER" | "DIRECTOR"

interface Props {
    role: Role
    onSwitch: (role: Role) => void
}

export function RoleSwitcher({ role, onSwitch }: Props) {
    return (
        <div className="grid grid-cols-2 gap-2 mb-4">
            <button
                type="button"
                onClick={() => onSwitch("USER")}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${role === "USER"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                    }`}
            >
                Xodim
            </button>
            <button
                type="button"
                onClick={() => onSwitch("DIRECTOR")}
                className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${role === "DIRECTOR"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                    }`}
            >
                Direktor
            </button>
        </div>
    )
}