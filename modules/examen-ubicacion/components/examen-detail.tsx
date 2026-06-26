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

interface ExamenDetailProps {
    examen: IExamenUbicacion
    detalles: IDetalleExamenUbicacion[]
    solicitudesNuevas: ISolicitud[]
    calificaciones: ICalificacionUbicacion[]
    estados: IEstado[]
    idiomas: IIdioma[]
    salones: ISalon[]
    docentes: IDocente[]
}

export function ExamenDetail({
    examen,
    detalles,
    solicitudesNuevas,
    calificaciones,
    estados,
    idiomas,
    salones,
    docentes,
}: ExamenDetailProps) {
    const [isActaOpen, setIsActaOpen] = React.useState(false)

    return (
        <div className="space-y-8">
            <ExamenForm
                examen={examen}
                estados={estados}
                idiomas={idiomas}
                salones={salones}
                docentes={docentes}
                onPreviewActa={() => setIsActaOpen(true)}
            />
            <ExamParticipants
                examen={examen}
                initialDetalles={detalles}
                solicitudesNuevas={solicitudesNuevas}
                calificaciones={calificaciones}
            />
            <PdfPreviewDialog
                isOpen={isActaOpen}
                onOpenChange={setIsActaOpen}
                title="Acta del Examen"
            >
                <ActaFormat examen={examen} detalle={detalles} />
            </PdfPreviewDialog>
        </div>
    )
}
