import NavigationBread from "@/components/navigation-bread"
import { SolicitudCertificadosDataTable } from "@/modules/solicitudes/certificados/solicitud-certificados.table"
import { SolicitudStateTabs } from "@/modules/solicitudes/shared/solicitud-state-tabs"
import { fetchSolicitudWorkflow } from "@/modules/solicitudes/shared/solicitud-workflow.loader"

export const dynamic = "force-dynamic"

export default async function PageSolicitudesCertificados() {
    const solicitudes = await fetchSolicitudWorkflow("certificados")

    return (
        <>
            <NavigationBread section="Solicitudes" href="/solicitudes" page="Certificados" />
            <div className="container mx-auto px-2 py-2">
                <h1 className="mb-4 text-2xl font-bold">Solicitudes de Certificados</h1>
                <SolicitudStateTabs
                    data={solicitudes}
                    renderTable={(items, actionMode) => (
                        <SolicitudCertificadosDataTable data={items} actionMode={actionMode} />
                    )}
                />
            </div>
        </>
    )
}
