'use client'

import React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/datatable/data-table"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import { formatDate } from "@/lib/utils"
import { getItemByCode } from "@/lib/common"
import { IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import ExamenesUbicacionService from "../services/examenes-ubicacion.service"
import { EXAMEN_ESTADOS, getEstadoExamenLabel } from "../examen-ubicacion.utils"

interface ExamenesUbicacionTableProps {
    data: IExamenUbicacion[]
}

function EstadoBadge({ examen }: { examen: IExamenUbicacion }) {
    const label = getEstadoExamenLabel(examen.estadoId, examen.estado?.nombre)
    const className = examen.estadoId === EXAMEN_ESTADOS.TERMINADO
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : examen.estadoId === EXAMEN_ESTADOS.ASIGNADO
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-amber-200 bg-amber-50 text-amber-700"

    return <Badge variant="outline" className={className}>{label}</Badge>
}

export function ExamenesUbicacionTable({ data }: ExamenesUbicacionTableProps) {
    const router = useRouter()
    const [selected, setSelected] = React.useState<IExamenUbicacion | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    const sortedData = React.useMemo(() => {
        return [...data].sort((a, b) => String(b.codigo ?? "").localeCompare(String(a.codigo ?? "")))
    }, [data])

    const handleDelete = async () => {
        if (!selected?.id) return

        setIsDeleting(true)
        try {
            const detalles = await ExamenesUbicacionService.fetchItemsDetail(selected.id)
            for (const detalle of detalles) {
                if (detalle.id) {
                    await ExamenesUbicacionService.deleteDetail(detalle.id)
                }
            }
            await ExamenesUbicacionService.delete(selected.id)
            toast.success("Examen eliminado correctamente")
            setSelected(null)
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("No se pudo eliminar el examen")
        } finally {
            setIsDeleting(false)
        }
    }

    const columns: ColumnDef<IExamenUbicacion>[] = [
        { accessorKey: "codigo", header: "Codigo" },
        {
            accessorKey: "estadoId",
            header: "Estado",
            cell: ({ row }) => <EstadoBadge examen={row.original} />
        },
        {
            accessorKey: "fecha",
            header: "Fecha Examen",
            cell: ({ row }) => formatDate(row.original.fecha)
        },
        {
            accessorKey: "idiomaId",
            header: "Idioma",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {getItemByCode(row.original.idiomaId, row.original.idioma?.nombre ?? "Idioma")}
                    <span>{row.original.idioma?.nombre ?? row.original.idiomaId}</span>
                </div>
            )
        },
        {
            id: "docente",
            header: "Docente",
            accessorFn: (row) => `${row.docente?.apellidos ?? ""} ${row.docente?.nombres ?? ""}`.trim()
        },
        {
            id: "aula",
            header: "Sala",
            accessorFn: (row) => row.aula?.nombre ?? row.aulaId
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild title="Ver detalle">
                        <Link href={`/examen-ubicacion/${row.original.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Eliminar examen"
                        disabled={isDeleting}
                        onClick={() => setSelected(row.original)}
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <React.Fragment>
            <React.Suspense fallback={<DataTableSkeleton />}>
                <DataTable columns={columns} data={sortedData} filterColumn="codigo" />
            </React.Suspense>

            <ConfirmDeleteDialog
                isOpen={Boolean(selected)}
                onOpenChange={(open) => {
                    if (!open) setSelected(null)
                }}
                onConfirm={handleDelete}
                title="Eliminar examen de ubicacion"
                description={`Esta accion eliminara el examen ${selected?.codigo ?? ""} y sus participantes asociados.`}
            />
        </React.Fragment>
    )
}
