import React from "react"
import NavigationBread from "@/components/navigation-bread"
import SolicitudbecasService from "@/modules/solicitudes/becas/solicitud-becas.service"
import { SolicitudBecaDetails } from "@/modules/solicitudes/becas/solicitud-becas.details"
import {
    buildSolicitudStateHref,
    SOLICITUD_BECA_TAB_VALUES,
    resolveTabState,
} from "@/modules/solicitudes/shared/solicitud-tab-state"

interface PageSolicitudBecaProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ estado?: string | string[] }>
}

export default async function PageSolicitudBeca({
    params,
    searchParams,
}: PageSolicitudBecaProps) {
    const [{ id }, { estado }] = await Promise.all([params, searchParams]);
    const returnState = resolveTabState(estado, SOLICITUD_BECA_TAB_VALUES, "nuevas");
    const listHref = buildSolicitudStateHref("/solicitudes/becas", returnState);
    const solicitud = await SolicitudbecasService.getById(id)

    if (!solicitud) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="text-4xl font-black text-muted-foreground">404</div>
                <h2 className="text-xl font-bold">Solicitud no encontrada</h2>
                <p className="text-muted-foreground">La solicitud que busca no existe o ha sido eliminada.</p>
            </div>
        )
    }

    return (
        <React.Fragment>
            <NavigationBread section="Solicitudes Becas" href={listHref} page={`${solicitud.nombres} ${solicitud.apellidos}`} />
            <div className="container mx-auto py-6 px-4 max-w-7xl">
                <SolicitudBecaDetails solicitud={solicitud} backHref={listHref} />
            </div>
        </React.Fragment>
    )
}
