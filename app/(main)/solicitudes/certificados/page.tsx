import NavigationBread from "@/components/navigation-bread"
import { SolicitudCertificadosDataTable } from "@/modules/solicitudes/certificados/solicitud-certificados.table"
import { SolicitudStateTabs } from "@/modules/solicitudes/shared/solicitud-state-tabs"
import {
    SOLICITUD_WORKFLOW_TAB_VALUES,
    resolveTabState,
} from "@/modules/solicitudes/shared/solicitud-tab-state"
import { fetchSolicitudWorkflow } from "@/modules/solicitudes/shared/solicitud-workflow.loader"

export const dynamic = "force-dynamic"

interface PageSolicitudesCertificadosProps {
    searchParams: Promise<{ estado?: string | string[] }>
}

export default async function PageSolicitudesCertificados({
    searchParams,
}: PageSolicitudesCertificadosProps) {
    const [solicitudes, { estado }] = await Promise.all([
        fetchSolicitudWorkflow("certificados"),
        searchParams,
    ])
    const activeState = resolveTabState(estado, SOLICITUD_WORKFLOW_TAB_VALUES, "nuevas")

    return (
        <>
            <NavigationBread section="Solicitudes" href="/solicitudes" page="Certificados" />
            <div className="container mx-auto px-2 py-2">
                <h1 className="mb-4 text-2xl font-bold">Solicitudes de Certificados</h1>
                <SolicitudStateTabs
                    data={solicitudes}
                    activeState={activeState}
                    renderTable={(items, actionMode, returnState) => (
                        <SolicitudCertificadosDataTable
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
