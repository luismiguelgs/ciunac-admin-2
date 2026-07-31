import NavigationBread from "@/components/navigation-bread";
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service";
import { SolicitudUbicacionDetails } from "@/modules/solicitudes/examen-ubicacion/solicitud-ubicacion.details";
import React from "react";
import { notFound } from "next/navigation";
import { isTipoSolicitudInGroup } from "@/modules/solicitudes/shared/solicitud-workflow";
import {
    buildSolicitudStateHref,
    SOLICITUD_WORKFLOW_TAB_VALUES,
    resolveTabState,
} from "@/modules/solicitudes/shared/solicitud-tab-state";

interface PageSolicitudUbicacionDetalleProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ estado?: string | string[] }>
}

export default async function PageSolicitudUbicacionDetalle({
    params,
    searchParams,
}: PageSolicitudUbicacionDetalleProps) {
    const [{ id }, { estado }] = await Promise.all([params, searchParams]);
    const returnState = resolveTabState(estado, SOLICITUD_WORKFLOW_TAB_VALUES, "nuevas");
    const detailHref = buildSolicitudStateHref(`/solicitudes/ubicacion/${id}`, returnState);

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
                extraPath={[{ label: `Detalle #${id}`, href: detailHref }]}
            />
            <div className="container mx-auto py-4 px-4">
                <SolicitudUbicacionDetails solicitud={solicitud} returnState={returnState} />
            </div>
        </React.Fragment>
    );
}
