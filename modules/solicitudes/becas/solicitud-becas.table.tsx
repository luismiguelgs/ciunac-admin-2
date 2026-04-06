'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import ISolicitudBeca from "./solicitud-becas.interface"
import { DataTable } from "@/components/datatable/data-table"
import { Eye, TrashIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import SolicitudbecasService from "./solicitud-becas.service"
import { useRouter } from "next/navigation"

interface SolicitudBecasDataTableProps {
    data: ISolicitudBeca[]
}

export function SolicitudBecasDataTable({ data }: SolicitudBecasDataTableProps) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [itemToDelete, setItemToDelete] = React.useState<ISolicitudBeca | null>(null)

    const columns: ColumnDef<ISolicitudBeca>[] = [
        {
            accessorKey: "nombres",
            header: "Nombres",
        },
        {
            accessorKey: "apellidos",
            header: "Apellidos",
        },
        {
            accessorKey: "facultad",
            header: "Facultad",
        },
        {
            accessorKey: "escuela",
            header: "Escuela",
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const solicitud = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild title="Ver detalles">
                            <Link href={`/solicitudes/becas/${solicitud._id || solicitud.id}`}>
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
            const id = itemToDelete._id || itemToDelete.id
            if (id) {
                await SolicitudbecasService.delete(id)
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
                    data={data}
                    filterColumn="apellidos"
                />
            </React.Suspense>
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                description={`¿Está seguro que desea eliminar la solicitud de ${itemToDelete?.nombres} ${itemToDelete?.apellidos}? Esta acción no se puede deshacer.`}
            />
        </React.Fragment>
    )
}
