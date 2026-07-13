import NavigationBread from "@/components/navigation-bread";
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service";
import { SolicitudUbicacionDetails } from "@/modules/solicitudes/examen-ubicacion/solicitud-ubicacion.details";
import React from "react";
import { notFound } from "next/navigation";
import { isTipoSolicitudInGroup } from "@/modules/solicitudes/shared/solicitud-workflow";

export default async function PageSolicitudUbicacionDetalle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const solicitud = await SolicitudesService.fetchItemById(id);

    if (!solicitud?.id || !isTipoSolicitudInGroup(solicitud.tiposSolicitud, "ubicacion")) {
        return notFound();
    }

    return (
        <React.Fragment>
            <NavigationBread
                section="Solicitudes"
                href="/solicitudes"
                page="Examen de Ubicacion"
                extraPath={[{ label: `Detalle #${id}`, href: `/solicitudes/ubicacion/${id}` }]}
            />
            <div className="container mx-auto py-4 px-4">
                <SolicitudUbicacionDetails solicitud={solicitud} />
            </div>
        </React.Fragment>
    );
}
