"use client";

// module-heatmap.tsx — Trend heatmap for a module.
//
// Renders the numeric value of a chosen metric field as a time × test colour
// matrix using the server's /api/v1/modules/{id}/heatmap endpoint. Rows are
// individual tests; columns are rolling time buckets. Cell colour is scaled
// from the min→max value range of the returned data so a regression is easy
// to spot at a glance.

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getModuleHeatmap } from "@/lib/api";
import type { TestResult, HeatmapCell } from "@/lib/types/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Pick a hex colour for a value in [0,1] across a blue→red ramp. */
function valueColor(ratio: number): string {
    const clamped = Math.max(0, Math.min(1, ratio));
    // blue (low) → amber (mid) → red (high)
    const hue = 230 - clamped * 230;
    return `hsl(${hue} 70% ${42 + clamped * 8}%)`;
}

function toHex(value: number, min: number, max: number): string {
    if (max === min) return valueColor(0.5);
    return valueColor((value - min) / (max - min));
}

/** Bucket an ISO timestamp into HH:MM buckets for x-axis labels. */
function bucketLabel(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(Math.floor(d.getMinutes() / 15) * 15).padStart(2, "0")}`;
}

export function ModuleHeatmap({ moduleId, results }: { moduleId: string; results: TestResult[] }) {
    // Auto-detect candidate numeric fields from the in-view results.
    const numericFields = useMemo(() => {
        const seen = new Map<string, number>();
        for (const r of results) {
            for (const map of [r.metrics, r.monitoring, r.event]) {
                for (const [k, v] of Object.entries(map ?? {})) {
                    if (typeof v === "number" && Number.isFinite(v)) seen.set(k, (seen.get(k) ?? 0) + 1);
                    else if (typeof v === "string" && !Number.isNaN(Number(v))) seen.set(k, (seen.get(k) ?? 0) + 1);
                }
            }
        }
        return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
    }, [results]);

    const [field, setField] = useState<string | null>(null);
    const activeField = field ?? numericFields[0] ?? "";

    const { data } = useQuery({
        queryKey: ["module-heatmap", moduleId, activeField],
        queryFn: () => getModuleHeatmap(moduleId, activeField),
        enabled: Boolean(activeField),
        retry: 0,
    });

    const { byTest, min, max } = useMemo(() => {
        const cells = data?.cells ?? [];
        const map = new Map<string, HeatmapCell[]>();
        let lo = Infinity;
        let hi = -Infinity;
        for (const c of cells) {
            const list = map.get(c.test_id) ?? [];
            list.push(c);
            map.set(c.test_id, list);
            if (c.value < lo) lo = c.value;
            if (c.value > hi) hi = c.value;
        }
        return { byTest: map, min: lo, max: hi };
    }, [data]);

    if (numericFields.length === 0) return null;

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <CardTitle>Trend heatmap</CardTitle>
                        <CardDescription>Numeric metric colour-coded over time. Rows are tests, columns are rolling time buckets.</CardDescription>
                    </div>
                    <select
                        value={activeField}
                        onChange={(e) => setField(e.target.value)}
                        className="flex h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        aria-label="Heatmap field"
                    >
                        {numericFields.map((f) => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                </div>
            </CardHeader>
            <CardContent>
                {data && data.cells.length > 0 ? (
                    <div className="space-y-3">
                        <div className="overflow-auto">
                            <table className="w-full text-xs">
                                <tbody>
                                    {[...byTest.entries()].map(([testId, cells]) => (
                                        <tr key={testId}>
                                            <td className="w-56 max-w-56 pr-3 align-middle font-mono">
                                                <span className="block truncate" title={testId}>{testId}</span>
                                            </td>
                                            <td className="flex gap-1 py-1">
                                                {cells.slice(-60).map((c) => (
                                                    <div
                                                        key={`${testId}:${c.timestamp}`}
                                                        title={`${bucketLabel(c.timestamp)} · ${c.value} · ${c.status}`}
                                                        className={cn(
                                                            "h-5 w-7 shrink-0 rounded-sm ring-1 ring-background",
                                                            (c.status ?? "").toLowerCase().includes("fail") && "outline outline-1 outline-destructive/70",
                                                        )}
                                                        style={{ backgroundColor: toHex(c.value, min, max) }}
                                                    />
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{Number.isFinite(min) ? min.toFixed(2) : "—"}</span>
                            <div className="h-2 flex-1 rounded-full" style={{ background: "linear-gradient(90deg, hsl(230 70% 42%), hsl(115 70% 50%), hsl(0 70% 50%))" }} />
                            <span>{Number.isFinite(max) ? max.toFixed(2) : "—"}</span>
                            <span className="ml-2">15-min buckets</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        No numeric samples for field “{activeField}” yet.
                        <div className="mt-1 text-xs">
                            <Badge variant="secondary">expects a numeric typed metric</Badge>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
