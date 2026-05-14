'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ISolicitud } from "../shared/solicitud.interface"
import { DataTable } from "@/components/datatable/data-table"
import { Eye, TrashIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import SolicitudesService from "../shared/solicitudes.service"
import { useRouter } from "next/navigation"

interface SolicitudConstanciasDataTableProps {
    data: ISolicitud[]
}

export function SolicitudConstanciasDataTable({ data }: SolicitudConstanciasDataTableProps) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [itemToDelete, setItemToDelete] = React.useState<ISolicitud | null>(null)

    // Ordenar de los periodos mas recientes a los mas antiguos
    const sortedData = React.useMemo(() => {
        return [...data].sort((a, b) => {
            const periodoA = a.periodo || ""
            const periodoB = b.periodo || ""
            return periodoB.localeCompare(periodoA)
        })
    }, [data])

    const columns: ColumnDef<ISolicitud>[] = [
        {
            accessorFn: (row) => `${row.estudiante?.nombres} ${row.estudiante?.apellidos}`,
            id: "nombres",
            header: "Estudiante",
        },
        {
            accessorFn: (row) => row.estudiante?.numeroDocumento,
            id: "documento",
            header: "Documento",
        },
        {
            accessorFn: (row) => row.tiposSolicitud?.solicitud,
            id: "tipo",
            header: "Tipo",
        },
        {
            accessorFn: (row) => row.idioma?.nombre,
            id: "idioma",
            header: "Idioma",
        },
        {
            accessorKey: "pago",
            header: "Pago",
            cell: ({ row }) => {
                const pago = row.getValue("pago")
                const numericPago = Number(pago) || 0
                return `S/ ${numericPago.toFixed(2)}`
            }
        },
        {
            accessorKey: "periodo",
            header: "Periodo",
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const solicitud = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild title="Ver detalles">
                            <Link href={`/solicitudes/constancias/${solicitud.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Eliminar"
                            onClick={() => {
                                setItemToDelete(solicitud)
                                setIsDeleteDialogOpen(true)
                            }}
                        >
                            <TrashIcon className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                )
            }
        },
    ]

    const handleConfirmDelete = async () => {
        if (itemToDelete) {
            const id = itemToDelete.id
            if (id) {
                await SolicitudesService.delete(id)
                setIsDeleteDialogOpen(false)
                setItemToDelete(null)
                router.refresh()
            }
        }
    }

    return (
        <React.Fragment>
            <React.Suspense fallback={<DataTableSkeleton />}>
                <DataTable
                    columns={columns}
                    data={sortedData}
                    filterColumn="nombres"
                />
            </React.Suspense>
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                description={`¿Está seguro que desea eliminar la solicitud de ${itemToDelete?.estudiante?.nombres} ${itemToDelete?.estudiante?.apellidos}? Esta acción no se puede deshacer.`}
            />
        </React.Fragment>
    )
}
