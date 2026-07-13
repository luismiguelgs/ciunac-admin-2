import NavigationBread from "@/components/navigation-bread";
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service";
import { SolicitudConstanciasDetails } from "@/modules/solicitudes/constancias/solicitud-constancias.details";
import React from "react";
import { notFound } from "next/navigation";
import { isTipoSolicitudInGroup } from "@/modules/solicitudes/shared/solicitud-workflow";

export default async function PageSolicitudConstanciaDetalle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const solicitud = await SolicitudesService.fetchItemById(id);

    if (!solicitud?.id || !isTipoSolicitudInGroup(solicitud.tiposSolicitud, "constancias")) {
        return notFound();
    }

    return (
        <React.Fragment>
            <NavigationBread
                section="Solicitudes"
                href="/solicitudes"
                page="Constancias"
                extraPath={[{ label: `Detalle #${id}`, href: `/solicitudes/constancias/${id}` }]}
            />
            <div className="container mx-auto py-4 px-4">
                <SolicitudConstanciasDetails solicitud={solicitud} />
            </div>
        </React.Fragment>
    );
}
