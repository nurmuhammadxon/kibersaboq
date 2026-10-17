"use client"

import { Activity } from "lucide-react"
import type { DirectorReportActivity } from "@/hooks/use-director-reports"

interface Props {
    activity: DirectorReportActivity[]
    bucketSize: number
}

const W = 720
const H = 240
const PAD = { top: 16, right: 16, bottom: 28, left: 36 }

const SERIES = [
    { key: "lessons", label: "Tugatilgan darslar", color: "#3b82f6" },
    { key: "completions", label: "Yakunlangan kurslar", color: "#22c55e" },
    { key: "certificates", label: "Sertifikatlar", color: "#f59e0b" },
] as const

function niceMax(v: number) {
    if (v <= 5) return 5
    const pow = Math.pow(10, Math.floor(Math.log10(v)))
    const n = v / pow
    const step = n <= 2 ? 2 : n <= 5 ? 5 : 10
    return step * pow
}

function shortDate(iso: string) {
    const [, m, d] = iso.split("-")
    return `${d}.${m}`
}

export function DirectorActivityChart({ activity, bucketSize }: Props) {
    const total = activity.reduce(
        (s, a) => s + a.lessons + a.completions + a.certificates,
        0
    )

    const max = niceMax(
        Math.max(1, ...activity.flatMap((a) => [a.lessons, a.completions, a.certificates]))
    )
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom
    const n = activity.length

    const x = (i: number) =>
        PAD.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW)
    const y = (v: number) => PAD.top + innerH - (v / max) * innerH

    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))
    const labelEvery = Math.max(1, Math.ceil(n / 8))

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Faollik grafigi</h2>
                    <span className="text-xs text-muted-foreground">
                        {bucketSize === 1 ? "kunlik" : "haftalik"}
                    </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {SERIES.map((s) => (
                        <span key={s.key} className="flex items-center gap-1.5">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ background: s.color }}
                            />
                            {s.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                {total === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        Tanlangan davrda faollik bo'lmagan
                    </p>
                ) : (
                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        className="h-auto w-full"
                        role="img"
                        aria-label="Faollik grafigi"
                    >
                        {ticks.map((t) => (
                            <g key={t}>
                                <line
                                    x1={PAD.left}
                                    x2={W - PAD.right}
                                    y1={y(t)}
                                    y2={y(t)}
                                    className="stroke-border"
                                    strokeDasharray={t === 0 ? undefined : "3 4"}
                                />
                                <text
                                    x={PAD.left - 6}
                                    y={y(t) + 3}
                                    textAnchor="end"
                                    className="fill-muted-foreground text-[10px]"
                                >
                                    {t}
                                </text>
                            </g>
                        ))}

                        {activity.map((a, i) =>
                            i % labelEvery === 0 ? (
                                <text
                                    key={a.date}
                                    x={x(i)}
                                    y={H - 8}
                                    textAnchor="middle"
                                    className="fill-muted-foreground text-[10px]"
                                >
                                    {shortDate(a.date)}
                                </text>
                            ) : null
                        )}

                        {SERIES.map((s) => (
                            <g key={s.key}>
                                <polyline
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth={2}
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    points={activity
                                        .map((a, i) => `${x(i)},${y(a[s.key])}`)
                                        .join(" ")}
                                />
                                {activity.map((a, i) => (
                                    <circle
                                        key={a.date}
                                        cx={x(i)}
                                        cy={y(a[s.key])}
                                        r={n > 40 ? 2 : 3}
                                        fill={s.color}
                                    >
                                        <title>
                                            {`${a.date}${bucketSize > 1 ? " dan boshlab" : ""}: ${s.label} - ${a[s.key]}`}
                                        </title>
                                    </circle>
                                ))}
                            </g>
                        ))}
                    </svg>
                )}
            </div>
        </div>
    )
}