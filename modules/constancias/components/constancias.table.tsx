'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { IConstancia } from "../constancias.interface"
import { DataTable } from "@/components/datatable/data-table"
import { Eye, TrashIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import { ConstanciasService } from "../constancias.service"
import useConstancias from "../constancias.hook"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface ConstanciasTableProps {
    state: 'pendientes' | 'aceptados' | 'impresos'
}

export function ConstanciasTable({ state }: ConstanciasTableProps) {
    const { data, loading, setData } = useConstancias(state)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [itemToDelete, setItemToDelete] = React.useState<IConstancia | null>(null)
    const [processingIds, setProcessingIds] = React.useState<Set<string>>(new Set())

    const handleStateChange = async (constancia: IConstancia, checked: boolean) => {
        const id = constancia.id || constancia._id
        if (!id) return

        setProcessingIds(prev => new Set(prev).add(id))
        try {
            if (state === 'pendientes') {
                const driveId = constancia.driveId
                const solicitudId = constancia.id_solicitud

                if (!driveId) {
                    toast.error("Error: La constancia no tiene un ID de archivo en Drive")
                    return
                }

                await ConstanciasService.procesarFirma(id, driveId, solicitudId)
                toast.success("Constancia procesada y firmada con éxito")
            } else if (state === 'impresos') {
                await ConstanciasService.updateAceptado(id, true)
                toast.success("Constancia marcada como entregada")
            }
            setData(prev => prev.filter(c => (c.id || c._id) !== id))
        } catch (error) {
            console.error("Error al procesar el cambio de estado:", error)
            toast.error("Error al actualizar el estado")
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        }
    }

    const stateLabel: Record<string, string> = {
        pendientes: 'Firmada',
        impresos: 'Entregada',
    }

    const columns: ColumnDef<IConstancia>[] = [
        ...(state !== 'aceptados' ? [{
            id: "estado",
            header: stateLabel[state] || '',
            cell: ({ row }: { row: { original: IConstancia } }) => {
                const constancia = row.original
                const id = constancia.id || constancia._id
                const isProcessing = id ? processingIds.has(id) : false

                if (isProcessing) {
                    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                }

                return (
                    <Checkbox
                        checked={false}
                        onCheckedChange={(checked) => handleStateChange(constancia, !!checked)}
                        aria-label={`Marcar como ${stateLabel[state]?.toLowerCase()}`}
                    />
                )
            }
        } as ColumnDef<IConstancia>] : []),
        {
            accessorKey: "estudiante",
            header: "Estudiante",
        },
        {
            accessorKey: "dni",
            header: "DNI",
        },
        {
            accessorKey: "tipo",
            header: "Tipo",
            cell: ({ row }) => (
                <Badge variant={row.original.tipo === 'MATRICULA' ? 'default' : 'secondary'}>
                    {row.original.tipo}
                </Badge>
            )
        },
        {
            accessorKey: "idioma",
            header: "Idioma",
        },
        {
            accessorKey: "nivel",
            header: "Nivel",
        },
        {
            accessorKey: "ciclo",
            header: "Ciclo",
        },
        {
            accessorKey: "modalidad",
            header: "Modalidad",
        },
        {
            id: "acciones",
            header: "Acciones",
            cell: ({ row }) => {
                const constancia = row.original
                const id = constancia.id || constancia._id
                return (
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild title="Ver detalles">
                            <Link href={`/constancias/${id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Eliminar"
                            onClick={() => {
                                setItemToDelete(constancia)
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
        const id = itemToDelete?.id || itemToDelete?._id
        if (id) {
            try {
                await ConstanciasService.deleteItem(id)
                toast.success("Constancia eliminada")
                setData(prev => prev.filter(c => (c.id || c._id) !== id))
                setIsDeleteDialogOpen(false)
                setItemToDelete(null)
            } catch {
                toast.error("Error al eliminar la constancia")
            }
        }
    }

    if (loading) return <DataTableSkeleton />

    return (
        <React.Fragment>
            <DataTable
                columns={columns}
                data={data}
                filterColumn="estudiante"
            />
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                description={`¿Está seguro que desea eliminar la constancia de ${itemToDelete?.estudiante}? Esta acción no se puede deshacer.`}
            />
        </React.Fragment>
    )
}
