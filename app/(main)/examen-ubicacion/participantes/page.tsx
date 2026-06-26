import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { ensureServerPermission } from "@/lib/server-permissions"
import { ParticipantsGlobalTable } from "@/modules/examen-ubicacion/components/participants-global.table"
import CalificacionesUbicacionService from "@/modules/examen-ubicacion/services/calificaciones.service"
import ExamenesUbicacionService from "@/modules/examen-ubicacion/services/examenes-ubicacion.service"

export const dynamic = "force-dynamic"

export default async function PageParticipantesExamenUbicacion() {
    await ensureServerPermission("/examen-ubicacion/participantes")
    const [participants, exams, calificaciones] = await Promise.all([
        ExamenesUbicacionService.fetchItemsDetail(),
        ExamenesUbicacionService.fetchItems(),
        CalificacionesUbicacionService.fetchItems(),
    ])

    return (
        <React.Fragment>
            <NavigationBread section="Examen de Ubicacion" href="/examen-ubicacion" page="Participantes" />
            <div className="container mx-auto py-2 px-2">
                <h1 className="mb-4 text-2xl font-bold">Participantes de Examen de Ubicacion</h1>
                <ParticipantsGlobalTable data={participants || []} exams={exams || []} calificaciones={calificaciones || []} />
            </div>
        </React.Fragment>
    )
}
