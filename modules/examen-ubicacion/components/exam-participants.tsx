'use client'

import React from "react"
import { FileText, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDeleteDialog } from "@/components/dialogs/confirm-delete-dialog"
import { ISolicitud } from "@/modules/solicitudes/shared/solicitud.interface"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"
import ICalificacionUbicacion from "../interfaces/calificacion.interface"
import { IDetalleExamenUbicacion, IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import ExamenesUbicacionService from "../services/examenes-ubicacion.service"
import { formatUbicacionFromCalificacion, obtenerResultadoUbicacion, SOLICITUD_ESTADOS } from "../examen-ubicacion.utils"
import { ExamRequestSelector } from "./exam-request-selector"
import { PdfPreviewDialog } from "./pdf-preview-dialog"
import { ConstanciaFormat } from "./formatos/constancia-format"

interface ExamParticipantsProps {
    examen: IExamenUbicacion
    initialDetalles: IDetalleExamenUbicacion[]
    solicitudesNuevas: ISolicitud[]
    calificaciones: ICalificacionUbicacion[]
}

export function ExamParticipants({
    examen,
    initialDetalles,
    solicitudesNuevas,
    calificaciones,
}: ExamParticipantsProps) {
    const router = useRouter()
    const [detalles, setDetalles] = React.useState(initialDetalles)
    const [isSelectorOpen, setIsSelectorOpen] = React.useState(false)
    const [deletingDetalle, setDeletingDetalle] = React.useState<IDetalleExamenUbicacion | null>(null)
    const [savingId, setSavingId] = React.useState<number | null>(null)
    const [constanciaDetalle, setConstanciaDetalle] = React.useState<IDetalleExamenUbicacion | null>(null)
    const calificacionById = React.useMemo(() => {
        return new Map(calificaciones.map((calificacion) => [calificacion.id, calificacion]))
    }, [calificaciones])

    React.useEffect(() => {
        setDetalles(initialDetalles)
    }, [initialDetalles])

    const refreshData = () => {
        router.refresh()
    }

    const handleDelete = async () => {
        if (!deletingDetalle?.id) return

        try {
            await SolicitudesService.update(deletingDetalle.solicitudId, { estadoId: SOLICITUD_ESTADOS.NUEVA })
            await ExamenesUbicacionService.deleteDetail(deletingDetalle.id)
            setDetalles((current) => current.filter((detalle) => detalle.id !== deletingDetalle.id))
            setDeletingDetalle(null)
            toast.success("Participante retirado del examen")
            refreshData()
        } catch (error) {
            console.error(error)
            toast.error("No se pudo retirar el participante")
        }
    }

    const handleNotaBlur = async (detalle: IDetalleExamenUbicacion, rawValue: string) => {
        if (!detalle.id) return
        const nota = Number(rawValue)
        if (Number.isNaN(nota)) {
            toast.error("La nota debe ser numerica")
            return
        }

        const calificacionId = obtenerResultadoUbicacion(nota, detalle.idiomaId, detalle.nivelId, calificaciones)
        if (!calificacionId) {
            toast.error("No existe una ubicacion configurada para esa nota")
            return
        }

        setSavingId(detalle.id)
        try {
            await ExamenesUbicacionService.updateDetail(detalle.id, {
                solicitudId: detalle.solicitudId,
                idiomaId: detalle.idiomaId,
                nivelId: detalle.nivelId,
                examenId: detalle.examenId,
                estudianteId: detalle.estudianteId,
                nota,
                calificacionId,
                terminado: detalle.terminado,
                activo: detalle.activo,
            })
            setDetalles((current) => current.map((item) => {
                if (item.id !== detalle.id) return item
                const calificacion = calificaciones.find((cal) => cal.id === calificacionId)
                return {
                    ...item,
                    nota,
                    calificacionId,
                    calificacion: calificacion
                        ? { id: calificacion.id!, ciclo: calificacion.ciclo }
                        : item.calificacion,
                }
            }))
            toast.success("Nota actualizada")
        } catch (error) {
            console.error(error)
            toast.error("No se pudo actualizar la nota")
        } finally {
            setSavingId(null)
        }
    }

    const handleTerminadoChange = async (detalle: IDetalleExamenUbicacion, checked: boolean) => {
        if (!detalle.id) return
        setSavingId(detalle.id)
        try {
            await ExamenesUbicacionService.updateDetailStatus(detalle.id, checked)
            if (checked) {
                await SolicitudesService.update(detalle.solicitudId, { estadoId: SOLICITUD_ESTADOS.TERMINADA })
            }
            setDetalles((current) => current.map((item) => item.id === detalle.id ? { ...item, terminado: checked } : item))
            toast.success("Estado del participante actualizado")
            refreshData()
        } catch (error) {
            console.error(error)
            toast.error("No se pudo actualizar el participante")
        } finally {
            setSavingId(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">Participantes</h2>
                <Button onClick={() => setIsSelectorOpen(true)} disabled={!examen.id}>
                    <Plus className="mr-2 h-4 w-4" />
                    Asignar Participantes
                </Button>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-black">
                        <TableRow className="hover:bg-black">
                            <TableHead className="text-white">DNI</TableHead>
                            <TableHead className="text-white">Apellidos</TableHead>
                            <TableHead className="text-white">Nombres</TableHead>
                            <TableHead className="text-white">Nivel</TableHead>
                            <TableHead className="text-white">Nota</TableHead>
                            <TableHead className="text-white">Ubicacion</TableHead>
                            <TableHead className="text-white">Terminado</TableHead>
                            <TableHead className="text-white">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {detalles.map((detalle) => (
                            <TableRow key={detalle.id}>
                                <TableCell>{detalle.estudiante?.numeroDocumento}</TableCell>
                                <TableCell>{detalle.estudiante?.apellidos}</TableCell>
                                <TableCell>{detalle.estudiante?.nombres}</TableCell>
                                <TableCell>{detalle.nivel?.nombre ?? detalle.nivelId}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            defaultValue={detalle.nota ?? 0}
                                            className="h-8 w-24"
                                            disabled={detalle.terminado || savingId === detalle.id}
                                            onBlur={(event) => handleNotaBlur(detalle, event.target.value)}
                                        />
                                        {savingId === detalle.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                    </div>
                                </TableCell>
                                <TableCell>{formatUbicacionFromCalificacion(calificacionById.get(detalle.calificacionId))}</TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={detalle.terminado}
                                        disabled={savingId === detalle.id}
                                        onCheckedChange={(checked) => handleTerminadoChange(detalle, checked === true)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" title="Ver constancia" onClick={() => setConstanciaDetalle(detalle)}>
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" title="Retirar participante" onClick={() => setDeletingDetalle(detalle)}>
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!detalles.length ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                    Aun no hay participantes asignados.
                                </TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </div>

            {examen.id ? (
                <ExamRequestSelector
                    isOpen={isSelectorOpen}
                    onOpenChange={setIsSelectorOpen}
                    examenId={examen.id}
                    idiomaId={examen.idiomaId}
                    solicitudes={solicitudesNuevas}
                    detalles={detalles}
                    calificaciones={calificaciones}
                    onAssigned={refreshData}
                />
            ) : null}

            <ConfirmDeleteDialog
                isOpen={Boolean(deletingDetalle)}
                onOpenChange={(open) => {
                    if (!open) setDeletingDetalle(null)
                }}
                onConfirm={handleDelete}
                title="Retirar participante"
                description="Esta accion retirara al participante y devolvera su solicitud al estado Nueva."
            />

            <PdfPreviewDialog
                isOpen={Boolean(constanciaDetalle)}
                onOpenChange={(open) => {
                    if (!open) setConstanciaDetalle(null)
                }}
                title="Constancia"
            >
                <ConstanciaFormat
                    data={constanciaDetalle ?? undefined}
                    calificacion={constanciaDetalle ? calificacionById.get(constanciaDetalle.calificacionId) : undefined}
                />
            </PdfPreviewDialog>
        </div>
    )
}
