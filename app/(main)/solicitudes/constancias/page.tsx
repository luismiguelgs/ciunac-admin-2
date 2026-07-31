import NavigationBread from "@/components/navigation-bread"
import { SolicitudConstanciasDataTable } from "@/modules/solicitudes/constancias/solicitud-constancias.table"
import { SolicitudStateTabs } from "@/modules/solicitudes/shared/solicitud-state-tabs"
import {
    SOLICITUD_WORKFLOW_TAB_VALUES,
    resolveTabState,
} from "@/modules/solicitudes/shared/solicitud-tab-state"
import { fetchSolicitudWorkflow } from "@/modules/solicitudes/shared/solicitud-workflow.loader"

export const dynamic = "force-dynamic"

interface PageSolicitudesConstanciasProps {
    searchParams: Promise<{ estado?: string | string[] }>
}

export default async function PageSolicitudesConstancias({
    searchParams,
}: PageSolicitudesConstanciasProps) {
    const [solicitudes, { estado }] = await Promise.all([
        fetchSolicitudWorkflow("constancias"),
        searchParams,
    ])
    const activeState = resolveTabState(estado, SOLICITUD_WORKFLOW_TAB_VALUES, "nuevas")

    return (
        <>
            <NavigationBread section="Solicitudes" href="/solicitudes" page="Constancias" />
            <div className="container mx-auto px-2 py-2">
                <h1 className="mb-4 text-2xl font-bold">Constancias CIUNAC</h1>
                <SolicitudStateTabs
                    data={solicitudes}
                    activeState={activeState}
                    renderTable={(items, actionMode, returnState) => (
                        <SolicitudConstanciasDataTable
                            data={items}
                            actionMode={actionMode}
                            returnState={returnState}
                        />
                    )}
                />
            </div>
        </>
    )
}
