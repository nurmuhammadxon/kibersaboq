import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Props {
    userSearch: string
    courseSearch: string
    onUserSearch: (v: string) => void
    onCourseSearch: (v: string) => void
}

export function CertificatesFilters({ userSearch, courseSearch, onUserSearch, onCourseSearch }: Props) {
    return (
        <div className="flex gap-2">
            <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Xodim qidirish..."
                    value={userSearch}
                    onChange={(e) => onUserSearch(e.target.value)}
                    className="pl-9"
                />
            </div>
            <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Kurs qidirish..."
                    value={courseSearch}
                    onChange={(e) => onCourseSearch(e.target.value)}
                    className="pl-9"
                />
            </div>
        </div>
    )
}