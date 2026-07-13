import NavigationBread from "@/components/navigation-bread"
import { Button } from "@/components/ui/button"
import { SolicitudUbicacionDataTable } from "@/modules/solicitudes/examen-ubicacion/solicitud-ubicacion.table"
import { SolicitudStateTabs } from "@/modules/solicitudes/shared/solicitud-state-tabs"
import { fetchSolicitudWorkflow } from "@/modules/solicitudes/shared/solicitud-workflow.loader"
import { Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PageSolicitudesUbicacion() {
    const solicitudes = await fetchSolicitudWorkflow("examenes-ubicacion")

    return (
        <>
            <NavigationBread section="Solicitudes" href="/solicitudes" page="Examen de Ubicacion" />
            <div className="container mx-auto px-2 py-2">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold">Solicitudes de Examen de Ubicacion</h1>
                    <Button asChild className="gap-2 self-start sm:self-auto">
                        <Link href="/solicitudes/nueva">
                            <Plus className="h-4 w-4" />
                            Nueva Solicitud
                        </Link>
                    </Button>
                </div>

                <SolicitudStateTabs
                    data={solicitudes}
                    renderTable={(items, actionMode) => (
                        <SolicitudUbicacionDataTable data={items} actionMode={actionMode} />
                    )}
                />
            </div>
        </>
    )
}
