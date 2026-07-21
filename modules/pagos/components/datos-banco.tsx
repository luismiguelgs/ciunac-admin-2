"use client"

import * as React from "react"
import { Database, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { IPagoBanco } from "../pago-banco.interface"
import { PagosBancoService } from "../pagos-banco.service"
import { MonthPeriodPicker } from "./month-period-picker"
import { PagosBancoTable } from "./pagos-banco.table"

function getCurrentPeriod(): string {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export function DatosBanco() {
    const [periodo, setPeriodo] = React.useState(getCurrentPeriod)
    const [pagos, setPagos] = React.useState<IPagoBanco[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError("")

        PagosBancoService.fetchByPeriodo(periodo)
            .then((data) => {
                if (!cancelled) setPagos(data)
            })
            .catch((requestError) => {
                if (cancelled) return
                console.error(requestError)
                setPagos([])
                setError("No se pudieron cargar los pagos bancarios del periodo seleccionado.")
                toast.error("No se pudieron cargar los pagos bancarios")
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [periodo])

    function handlePagoUpdated(updated: IPagoBanco) {
        setPagos((current) => current.map((pago) => pago.id === updated.id ? updated : pago))
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
                <MonthPeriodPicker value={periodo} onValueChange={setPeriodo} disabled={loading} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Database className="size-4" />
                    <span className="font-medium tabular-nums">{pagos.length.toLocaleString("es-PE")} registros</span>
                </div>
            </div>

            {loading ? (
                <div className="flex h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                    Cargando pagos bancarios...
                </div>
            ) : error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : pagos.length ? (
                <PagosBancoTable pagos={pagos} onPagoUpdated={handlePagoUpdated} />
            ) : (
                <div className="rounded-md border py-16 text-center text-sm text-muted-foreground">
                    No hay pagos bancarios registrados para {periodo}.
                </div>
            )}
        </div>
    )
}
