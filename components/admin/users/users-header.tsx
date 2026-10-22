interface Props {
    count: number
}

export function UsersHeader({ count }: Props) {
    return (
        <div>
            <h2 className="text-foreground font-bold text-xl">Foydalanuvchilar</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{count} ta foydalanuvchi</p>
        </div>
    )
}
