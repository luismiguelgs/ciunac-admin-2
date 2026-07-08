'use client'

import React from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getItemByCode } from "@/lib/common"
import { ISolicitud } from "@/modules/solicitudes/shared/solicitud.interface"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"
import { IDetalleExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import ICalificacionUbicacion from "../interfaces/calificacion.interface"
import ExamenesUbicacionService from "../services/examenes-ubicacion.service"
import { obtenerResultadoUbicacion, SOLICITUD_ESTADOS } from "../examen-ubicacion.utils"

interface ExamRequestSelectorProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    examenId: number
    idiomaId: number
    solicitudes: ISolicitud[]
    detalles: IDetalleExamenUbicacion[]
    calificaciones: ICalificacionUbicacion[]
    asignadoEstadoId?: number
    onAssigned: () => void
}

export function ExamRequestSelector({
    isOpen,
    onOpenChange,
    examenId,
    idiomaId,
    solicitudes,
    detalles,
    calificaciones,
    asignadoEstadoId,
    onAssigned,
}: ExamRequestSelectorProps) {
    const [selection, setSelection] = React.useState<number[]>([])
    const [isSaving, setIsSaving] = React.useState(false)
    const assignedSolicitudIds = React.useMemo(() => new Set(detalles.map((detalle) => detalle.solicitudId)), [detalles])
    const availableSolicitudes = React.useMemo(() => {
        return solicitudes.filter((solicitud) =>
            solicitud.idiomaId === idiomaId &&
            !assignedSolicitudIds.has(solicitud.id)
        )
    }, [assignedSolicitudIds, idiomaId, solicitudes])

    const toggleSelection = (id: number, checked: boolean) => {
        setSelection((current) => checked ? [...current, id] : current.filter((item) => item !== id))
    }

    const handleAssign = async () => {
        const selectedSolicitudes = availableSolicitudes.filter((solicitud) => selection.includes(solicitud.id))
        if (!selectedSolicitudes.length) {
            toast.info("Seleccione al menos una solicitud")
            return
        }
        if (!asignadoEstadoId) {
            toast.error("No se encontro el estado Asignado para examenes de ubicacion")
            return
        }

        setIsSaving(true)
        try {
            for (const solicitud of selectedSolicitudes) {
                const calificacionId = obtenerResultadoUbicacion(0, solicitud.idiomaId, solicitud.nivelId, calificaciones)
                if (!calificacionId) {
                    toast.error(`No existe configuracion de calificacion para ${solicitud.estudiante?.apellidos ?? "la solicitud"}`)
                    continue
                }

                await ExamenesUbicacionService.createDetail({
                    examenId,
                    solicitudId: solicitud.id,
                    idiomaId: solicitud.idiomaId,
                    nivelId: solicitud.nivelId,
                    estudianteId: solicitud.estudianteId,
                    nota: 0,
                    calificacionId,
                    terminado: false,
                    activo: true,
                })
                await SolicitudesService.update(solicitud.id, { estadoId: SOLICITUD_ESTADOS.ASIGNADA })
            }

            await ExamenesUbicacionService.updateStatus(examenId, asignadoEstadoId)
            toast.success("Participantes asignados correctamente")
            setSelection([])
            onAssigned()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
            toast.error("No se pudieron asignar los participantes")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-4xl">
                <SheetHeader>
                    <SheetTitle>Asignar Participantes</SheetTitle>
                    <SheetDescription>
                        Seleccione solicitudes pagadas del mismo idioma para asignarlas al examen.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-auto px-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10" />
                                <TableHead>Estudiante</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Idioma</TableHead>
                                <TableHead>Nivel</TableHead>
                                <TableHead className="text-right">Pago</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {availableSolicitudes.map((solicitud) => (
                                <TableRow key={solicitud.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selection.includes(solicitud.id)}
                                            onCheckedChange={(checked) => toggleSelection(solicitud.id, checked === true)}
                                        />
                                    </TableCell>
                                    <TableCell>{solicitud.estudiante?.apellidos} {solicitud.estudiante?.nombres}</TableCell>
                                    <TableCell>{solicitud.estudiante?.numeroDocumento}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getItemByCode(solicitud.idiomaId, solicitud.idioma?.nombre ?? "Idioma")}
                                            {solicitud.idioma?.nombre}
                                        </div>
                                    </TableCell>
                                    <TableCell>{solicitud.nivel?.nombre}</TableCell>
                                    <TableCell className="text-right">S/ {Number(solicitud.pago || 0).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            {!availableSolicitudes.length ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No hay solicitudes pagadas para asignar.
                                    </TableCell>
                                </TableRow>
                            ) : null}
                        </TableBody>
                    </Table>
                </div>
                <SheetFooter>
                    <Button onClick={handleAssign} disabled={isSaving || !selection.length}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        Asignar Participante(s)
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
