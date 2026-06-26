import Link from "next/link"
import { Plus } from "lucide-react"
import React from "react"
import NavigationBread from "@/components/navigation-bread"
import { Button } from "@/components/ui/button"
import { ensureServerPermission } from "@/lib/server-permissions"
import { ExamenesUbicacionTable } from "@/modules/examen-ubicacion/components/examenes-ubicacion.table"
import { ResultadosPeriodoButton } from "@/modules/examen-ubicacion/components/resultados-periodo.button"
import ExamenesUbicacionService from "@/modules/examen-ubicacion/services/examenes-ubicacion.service"

export const dynamic = "force-dynamic"

export default async function PageExamenesUbicacion() {
    await ensureServerPermission("/examen-ubicacion")
    const data = await ExamenesUbicacionService.fetchItems()

    return (
        <React.Fragment>
            <NavigationBread section="Examen de Ubicacion" href="/examen-ubicacion" page="Lista de Examenes" />
            <div className="container mx-auto py-2 px-2">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Exámenes de Ubicación</h1>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <ResultadosPeriodoButton examenes={data || []} />
                        <Button asChild>
                            <Link href="/examen-ubicacion/nuevo">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Examen
                            </Link>
                        </Button>
                    </div>
                </div>
                <ExamenesUbicacionTable data={data || []} />
            </div>
        </React.Fragment>
    )
}
