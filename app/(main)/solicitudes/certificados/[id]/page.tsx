import { notFound } from "next/navigation"
import NavigationBread from "@/components/navigation-bread"
import { SolicitudCertificadosDetails } from "@/modules/solicitudes/certificados/solicitud-certificados.details"
import { isTipoSolicitudInGroup } from "@/modules/solicitudes/shared/solicitud-workflow"
import {
    buildSolicitudStateHref,
    SOLICITUD_WORKFLOW_TAB_VALUES,
    resolveTabState,
} from "@/modules/solicitudes/shared/solicitud-tab-state"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"

interface PageSolicitudCertificadoDetalleProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ estado?: string | string[] }>
}

export default async function PageSolicitudCertificadoDetalle({
    params,
    searchParams,
}: PageSolicitudCertificadoDetalleProps) {
    const [{ id }, { estado }] = await Promise.all([params, searchParams])
    const returnState = resolveTabState(estado, SOLICITUD_WORKFLOW_TAB_VALUES, "nuevas")
    const detailHref = buildSolicitudStateHref(`/solicitudes/certificados/${id}`, returnState)

    const solicitud = await SolicitudesService.fetchItemById(id)

    if (!solicitud?.id || !isTipoSolicitudInGroup(solicitud.tiposSolicitud, "certificados")) {
        notFound()
    }

    return (
        <>
            <NavigationBread
                section="Solicitudes"
                href="/solicitudes"
                page="Certificados"
                extraPath={[{ label: `Detalle #${id}`, href: detailHref }]}
            />
            <div className="container mx-auto px-4 py-4">
                <SolicitudCertificadosDetails solicitud={solicitud} returnState={returnState} />
            </div>
        </>
    )
}
