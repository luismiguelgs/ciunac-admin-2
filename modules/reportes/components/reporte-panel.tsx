"use client"

import * as React from "react"
import { AlertCircle, CalendarRange, Database, FileSpreadsheet, Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { ApiError } from "@/services/api.service"
import { ReportesService } from "../reportes.service"
import { exportReportToExcel } from "../reportes.excel"
import type { ReportConfig, ReportDateRange, ReportSolicitud } from "../reportes.interface"
import { getDefaultReportDateRange, validateReportDateRange } from "../reportes.utils"
import { ReporteTable } from "./reporte.table"

function getLoadErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.status === 401) return "La sesión o la clave de acceso no son válidas."
        if (error.status === 403) return "No tiene permiso para consultar este reporte."
        if (error.status === 400) return "El backend rechazó el rango o el tipo de reporte."
    }
    return "No se pudo cargar el reporte. Intente nuevamente."
}

export function ReportePanel({ config }: { config: ReportConfig }) {
    const [range, setRange] = React.useState<ReportDateRange>(() => getDefaultReportDateRange())
    const [data, setData] = React.useState<ReportSolicitud[]>([])
    const [loading, setLoading] = React.useState(false)
    const [exporting, setExporting] = React.useState(false)
    const [hasQueried, setHasQueried] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    function updateRange(field: keyof ReportDateRange, value: string) {
        setRange(current => ({ ...current, [field]: value }))
        setError(null)
    }

    async function handleQuery(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const validationError = validateReportDateRange(range)
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        setError(null)
        setHasQueried(true)
        try {
            const solicitudes = await ReportesService.fetchByDate(config.kind, range)
            setData(solicitudes)
        } catch (loadError) {
            console.error(loadError)
            setData([])
            setError(getLoadErrorMessage(loadError))
        } finally {
            setLoading(false)
        }
    }

    async function handleExport() {
        if (!data.length) return
        setExporting(true)
        try {
            await exportReportToExcel(data, config, range)
            toast.success("Reporte exportado correctamente")
        } catch (exportError) {
            console.error(exportError)
            toast.error("No se pudo generar el archivo Excel")
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="space-y-5">
            <Card className="overflow-hidden border-slate-200">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 via-white to-emerald-50/60">
                    <CardTitle className="flex items-center gap-2">
                        <CalendarRange className="h-5 w-5 text-emerald-700" />
                        {config.title}
                    </CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" onSubmit={handleQuery}>
                        <div className="space-y-2">
                            <Label htmlFor={`${config.kind}-inicio`}>Fecha inicial</Label>
                            <Input
                                id={`${config.kind}-inicio`}
                                type="date"
                                value={range.inicio}
                                onChange={event => updateRange("inicio", event.target.value)}
                                aria-invalid={Boolean(error)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`${config.kind}-fin`}>Fecha final</Label>
                            <Input
                                id={`${config.kind}-fin`}
                                type="date"
                                value={range.fin}
                                onChange={event => updateRange("fin", event.target.value)}
                                aria-invalid={Boolean(error)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="md:min-w-32">
                            {loading ? <Loader2 className="animate-spin" /> : <Search />}
                            Consultar
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {error ? (
                <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>No se pudo completar la consulta</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : null}

            {loading ? <DataTableSkeleton columnCount={config.kind === "documentos" ? 10 : 9} rowCount={8} /> : null}

            {!loading && !hasQueried ? (
                <Empty className="min-h-64 border">
                    <EmptyHeader>
                        <EmptyMedia variant="icon"><Search /></EmptyMedia>
                        <EmptyTitle>Seleccione un periodo</EmptyTitle>
                        <EmptyDescription>Defina el rango de fechas y pulse Consultar para cargar la información.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : null}

            {!loading && hasQueried && !error && data.length === 0 ? (
                <Empty className="min-h-64 border">
                    <EmptyHeader>
                        <EmptyMedia variant="icon"><Database /></EmptyMedia>
                        <EmptyTitle>Sin resultados</EmptyTitle>
                        <EmptyDescription>No se encontraron solicitudes para el periodo seleccionado.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : null}

            {!loading && data.length > 0 ? (
                <section className="space-y-3" aria-live="polite">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span>Resultados</span>
                            <Badge variant="secondary" className="min-w-8 justify-center tabular-nums">{data.length}</Badge>
                        </div>
                        <Button type="button" variant="outline" onClick={handleExport} disabled={exporting || !data.length}>
                            {exporting ? <Loader2 className="animate-spin" /> : <FileSpreadsheet className="text-emerald-700" />}
                            {exporting ? "Generando..." : "Exportar a Excel"}
                        </Button>
                    </div>
                    <ReporteTable data={data} kind={config.kind} />
                </section>
            ) : null}
        </div>
    )
}

