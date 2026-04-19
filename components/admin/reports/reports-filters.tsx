"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const dateInputClassName = cn(
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
)

interface CourseOption {
    id: string
    title: string
}

interface ReportsFiltersProps {
    from: string
    to: string
    courseId: string
    courseOptions: CourseOption[]
    loading: boolean
    onFromChange: (value: string) => void
    onToChange: (value: string) => void
    onCourseIdChange: (value: string) => void
    onApply: () => void
}

export function ReportsFilters({
    from,
    to,
    courseId,
    courseOptions,
    loading,
    onFromChange,
    onToChange,
    onCourseIdChange,
    onApply,
}: ReportsFiltersProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="grid gap-2 sm:flex-1 sm:min-w-[140px]">
                <Label htmlFor="report-from">Boshlanish</Label>
                <input
                    id="report-from"
                    type="date"
                    value={from}
                    onChange={(e) => onFromChange(e.target.value)}
                    className={dateInputClassName}
                />
            </div>
            <div className="grid gap-2 sm:flex-1 sm:min-w-[140px]">
                <Label htmlFor="report-to">Tugash</Label>
                <input
                    id="report-to"
                    type="date"
                    value={to}
                    onChange={(e) => onToChange(e.target.value)}
                    className={dateInputClassName}
                />
            </div>
            <div className="grid gap-2 sm:flex-[2] sm:min-w-[200px]">
                <Label>Kurs</Label>
                <Select
                    value={courseId || "__all__"}
                    onValueChange={(v) =>
                        onCourseIdChange(v === "__all__" ? "" : v)
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Barcha kurslar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">Barcha kurslar</SelectItem>
                        {courseOptions.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                                {c.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button
                type="button"
                onClick={onApply}
                disabled={loading}
                className="w-full sm:w-auto"
            >
                Qo'llash
            </Button>
        </div>
    )
}
