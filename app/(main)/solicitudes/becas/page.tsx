import NavigationBread from "@/components/navigation-bread";
import { UrlStateTabs } from "@/components/url-state-tabs";
import React from "react";
import SolicitudbecasService from "@/modules/solicitudes/becas/solicitud-becas.service";
import { SolicitudBecasDataTable } from "@/modules/solicitudes/becas/solicitud-becas.table";
import {
    SOLICITUD_BECA_TAB_VALUES,
    SOLICITUD_STATE_QUERY_PARAM,
    resolveTabState,
} from "@/modules/solicitudes/shared/solicitud-tab-state";

interface PageSolicitudesBecasProps {
    searchParams: Promise<{ estado?: string | string[] }>
}

export default async function PageSolicitudesBecas({
    searchParams,
}: PageSolicitudesBecasProps) {
    const [items, { estado }] = await Promise.all([
        SolicitudbecasService.getAll(),
        searchParams,
    ]);
    const data = items || [];
    const activeState = resolveTabState(estado, SOLICITUD_BECA_TAB_VALUES, "nuevas");

    const nuevas = data.filter(item => !item.estado || item.estado.toLowerCase() === 'nuevas' || item.estado.toLowerCase() === 'pendiente');
    const aprobadas = data.filter(item => item.estado?.toLowerCase() === 'aprobado');
    const rechazadas = data.filter(item => item.estado?.toLowerCase() === 'rechazado');

    return (
        <React.Fragment>
            <NavigationBread section="Solicitudes" href="/solicitudes" page="Becas" />
            <div className="container mx-auto py-2 px-2">
                <h1 className="text-2xl font-bold mb-4">Becas CIUNAC</h1>
                <UrlStateTabs activeValue={activeState} queryParam={SOLICITUD_STATE_QUERY_PARAM} items={[
                    {
                        value: "nuevas",
                        label: `Nuevas (${nuevas.length})`,
                        content: <SolicitudBecasDataTable data={nuevas} returnState="nuevas" />
                    },
                    {
                        value: "aprobados",
                        label: `Aprobadas (${aprobadas.length})`,
                        content: <SolicitudBecasDataTable data={aprobadas} returnState="aprobados" />
                    },
                    {
                        value: "rechazados",
                        label: `Rechazadas (${rechazadas.length})`,
                        content: <SolicitudBecasDataTable data={rechazadas} returnState="rechazados" />
                    },
                ]} />
            </div>
        </React.Fragment>
    )
}
