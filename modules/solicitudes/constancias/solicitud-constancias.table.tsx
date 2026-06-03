'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Ban, Eye, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DataTable } from "@/components/datatable/data-table"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ISolicitud } from "../shared/solicitud.interface"
import SolicitudesService from "../shared/solicitudes.service"
import { SolicitudConstanciasRejectDialog } from "./solicitud-constancias-reject.dialog"

interface SolicitudConstanciasDataTableProps {
    data: ISolicitud[]
    actionMode?: "reject" | "restore"
}

const NUEVAS_ESTADO_ID = 1

export function SolicitudConstanciasDataTable({
    data,
    actionMode = "reject"
}: SolicitudConstanciasDataTableProps) {
    const router = useRouter()
    const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false)
    const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false)
    const [selectedSolicitud, setSelectedSolicitud] = React.useState<ISolicitud | null>(null)
    const [isRestoring, setIsRestoring] = React.useState(false)

    const sortedData = React.useMemo(() => {
        return [...data].sort((a, b) => {
            const periodoA = a.periodo || ""
            const periodoB = b.periodo || ""
            return periodoB.localeCompare(periodoA)
        })
    }, [data])

    const handleRestoreDialogOpenChange = (open: boolean) => {
        setIsRestoreDialogOpen(open)
        if (!open) {
            setSelectedSolicitud(null)
            setIsRestoring(false)
        }
    }

    const handleRestoreSolicitud = async () => {
        if (!selectedSolicitud) {
            return
        }

        setIsRestoring(true)

        const success = await SolicitudesService.update(selectedSolicitud.id, {
            estadoId: NUEVAS_ESTADO_ID,
        })

        if (success) {
            toast.success("Solicitud devuelta a Nuevas")
            handleRestoreDialogOpenChange(false)
            router.refresh()
        } else {
            toast.error("Error al devolver la solicitud")
            setIsRestoring(false)
        }
    }

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
                const isRestoreMode = actionMode === "restore"

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
                            title={isRestoreMode ? "Devolver a Nuevas" : "Rechazar solicitud"}
                            onClick={() => {
                                setSelectedSolicitud(solicitud)
                                if (isRestoreMode) {
                                    setIsRestoreDialogOpen(true)
                                } else {
                                    setIsRejectDialogOpen(true)
                                }
                            }}
                        >
                            {isRestoreMode ? (
                                <RotateCcw className="h-4 w-4 text-blue-600" />
                            ) : (
                                <Ban className="h-4 w-4 text-red-600" />
                            )}
                        </Button>
                    </div>
                )
            }
        },
    ]

    return (
        <React.Fragment>
            <React.Suspense fallback={<DataTableSkeleton />}>
                <DataTable
                    columns={columns}
                    data={sortedData}
                    filterColumn="nombres"
                />
            </React.Suspense>

            <SolicitudConstanciasRejectDialog
                isOpen={isRejectDialogOpen}
                onOpenChange={(open) => {
                    setIsRejectDialogOpen(open)
                    if (!open) {
                        setSelectedSolicitud(null)
                    }
                }}
                solicitud={selectedSolicitud}
                onRejected={() => router.refresh()}
            />

            <AlertDialog open={isRestoreDialogOpen} onOpenChange={handleRestoreDialogOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Devolver solicitud a Nuevas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta accion cambiara la solicitud de {selectedSolicitud?.estudiante?.nombres} {selectedSolicitud?.estudiante?.apellidos} al estado Nuevas. Desea continuar?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRestoring}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isRestoring}
                            onClick={(event) => {
                                event.preventDefault()
                                handleRestoreSolicitud()
                            }}
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    )
}
