'use client'

import React from "react"
import { IEstado, IIdioma, ISalon } from "@/modules/estructura/interfaces/types.interface"
import { IDocente } from "@/modules/seguimiento-docente/docentes/docente.interface"
import { ISolicitud } from "@/modules/solicitudes/shared/solicitud.interface"
import ICalificacionUbicacion from "../interfaces/calificacion.interface"
import { IDetalleExamenUbicacion, IExamenUbicacion } from "../interfaces/examen-ubicacion.interface"
import { ExamenForm } from "./examen-form"
import { ExamParticipants } from "./exam-participants"
import { PdfPreviewDialog } from "./pdf-preview-dialog"
import { ActaFormat } from "./formatos/acta-format"
import { ActaExamenButton } from "./acta-examen.button"
import { isEstadoExamen } from "../examen-ubicacion.utils"

interface ExamenDetailProps {
    examen: IExamenUbicacion
    detalles: IDetalleExamenUbicacion[]
    solicitudesPagadas: ISolicitud[]
    calificaciones: ICalificacionUbicacion[]
    estados: IEstado[]
    idiomas: IIdioma[]
    salones: ISalon[]
    docentes: IDocente[]
}

export function ExamenDetail({
    examen,
    detalles,
    solicitudesPagadas,
    calificaciones,
    estados,
    idiomas,
    salones,
    docentes,
}: ExamenDetailProps) {
    const [isListadoOpen, setIsListadoOpen] = React.useState(false)
    const [isActaGeneratedLocally, setIsActaGeneratedLocally] = React.useState(false)
    const isActaGenerada = isActaGeneratedLocally || isEstadoExamen("ACTA_GENERADA", examen.estadoId, examen.estado?.nombre, estados)

    return (
        <div className="space-y-8">
            <ExamenForm
                examen={examen}
                estados={estados}
                idiomas={idiomas}
                salones={salones}
                docentes={docentes}
                immutable={isActaGenerada}
                onPreviewListado={() => setIsListadoOpen(true)}
                listadoActions={
                    <ActaExamenButton
                        examen={examen}
                        estados={estados}
                        onGenerated={() => setIsActaGeneratedLocally(true)}
                    />
                }
            />
            <ExamParticipants
                examen={examen}
                initialDetalles={detalles}
                solicitudesPagadas={solicitudesPagadas}
                calificaciones={calificaciones}
                estados={estados}
                readOnly={isActaGenerada}
            />
            <PdfPreviewDialog
                isOpen={isListadoOpen}
                onOpenChange={setIsListadoOpen}
                title="Listado del Examen"
            >
                <ActaFormat examen={examen} detalle={detalles} />
            </PdfPreviewDialog>
        </div>
    )
}
