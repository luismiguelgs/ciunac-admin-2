import { notFound } from "next/navigation"
import NavigationBread from "@/components/navigation-bread"
import { SolicitudCertificadosDetails } from "@/modules/solicitudes/certificados/solicitud-certificados.details"
import { isTipoSolicitudInGroup } from "@/modules/solicitudes/shared/solicitud-workflow"
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service"

interface PageSolicitudCertificadoDetalleProps {
    params: Promise<{ id: string }>
}

export default async function PageSolicitudCertificadoDetalle({ params }: PageSolicitudCertificadoDetalleProps) {
    const { id } = await params

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
                extraPath={[{ label: `Detalle #${id}`, href: `/solicitudes/certificados/${id}` }]}
            />
            <div className="container mx-auto px-4 py-4">
                <SolicitudCertificadosDetails solicitud={solicitud} />
            </div>
        </>
    )
}
