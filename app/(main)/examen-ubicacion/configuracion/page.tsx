import React from "react"
import MyTabs from "@/components/my-tabs"
import NavigationBread from "@/components/navigation-bread"
import { ensureServerPermission } from "@/lib/server-permissions"
import OpAulas from "@/modules/estructura/components/op-aulas"
import { CalificacionesUbicacion } from "@/modules/examen-ubicacion/components/configuracion/calificaciones-ubicacion"
import { CronogramaUbicacion } from "@/modules/examen-ubicacion/components/configuracion/cronograma-ubicacion"
import CalificacionesUbicacionService from "@/modules/examen-ubicacion/services/calificaciones.service"
import CronogramaUbicacionService from "@/modules/examen-ubicacion/services/cronograma-ubicacion.service"

export const dynamic = "force-dynamic"

export default async function PageConfiguracionExamenUbicacion() {
    await ensureServerPermission("/examen-ubicacion/configuracion")
    const [calificaciones, cronograma] = await Promise.all([
        CalificacionesUbicacionService.fetchItems(),
        CronogramaUbicacionService.fetchItems(),
    ])

    return (
        <React.Fragment>
            <NavigationBread section="Examen de Ubicacion" href="/examen-ubicacion" page="Configuracion" />
            <div className="container mx-auto py-2 px-2">
                <h1 className="mb-4 text-2xl font-bold">Configuracion de Examen de Ubicacion</h1>
                <MyTabs
                    defaultValue="salas"
                    items={[
                        { value: "salas", label: "Salas de Examen", content: <OpAulas /> },
                        { value: "calificaciones", label: "Calificaciones", content: <CalificacionesUbicacion initialData={calificaciones || []} /> },
                        { value: "cronograma", label: "Cronograma", content: <CronogramaUbicacion initialData={cronograma || []} /> },
                    ]}
                />
            </div>
        </React.Fragment>
    )
}
