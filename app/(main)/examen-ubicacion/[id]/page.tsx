import React from "react"
import { notFound } from "next/navigation"
import NavigationBread from "@/components/navigation-bread"
import { ensureServerPermission } from "@/lib/server-permissions"
import OpcionesService, { Collection } from "@/modules/estructura/services/opciones.service"
import { IEstado, IIdioma, ISalon } from "@/modules/estructura/interfaces/types.interface"
import DocentesService from "@/modules/seguimiento-docente/docentes/docente.service"
import { IDocente } from "@/modules/seguimiento-docente/docentes/docente.interface"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"
import { ExamenDetail } from "@/modules/examen-ubicacion/components/examen-detail"
import { SOLICITUD_ESTADOS } from "@/modules/examen-ubicacion/examen-ubicacion.utils"
import CalificacionesUbicacionService from "@/modules/examen-ubicacion/services/calificaciones.service"
import ExamenesUbicacionService from "@/modules/examen-ubicacion/services/examenes-ubicacion.service"

export const dynamic = "force-dynamic"

export default async function PageDetalleExamenUbicacion({ params }: { params: Promise<{ id: string }> }) {
    await ensureServerPermission("/examen-ubicacion")
    const { id } = await params

    const [examen, detalles, solicitudesPagadas, calificaciones, estados, idiomas, salones, docentes] = await Promise.all([
        ExamenesUbicacionService.getById(id),
        ExamenesUbicacionService.fetchItemsDetail(id),
        SolicitudesService.fetchItemByState("examenes-ubicacion", SOLICITUD_ESTADOS.PAGADA),
        CalificacionesUbicacionService.fetchItems(),
        OpcionesService.fetchItems<IEstado>(Collection.Estados),
        OpcionesService.fetchItems<IIdioma>(Collection.Idiomas),
        OpcionesService.fetchItems<ISalon>(Collection.Salones),
        DocentesService.fetchItems<IDocente>(),
    ])

    if (!examen?.id) return notFound()

    return (
        <React.Fragment>
            <NavigationBread
                section="Examen de Ubicacion"
                href="/examen-ubicacion"
                extraPath={[{ label: `Examen #${id}`, href: `/examen-ubicacion/${id}` }]}
            />
            <div className="container mx-auto py-4 px-4">
                <ExamenDetail
                    examen={examen}
                    detalles={detalles || []}
                    solicitudesPagadas={solicitudesPagadas || []}
                    calificaciones={calificaciones || []}
                    estados={estados || []}
                    idiomas={idiomas || []}
                    salones={salones || []}
                    docentes={docentes || []}
                />
            </div>
        </React.Fragment>
    )
}
