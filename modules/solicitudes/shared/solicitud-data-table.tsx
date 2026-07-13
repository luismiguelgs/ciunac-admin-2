'use client'

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Ban, Eye, FileDown, FilePenLine, FileText, Globe2, RotateCcw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DataTable } from "@/components/datatable/data-table"
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getItemByCode } from "@/lib/common"
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
import { ISolicitud } from "./solicitud.interface"
import SolicitudesService from "./solicitudes.service"
import { SolicitudRejectDialog } from "./solicitud-reject.dialog"
import { findSolicitudEstado, isTipoSolicitudDigital } from "./solicitud-workflow"
import useOpciones from "@/modules/estructura/hooks/use-opciones"
import type { IEstado } from "@/modules/estructura/interfaces/types.interface"
import { Collection } from "@/modules/estructura/services/opciones.service"

export interface SolicitudDataTableProps {
    data: ISolicitud[]
    actionMode?: "reject" | "restore"
    basePath?: string
    showTipoColumn?: boolean
    showNivelColumn?: boolean
    showOnlineColumn?: boolean
    showFormatoColumn?: boolean
}

export function SolicitudDataTable({
    data,
    actionMode = "reject",
    basePath = "/solicitudes/constancias",
    showTipoColumn = true,
    showNivelColumn = false,
    showOnlineColumn = true,
    showFormatoColumn = false
}: SolicitudDataTableProps) {
    const router = useRouter()
    const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false)
    const [isRestoreDialogOpen, setIsRestoreDialogOpen] = React.useState(false)
    const [selectedSolicitud, setSelectedSolicitud] = React.useState<ISolicitud | null>(null)
    const [isRestoring, setIsRestoring] = React.useState(false)
    const { data: estados, loading: loadingEstados } = useOpciones<IEstado>(Collection.Estados)
    const estadoNueva = React.useMemo(() => findSolicitudEstado(estados, "nueva"), [estados])

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

        if (typeof estadoNueva?.id !== "number") {
            toast.error("No se encontro el estado Nueva en el catalogo de solicitudes")
            return
        }

        setIsRestoring(true)

        const success = await SolicitudesService.update(selectedSolicitud.id, {
            estadoId: estadoNueva.id,
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
        ...(showTipoColumn ? [{
            accessorFn: (row) => row.tiposSolicitud?.solicitud,
            id: "tipo",
            header: "Tipo",
        } satisfies ColumnDef<ISolicitud>] : []),
        ...(showFormatoColumn ? [{
            accessorFn: (row) => row.digital,
            id: "formato",
            header: "Formato",
            cell: ({ row }) => {
                const solicitud = row.original
                const isDigital = Boolean(solicitud.digital) || isTipoSolicitudDigital(solicitud.tiposSolicitud)

                return (
                    <Badge
                        variant="outline"
                        title={isDigital ? "Certificado digital" : "Certificado físico"}
                        className={isDigital
                            ? "w-fit gap-1 border-violet-200 bg-violet-50 text-violet-700"
                            : "w-fit gap-1 border-sky-200 bg-sky-50 text-sky-700"
                        }
                    >
                        {isDigital ? (
                            <FileDown className="h-3.5 w-3.5" />
                        ) : (
                            <FileText className="h-3.5 w-3.5" />
                        )}
                        {isDigital ? "Digital" : "Físico"}
                    </Badge>
                )
            }
        } satisfies ColumnDef<ISolicitud>] : []),
        ...(showNivelColumn ? [{
            accessorFn: (row) => row.nivel?.nombre,
            id: "nivel",
            header: "Nivel",
        } satisfies ColumnDef<ISolicitud>] : []),
        {
            accessorFn: (row) => row.idioma?.nombre,
            id: "idioma",
            header: "Idioma",
            cell: ({ row }) => {
                const solicitud = row.original
                const idiomaNombre = solicitud.idioma?.nombre || "Idioma"

                return (
                    <div className="flex items-center gap-2">
                        {getItemByCode(solicitud.idiomaId, idiomaNombre)}
                        <span>{idiomaNombre}</span>
                    </div>
                )
            }
        },
        ...(showOnlineColumn ? [{
            accessorFn: (row) => !row.manual,
            id: "online",
            header: "Online",
            cell: ({ row }) => {
                const solicitud = row.original
                const isOnline = !solicitud.manual

                return (
                    <Badge
                        variant="outline"
                        title={isOnline ? "Solicitud online" : "Solicitud manual"}
                        className={isOnline
                            ? "w-fit gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "w-fit gap-1 border-amber-200 bg-amber-50 text-amber-700"
                        }
                    >
                        {isOnline ? (
                            <Globe2 className="h-3.5 w-3.5" />
                        ) : (
                            <FilePenLine className="h-3.5 w-3.5" />
                        )}
                        {isOnline ? "Online" : "Manual"}
                    </Badge>
                )
            }
        } satisfies ColumnDef<ISolicitud>] : []),
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
                            <Link href={`${basePath}/${solicitud.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            title={isRestoreMode ? "Devolver a Nuevas" : "Rechazar solicitud"}
                            disabled={isRestoreMode && (loadingEstados || typeof estadoNueva?.id !== "number")}
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

            <SolicitudRejectDialog
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
