import NavigationBread from "@/components/navigation-bread";
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service";
import { SolicitudConstanciasDetails } from "@/modules/solicitudes/constancias/solicitud-constancias.details";
import React from "react";
import { notFound } from "next/navigation";
import { isTipoSolicitudInGroup } from "@/modules/solicitudes/shared/solicitud-workflow";
import {
    buildSolicitudStateHref,
    SOLICITUD_WORKFLOW_TAB_VALUES,
    resolveTabState,
} from "@/modules/solicitudes/shared/solicitud-tab-state";

interface PageSolicitudConstanciaDetalleProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ estado?: string | string[] }>
}

export default async function PageSolicitudConstanciaDetalle({
    params,
    searchParams,
}: PageSolicitudConstanciaDetalleProps) {
    const [{ id }, { estado }] = await Promise.all([params, searchParams]);
    const returnState = resolveTabState(estado, SOLICITUD_WORKFLOW_TAB_VALUES, "nuevas");
    const detailHref = buildSolicitudStateHref(`/solicitudes/constancias/${id}`, returnState);

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
                extraPath={[{ label: `Detalle #${id}`, href: detailHref }]}
            />
            <div className="container mx-auto py-4 px-4">
                <SolicitudConstanciasDetails solicitud={solicitud} returnState={returnState} />
            </div>
        </React.Fragment>
    );
}
