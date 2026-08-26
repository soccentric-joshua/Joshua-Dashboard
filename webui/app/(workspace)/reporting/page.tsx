"use client";

import { BarChart2, Ban } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Reporting is intentionally disabled.
 *
 * The aggregation, time-bucketed trend, and export endpoints
 * (`GET /api/v1/runs/{id}/export`, etc.) are not implemented in the Server
 * contract yet. This route must not imply that the feature is available or
 * advertise planned endpoints as if they worked, so it renders an explicit
 * "not available" state and is not reachable from the primary navigation.
 */
export default function ReportingPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center gap-3">
                <BarChart2 className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reporting</h1>
                    <p className="text-sm text-muted-foreground">
                        Generate and view test reports
                    </p>
                </div>
            </div>

            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Ban className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Reporting is not available yet
                        </p>
                        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                            The reporting, trend-analysis, and export endpoints
                            are not implemented, so this feature is disabled. Raw
                            run and module data remain available on the Runs and
                            Modules pages.
                        </p>
                    </div>
                    <Link
                        href="/runs"
                        className="font-medium text-primary hover:underline"
                    >
                        Go to Runs →
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
