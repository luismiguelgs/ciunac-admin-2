import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { ensureServerPermission } from "@/lib/server-permissions"
import OpcionesService, { Collection } from "@/modules/estructura/services/opciones.service"
import { IEstado, IIdioma, IModulo, ISalon } from "@/modules/estructura/interfaces/types.interface"
import DocentesService from "@/modules/seguimiento-docente/docentes/docente.service"
import { IDocente } from "@/modules/seguimiento-docente/docentes/docente.interface"
import { ExamenForm } from "@/modules/examen-ubicacion/components/examen-form"

export const dynamic = "force-dynamic"

export default async function PageNuevoExamenUbicacion() {
    await ensureServerPermission("/examen-ubicacion/nuevo")
    const [estados, idiomas, salones, docentes, modulos] = await Promise.all([
        OpcionesService.fetchItems<IEstado>(Collection.Estados),
        OpcionesService.fetchItems<IIdioma>(Collection.Idiomas),
        OpcionesService.fetchItems<ISalon>(Collection.Salones),
        DocentesService.fetchItems<IDocente>(),
        OpcionesService.fetchItems<IModulo>(Collection.Modulos),
    ])

    return (
        <React.Fragment>
            <NavigationBread section="Examen de Ubicacion" href="/examen-ubicacion" page="Nuevo Examen" />
            <div className="container mx-auto py-4 px-4">
                <ExamenForm
                    estados={estados || []}
                    idiomas={idiomas || []}
                    salones={salones || []}
                    docentes={docentes || []}
                    modulos={modulos || []}
                />
            </div>
        </React.Fragment>
    )
}
