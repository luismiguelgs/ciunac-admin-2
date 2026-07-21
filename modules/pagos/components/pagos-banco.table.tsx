"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { BadgeCheck, Loader2, Undo2 } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/datatable/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { IPagoBanco } from "../pago-banco.interface"
import { PagosBancoService } from "../pagos-banco.service"
import { PagoVerificationDialog } from "./pago-verification.dialog"

interface PagosBancoTableProps {
    pagos: IPagoBanco[]
    onPagoUpdated: (pago: IPagoBanco) => void
}

const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
})

function formatAmount(value: string | number | null): string {
    if (value === null || value === "") return "-"
    const amount = Number(value)
    return Number.isFinite(amount) ? currencyFormatter.format(amount) : "-"
}

function formatDate(value: string | null): string {
    if (!value) return "-"
    const [year, month, day] = value.slice(0, 10).split("-")
    return year && month && day ? `${day}/${month}/${year}` : value
}

export function PagosBancoTable({ pagos, onPagoUpdated }: PagosBancoTableProps) {
    const [selectedPago, setSelectedPago] = React.useState<IPagoBanco | null>(null)
    const [processingId, setProcessingId] = React.useState<number | null>(null)

    const sortedPagos = React.useMemo(() => {
        return pagos.toSorted((left, right) => {
            const dateComparison = (right.fechaEfectiva || "").localeCompare(left.fechaEfectiva || "")
            return dateComparison || right.id - left.id
        })
    }, [pagos])

    const columns = React.useMemo<ColumnDef<IPagoBanco>[]>(() => [
        {
            id: "busqueda",
            accessorFn: (row) => [row.alumno, row.dniCodigo, row.numeroVoucher].filter(Boolean).join(" "),
            header: "Busqueda",
            enableHiding: false,
        },
        { accessorKey: "id", header: "ID" },
        { accessorKey: "dniCodigo", header: "DNI / Codigo", cell: ({ getValue }) => getValue<string | null>() || "-" },
        { accessorKey: "alumno", header: "Alumno", cell: ({ getValue }) => getValue<string | null>() || "Sin identificar" },
        {
            accessorKey: "numeroVoucher",
            header: "Voucher",
            cell: ({ getValue }) => <span className="font-mono text-xs">{getValue<string | null>() || "-"}</span>,
        },
        {
            accessorKey: "monto",
            header: "Monto",
            cell: ({ getValue }) => <span className="font-semibold tabular-nums">{formatAmount(getValue<string | number | null>())}</span>,
        },
        { accessorKey: "fechaPago", header: "Fecha de pago", cell: ({ getValue }) => formatDate(getValue<string | null>()) },
        { accessorKey: "fechaEfectiva", header: "Fecha efectiva", cell: ({ getValue }) => formatDate(getValue<string | null>()) },
        { accessorKey: "periodo", header: "Periodo", cell: ({ getValue }) => getValue<string | null>() || "-" },
        { accessorKey: "voucherRestante", header: "Voucher restante", cell: ({ getValue }) => getValue<string | null>() || "-" },
        { accessorKey: "archivo", header: "Archivo", cell: ({ getValue }) => getValue<string | null>() || "-" },
        {
            accessorKey: "verificado",
            header: "Estado",
            cell: ({ row }) => row.original.verificado ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    <BadgeCheck /> Verificado
                </Badge>
            ) : (
                <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                    Pendiente
                </Badge>
            ),
        },
        { accessorKey: "creadoEn", header: "Creado", cell: ({ getValue }) => formatDate(getValue<string | null>()) },
        { accessorKey: "modificadoEn", header: "Modificado", cell: ({ getValue }) => formatDate(getValue<string | null>()) },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const pago = row.original
                const loading = processingId === pago.id
                const title = pago.verificado ? "Revertir verificacion" : "Verificar pago"

                return (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title={title}
                        aria-label={title}
                        disabled={processingId !== null}
                        onClick={() => setSelectedPago(pago)}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : pago.verificado ? (
                            <Undo2 className="text-amber-600" />
                        ) : (
                            <BadgeCheck className="text-emerald-600" />
                        )}
                    </Button>
                )
            },
        },
    ], [processingId])

    async function handleConfirm() {
        if (!selectedPago) return
        const targetVerified = !selectedPago.verificado
        setProcessingId(selectedPago.id)

        try {
            const updated = await PagosBancoService.setVerificado(selectedPago.id, targetVerified)
            onPagoUpdated({ ...selectedPago, ...updated, verificado: targetVerified })
            toast.success(targetVerified ? "Pago verificado correctamente" : "Verificacion revertida correctamente")
            setSelectedPago(null)
        } catch (error) {
            console.error(error)
            toast.error(targetVerified ? "No se pudo verificar el pago" : "No se pudo revertir la verificacion")
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={sortedPagos}
                filterColumn="busqueda"
                searchPlaceholder="Buscar por alumno, DNI o voucher..."
                pageSize={25}
                compact
                initialColumnVisibility={{
                    busqueda: false,
                    id: false,
                    periodo: false,
                    voucherRestante: false,
                    creadoEn: false,
                    modificadoEn: false,
                }}
            />
            <PagoVerificationDialog
                pago={selectedPago}
                loading={processingId !== null}
                onOpenChange={(open) => !open && setSelectedPago(null)}
                onConfirm={handleConfirm}
            />
        </>
    )
}
