import NavigationBread from "@/components/navigation-bread";
import SolicitudesService from "@/modules/solicitudes/shared/solicitudes.service";
import OpcionesService, { Collection } from "@/modules/estructura/services/opciones.service";
import { SolicitudUbicacionDetails } from "@/modules/solicitudes/examen-ubicacion/solicitud-ubicacion.details";
import { IIdioma, INivel, ITipoSolicitud } from "@/modules/estructura/interfaces/types.interface";
import React from "react";
import { notFound } from "next/navigation";

const TIPO_SOLICITUD_UBICACION_ID = 7;

export default async function PageSolicitudUbicacionDetalle({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [solicitud, tiposSolicitud, idiomas, niveles] = await Promise.all([
        SolicitudesService.fetchItemById(id),
        OpcionesService.fetchItems<ITipoSolicitud>(Collection.Tiposolicitud),
        OpcionesService.fetchItems<IIdioma>(Collection.Idiomas),
        OpcionesService.fetchItems<INivel>(Collection.Niveles),
    ]);

    if (!solicitud || !solicitud.id) {
        return notFound();
    }

    const safeTipos = Array.isArray(tiposSolicitud)
        ? tiposSolicitud.filter((tipo) => tipo.id === TIPO_SOLICITUD_UBICACION_ID || tipo.id === solicitud.tipoSolicitudId)
        : [];
    const safeIdiomas = Array.isArray(idiomas) ? idiomas : [];
    const safeNiveles = Array.isArray(niveles) ? niveles : [];

    return (
        <React.Fragment>
            <NavigationBread
                section="Solicitudes"
                href="/solicitudes"
                page="Examen de Ubicacion"
                extraPath={[{ label: `Detalle #${id}`, href: `/solicitudes/ubicacion/${id}` }]}
            />
            <div className="container mx-auto py-4 px-4">
                <SolicitudUbicacionDetails
                    solicitud={solicitud}
                    tiposSolicitud={safeTipos}
                    idiomas={safeIdiomas}
                    niveles={safeNiveles}
                />
            </div>
        </React.Fragment>
    );
}
